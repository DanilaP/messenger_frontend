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
}

const ESTIMATED_ITEM_HEIGHT = 80;

// Отдельная функция для правильной типизации forwardRef с дженериком
function VirtualizedListInner<T>(
	props: IListProps<T>,
	ref: React.ForwardedRef<VirtualizedListRef>
) {
	const { items, height, renderItem, getKey, onScroll } = props;
    
	const containerRef = useRef<HTMLDivElement>(null);
	const [scrollTop, setScrollTop] = useState(0);
	const [heights, setHeights] = useState<number[]>([]);
	const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

	useImperativeHandle(ref, () => ({
		scrollToBottom: () => {
			if (containerRef.current) {
				containerRef.current.scrollTop = containerRef.current.scrollHeight;
			}
		},
		getScrollElement: () => containerRef.current,
	}));

	useEffect(() => {
		setHeights(prev => {
			const newHeights = [...prev];
			if (items.length > newHeights.length) {
				for (let i = newHeights.length; i < items.length; i++) {
					newHeights[i] = ESTIMATED_ITEM_HEIGHT;
				}
			}
			if (items.length < newHeights.length) {
				newHeights.length = items.length;
			}
			return newHeights;
		});
	}, [items.length]);

	const measureHeight = useCallback((index: number) => {
		const element = itemRefs.current.get(index);
		if (element) {
			const height = element.getBoundingClientRect().height;
			if (heights[index] !== height) {
				setHeights(prev => {
					const newHeights = [...prev];
					newHeights[index] = height;
					return newHeights;
				});
			}
		}
	}, [heights]);

	useEffect(() => {
		const indexes = Array.from(itemRefs.current.keys());
		indexes.forEach(index => measureHeight(index));
	}, [items, measureHeight, scrollTop]);

	const totalHeight = useMemo(() => {
		return heights.reduce((sum, h) => sum + h, 0);
	}, [heights]);

	const getVisibleRange = useCallback(() => {
		if (!containerRef.current) return { start: 0, end: 0 };
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
			const key = getKey ? getKey(item, i) : i;
			result.push(
				<div
					key={ key }
					ref={ el => {
						if (el) {
							itemRefs.current.set(i, el);
						} else {
							itemRefs.current.delete(i);
						}
					} }
					className="list-item-wrapper"
				>
					{ renderItem(item, i) }
				</div>
			);
		}
		return result;
	}, [start, end, items, renderItem, getKey]);

	return (
		<div
			ref={ containerRef }
			style={ { height: `${height}px`, overflowY: "auto", position: "relative" } }
			className="list"
			onScroll={ handleScroll }
		>
			<div style={ { height: totalHeight, position: "relative" } }>
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