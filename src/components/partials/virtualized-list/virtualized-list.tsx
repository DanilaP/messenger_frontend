import type { ReactNode } from "react";
import { forwardRef, useEffect, useRef, useState, useCallback, useMemo, useImperativeHandle } from "react";
import "./virtualized-list.scss";

interface IListProps<T> {
    items: T[];
    height: number;
    renderItem: (item: T, index: number) => ReactNode;
    getKey?: (item: T, index: number) => string | number;
    onScroll?: (event: React.UIEvent<HTMLDivElement>) => void;
}

export interface VirtualizedListRef {
    scrollToBottom: () => void;
    getScrollElement: () => HTMLDivElement | null;
    scrollToItemByKey: (key: string | number, align?: "start" | "center" | "end") => boolean;
}

const ESTIMATED_ITEM_HEIGHT = 80;
const DEFAULT_KEY_PREFIX = "__virtualized_item_";

// Отдельная функция для правильной типизации forwardRef с дженериком
function VirtualizedListInner<T>(
	props: IListProps<T>,
	ref: React.ForwardedRef<VirtualizedListRef>
) {
	const { items, height, renderItem, getKey, onScroll } = props;
    
	const containerRef = useRef<HTMLDivElement>(null);
	const [scrollTop, setScrollTop] = useState(0);
	const [heightsByKey, setHeightsByKey] = useState<Record<string, number>>({});
	const itemRefs = useRef<Map<string, HTMLDivElement>>(new Map());
	const itemKeys = useMemo(
		() => items.map((item, index) => String(getKey ? getKey(item, index) : `${DEFAULT_KEY_PREFIX}${index}`)),
		[items, getKey]
	);
	const heights = useMemo(
		() => itemKeys.map((key) => heightsByKey[key] ?? ESTIMATED_ITEM_HEIGHT),
		[itemKeys, heightsByKey]
	);

	const getItemOffsetByIndex = useCallback((index: number) => {
		let offset = 0;
		for (let i = 0; i < index; i++) {
			offset += heights[i] ?? ESTIMATED_ITEM_HEIGHT;
		}
		return offset;
	}, [heights]);

	useImperativeHandle(ref, () => ({
		scrollToBottom: () => {
			if (containerRef.current) {
				containerRef.current.scrollTop = containerRef.current.scrollHeight;
			}
		},
		getScrollElement: () => containerRef.current,
		scrollToItemByKey: (key: string | number, align: "start" | "center" | "end" = "center") => {
			if (!containerRef.current) return false;
			const normalizedKey = String(key);
			const itemIndex = itemKeys.findIndex((itemKey) => itemKey === normalizedKey);
			if (itemIndex === -1) return false;
			const itemOffset = getItemOffsetByIndex(itemIndex);
			const itemHeight = heights[itemIndex] ?? ESTIMATED_ITEM_HEIGHT;
			let nextScrollTop = itemOffset;
			if (align === "center") {
				nextScrollTop = itemOffset - (height / 2) + (itemHeight / 2);
			}
			if (align === "end") {
				nextScrollTop = itemOffset - height + itemHeight;
			}
			containerRef.current.scrollTop = Math.max(0, nextScrollTop);
			return true;
		},
	}), [itemKeys, getItemOffsetByIndex, heights, height]);

	const measureHeight = useCallback((key: string) => {
		const element = itemRefs.current.get(key);
		if (element) {
			const height = element.getBoundingClientRect().height;
			if (heightsByKey[key] !== height) {
				setHeightsByKey(prev => {
					return {
						...prev,
						[key]: height
					};
				});
			}
		}
	}, [heightsByKey]);

	useEffect(() => {
		const keys = Array.from(itemRefs.current.keys());
		keys.forEach((key) => measureHeight(key));
	}, [items, measureHeight, scrollTop]);

	const totalHeight = useMemo(() => {
		return heights.reduce((sum, h) => sum + h, 0);
	}, [heights]);

	const getVisibleRange = useCallback(() => {
		if (heights.length === 0 || height <= 0) return { start: 0, end: 0 };
		let offset = 0;
		let startIndex = 0;
		for (let i = 0; i < heights.length; i++) {
			const itemTop = offset;
			const itemBottom = offset + heights[i];
			if (itemBottom >= scrollTop && itemTop <= scrollTop + height) {
				startIndex = i;
				break;
			}
			offset += heights[i];
		}
		let endIndex = startIndex;
		let currentOffset = 0;
		for (let i = 0; i < startIndex; i++) {
			currentOffset += heights[i];
		}
		for (let i = startIndex; i < heights.length; i++) {
			const itemTop = currentOffset;
			if (itemTop > scrollTop + height) break;
			endIndex = i;
			currentOffset += heights[i];
		}
		const buffer = 2;
		return {
			start: Math.max(0, startIndex - buffer),
			end: Math.min(heights.length - 1, endIndex + buffer)
		};
	}, [heights, scrollTop, height]);

	const { start, end } = getVisibleRange();
	const offsetY = useMemo(() => {
		let offset = 0;
		for (let i = 0; i < start; i++) {
			offset += heights[i];
		}
		return offset;
	}, [heights, start]);

	const handleScroll = useCallback((event: React.UIEvent<HTMLDivElement>) => {
		if (containerRef.current) {
			setScrollTop(containerRef.current.scrollTop);
		}
		onScroll?.(event);
	}, [onScroll]);

	const visibleItems = useMemo(() => {
		const result: ReactNode[] = [];
		for (let i = start; i <= end && i < items.length; i++) {
			const item = items[i];
			const key = itemKeys[i];
			result.push(
				<div
					key={ key }
					ref={ el => {
						if (el) {
							itemRefs.current.set(key, el);
						} else {
							itemRefs.current.delete(key);
						}
					} }
					className="list-item-wrapper"
				>
					{ renderItem(item, i) }
				</div>
			);
		}
		return result;
	}, [start, end, items, renderItem, itemKeys]);

	return (
		<div
			ref={ containerRef }
			style={ { height: `${height}px`, overflowY: "auto", position: "relative" } }
			className="list"
			onScroll={ handleScroll }
		>
			<div style={ { height: totalHeight, position: "relative", paddingBottom: "10px" } }>
				<div style={ { transform: `translateY(${offsetY}px)` } }>
					{ visibleItems }
				</div>
			</div>
		</div>
	);
}

// Приводим forwardRef к корректному типу с дженериком
const VirtualizedList = forwardRef(VirtualizedListInner) as <T>(
    props: IListProps<T> & { ref?: React.ForwardedRef<VirtualizedListRef> }
) => React.ReactElement;

export default VirtualizedList;