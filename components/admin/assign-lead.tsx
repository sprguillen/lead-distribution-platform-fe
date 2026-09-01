'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/field';
import type { Broker } from '@/lib/types';

import { assignLead, type AssignState } from '@/app/admin/leads/actions';

const INITIAL: AssignState = { error: null, success: null };

export function AssignLead({
  leadId,
  brokers,
}: {
  leadId: number;
  brokers: Broker[];
}) {
  const [state, formAction, pending] = useActionState(assignLead, INITIAL);

  if (brokers.length === 0) {
    return <span className="text-xs text-ink-subtle">No brokers</span>;
  }

  return (
    <form action={formAction} className="flex items-center justify-end gap-1.5">
      <input type="hidden" name="leadId" value={leadId} />

      {/* Fixed-width wrapper: the shared control style is w-full, so the
          width has to be constrained from the outside. */}
      <div className="w-32 shrink-0">
        <Select
          name="brokerId"
          aria-label={`Assign lead ${leadId} to a broker`}
          defaultValue=""
          className="h-8 py-0 text-xs"
          required
        >
          <option value="" disabled>
            Choose broker…
          </option>
          {brokers.map((broker) => (
            <option key={broker.id} value={broker.id}>
              {broker.name}
            </option>
          ))}
        </Select>
      </div>

      <Button
        type="submit"
        size="sm"
        variant="secondary"
        className="shrink-0"
        disabled={pending}
      >
        {pending ? '…' : 'Assign'}
      </Button>

      {state.error ? (
        <span className="text-xs text-danger">{state.error}</span>
      ) : null}
    </form>
  );
}
