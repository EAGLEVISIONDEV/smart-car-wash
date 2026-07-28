# Smart Car Wash

Modern website + booking system for **Smart Car Wash** (Strada Buzești 34, București).

## Features

- Marketing landing (servicii, proces, vizită)
- **Programare online** with Romanian plate validation
- **Status** lookup by plate or booking code
- **Admin board** (`/admin`) — today's queue + status updates
- Legal pages (GDPR-aware for plates)

## Stack

Next.js 16 · Tailwind 4 · Framer Motion · Drizzle + libSQL (local file / Turso)

## Setup

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000

### Admin

Default secret: `smart-admin-2026` (override with `ADMIN_SECRET`)

Visit `/admin` and enter the secret.

### Production DB (recommended)

Set Turso (or any libSQL) env:

```
TURSO_DATABASE_URL=libsql://...
TURSO_AUTH_TOKEN=...
ADMIN_SECRET=your-long-secret
```

On Vercel without Turso, bookings use ephemeral `/tmp` SQLite (demo only).

## Scripts

```bash
npm run build
npm start
```
