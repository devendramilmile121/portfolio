import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

const subscribe = (onChange: () => void) => {
  const media = window.matchMedia?.(QUERY);
  media?.addEventListener?.('change', onChange);
  return () => media?.removeEventListener?.('change', onChange);
};

/** True when the visitor asked the OS for less motion. False during pre-rendering, corrected on hydration. */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia?.(QUERY).matches ?? false,
    () => false
  );
}
