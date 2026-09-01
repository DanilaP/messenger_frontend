import { useCallback, useEffect, useRef } from "react";

function useDebouncedCallback<T extends (...args: any[]) => any>(
	callback: T,
	delay: number
) {
	const timeoutRef = useRef<number | null>(null);

	const debouncedCallback = useCallback((...args: Parameters<T>) => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			callback(...args);
		}, delay);
	}, [callback, delay]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return debouncedCallback;
}

export default useDebouncedCallback;