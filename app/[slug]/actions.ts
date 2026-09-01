'use server';

import { headers } from 'next/headers';

import { api, ApiError } from '@/lib/api';

export type PublicLeadState = {
  status: 'idle' | 'success' | 'error';
  message: string | null;
};

export async function submitPublicLead(
  _previous: PublicLeadState,
  formData: FormData,
): Promise<PublicLeadState> {
  const slug = String(formData.get('slug') ?? '');
  const name = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim();
  const phone = String(formData.get('phone') ?? '').trim();

  if (!name || !email || !phone) {
    return { status: 'error', message: 'All fields are required.' };
  }

  // The visitor's IP reaches this Server Action as a header on the Next.js
  // request; forwarding it lets the API record the real visitor rather than
  // the frontend server.
  const requestHeaders = await headers();
  const forwardedFor =
    requestHeaders.get('x-forwarded-for') ??
    requestHeaders.get('x-real-ip') ??
    '';

  try {
    await api(`/public/forms/${encodeURIComponent(slug)}/leads`, {
      method: 'POST',
      body: { name, email, phone },
      anonymous: true,
      ...(forwardedFor ? { headers: { 'x-forwarded-for': forwardedFor } } : {}),
    });
  } catch (error) {
    return {
      status: 'error',
      message:
        error instanceof ApiError
          ? error.message
          : 'Could not submit the form. Please try again.',
    };
  }

  return {
    status: 'success',
    message: 'Thanks — your details have been received.',
  };
}
