"use client";

import { useCallback, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams as useNextSearchParams } from "next/navigation";

interface FilterState {
  [key: string]: string | string[] | number | undefined;
}

export function useSearchParams(initial: FilterState = {}) {
  const router = useRouter();
  const searchParams = useNextSearchParams();
  const [filters, setFilters] = useState<FilterState>(initial);
  const [isHydrated, setIsHydrated] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isUpdatingFromUser = useRef(false);
  const initialRef = useRef(initial);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isUpdatingFromUser.current) {
      return;
    }
    
    const initialFilters: FilterState = { ...initialRef.current };
    
    searchParams.forEach((value, key) => {
      if (value.includes(',')) {
        initialFilters[key] = value.split(',');
      } else {
        if (key === 'page' || key === 'limit') {
          const numValue = parseInt(value, 10);
          initialFilters[key] = isNaN(numValue) ? value : numValue;
        } else {
          initialFilters[key] = value;
        }
      }
    });
    
    setFilters(prevFilters => {
      const hasChanged = Object.keys(initialFilters).some(key => 
        prevFilters[key] !== initialFilters[key]
      ) || Object.keys(prevFilters).some(key => 
        !(key in initialFilters)
      );
      
      setIsHydrated(true);
      
      if (hasChanged) {
        return initialFilters;
      }
      
      return prevFilters;
    });
  }, [searchParams]);

  const setFilter = useCallback((keyOrObject: string | FilterState, value?: string | string[] | number) => {
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
            params.set(key, String(value));
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
    filters: isHydrated ? filters : {},
    setFilter,
    clearFilters
  };
}
