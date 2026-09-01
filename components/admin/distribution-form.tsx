'use client';

import { useActionState, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/field';
import { Alert } from '@/components/ui/table';
import type { Broker, DistributionBroker } from '@/lib/types';

import type { DistributionState } from '@/app/admin/distribution/actions';

const INITIAL: DistributionState = { error: null, success: null };

type Row = { include: boolean; percentage: number; isActive: boolean };

function initialRows(
  brokers: Broker[],
  existing: DistributionBroker[],
): Record<number, Row> {
  const bySettings = new Map(existing.map((item) => [item.brokerId, item]));

  return Object.fromEntries(
    brokers.map((broker) => {
      const setting = bySettings.get(broker.id);

      return [
        broker.id,
        {
          include: Boolean(setting),
          percentage: setting?.percentage ?? 0,
          isActive: setting?.isActive ?? true,
        },
      ];
    }),
  );
}

export function DistributionForm({
  action,
  brokers,
  distributionId,
  existing = [],
  submitLabel,
}: {
  action: (
    state: DistributionState,
    formData: FormData,
  ) => Promise<DistributionState>;
  brokers: Broker[];
  distributionId?: number;
  existing?: DistributionBroker[];
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, INITIAL);
  const [rows, setRows] = useState(() => initialRows(brokers, existing));

  const update = (id: number, patch: Partial<Row>) =>
    setRows((current) => ({ ...current, [id]: { ...current[id], ...patch } }));

  const included = brokers.filter((broker) => rows[broker.id]?.include);
  const total = included.reduce(
    (sum, broker) => sum + (rows[broker.id]?.percentage ?? 0),
    0,
  );

  return (
    <form action={formAction} className="space-y-4">
      {distributionId ? (
        <input type="hidden" name="id" value={distributionId} />
      ) : null}

      <ul className="divide-y divide-border rounded-lg border border-border">
        {brokers.map((broker) => {
          const row = rows[broker.id];

          return (
            <li key={broker.id} className="flex flex-wrap items-center gap-3 px-3 py-2.5">
              <label className="flex min-w-0 flex-1 items-center gap-2.5">
                <input
                  type="checkbox"
                  name={`include-${broker.id}`}
                  checked={row.include}
                  onChange={(event) =>
                    update(broker.id, { include: event.target.checked })
                  }
                  className="size-4 shrink-0 rounded border-border-strong accent-accent"
                />
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium text-ink">
                    {broker.name}
                  </span>
                  <span className="block text-xs text-ink-muted">
                    {broker.timezone} · {broker.openingTime}–
                    {broker.closingTime}
                  </span>
                </span>
              </label>

              <div className="flex items-center gap-1.5">
                <Input
                  type="number"
                  name={`percentage-${broker.id}`}
                  aria-label={`${broker.name} percentage`}
                  min={0}
                  max={100}
                  step={1}
                  value={row.percentage}
                  disabled={!row.include}
                  onChange={(event) =>
                    update(broker.id, { percentage: Number(event.target.value) })
                  }
                  className="h-8 w-20 py-0 text-sm"
                />
                <span className="text-sm text-ink-muted">%</span>
              </div>

              <label className="flex w-24 items-center gap-1.5 text-xs text-ink-muted">
                <input
                  type="checkbox"
                  name={`active-${broker.id}`}
                  checked={row.isActive}
                  disabled={!row.include}
                  onChange={(event) =>
                    update(broker.id, { isActive: event.target.checked })
                  }
                  className="size-3.5 rounded border-border-strong accent-accent"
                />
                Active
              </label>
            </li>
          );
        })}
      </ul>

      <p className="text-sm text-ink-muted">
        {included.length} broker{included.length === 1 ? '' : 's'} selected ·
        total{' '}
        <span className={total === 100 ? 'text-success' : 'text-warning'}>
          {total}%
        </span>
        {total === 100 ? null : ' — percentages usually add up to 100'}
      </p>

      {state.error ? <Alert>{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}
