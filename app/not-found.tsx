import Link from 'next/link';

import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
      <p className="text-sm font-medium tracking-wide text-ink-muted uppercase">
        404
      </p>
      <h1 className="text-lg font-semibold text-ink">Page not found</h1>
      <p className="max-w-sm text-sm text-ink-muted">
        The page you are looking for does not exist or the form URL is
        incorrect.
      </p>
      <Link href="/" className="mt-2">
        <Button variant="secondary">Go home</Button>
      </Link>
    </main>
  );
}
