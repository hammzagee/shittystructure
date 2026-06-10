# Shitty Structure

Independent member feedback board for Structure gym members.

## Overview

This app uses a Cloudflare Worker with static assets, D1, and a plain frontend dashboard. Members verify with an original JPEG photo that has recent EXIF timestamp and GPS metadata. The photo is checked in memory and is not stored.

After verification, the Worker returns a cryptographically random member token. The browser stores that token locally and sends it on future report and vote requests. The database stores only the token hash.

## Local Setup

```bash
npm install
npm run dev
```

Wrangler was not installed globally in this workspace, so the project keeps it as a dev dependency.

## Local D1 Setup

Initialize and seed the local D1 database:

```bash
npm run db:init
npm run db:seed
```

Then start the app:

```bash
npm run dev
```

## Test The Flow

1. Open the local Wrangler URL.
2. Click **Verify to Vote**.
3. Upload an original phone JPEG from near the Gulberg branch, taken within the last 14 days, with location metadata enabled.
4. After verification succeeds, publish a report from **Report an Issue**.
5. Vote on an issue with **Have this too**.

Unverified report and vote requests return `401 verification_required`.

## Deploy To Cloudflare

1. Log in to Cloudflare:

```bash
npx wrangler login
```

2. Create the D1 database:

```bash
npx wrangler d1 create shitty-structure
```

3. Copy the returned `database_id` into `wrangler.jsonc` under `d1_databases[0].database_id`.

4. Apply schema remotely:

```bash
npx wrangler d1 execute shitty-structure --remote --file=./db/schema.sql
```

5. Optional: seed the initial branch/demo issue remotely:

```bash
npx wrangler d1 execute shitty-structure --remote --file=./db/seed.sql
```

6. The Worker rewrites `canonical`, `og:url`, `og:image`, and `twitter:image` to the deployed request origin. After custom-domain setup, re-run a social preview validator against the production URL.

7. Validate the deploy package:

```bash
npx wrangler deploy --dry-run
```

8. Deploy:

```bash
npm run deploy
```

## Configuration

`wrangler.jsonc` controls:

- `DB`: D1 binding used for branches, reports, votes, and verifications.
- `ASSETS`: static frontend assets from `public`.
- `PHOTO_MAX_AGE_DAYS`: maximum accepted photo age. Default is `14`.
- `VERIFICATION_VALID_DAYS`: member token validity period. Default is `30`.
- `TURNSTILE_SITE_KEY`: public Cloudflare Turnstile widget site key.

## Turnstile Bot Protection

The app uses Cloudflare Turnstile in silent mode (`execution: execute`, `appearance: interaction-only`) for verification, report posting, and voting.

1. Create a Turnstile widget in Cloudflare.
2. Add your production domain to the widget. Add any temporary testing host only while needed.
3. Put the public site key in `wrangler.jsonc`:

```jsonc
"TURNSTILE_SITE_KEY": "your-public-site-key"
```

4. Store the secret key as a Worker secret:

```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
```

Turnstile is enforced only when `TURNSTILE_SECRET_KEY` exists. Local development can run without keys.

## Robots And Preview URLs

The Worker serves dynamic `robots.txt` and `sitemap.xml`.

- Production/custom domains are indexable and include a sitemap reference.
- Localhost and `*.trycloudflare.com` tunnel URLs return `Disallow: /`.
- Tunnel/dev HTML also gets `noindex, nofollow` via both `<meta name="robots">` and `X-Robots-Tag`.

## Current Routes

- `/` dashboard
- `/robots.txt`
- `/sitemap.xml`
- `/api/branches`
- `/api/issues`
- `/api/issues/:id`
- `/api/issues/:id/vote`
- `/api/stats`
- `/api/verify-photo`
- `/api/verification/status`

Verification checks JPEG EXIF timestamp and GPS metadata in memory, stores only a hashed member token and metadata summary, then requires the returned token for posting reports and voting.
