import { cn } from '@/lib/cn';
import type { LeadStatus } from '@/lib/types';

const STATUS_STYLES: Record<LeadStatus, string> = {
  SENT: 'bg-success-soft text-success',
  UNSENT: 'bg-warning-soft text-warning',
  DUPLICATE: 'bg-accent-soft text-accent-ink',
  FAILED: 'bg-danger-soft text-danger',
};

export function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize',
        STATUS_STYLES[status],
      )}
    >
      {status.toLowerCase()}
    </span>
  );
}

export function ActiveBadge({ isActive }: { isActive: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium',
        isActive
          ? 'bg-success-soft text-success'
          : 'bg-neutral-soft text-ink-muted',
      )}
    >
      <span
        aria-hidden
        className={cn(
          'size-1.5 rounded-full',
          isActive ? 'bg-success' : 'bg-ink-subtle',
        )}
      />
      {isActive ? 'Active' : 'Inactive'}
    </span>
  );
}
