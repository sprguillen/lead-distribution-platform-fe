import type { Metadata } from 'next';

import { Card, CardBody } from '@/components/ui/card';

import { LoginForm } from './login-form';

export const metadata: Metadata = {
  title: 'Sign in · Lead Distribution',
};

export default async function LoginPage(props: PageProps<'/login'>) {
  const { next } = await props.searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-xl font-semibold text-ink">
            Lead Distribution Platform
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            Sign in to manage brokers, forms and leads.
          </p>
        </div>

        <Card>
          <CardBody className="p-6">
            <LoginForm next={typeof next === 'string' ? next : '/admin'} />
          </CardBody>
        </Card>
      </div>
    </main>
  );
}
