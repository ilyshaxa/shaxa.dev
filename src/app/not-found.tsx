import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeProvider } from '@/components/theme-provider';
import { fontVariables } from '@/lib/fonts';
import { themeScript } from '@/lib/theme-script';
import './globals.css';

// Renders for requests no locale handles (paths the middleware skips, such as /foo.bar or /api/nothing).
// The root layout renders no <html>, so this page supplies its own; the language is the default locale.
export default function NotFound() {
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen font-sans antialiased">
        <ThemeProvider>
          <main className="page-container flex min-h-screen flex-col justify-center py-24">
            <p className="text-title-2 text-muted-foreground">404</p>
            <h1 className="mt-2 text-title-1">Page not found</h1>
            <p className="mt-4 max-w-[34rem] text-body-lg text-muted-foreground">This page doesn&apos;t exist or has moved.</p>
            <Button asChild variant="plain" size="lg" className="mt-6 min-h-11 self-start">
              <Link href="/">Back to home</Link>
            </Button>
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
