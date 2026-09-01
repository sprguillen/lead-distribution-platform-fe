'use client';

import { Button } from '@/components/ui/button';
import { Card, CardBody } from '@/components/ui/card';

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <Card className="max-w-lg">
      <CardBody className="space-y-3 p-6">
        <h2 className="text-sm font-semibold text-ink">
          Something went wrong
        </h2>
        <p className="text-sm text-ink-muted">
          {error.message || 'The page could not be loaded.'}
        </p>
        <Button variant="secondary" onClick={reset}>
          Try again
        </Button>
      </CardBody>
    </Card>
  );
}
