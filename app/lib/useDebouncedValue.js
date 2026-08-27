'use client';
import { useEffect, useState } from 'react';

/**
 * Возвращает значение с задержкой — чтобы частые события (drag range-слайдера)
 * не пересчитывали список и не перезапускали layout-анимации карточек на каждый пиксель.
 */
export function useDebouncedValue(value, delay = 120) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
