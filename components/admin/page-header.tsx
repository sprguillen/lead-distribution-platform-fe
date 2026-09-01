import type { ReactNode } from 'react';

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
      <div>
        <h1 className="text-lg font-semibold text-ink">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-ink-muted">{description}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function StatTile({
  label,
  value,
  tone = 'default',
}: {
  label: string;
  value: number | string;
  tone?: 'default' | 'success' | 'warning' | 'accent' | 'danger';
}) {
  const tones = {
    default: 'text-ink',
    success: 'text-success',
    warning: 'text-warning',
    accent: 'text-accent-ink',
    danger: 'text-danger',
  } as const;

  return (
    <div className="rounded-xl border border-border bg-surface px-4 py-3.5">
      <p className="text-xs font-medium tracking-wide text-ink-muted uppercase">
        {label}
      </p>
      <p className={`mt-1.5 text-2xl font-semibold ${tones[tone]}`}>{value}</p>
    </div>
  );
}
