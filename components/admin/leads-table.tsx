import { AssignLead } from '@/components/admin/assign-lead';
import { StatusBadge } from '@/components/ui/badge';
import { EmptyState, Td, TableWrap, Th } from '@/components/ui/table';
import { formatDateParts } from '@/lib/format';
import type { Broker, Lead } from '@/lib/types';

export function LeadsTable({
  leads,
  /** Brokers offered in the manual-assign control; omit to hide the column. */
  assignableBrokers,
  showBroker = true,
  /**
   * Only one form can exist, so the column is redundant wherever the row also
   * carries an assign control — the space goes to the control instead. The
   * broker leads view keeps it, where the spec calls for it explicitly.
   */
  showForm = assignableBrokers === undefined,
  emptyTitle = 'No leads yet',
  emptyDescription,
}: {
  leads: Lead[];
  assignableBrokers?: Broker[];
  showBroker?: boolean;
  showForm?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
}) {
  if (leads.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }

  return (
    <TableWrap minWidth={assignableBrokers ? '56rem' : '42rem'}>
      <thead>
        <tr>
          <Th>Lead</Th>
          <Th>Phone</Th>
          <Th>IP address</Th>
          {showForm ? <Th>Form</Th> : null}
          <Th>Received</Th>
          {showBroker ? <Th>Broker</Th> : null}
          <Th>Status</Th>
          {assignableBrokers ? <Th className="text-right">Assign</Th> : null}
        </tr>
      </thead>
      <tbody>
        {leads.map((lead) => (
          <tr key={lead.id} className="hover:bg-canvas/60">
            <Td>
              <p className="font-medium text-ink">{lead.name}</p>
              <p className="text-xs text-ink-muted">{lead.email}</p>
            </Td>
            <Td className="whitespace-nowrap text-ink-muted">{lead.phone}</Td>
            <Td className="font-mono text-xs text-ink-muted">
              {lead.ipAddress}
            </Td>
            {showForm ? (
              <Td className="whitespace-nowrap text-ink-muted">
                {lead.formName}
              </Td>
            ) : null}
            <Td className="whitespace-nowrap text-ink-muted">
              {(() => {
                const received = formatDateParts(
                  lead.assignedAt ?? lead.createdAt,
                );

                return received ? (
                  <>
                    <span className="block">{received.date}</span>
                    <span className="block text-xs text-ink-subtle">
                      {received.time}
                    </span>
                  </>
                ) : (
                  '—'
                );
              })()}
            </Td>
            {showBroker ? (
              <Td className="whitespace-nowrap text-ink-muted">
                {lead.broker?.name ?? '—'}
              </Td>
            ) : null}
            <Td>
              <StatusBadge status={lead.status} />
            </Td>
            {assignableBrokers ? (
              <Td className="text-right">
                {lead.status === 'UNSENT' ? (
                  <AssignLead leadId={lead.id} brokers={assignableBrokers} />
                ) : (
                  <span className="text-xs text-ink-subtle">—</span>
                )}
              </Td>
            ) : null}
          </tr>
        ))}
      </tbody>
    </TableWrap>
  );
}
