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

6. Update the SEO/social URLs in `public/index.html` after you know the production domain. Search previews work best when `canonical`, `og:url`, `og:image`, and `twitter:image` use absolute `https://...` URLs instead of `/`.

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

## Current Routes

- `/` dashboard
- `/api/branches`
- `/api/issues`
- `/api/issues/:id`
- `/api/issues/:id/vote`
- `/api/stats`
- `/api/verify-photo`
- `/api/verification/status`

Verification checks JPEG EXIF timestamp and GPS metadata in memory, stores only a hashed member token and metadata summary, then requires the returned token for posting reports and voting.
