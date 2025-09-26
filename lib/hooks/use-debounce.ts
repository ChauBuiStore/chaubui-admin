import { useEffect, useRef, useState } from "react";

export function useDebounce<T>(
  value: T,
  delay: number = 300,
  callback?: (value: T) => void
) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [isLoading, setIsLoading] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    setIsLoading(true);

    timeoutRef.current = setTimeout(() => {
      setDebouncedValue(value);
      setIsLoading(false);
      callback?.(value);
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, delay, callback]);

  return { debouncedValue, isLoading };
}

export default useDebounce;