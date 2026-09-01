import Link from 'next/link';
import { notFound } from 'next/navigation';

import { LeadsTable } from '@/components/admin/leads-table';
import { PageHeader, StatTile } from '@/components/admin/page-header';
import { ActiveBadge } from '@/components/ui/badge';
import { Card, CardHeader } from '@/components/ui/card';
import { Td, TableWrap, Th } from '@/components/ui/table';
import { api } from '@/lib/api';
import { formatDateTime } from '@/lib/format';
import type { Broker, Distribution } from '@/lib/types';

export default async function DistributionDetailPage(
  props: PageProps<'/admin/distribution/[id]'>,
) {
  const { id } = await props.params;

  const [distribution, brokers] = await Promise.all([
    api<Distribution | null>('/distributions'),
    api<Broker[]>('/brokers'),
  ]);

  if (!distribution || String(distribution.id) !== id) {
    notFound();
  }

  const { leadCounts } = distribution;

  return (
    <>
      <Link
        href="/admin/distribution"
        className="mb-3 inline-block text-sm text-ink-muted hover:text-ink"
      >
        ← Back to distribution
      </Link>

      <PageHeader
        title="Distribution detail"
        description={`Created ${formatDateTime(distribution.createdAt)} · attached to /${distribution.form.slug}`}
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        <StatTile label="Total" value={leadCounts.total} />
        <StatTile label="Sent" value={leadCounts.sent} tone="success" />
        <StatTile label="Unsent" value={leadCounts.unsent} tone="warning" />
        <StatTile label="Duplicate" value={leadCounts.duplicate} tone="accent" />
        <StatTile label="Failed" value={leadCounts.failed} tone="danger" />
      </div>

      <Card className="mb-5">
        <CardHeader
          title="Brokers in this distribution"
          description="Percentage sets each broker's target share of the leads."
        />
        <TableWrap>
          <thead>
            <tr>
              <Th>Broker</Th>
              <Th>Share</Th>
              <Th>Hours</Th>
              <Th>Cap</Th>
              <Th>In distribution</Th>
              <Th>Broker status</Th>
            </tr>
          </thead>
          <tbody>
            {distribution.brokers.map((setting) => (
              <tr key={setting.id} className="hover:bg-canvas/60">
                <Td>
                  <Link
                    href={`/admin/brokers/${setting.brokerId}`}
                    className="font-medium text-accent hover:underline"
                  >
                    {setting.broker.name}
                  </Link>
                  <p className="text-xs text-ink-muted">
                    {setting.broker.timezone}
                  </p>
                </Td>
                <Td className="font-medium">{setting.percentage}%</Td>
                <Td className="whitespace-nowrap text-ink-muted">
                  {setting.broker.openingTime}–{setting.broker.closingTime}
                </Td>
                <Td className="text-ink-muted">
                  {setting.broker.dailyCap}/day
                </Td>
                <Td>
                  <ActiveBadge isActive={setting.isActive} />
                </Td>
                <Td>
                  <ActiveBadge isActive={setting.broker.isActive} />
                </Td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      </Card>

      <Card>
        <CardHeader
          title="Lead history"
          description="Every lead that passed through this distribution — sent, unsent and duplicate."
        />
        <LeadsTable
          leads={distribution.leads}
          assignableBrokers={brokers}
          emptyTitle="No leads yet"
          emptyDescription="Leads appear here once the public form is submitted."
        />
      </Card>
    </>
  );
}
