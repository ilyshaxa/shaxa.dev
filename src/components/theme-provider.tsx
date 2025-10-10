'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from 'next-themes';

export function ThemeProvider({ children, ...props }: React.PropsWithChildren<Record<string, unknown>>) {
  return (
    <NextThemesProvider 
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      storageKey="theme"
      disableTransitionOnChange
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}

export function useTheme() {
  const { theme, setTheme, resolvedTheme } = useNextTheme();
  const actualTheme = resolvedTheme === 'dark' ? 'dark' : 'light'; // Explicitly 'dark' or 'light'

  return { theme, setTheme, actualTheme };
}
