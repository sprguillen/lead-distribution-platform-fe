import type { ComponentProps, ReactNode } from 'react';

import { cn } from '@/lib/cn';

const CONTROL =
  'w-full rounded-lg border border-border-strong bg-surface px-3 py-2 text-sm text-ink ' +
  'placeholder:text-ink-subtle disabled:cursor-not-allowed disabled:bg-neutral-soft';

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={htmlFor} className="block text-sm font-medium text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p className="text-xs text-danger">{error}</p>
      ) : hint ? (
        <p className="text-xs text-ink-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return <input className={cn(CONTROL, className)} {...props} />;
}

export function Select({ className, ...props }: ComponentProps<'select'>) {
  return <select className={cn(CONTROL, className)} {...props} />;
}
