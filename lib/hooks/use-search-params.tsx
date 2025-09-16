"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams as useNextSearchParams } from "next/navigation";

interface FilterState {
  [key: string]: string | string[] | undefined;
}

export function useSearchParams(initial: FilterState = {}) {
  const router = useRouter();
  const searchParams = useNextSearchParams();
  const [filters, setFilters] = useState<FilterState>(() => {
    const initialFilters: FilterState = { ...initial };

    searchParams.forEach((value, key) => {
      if (value.includes(',')) {
        initialFilters[key] = value.split(',');
      } else {
        initialFilters[key] = value;
      }
    });

    return initialFilters;
  });
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingFromUser = useRef(false);
  const initialRef = useRef(initial);

  useEffect(() => {
    if (isUpdatingFromUser.current) {
      return;
    }

    const initialFilters: FilterState = { ...initialRef.current };

    searchParams.forEach((value, key) => {
      if (value.includes(',')) {
        initialFilters[key] = value.split(',');
      } else {
        initialFilters[key] = value;
      }
    });

    setFilters(initialFilters);
  }, [searchParams]);

  const setFilter = useCallback((keyOrObject: string | FilterState, value?: string | string[]) => {
    isUpdatingFromUser.current = true;

    setFilters(prevFilters => {
      let newFilters: FilterState;

      if (typeof keyOrObject === 'object') {
        newFilters = {
          ...prevFilters,
          ...keyOrObject
        };
      } else {
        newFilters = {
          ...prevFilters,
          [keyOrObject]: value
        };
      }

      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      updateTimeoutRef.current = setTimeout(() => {
        const params = new URLSearchParams();

        Object.entries(newFilters).forEach(([key, value]) => {
          if (value === undefined) {
            return;
          }

          if (Array.isArray(value)) {
            if (value.length > 0) {
              params.set(key, value.join(','));
            }
          } else if (value && value !== '') {
            params.set(key, value);
          }
        });

        const newURL = params.toString() ? `?${params.toString()}` : window.location.pathname;
        router.replace(newURL, { scroll: false });

        setTimeout(() => {
          isUpdatingFromUser.current = false;
        }, 50);
      }, 100);

      return newFilters;
    });
  }, [router]);

  const clearFilters = useCallback(() => {
    isUpdatingFromUser.current = true;
    setFilters({});
    router.replace(window.location.pathname, { scroll: false });
    isUpdatingFromUser.current = false;
  }, [router]);

  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return {
    filters,
    setFilter,
    clearFilters
  };
}
