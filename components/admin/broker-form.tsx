'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, Input, Select } from '@/components/ui/field';
import { Alert } from '@/components/ui/table';
import { WEEKDAYS, type Broker } from '@/lib/types';

import type { BrokerFormState } from '@/app/admin/brokers/actions';

const INITIAL: BrokerFormState = { error: null, success: null };

const DEFAULT_DAYS = new Set([
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
]);

export function BrokerForm({
  action,
  timezones,
  broker,
  submitLabel,
}: {
  action: (
    state: BrokerFormState,
    formData: FormData,
  ) => Promise<BrokerFormState>;
  timezones: string[];
  broker?: Broker;
  submitLabel: string;
}) {
  const [state, formAction, pending] = useActionState(action, INITIAL);

  const selectedDays = new Set<string>(broker?.workingDays ?? [...DEFAULT_DAYS]);

  return (
    <form action={formAction} className="space-y-4">
      {broker ? <input type="hidden" name="id" value={broker.id} /> : null}

      <Field label="Broker name" htmlFor="name">
        <Input
          id="name"
          name="name"
          defaultValue={broker?.name}
          placeholder="Broker A"
          required
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          label="Daily cap"
          htmlFor="dailyCap"
          hint="Maximum leads per day, in the broker's timezone."
        >
          <Input
            id="dailyCap"
            name="dailyCap"
            type="number"
            min={1}
            step={1}
            defaultValue={broker?.dailyCap ?? 10}
            required
          />
        </Field>

        <Field label="Timezone" htmlFor="timezone">
          <Select
            id="timezone"
            name="timezone"
            defaultValue={broker?.timezone ?? 'Asia/Manila'}
            required
          >
            {timezones.map((zone) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Opening time" htmlFor="openingTime">
          <Input
            id="openingTime"
            name="openingTime"
            type="time"
            defaultValue={broker?.openingTime ?? '09:00'}
            required
          />
        </Field>

        <Field
          label="Closing time"
          htmlFor="closingTime"
          hint="Must be later than the opening time."
        >
          <Input
            id="closingTime"
            name="closingTime"
            type="time"
            defaultValue={broker?.closingTime ?? '18:00'}
            required
          />
        </Field>
      </div>

      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-ink">
          Working days
        </legend>
        <div className="flex flex-wrap gap-1.5">
          {WEEKDAYS.map((day) => (
            <label
              key={day}
              className="cursor-pointer rounded-lg border border-border-strong px-2.5 py-1.5 text-xs font-medium text-ink-muted has-checked:border-accent has-checked:bg-accent-soft has-checked:text-accent-ink"
            >
              <input
                type="checkbox"
                name={`day-${day}`}
                defaultChecked={selectedDays.has(day)}
                className="sr-only"
              />
              {day.slice(0, 3)}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex items-center gap-2 text-sm text-ink">
        <input
          type="checkbox"
          name="isActive"
          defaultChecked={broker?.isActive ?? true}
          className="size-4 rounded border-border-strong accent-accent"
        />
        Active — inactive brokers never receive leads
      </label>

      {state.error ? <Alert>{state.error}</Alert> : null}
      {state.success ? <Alert tone="success">{state.success}</Alert> : null}

      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : submitLabel}
      </Button>
    </form>
  );
}
