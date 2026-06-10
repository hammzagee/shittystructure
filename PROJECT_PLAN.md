# Shitty Structure Project Plan

## 1. Project Summary

**Domain:** `shittystructure.hammza.com`

This project is an independent, member-led feedback and pressure tool for Structure gym members. It is not an official Structure Health & Fitness product and should not imply owner, staff, or company involvement.

The platform lets verified gym members report issues they are facing, mention staff where relevant, and upvote issues raised by other verified members. The default posting mode is anonymous, but users can choose to identify themselves if they want.

The goal is to create a clear, credible, easy-to-understand public view of member issues that can be shared with the gym owner or decision makers.

## 2. Product Goals

1. Let members safely report gym-related issues.
2. Make anonymous participation the default.
3. Verify that participants recently visited a Structure branch.
4. Prevent fake or duplicate voting as much as possible.
5. Present issues in a simple public dashboard that non-technical people can understand quickly.
6. Keep cost low by avoiding unnecessary file storage.
7. Use Cloudflare services for hosting, API, database, verification, moderation, and AI-assisted clustering.

## 3. Non-Goals For MVP

1. No official Structure login or integration.
2. No membership database integration.
3. No stored verification photos.
4. No complex social network features.
5. No private chat between members and staff.
6. No positive shout-out system in v1; focus is issue reporting.
7. No manual admin approval for every post unless moderation risk requires it.

## 4. Target Users

### Gym Members

Members want a low-friction way to report issues without fear of retaliation. They should be able to understand the site without technical knowledge.

### Gym Owner / Decision Makers

The owner needs a quick, high-level view of what is being reported, how many verified members agree, and which staff members or branches are repeatedly mentioned.

### Public Viewers

Anyone with the link can see aggregated reports and upvote counts, but only verified members can post or vote.

## 5. Core User Flows

### 5.1 First-Time Verification

1. User opens `shittystructure.hammza.com`.
2. User selects their Structure branch.
3. User uploads an original recent photo from their phone gallery.
4. The app extracts EXIF metadata from the photo.
5. The backend checks:
   - Photo has GPS metadata.
   - Photo timestamp is recent enough.
   - GPS location is inside the selected branch geofence.
6. If valid, the backend creates a verified anonymous member token.
7. The uploaded photo is discarded immediately.
8. User can post and upvote for the verification period.

### 5.2 Issue Posting

1. User taps **Report an Issue**.
2. User enters:
   - Short title
   - Description
   - Branch
   - Category
   - Optional staff role/name
3. Anonymous mode is ON by default.
4. User can toggle anonymity off if they want their name shown.
5. Workers AI checks the post for spam, threats, extreme abuse, or obvious personal information leakage.
6. If the post passes, it auto-publishes.
7. Similar issues are suggested before submission where possible.

### 5.3 Upvoting

1. Verified member opens an issue.
2. Member taps **I have this issue too**.
3. Backend allows one vote per verified member token per issue.
4. Vote count updates publicly.

### 5.4 Public Dashboard

The homepage should immediately answer:

1. What are members reporting?
2. Which issues have the most verified support?
3. Which branch is affected?
4. Which staff names or roles are mentioned most often?
5. What changed recently?

## 6. Verification Policy

### Recommended Defaults

| Setting | Recommendation |
| --- | --- |
| Photo age limit | 14 days |
| Verification validity | 30 days |
| Geofence radius | 150-250 meters per branch |
| Photo storage | Never store uploaded photos |
| Metadata storage | Store pass/fail proof fields only |

### Why 14 Days?

Seven days is stricter but may exclude legitimate members who missed a week. Thirty days is more inclusive but weaker as proof of recent presence. Fourteen days balances trust and usability.

### Photo Handling

The uploaded photo should be processed in memory or temporary request storage only.

The system should extract:

1. EXIF timestamp
2. EXIF latitude
3. EXIF longitude
4. Camera/device metadata if useful for anti-abuse checks

Then the original image should be discarded.

The database should only store:

1. Verification status
2. Branch ID
3. Verification timestamp
4. Expiry timestamp
5. Photo taken timestamp
6. Approximate distance from selected branch
7. Metadata availability flags

Avoid storing exact GPS coordinates long term unless needed for abuse analysis. If coordinates are stored, round them or delete them after a short retention period.

### Important Limitation

EXIF metadata can be missing or stripped, especially from WhatsApp, Instagram, screenshots, and edited photos. The UI must clearly tell users:

> Upload an original photo from your phone gallery. Screenshots and WhatsApp/Instagram images usually will not work.

EXIF can also be faked by a determined attacker, so verification should be treated as a reasonable trust signal rather than perfect proof.

## 7. Anonymity & Identity

### Default

All reports are anonymous by default.

### Optional Identity

Users may choose to post non-anonymously. For MVP, only ask for a display name if the user turns anonymity off.

### Public Staff Names

Staff names may be public when a member includes them. To reduce abuse risk, the UI should encourage issue-focused writing:

> Describe what happened. Avoid insults, threats, or private personal details.

## 8. Landing Page UX

The landing page should be the product dashboard, not a generic marketing page.

### Above The Fold

1. Project name and short disclaimer:
   - **Independent member feedback board for Structure gym members**
   - **Not affiliated with Structure Health & Fitness**
2. Primary action:
   - **Report an Issue**
3. Secondary action:
   - **Verify to Vote**
4. At-a-glance stats:
   - Verified issues in the last 30 days
   - Total verified upvotes
   - Most reported category
   - Focus branch

### Main Dashboard

1. Top issues by verified upvotes
2. Branch scope:
   - Gulberg only for MVP launch
   - Other branches later
3. Category filter:
   - Management
   - Staff
   - Facilities
   - Billing
   - Safety
   - Cleanliness
   - Other
4. Staff mention summary
5. Recent issue activity

### Tone

The design should be easy for both laymen and educated users:

1. Plain English
2. Large buttons
3. Short forms
4. Clear progress steps
5. No technical terms such as "EXIF" in the main flow unless needed in help text

## 9. Cloudflare Architecture

### MVP Stack

| Need | Cloudflare Service |
| --- | --- |
| Frontend hosting | Cloudflare Pages |
| API backend | Cloudflare Workers |
| SQL database | Cloudflare D1 |
| Sessions and rate limits | Cloudflare KV |
| Bot protection | Cloudflare Turnstile |
| Moderation and summaries | Workers AI |
| Duplicate issue detection | Workers AI embeddings + Vectorize |
| Analytics | Cloudflare Web Analytics / Workers logs |

### Not Needed In MVP

| Service | Reason |
| --- | --- |
| R2 | Photos are not stored |
| Durable Objects | Real-time coordination is not needed for v1 |
| Queues | Useful later, but synchronous metadata extraction is enough for MVP if file sizes are limited |

### High-Level Request Flow

```text
Browser
  -> Cloudflare Pages frontend
  -> Cloudflare Worker API
  -> Turnstile validation
  -> EXIF metadata extraction
  -> D1 verification/session records
  -> D1 issue/vote records
  -> Workers AI moderation and summarization
  -> Vectorize for similar issue search
```

## 10. Data Model

### branches

```text
id
name
slug
city
latitude
longitude
radius_meters
is_active
created_at
```

### verifications

```text
id
branch_id
member_token_hash
verified_at
expires_at
photo_taken_at
distance_from_branch_meters
metadata_status
verification_method
created_ip_hash
user_agent_hash
created_at
```

### issues

```text
id
branch_id
author_token_hash
title
body
category
staff_name
staff_role
is_anonymous
display_name
status
cluster_id
moderation_status
created_at
updated_at
```

### votes

```text
id
issue_id
member_token_hash
created_at
```

Add a unique database constraint on:

```text
issue_id + member_token_hash
```

### issue_clusters

```text
id
canonical_issue_id
summary
embedding_id
created_at
updated_at
```

### moderation_events

```text
id
issue_id
model
result
reason
created_at
```

## 11. Anti-Abuse Plan

### Fake Users

1. Require valid recent branch photo metadata.
2. Use Turnstile on verification and posting.
3. Rate limit by token, IP hash, and user agent hash.
4. Expire verification after 30 days.

### Fake Upvotes

1. One vote per verified member token per issue.
2. Require active verification to vote.
3. Rate limit voting.
4. Detect suspicious bursts from the same IP hash or device pattern.

### Duplicate Issues

1. Normalize titles and bodies.
2. Detect exact duplicates with hashing.
3. Use Workers AI embeddings to identify similar issues.
4. Suggest existing issues before posting:
   - "This looks similar to an existing issue. Do you want to upvote it instead?"

### Defamation / Abuse Risk

1. Auto-block threats and extreme abuse.
2. Allow staff names but discourage insults.
3. Keep issue language focused on observable behavior.
4. Add report button for public viewers.

## 12. Legal And Positioning Notes

Because the domain and product are intentionally critical, the site should include a clear disclaimer:

> This is an independent member-run feedback board. It is not affiliated with, endorsed by, or operated by Structure Health & Fitness.

The site should avoid using official logos unless permission is granted.

The public copy should focus on member experiences and issues rather than personal attacks.

## 13. MVP Feature List

### Must Have

1. Public dashboard at `shittystructure.hammza.com`
2. Branch selection
3. Photo metadata verification
4. Anonymous issue posting
5. Optional non-anonymous posting
6. Public staff names in issues
7. Verified upvotes
8. One vote per verified member per issue
9. Auto-publish after moderation pass
10. Basic issue categories
11. Branch and category filters
12. Turnstile protection

### Should Have

1. Similar issue suggestions
2. AI-generated issue cluster summaries
3. Staff mention summary
4. Shareable issue links
5. Basic admin/debug view

### Later

1. Improve Urdu copy after member feedback
2. Better fallback verification for photos without metadata
3. Owner-facing PDF export
4. Weekly issue digest
5. Trend charts
6. Manual moderation dashboard

## 14. Suggested Pages

```text
/                         Public dashboard
/verify                   Member verification
/report                   Create issue
/issues/:id               Issue detail
/branches/:slug           Branch-specific dashboard
/about                    Disclaimer and explanation
/privacy                  Privacy policy
/admin                    Private admin/debug dashboard
```

## 15. Suggested API Routes

```text
POST /api/verify-photo
GET  /api/verification/status
POST /api/issues
GET  /api/issues
GET  /api/issues/:id
POST /api/issues/:id/vote
DELETE /api/issues/:id/vote
POST /api/issues/:id/report
GET  /api/stats
GET  /api/branches
```

## 16. Implementation Phases

### Phase 1: Scaffold

1. Create Cloudflare Pages/Workers project.
2. Configure D1 database.
3. Configure Turnstile.
4. Add branch seed data.
5. Build basic frontend layout.

### Phase 2: Verification

1. Implement photo upload.
2. Extract EXIF metadata.
3. Check timestamp and geofence.
4. Create anonymous member token.
5. Store verification record.
6. Discard uploaded photo.

### Phase 3: Issues And Voting

1. Build issue creation form.
2. Add anonymous default.
3. Allow optional display name.
4. Store staff names publicly.
5. Implement verified voting.
6. Add dashboard ranking by verified upvotes.

### Phase 4: Moderation And Duplicates

1. Add Workers AI moderation.
2. Add exact duplicate checks.
3. Add Vectorize-based similar issue detection.
4. Add pre-submit similar issue prompt.

### Phase 5: Polish

1. Improve mobile UX.
2. Add privacy and disclaimer pages.
3. Add basic analytics.
4. Add admin/debug dashboard.
5. Prepare owner-facing summary view.

## 17. Key Decisions Already Made

| Decision | Choice |
| --- | --- |
| Project type | Member-led pressure tool |
| Official Structure involvement | None |
| Domain | `shittystructure.hammza.com` |
| MVP launch branch | Gulberg only |
| Default identity | Anonymous |
| Optional identity | Allowed |
| Staff names | Public allowed |
| Language | English and Urdu |
| Content focus | Issues only |
| Publishing | Auto-publish after verification and moderation |
| Photo storage | Do not store photos |
| Cloud provider | Cloudflare |

## 18. Open Decisions

1. Exact branch geofence radius for each location.
2. Exact timeline for adding branches after Gulberg.
3. Whether issue titles can include staff names or only the staff field can.
4. Whether to allow comments under issues in v1.
5. Whether to use a private admin password from day one.
6. Whether to add more Urdu-first content beyond the UI labels and help text.
