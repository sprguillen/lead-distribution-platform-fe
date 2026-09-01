'use server';

import { redirect } from 'next/navigation';

import { api, ApiError } from '@/lib/api';
import { setSessionToken } from '@/lib/session';

export type LoginState = { error: string | null };

type LoginResponse = { token: string; user: { id: number; email: string } };

/** Only allow relative paths, so `?next=` cannot be used as an open redirect. */
function safeRedirect(value: FormDataEntryValue | null) {
  return typeof value === 'string' &&
    value.startsWith('/') &&
    !value.startsWith('//')
    ? value
    : '/admin';
}

export async function login(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');
  const destination = safeRedirect(formData.get('next'));

  if (!email || !password) {
    return { error: 'Enter your email and password.' };
  }

  let token: string;

  try {
    const result = await api<LoginResponse>('/auth/login', {
      method: 'POST',
      body: { email, password },
      anonymous: true,
    });

    token = result.token;
  } catch (error) {
    if (error instanceof ApiError) {
      return { error: error.message };
    }

    return { error: 'Could not reach the server. Please try again.' };
  }

  await setSessionToken(token);

  // redirect throws a control-flow exception, so it must sit outside the
  // try/catch above or it would be swallowed as a login failure.
  redirect(destination);
}
