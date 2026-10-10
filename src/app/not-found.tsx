import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="page-container flex min-h-screen flex-col justify-center py-24">
      <p className="text-title-2 text-muted-foreground">404</p>
      <h1 className="mt-2 text-title-1">Page not found</h1>
      <p className="mt-4 max-w-[34rem] text-body-lg text-muted-foreground">This page doesn&apos;t exist or has moved.</p>
      <Button asChild variant="plain" size="lg" className="mt-6 self-start">
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
