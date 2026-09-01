'use client';

import { useActionState } from 'react';

import { Button } from '@/components/ui/button';
import { Field, Input } from '@/components/ui/field';
import { Alert } from '@/components/ui/table';

import { login, type LoginState } from './actions';

const INITIAL: LoginState = { error: null };

export function LoginForm({ next }: { next: string }) {
  const [state, formAction, pending] = useActionState(login, INITIAL);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="next" value={next} />

      <Field label="Email" htmlFor="email">
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          placeholder="admin@example.com"
          required
        />
      </Field>

      <Field label="Password" htmlFor="password">
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          placeholder="••••••••"
          required
        />
      </Field>

      {state.error ? <Alert>{state.error}</Alert> : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </Button>
    </form>
  );
}
