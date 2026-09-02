import 'server-only';

import { cookies, headers } from 'next/headers';

export const SESSION_COOKIE = 'admin_session';

// Eight hours, matching the backend token expiry.
const SESSION_MAX_AGE = 60 * 60 * 8;

export async function getSessionToken() {
  const store = await cookies();

  return store.get(SESSION_COOKIE)?.value ?? null;
}

export async function setSessionToken(token: string) {
  const store = await cookies();

  // Mark the cookie Secure only when the request actually arrived over HTTPS,
  // rather than whenever NODE_ENV is production. 
  const forwardedProto = (await headers())
    .get('x-forwarded-proto')
    ?.split(',')[0]
    ?.trim();

  // httpOnly keeps the JWT out of client-side JavaScript entirely: the browser
  // attaches it to Next.js requests, and only the server ever forwards it to
  // the API. Nothing in the bundle can read it.
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: forwardedProto === 'https',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

export async function clearSessionToken() {
  const store = await cookies();

  store.delete(SESSION_COOKIE);
}
