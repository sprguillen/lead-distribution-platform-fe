'use server';

import { revalidatePath } from 'next/cache';

import { api, ApiError } from '@/lib/api';
import { WEEKDAYS, type Broker } from '@/lib/types';

export type BrokerFormState = { error: string | null; success: string | null };

function parseForm(formData: FormData) {
  const workingDays = WEEKDAYS.filter(
    (day) => formData.get(`day-${day}`) === 'on',
  );

  return {
    name: String(formData.get('name') ?? '').trim(),
    dailyCap: Number(formData.get('dailyCap')),
    timezone: String(formData.get('timezone') ?? '').trim(),
    openingTime: String(formData.get('openingTime') ?? ''),
    closingTime: String(formData.get('closingTime') ?? ''),
    isActive: formData.get('isActive') === 'on',
    workingDays,
  };
}

export async function createBroker(
  _previous: BrokerFormState,
  formData: FormData,
): Promise<BrokerFormState> {
  const payload = parseForm(formData);

  if (payload.workingDays.length === 0) {
    return { error: 'Select at least one working day.', success: null };
  }

  try {
    await api<Broker>('/brokers', { method: 'POST', body: payload });
  } catch (error) {
    return {
      error:
        error instanceof ApiError
          ? error.message
          : 'Could not create the broker.',
      success: null,
    };
  }

  revalidatePath('/admin/brokers');
  revalidatePath('/admin');

  return { error: null, success: `${payload.name} was created.` };
}

export async function updateBroker(
  _previous: BrokerFormState,
  formData: FormData,
): Promise<BrokerFormState> {
  const id = Number(formData.get('id'));
  const payload = parseForm(formData);

  if (payload.workingDays.length === 0) {
    return { error: 'Select at least one working day.', success: null };
  }

  try {
    await api<Broker>(`/brokers/${id}`, { method: 'PUT', body: payload });
  } catch (error) {
    return {
      error:
        error instanceof ApiError
          ? error.message
          : 'Could not update the broker.',
      success: null,
    };
  }

  revalidatePath('/admin/brokers');
  revalidatePath(`/admin/brokers/${id}`);

  return { error: null, success: 'Changes saved.' };
}

export async function toggleBrokerActive(formData: FormData) {
  const id = Number(formData.get('id'));
  const isActive = formData.get('isActive') === 'true';

  await api<Broker>(`/brokers/${id}`, {
    method: 'PUT',
    body: { isActive: !isActive },
  });

  revalidatePath('/admin/brokers');
  revalidatePath(`/admin/brokers/${id}`);
  revalidatePath('/admin');
}
