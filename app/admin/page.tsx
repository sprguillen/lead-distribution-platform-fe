import Link from 'next/link';

import { PageHeader, StatTile } from '@/components/admin/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardBody, CardHeader } from '@/components/ui/card';
import { api } from '@/lib/api';
import type { DashboardSummary } from '@/lib/types';

export default async function DashboardPage() {
  const summary = await api<DashboardSummary>('/dashboard');

  const { form, distribution, brokers, leads } = summary;

  const steps = [
    {
      label: 'Create brokers',
      done: brokers.total > 0,
      detail:
        brokers.total > 0
          ? `${brokers.total} broker${brokers.total === 1 ? '' : 's'}, ${brokers.active} active`
          : 'No brokers yet',
      href: '/admin/brokers',
    },
    {
      label: 'Create the lead form',
      done: form.exists,
      detail: form.data ? `/${form.data.slug}` : 'No form yet',
      href: '/admin/form',
    },
    {
      label: 'Create the distribution',
      done: distribution.exists,
      detail: distribution.exists
        ? 'Connected to the form'
        : 'No distribution yet',
      href: '/admin/distribution',
    },
  ];

  return (
    <>
      <PageHeader
        title="Dashboard"
        description="Lead volume and setup status at a glance."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile label="Total leads" value={leads.total} />
        <StatTile label="Sent" value={leads.sent} tone="success" />
        <StatTile label="Unsent" value={leads.unsent} tone="warning" />
        <StatTile label="Duplicate" value={leads.duplicate} tone="accent" />
        <StatTile label="Failed" value={leads.failed} tone="danger" />
      </div>

      <div className="mt-5 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardHeader
            title="Setup"
            description="One form and one distribution can exist."
          />
          <ul className="divide-y divide-border">
            {steps.map((step) => (
              <li
                key={step.label}
                className="flex items-center justify-between gap-3 px-5 py-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    aria-hidden
                    className={
                      step.done
                        ? 'flex size-5 shrink-0 items-center justify-center rounded-full bg-success-soft text-xs text-success'
                        : 'flex size-5 shrink-0 items-center justify-center rounded-full bg-neutral-soft text-xs text-ink-subtle'
                    }
                  >
                    {step.done ? '✓' : '•'}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{step.label}</p>
                    <p className="truncate text-xs text-ink-muted">
                      {step.detail}
                    </p>
                  </div>
                </div>

                <Link href={step.href}>
                  <Button variant="secondary" size="sm">
                    {step.done ? 'View' : 'Set up'}
                  </Button>
                </Link>
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <CardHeader
            title="Public form"
            description="Share this link to start collecting leads."
          />
          <CardBody>
            {form.data ? (
              <>
                <p className="text-sm text-ink">{form.data.name}</p>
                <Link
                  href={`/${form.data.slug}`}
                  className="mt-1 inline-block font-mono text-sm text-accent hover:underline"
                >
                  /{form.data.slug}
                </Link>
                {!distribution.exists ? (
                  <p className="mt-3 text-sm text-warning">
                    No distribution yet — submitted leads will be saved as
                    unsent until you create one.
                  </p>
                ) : null}
              </>
            ) : (
              <p className="text-sm text-ink-muted">
                Create the lead form to get a public URL.
              </p>
            )}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
