import { LeadsTable } from '@/components/admin/leads-table';
import { PageHeader, StatTile } from '@/components/admin/page-header';
import { Card, CardHeader } from '@/components/ui/card';
import { api } from '@/lib/api';
import type { Broker, Lead } from '@/lib/types';

export default async function LeadsPage() {
  const [leads, brokers] = await Promise.all([
    api<Lead[]>('/leads'),
    api<Broker[]>('/brokers'),
  ]);

  const counts = {
    sent: leads.filter((lead) => lead.status === 'SENT').length,
    unsent: leads.filter((lead) => lead.status === 'UNSENT').length,
    duplicate: leads.filter((lead) => lead.status === 'DUPLICATE').length,
    failed: leads.filter((lead) => lead.status === 'FAILED').length,
  };

  return (
    <>
      <PageHeader
        title="Leads"
        description="Every lead submitted through the public form. Unsent leads can be assigned manually."
      />

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Sent" value={counts.sent} tone="success" />
        <StatTile label="Unsent" value={counts.unsent} tone="warning" />
        <StatTile label="Duplicate" value={counts.duplicate} tone="accent" />
        <StatTile label="Failed" value={counts.failed} tone="danger" />
      </div>

      <Card>
        <CardHeader title="All leads" description={`${leads.length} total`} />
        <LeadsTable
          leads={leads}
          assignableBrokers={brokers}
          emptyTitle="No leads yet"
          emptyDescription="Leads appear here as soon as the public form is submitted."
        />
      </Card>
    </>
  );
}
