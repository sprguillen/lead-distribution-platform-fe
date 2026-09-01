import Link from 'next/link';
import { notFound } from 'next/navigation';

import { BrokerForm } from '@/components/admin/broker-form';
import { LeadsTable } from '@/components/admin/leads-table';
import { PageHeader, StatTile } from '@/components/admin/page-header';
import { ActiveBadge } from '@/components/ui/badge';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { apiOrNull } from '@/lib/api';
import { formatWorkingDays } from '@/lib/format';
import { supportedTimezones } from '@/lib/timezones';
import type { BrokerDetail } from '@/lib/types';

import { updateBroker } from '../actions';

export default async function BrokerDetailPage(
  props: PageProps<'/admin/brokers/[id]'>,
) {
  const { id } = await props.params;

  const broker = await apiOrNull<BrokerDetail>(`/brokers/${id}`);

  if (!broker) {
    notFound();
  }

  const sent = broker.leads.filter((lead) => lead.status === 'SENT');

  return (
    <>
      <Link
        href="/admin/brokers"
        className="mb-3 inline-block text-sm text-ink-muted hover:text-ink"
      >
        ← Back to brokers
      </Link>

      <PageHeader
        title={broker.name}
        description={`${broker.timezone} · ${broker.openingTime}–${broker.closingTime} · ${formatWorkingDays(broker.workingDays)}`}
        action={<ActiveBadge isActive={broker.isActive} />}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile label="Leads received" value={sent.length} tone="success" />
        <StatTile label="Daily cap" value={`${broker.dailyCap}/day`} />
        <StatTile
          label="In distribution"
          value={broker.distributionSettings.length > 0 ? 'Yes' : 'No'}
        />
      </div>

      <div className="space-y-5">
        <Card className="min-w-0">
          <CardHeader
            title="Leads received"
            description="Every lead assigned to this broker, automatically or manually."
          />
          <LeadsTable
            leads={broker.leads}
            showBroker={false}
            emptyTitle="No leads yet"
            emptyDescription="This broker has not received any leads."
          />
        </Card>

        <Card className="max-w-xl">
          <CardHeader title="Edit broker" />
          <CardBody>
            <BrokerForm
              action={updateBroker}
              timezones={supportedTimezones()}
              broker={broker}
              submitLabel="Save changes"
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
