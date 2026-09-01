import Link from 'next/link';

import { PageHeader } from '@/components/admin/page-header';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Alert } from '@/components/ui/table';
import { apiOrNull } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import type { LeadForm } from '@/lib/types';

import { FormCreator } from './form-creator';

export default async function FormPage() {
  const form = await apiOrNull<LeadForm>('/forms');

  return (
    <>
      <PageHeader
        title="Lead form"
        description="Only one form can exist. Its public URL is where visitors submit leads."
      />

      {form ? (
        <Card className="max-w-xl">
          <CardHeader title={form.name} />
          <CardBody className="space-y-4">
            <dl className="grid gap-3 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium tracking-wide text-ink-muted uppercase">
                  Public URL
                </dt>
                <dd className="mt-1">
                  <Link
                    href={`/${form.slug}`}
                    className="font-mono text-sm text-accent hover:underline"
                  >
                    /{form.slug}
                  </Link>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium tracking-wide text-ink-muted uppercase">
                  Created
                </dt>
                <dd className="mt-1 text-sm text-ink">
                  {formatDateTime(form.createdAt)}
                </dd>
              </div>
            </dl>

            <Alert tone="info">
              A form already exists, so another one cannot be created.
            </Alert>
          </CardBody>
        </Card>
      ) : (
        <Card className="max-w-xl">
          <CardHeader
            title="Create the lead form"
            description="You can only do this once."
          />
          <CardBody>
            <FormCreator />
          </CardBody>
        </Card>
      )}
    </>
  );
}
