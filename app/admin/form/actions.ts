'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { api, ApiError } from '@/lib/api';
import type { LeadForm } from '@/lib/types';

export type FormState = { error: string | null };

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function createLeadForm(
  _previous: FormState,
  formData: FormData,
): Promise<FormState> {
  const name = String(formData.get('name') ?? '').trim();
  const slug = slugify(String(formData.get('slug') ?? '') || name);

  if (!name) {
    return { error: 'Enter a form name.' };
  }

  if (!slug) {
    return { error: 'Enter a URL slug using letters, numbers and hyphens.' };
  }

  // These would shadow the admin area if used as a public form URL.
  if (slug === 'admin' || slug === 'login') {
    return { error: `"${slug}" is reserved. Choose another slug.` };
  }

  try {
    await api<LeadForm>('/forms', { method: 'POST', body: { name, slug } });
  } catch (error) {
    return {
      error:
        error instanceof ApiError ? error.message : 'Could not create the form.',
    };
  }

  revalidatePath('/admin/form');
  revalidatePath('/admin');

  // The page swaps to the "form exists" view, which unmounts this form, so
  // navigate instead of returning a message that could never render.
  redirect('/admin/form');
}
