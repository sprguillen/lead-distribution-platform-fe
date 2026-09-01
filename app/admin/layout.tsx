import Link from 'next/link';
import { redirect } from 'next/navigation';

import { Nav } from '@/components/admin/nav';
import { Button } from '@/components/ui/button';
import { getSessionToken } from '@/lib/session';

import { logout } from './actions';

export default async function AdminLayout({ children }: LayoutProps<'/admin'>) {
  // Defence in depth: proxy.ts already redirects, but a page must never render
  // admin chrome without a session.
  if (!(await getSessionToken())) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-[84rem] items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <Link href="/admin" className="text-sm font-semibold text-ink">
            Lead Distribution
          </Link>

          <form action={logout}>
            <Button type="submit" variant="ghost" size="sm">
              Sign out
            </Button>
          </form>
        </div>
      </header>

      <div className="mx-auto max-w-[84rem] gap-8 px-4 py-6 sm:px-6 lg:flex lg:py-8">
        <aside className="lg:w-44 lg:shrink-0">
          <Nav />
        </aside>

        <main className="mt-5 min-w-0 flex-1 lg:mt-0">{children}</main>
      </div>
    </div>
  );
}
