'use client';

import { useActionState, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { Alert } from '@/components/ui/table';

import { createLeadForm, type FormState } from './actions';

const INITIAL: FormState = { error: null };

export function FormCreator() {
  const [state, formAction, pending] = useActionState(createLeadForm, INITIAL);
  const [slug, setSlug] = useState('');

  return (
    <form action={formAction} className="space-y-4">
      <Field label="Form name" htmlFor="name">
        <Input
          id="name"
          name="name"
          placeholder="Lead Registration"
          required
          onChange={(event) => {
            // Mirror the name into the slug until the slug is edited directly.
            setSlug((current) =>
              current === '' || current === slug
                ? event.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-')
                    .replace(/^-+/, '')
                : current,
            );
          }}
        />
      </Field>

      <Field
        label="Public URL slug"
        htmlFor="slug"
        hint={slug ? `The form will be public at /${slug}` : 'Lowercase letters, numbers and hyphens.'}
      >
        <Input
          id="slug"
          name="slug"
          value={slug}
          onChange={(event) => setSlug(event.target.value)}
          placeholder="lead-registration"
          required
        />
      </Field>

      {state.error ? <Alert>{state.error}</Alert> : null}

      <Button type="submit" disabled={pending}>
        {pending ? 'Creating…' : 'Create form'}
      </Button>
    </form>
  );
}
