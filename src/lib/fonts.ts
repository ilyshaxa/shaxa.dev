import { Geist_Mono, Inter } from 'next/font/google';

// Apple platforms render SF Pro through -apple-system (see --font-sans in globals.css);
// everyone else gets Inter, including Cyrillic for the Russian locale.
export const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  display: 'swap',
});

export const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false,
});

// Both `<html>` owners (the locale layout and the root 404) apply the same font variables.
export const fontVariables = `${inter.variable} ${geistMono.variable}`;
