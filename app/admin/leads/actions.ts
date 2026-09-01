'use server';

import { revalidatePath } from 'next/cache';

import { api, ApiError } from '@/lib/api';

export type AssignState = { error: string | null; success: string | null };

export async function assignLead(
  _previous: AssignState,
  formData: FormData,
): Promise<AssignState> {
  const leadId = Number(formData.get('leadId'));
  const brokerId = Number(formData.get('brokerId'));

  if (!Number.isInteger(leadId) || !Number.isInteger(brokerId)) {
    return { error: 'Choose a broker to assign this lead to.', success: null };
  }

  try {
    await api(`/leads/${leadId}/assign`, {
      method: 'POST',
      body: { brokerId },
    });
  } catch (error) {
    return {
      error:
        error instanceof ApiError ? error.message : 'Could not assign the lead.',
      success: null,
    };
  }

  revalidatePath('/admin/leads');
  revalidatePath('/admin/distribution');
  revalidatePath('/admin');

  return { error: null, success: 'Lead assigned.' };
}
