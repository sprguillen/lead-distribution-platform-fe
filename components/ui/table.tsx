import type { ReactNode } from 'react';

import { cn } from '@/lib/cn';

/** Wraps a table so wide content scrolls inside the card, not the page. */
export function TableWrap({
  children,
  minWidth = '44rem',
}: {
  children: ReactNode;
  /** Below this the table scrolls inside its card rather than widening the page. */
  minWidth?: string;
}) {
  return (
    <div className="overflow-x-auto">
      <table
        className="w-full border-collapse text-sm"
        style={{ minWidth }}
      >
        {children}
      </table>
    </div>
  );
}

export function Th({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <th
      scope="col"
      className={cn(
        'whitespace-nowrap border-b border-border bg-neutral-soft/60 px-4 py-2.5 text-left',
        'text-xs font-medium tracking-wide text-ink-muted uppercase',
        className,
      )}
    >
      {children}
    </th>
  );
}

export function Td({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <td
      className={cn(
        'border-b border-border px-4 py-3 align-middle text-ink',
        className,
      )}
    >
      {children}
    </td>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-14 text-center">
      <p className="text-sm font-medium text-ink">{title}</p>
      {description ? (
        <p className="max-w-sm text-sm text-ink-muted">{description}</p>
      ) : null}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}

export function Alert({
  tone = 'error',
  children,
}: {
  tone?: 'error' | 'success' | 'info';
  children: ReactNode;
}) {
  const tones = {
    error: 'bg-danger-soft text-danger',
    success: 'bg-success-soft text-success',
    info: 'bg-accent-soft text-accent-ink',
  } as const;

  return (
    <p
      role="status"
      className={cn('rounded-lg px-3 py-2 text-sm', tones[tone])}
    >
      {children}
    </p>
  );
}
