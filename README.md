# Cloud9 — Dreamy Coffee Shop & Loyalty

A boutique coffee shop website and loyalty system with a soft, cloud-inspired aesthetic.

## Stack

- **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Framer Motion
- **Backend:** Supabase (Auth, Postgres, Storage)
- **UI:** shadcn-style components, custom glass and cloud visuals

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. Run the SQL in `supabase/migrations/001_initial_schema.sql` in the SQL Editor.
3. In Storage, create a **public** bucket named `gallery` (for gallery images).
4. Copy your project URL and keys into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. **Add the first admin user:** After signing up once via the app (e.g. at `/admin/login`), get your user ID from Supabase Auth → Users, then run in SQL:

```sql
INSERT INTO admin_users (user_id) VALUES ('your-auth-user-uuid-here');
```

### 3. Run the app

```bash
npm run dev
```

- **Site:** http://localhost:3000  
- **Admin:** http://localhost:3000/admin (log in as admin)  
- **Staff validation:** http://localhost:3000/staff/validate?token=… (used when staff scans a customer’s redemption QR)

## Daily code reminder (GitHub Actions)

The workflow in `.github/workflows/daily-code-reminder.yml` runs at 21:00 UTC and can email you a link to set the next day’s code.

1. In the repo: **Settings → Secrets and variables → Actions**, add:
   - `ADMIN_EMAIL` — where to send the reminder
   - `APP_URL` — e.g. `https://your-app.vercel.app`
   - `RESEND_API_KEY` — (optional) from [resend.com](https://resend.com) to send the email

2. If `RESEND_API_KEY` is not set, the workflow still runs and prints the link in the log.

## Features

- **Public site:** Home, Concept, Menu, Gallery, Loyalty intro, Visit Us
- **Weekly Cloud9 mood:** Editable message on the homepage (admin → Cloud9 mood)
- **Loyalty:** Customers claim one visit per day (QR + daily code), earn points, redeem rewards
- **Staff:** Scan a customer’s redemption QR at `/staff/validate` to validate and deduct points
- **Admin:** Menu, gallery, rewards, loyalty (customers/points), daily code, weekly QR, mood

## Project structure

- `app/(public)/` — Public pages (home, concept, menu, gallery, loyalty, visit)
- `app/(public)/loyalty/claim` — Claim visit (daily code)
- `app/(public)/loyalty/app` — Customer loyalty dashboard (balance, rewards, redeem)
- `app/staff/validate` — Staff redemption validation
- `app/admin/(dashboard)/` — Admin pages (auth-protected)
- `components/` — UI and cloud components
- `lib/` — Supabase clients, utils, types
- `supabase/migrations/` — Database schema
