# Lead Distribution Platform — Frontend

Next.js 16 (App Router) admin UI and public lead form for the lead distribution
platform.

This is one of two services. The Express + Prisma API lives in a separate
repository:

<https://github.com/sprguillen/lead-distribution-platform-be>

Deploy the backend first — this app is useless without it, and its health check
is the quickest way to tell the two apart when something is wrong.

```
browser ──▶ this app (public port) ──▶ backend API (internal port) ──▶ MySQL
```

Only this app is publicly exposed. The browser never reaches the API directly.

- **Runtime:** Node.js 20.9+ (developed on 24)
- **Styling:** Tailwind CSS v4
- **Process manager:** PM2

## How it talks to the backend

The backend listens on an internal port that is **not publicly exposed**, so the
browser never calls it. Every request goes through the Next.js server:

- Login is a Server Action that calls the API and stores the returned JWT in an
  **httpOnly cookie**. The token is never readable from client-side JavaScript.
- Admin pages are Server Components that read that cookie and call the API
  server-side.
- The public form posts through a Server Action, which forwards the visitor's
  `X-Forwarded-For` header so the API records the real visitor IP.
- `proxy.ts` (Next.js 16's replacement for `middleware.ts`) redirects
  unauthenticated visitors away from `/admin/*`. It is a convenience redirect,
  not the security boundary — the API rejects any request without a valid token.

## Routes

| Route                      | Access | Purpose                                              |
| -------------------------- | ------ | ---------------------------------------------------- |
| `/`                        | public | Redirects to `/admin` or `/login`.                   |
| `/login`                   | public | Admin sign-in.                                       |
| `/{slug}`                  | public | The lead form, e.g. `/lead-registration`.            |
| `/admin`                   | admin  | Dashboard: lead counts and setup progress.           |
| `/admin/brokers`           | admin  | Broker list, create, activate/deactivate.            |
| `/admin/brokers/{id}`      | admin  | Broker detail: leads received, and edit settings.    |
| `/admin/form`              | admin  | Create or view the single lead form.                 |
| `/admin/distribution`      | admin  | Create the distribution, set broker percentages.     |
| `/admin/distribution/{id}` | admin  | Distribution detail: full lead history.              |
| `/admin/leads`             | admin  | All leads, with manual assignment for unsent ones.   |

`admin` and `login` are rejected as form slugs, since they would shadow these
routes.

## 1. Clone the repository

```bash
git clone https://github.com/sprguillen/lead-distribution-platform-fe.git lead-distribution-frontend
cd lead-distribution-frontend
```

## 2. Install dependencies

```bash
npm ci
```

Install all dependencies including dev dependencies — `next build` needs them.

## 3. Set environment variables

```bash
cp .env.example .env.local
```

| Variable  | Required | Description                                                                                      |
| --------- | -------- | ------------------------------------------------------------------------------------------------ |
| `API_URL` | **yes**  | Internal address of the backend, e.g. `http://127.0.0.1:4000`. Point it at the assigned backend port. |

There is no default. If it is unset the first admin request fails with a named
error in the logs, rather than silently dialling the wrong port and returning
empty pages.

The value is read server-side at request time, not baked into the build. So you
can build before the backend exists, and changing the port needs only
`pm2 restart lead-frontend --update-env` — no rebuild.

`API_URL` is deliberately **not** prefixed with `NEXT_PUBLIC_`, so it is never
inlined into the browser bundle. Nothing in this app should be public — the
browser only ever talks to Next.js.

Start the backend first and confirm it answers before starting this app:

```bash
curl http://127.0.0.1:4000/health
```

## 4. Database

This app has no database of its own. Follow the setup and migration steps in the
backend README; this app reads everything through the API.

## 5. Run in development

```bash
npm run dev     # http://localhost:3000
npm run lint
npx tsc --noEmit
```

## 6. Build and run in production (PM2)

```bash
npm run build
npm start       # next start, honours PORT
```

Under PM2, binding to the publicly assigned port:

```bash
PORT=<ASSIGNED_PUBLIC_PORT> pm2 start npm --name lead-frontend --time -- start
pm2 save
```

Redeploying after a push:

```bash
git pull
npm ci
npm run build
pm2 restart lead-frontend --update-env
```

Other lifecycle commands:

```bash
pm2 status
pm2 stop lead-frontend
pm2 restart lead-frontend
pm2 delete lead-frontend
```

`--update-env` matters whenever `.env.local` changed — PM2 otherwise reuses the
environment the process originally started with.

> **Ports:** this app is the only publicly exposed process. The backend stays on
> its internal port and is reached over `127.0.0.1`.

## 7. Checking logs

```bash
pm2 logs lead-frontend
pm2 logs lead-frontend --lines 200
pm2 logs lead-frontend --err
pm2 describe lead-frontend      # shows the on-disk log paths
```

Server Component and Server Action errors appear in these logs, not in the
browser console — the browser only receives a generic message.

## 8. Accessing the deployed app

| What             | Where                                          |
| ---------------- | ---------------------------------------------- |
| Admin dashboard  | `http://<VPS_IP>:<ASSIGNED_PORT>/login`        |
| Public lead form | `http://<VPS_IP>:<ASSIGNED_PORT>/<form-slug>`  |

Admin credentials for review are supplied with the submission, not stored here.

## Project structure

```
app/
  login/            Sign-in page and its Server Action
  admin/            Admin area — layout guard, pages, and per-feature actions
  [slug]/           Public lead form
components/
  ui/               Button, Card, Field, Badge, Table primitives
  admin/            Nav, page header, leads table, broker and distribution forms
lib/
  api.ts            Server-only fetch wrapper for the backend
  session.ts        httpOnly session cookie helpers
  types.ts          Shared API types
proxy.ts            Admin route guard
```

Business logic — distribution, eligibility, duplicate detection — lives entirely
in the backend. This app renders state and submits mutations.

## Test notes

With the backend running and an admin seeded:

1. **Login** — `/admin/leads` while signed out redirects to `/login?next=...`;
   after signing in you land back on the requested page. The `admin_session`
   cookie is httpOnly, so `document.cookie` in DevTools never shows the token.
2. **Brokers** — create a few. Submitting `9:00` instead of `09:00`, a closing
   time before the opening time, or an unknown timezone shows a server-side
   error rather than saving a broker that could never receive leads.
3. **One form only** — after creating the form, `/admin/form` shows the form
   details and no create button.
4. **Distribution before a form** — on a fresh database, `/admin/distribution`
   shows `Oops, please create a form first.`
5. **One distribution only** — after creating it, the page switches to broker
   settings and shows that another cannot be created.
6. **Submit a lead** — open `/{slug}` in a private window (no admin cookie
   needed), submit, and confirm the lead appears on `/admin/leads` with its IP
   address and lowercased email.
7. **Duplicates** — submit the same email again in any casing; it is recorded as
   `duplicate` with no broker.
8. **Schedules and caps** — set a broker's closing time to a minute from now or
   its cap to 1, then submit; the broker is skipped and the lead goes elsewhere
   or becomes `unsent`.
9. **Manual assign** — pick a broker on an unsent row and press Assign; the row
   flips to `sent` and appears on that broker's page.
10. **Distribution detail** — `/admin/distribution/{id}` lists sent, unsent and
    duplicate leads together with the broker that received each one.
