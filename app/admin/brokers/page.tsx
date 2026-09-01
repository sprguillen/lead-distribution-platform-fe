import Link from 'next/link';

import { BrokerForm } from '@/components/admin/broker-form';
import { PageHeader } from '@/components/admin/page-header';
import { ActiveBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { EmptyState, Td, TableWrap, Th } from '@/components/ui/table';
import { api } from '@/lib/api';
import { formatWorkingDays } from '@/lib/format';
import { supportedTimezones } from '@/lib/timezones';
import type { Broker } from '@/lib/types';

import { createBroker, toggleBrokerActive } from './actions';

export default async function BrokersPage() {
  const brokers = await api<Broker[]>('/brokers');
  const timezones = supportedTimezones();

  return (
    <>
      <PageHeader
        title="Brokers"
        description="Brokers receive leads only while active, open, and under their daily cap."
      />

      <div className="space-y-5">
        <Card className="min-w-0">
          <CardHeader
            title="All brokers"
            description={`${brokers.length} total`}
          />

          {brokers.length === 0 ? (
            <EmptyState
              title="No brokers yet"
              description="Create your first broker using the form to start distributing leads."
            />
          ) : (
            <TableWrap>
              <thead>
                <tr>
                  <Th>Broker</Th>
                  <Th>Schedule</Th>
                  <Th>Cap</Th>
                  <Th>Status</Th>
                  <Th className="text-right">Actions</Th>
                </tr>
              </thead>
              <tbody>
                {brokers.map((broker) => (
                  <tr key={broker.id} className="hover:bg-canvas/60">
                    <Td>
                      <Link
                        href={`/admin/brokers/${broker.id}`}
                        className="font-medium whitespace-nowrap text-accent hover:underline"
                      >
                        {broker.name}
                      </Link>
                      <p className="text-xs text-ink-muted">
                        {broker.timezone}
                      </p>
                    </Td>
                    <Td className="whitespace-nowrap text-ink-muted">
                      <span className="block">
                        {broker.openingTime}–{broker.closingTime}
                      </span>
                      <span className="block text-xs text-ink-subtle">
                        {formatWorkingDays(broker.workingDays)}
                      </span>
                    </Td>
                    <Td className="text-ink-muted">{broker.dailyCap}/day</Td>
                    <Td>
                      <ActiveBadge isActive={broker.isActive} />
                    </Td>
                    <Td className="text-right">
                      <form action={toggleBrokerActive} className="inline">
                        <input type="hidden" name="id" value={broker.id} />
                        <input
                          type="hidden"
                          name="isActive"
                          value={String(broker.isActive)}
                        />
                        <Button type="submit" variant="secondary" size="sm">
                          {broker.isActive ? 'Deactivate' : 'Activate'}
                        </Button>
                      </form>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrap>
          )}
        </Card>

        <Card className="max-w-xl">
          <CardHeader title="Add a broker" />
          <CardBody>
            <BrokerForm
              action={createBroker}
              timezones={timezones}
              submitLabel="Create broker"
            />
          </CardBody>
        </Card>
      </div>
    </>
  );
}
