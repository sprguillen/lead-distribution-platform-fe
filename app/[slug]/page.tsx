import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { Card, CardBody } from '@/components/ui/card';
import { apiOrNull } from '@/lib/api';
import type { LeadForm } from '@/lib/types';

import { PublicForm } from './public-form';

async function getForm(slug: string) {
  return apiOrNull<LeadForm>(`/public/forms/${encodeURIComponent(slug)}`, {
    anonymous: true,
  });
}

export async function generateMetadata(
  props: PageProps<'/[slug]'>,
): Promise<Metadata> {
  const { slug } = await props.params;
  const form = await getForm(slug);

  return { title: form ? form.name : 'Form not found' };
}

export default async function PublicFormPage(props: PageProps<'/[slug]'>) {
  const { slug } = await props.params;
  const form = await getForm(slug);

  if (!form) {
    notFound();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-ink">{form.name}</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Fill in your details and we will get back to you.
          </p>
        </div>

        <Card>
          <CardBody className="p-6">
            <PublicForm slug={form.slug} />
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
