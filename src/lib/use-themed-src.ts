'use client';

import { useSyncExternalStore } from 'react';
import { useTheme } from '@/components/theme-provider';

const subscribe = () => () => {};

/**
 * Picks the light/dark variant of an asset. The server and the hydration render both return
 * `defaultSrc` (the theme is unknown there), so there's no mismatch; the variant swaps in right after.
 */
export function useThemedSrc(defaultSrc: string, lightSrc?: string, darkSrc?: string): string {
  const { actualTheme } = useTheme();
  const isClient = useSyncExternalStore(subscribe, () => true, () => false);
  if (!isClient) return defaultSrc;
  if (actualTheme === 'light' && lightSrc) return lightSrc;
  if (actualTheme === 'dark' && darkSrc) return darkSrc;
  return defaultSrc;
}
