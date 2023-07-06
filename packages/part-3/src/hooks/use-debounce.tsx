import { useEffect, useState } from 'react';

export default function useDebounce<T>(value: T, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const [debouncing, setDebouncing] = useState<boolean>(false);

  useEffect(() => {
    setDebouncing(true);
    const handler = setTimeout(() => {
      setDebouncedValue(value);
      setDebouncing(false);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return [debouncedValue, debouncing] as const;
}
