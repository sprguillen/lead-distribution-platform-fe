'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/cn';

const LINKS = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/brokers', label: 'Brokers' },
  { href: '/admin/form', label: 'Lead form' },
  { href: '/admin/distribution', label: 'Distribution' },
  { href: '/admin/leads', label: 'Leads' },
] as const;

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto lg:flex-col">
      {LINKS.map((link) => {
        const isActive =
          link.href === '/admin'
            ? pathname === '/admin'
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
              'rounded-lg px-3 py-2 text-sm font-medium whitespace-nowrap transition-colors',
              isActive
                ? 'bg-accent-soft text-accent-ink'
                : 'text-ink-muted hover:bg-neutral-soft hover:text-ink',
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
