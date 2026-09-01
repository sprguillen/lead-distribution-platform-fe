'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { api, ApiError } from '@/lib/api';
import type { Broker, Distribution } from '@/lib/types';

export type DistributionState = { error: string | null; success: string | null };

/**
 * Reads the per-broker rows out of the form. A broker is included only when
 * its `include-<id>` checkbox is ticked; `active-<id>` maps to the broker's
 * active flag inside the distribution.
 */
function parseBrokerRows(formData: FormData, brokers: Broker[]) {
  return brokers
    .filter((broker) => formData.get(`include-${broker.id}`) === 'on')
    .map((broker) => ({
      brokerId: broker.id,
      percentage: Number(formData.get(`percentage-${broker.id}`) ?? 0),
      isActive: formData.get(`active-${broker.id}`) === 'on',
    }));
}

function validate(rows: ReturnType<typeof parseBrokerRows>) {
  if (rows.length === 0) {
    return 'Select at least one broker.';
  }

  const invalid = rows.some(
    (row) =>
      !Number.isInteger(row.percentage) ||
      row.percentage < 0 ||
      row.percentage > 100,
  );

  if (invalid) {
    return 'Percentages must be whole numbers between 0 and 100.';
  }

  return null;
}

export async function createDistribution(
  _previous: DistributionState,
  formData: FormData,
): Promise<DistributionState> {
  const brokers = await api<Broker[]>('/brokers');
  const rows = parseBrokerRows(formData, brokers);

  const invalid = validate(rows);

  if (invalid) {
    return { error: invalid, success: null };
  }

  let created: Distribution;

  try {
    created = await api<Distribution>('/distributions', {
      method: 'POST',
      body: { brokers: rows },
    });
  } catch (error) {
    // The backend returns "Oops, please create a form first." when no form
    // exists yet; surfacing its message keeps that rule in one place.
    return {
      error:
        error instanceof ApiError
          ? error.message
          : 'Could not create the distribution.',
      success: null,
    };
  }

  revalidatePath('/admin/distribution');
  revalidatePath('/admin');

  // Once the distribution exists the page renders a different branch, which
  // unmounts this form and discards its state — so confirm by navigating to
  // the new distribution rather than returning a message nothing can show.
  redirect(`/admin/distribution/${created.id}`);
}

export async function updateDistribution(
  _previous: DistributionState,
  formData: FormData,
): Promise<DistributionState> {
  const id = Number(formData.get('id'));
  const brokers = await api<Broker[]>('/brokers');
  const rows = parseBrokerRows(formData, brokers);

  const invalid = validate(rows);

  if (invalid) {
    return { error: invalid, success: null };
  }

  try {
    await api<Distribution>(`/distributions/${id}`, {
      method: 'PUT',
      body: { brokers: rows },
    });
  } catch (error) {
    return {
      error:
        error instanceof ApiError
          ? error.message
          : 'Could not update the distribution.',
      success: null,
    };
  }

  revalidatePath('/admin/distribution');
  revalidatePath(`/admin/distribution/${id}`);

  return { error: null, success: 'Distribution updated.' };
}
