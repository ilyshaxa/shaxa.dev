import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl text-center">
        <p className="text-display text-muted-foreground">404</p>
        <h1 className="mt-4 text-title-1">Page Not Found</h1>
        <p className="mt-4 text-body-lg text-muted-foreground text-pretty">
          Oops! The page you&apos;re looking for seems to have vanished into the digital void. Don&apos;t worry,
          even the best DevOps engineers encounter 404s sometimes!
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="/projects">Browse Projects</Link>
          </Button>
        </div>
        <p className="mt-12 rounded-lg bg-secondary p-6 text-caption text-muted-foreground">
          💡 <strong className="text-foreground">Pro Tip:</strong> This 404 page is deployed with zero-downtime CI/CD
          pipelines. Even this error page follows DevOps best practices!
        </p>
      </div>
    </div>
  );
}
