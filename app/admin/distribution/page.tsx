import Link from 'next/link';

import { DistributionForm } from '@/components/admin/distribution-form';
import { PageHeader, StatTile } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { Alert, EmptyState } from '@/components/ui/table';
import { api, apiOrNull } from '@/lib/api';
import type { Broker, Distribution, LeadForm } from '@/lib/types';

import { createDistribution, updateDistribution } from './actions';

export default async function DistributionPage() {
  const [distribution, brokers, form] = await Promise.all([
    api<Distribution | null>('/distributions'),
    api<Broker[]>('/brokers'),
    apiOrNull<LeadForm>('/forms'),
  ]);

  if (brokers.length === 0) {
    return (
      <>
        <PageHeader title="Distribution" />
        <Card>
          <EmptyState
            title="Create brokers first"
            description="A distribution needs at least one broker to send leads to."
            action={
              <Link href="/admin/brokers">
                <Button>Go to brokers</Button>
              </Link>
            }
          />
        </Card>
      </>
    );
  }

  if (!distribution) {
    return (
      <>
        <PageHeader
          title="Distribution"
          description="Only one distribution can exist. It is attached to the lead form automatically."
        />

        <Card className="max-w-3xl">
          <CardHeader
            title="Create the distribution"
            description="Choose which brokers take part and what share of leads each should receive."
          />
          <CardBody className="space-y-4">
            {form ? null : (
              <Alert>Oops, please create a form first.</Alert>
            )}

            <DistributionForm
              action={createDistribution}
              brokers={brokers}
              submitLabel="Create distribution"
            />
          </CardBody>
        </Card>
      </>
    );
  }

  const { leadCounts } = distribution;

  return (
    <>
      <PageHeader
        title="Distribution"
        description={`Attached to "${distribution.form.name}" (/${distribution.form.slug}).`}
        action={
          <Link href={`/admin/distribution/${distribution.id}`}>
            <Button variant="secondary">View lead history</Button>
          </Link>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Sent" value={leadCounts.sent} tone="success" />
        <StatTile label="Unsent" value={leadCounts.unsent} tone="warning" />
        <StatTile label="Duplicate" value={leadCounts.duplicate} tone="accent" />
        <StatTile label="Failed" value={leadCounts.failed} tone="danger" />
      </div>

      <Card className="max-w-3xl">
        <CardHeader
          title="Broker settings"
          description="The next lead goes to the eligible broker furthest behind its target share."
        />
        <CardBody className="space-y-4">
          <Alert tone="info">
            A distribution already exists, so another one cannot be created.
          </Alert>

          <DistributionForm
            action={updateDistribution}
            brokers={brokers}
            distributionId={distribution.id}
            existing={distribution.brokers}
            submitLabel="Save settings"
          />
        </CardBody>
      </Card>
    </>
  );
}
