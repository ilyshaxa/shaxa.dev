'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 font-mono">
      <div className="max-w-md mx-auto text-center">
        <div className="text-8xl font-bold text-destructive mb-6">404</div>
        <div className="text-left border border-border p-6">
          <p className="text-sm text-secondary">bash: /path: command not found</p>
          <p className="text-sm mt-2">
            <span className="text-destructive">[ERR]</span> 404 - The requested resource was not found
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            No such file or directory
          </p>
        </div>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-block border border-border px-4 py-2 text-primary hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
          >
            [ cd ~ ]
          </Link>
        </div>
      </div>
    </div>
  );
}
