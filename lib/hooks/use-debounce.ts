import { useEffect, useMemo, useRef, useState } from "react";

export function useDebounce<T>(value: T, delay: number = 300, callback?: (value: T) => void) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);
  const previousValueRef = useRef(value);

  useEffect(() => {
    previousValueRef.current = value;

    isMountedRef.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const timeoutId = setTimeout(() => {
      if (isMountedRef.current) {
        setDebouncedValue(value);
        callback?.(value);
      }
    }, delay);

    timeoutRef.current = timeoutId;

    return () => {
      isMountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, callback]);

  const isLoading = useMemo(() => {
    return debouncedValue !== value;
  }, [debouncedValue, value]);

  return { debouncedValue, isLoading };
}

export default useDebounce;
