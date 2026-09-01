import { NextResponse, type NextRequest } from 'next/server';

import { SESSION_COOKIE } from '@/lib/session';

/**
 * Gate for the admin area. This is a fast redirect for unauthenticated
 * visitors, not the security boundary — every admin page and Server Action
 * also carries the session cookie to the API, which rejects an absent or
 * expired token on its own.
 */
export function proxy(request: NextRequest) {
  const hasSession = request.cookies.has(SESSION_COOKIE);
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/admin') && !hasSession) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', `${pathname}${search}`);

    return NextResponse.redirect(loginUrl);
  }

  if (pathname === '/login' && hasSession) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/login'],
};
