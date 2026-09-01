'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { Alert } from '@/components/ui/table';

import { submitPublicLead, type PublicLeadState } from './actions';

const INITIAL: PublicLeadState = { status: 'idle', message: null };

export function PublicForm({ slug }: { slug: string }) {
  const [state, formAction, pending] = useActionState(
    submitPublicLead,
    INITIAL,
  );

  if (state.status === 'success') {
    return (
      <div className="space-y-3 py-4 text-center">
        <div
          aria-hidden
          className="mx-auto flex size-10 items-center justify-center rounded-full bg-success-soft text-lg text-success"
        >
          ✓
        </div>
        <p className="text-sm font-medium text-ink">{state.message}</p>
        <p className="text-sm text-ink-muted">
          We will be in touch with you shortly.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="slug" value={slug} />

      <Field label="Full name" htmlFor="name">
        <Input id="name" name="name" placeholder="Jane Dela Cruz" required />
      </Field>

      <Field label="Email" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="jane@example.com"
          required
        />
      </Field>

      <Field label="Phone" htmlFor="phone">
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+63 917 123 4567"
          required
        />
      </Field>

      {state.status === 'error' && state.message ? (
        <Alert>{state.message}</Alert>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Submitting…' : 'Submit'}
      </Button>
    </form>
  );
}
