const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store"
};

const focusBranchSlug = "gulberg";
const focusBranchId = "branch_gulberg";
// Accept up to 8 MB so Safari/Mac uploads still work if the browser sends the full file.
// EXIF is always read from the first 512 KB only — the rest is ignored in memory.
const maxOriginalPhotoBytes = 8 * 1024 * 1024;
const maxExifReadBytes = 512 * 1024;
const branchCacheTtlMs = 300000;
let cachedFocusBranch = null;
let cachedFocusBranchLoadedAt = 0;
const defaultPhotoMaxAgeDays = 14;
const defaultVerificationValidDays = 30;

class InputValidationError extends Error {
  constructor(message, field = null) {
    super(message);
    this.name = "InputValidationError";
    this.field = field;
  }
}

function htmlContentSecurityPolicy(nonce) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://challenges.cloudflare.com`,
    "connect-src 'self' https://challenges.cloudflare.com",
    "frame-src https://challenges.cloudflare.com",
    "img-src 'self' data:",
    "style-src 'self' 'unsafe-inline'",
    "font-src 'self' data:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join("; ");
}

const apiMessages = {
  en: {
    verification_required_report: "Verify as a member before publishing a report.",
    verification_required_vote: "Verify as a member before voting.",
    issue_not_found: "Issue not found for the active launch branch.",
    photo_required: "Add a recent original gym photo first.",
    wrong_branch: "Verification is currently open for Gulberg branch only.",
    photo_too_large: "Photo is too large. Use an original image under 8 MB.",
    unsupported_format: "Upload an original phone-gallery JPEG/JPG or HEIC/HEIF photo with EXIF metadata.",
    missing_exif: "This photo does not include EXIF metadata. Try an original photo from your phone gallery.",
    missing_timestamp: "This photo is missing the original capture time.",
    photo_not_recent: "Photo must be from the last {maxAgeDays} days.",
    missing_location: "This photo is missing location metadata. Check that camera location is enabled and use the original photo.",
    branch_not_found: "Verification branch is not available right now.",
    outside_branch: "Photo location is about {distance}m from Gulberg. It needs to be within {maxDistance}m.",
    bot_check_required: "Bot check is required. Please try again.",
    bot_check_unavailable: "Bot check is unavailable. Please try again.",
    bot_check_failed: "Bot check failed. Please try again."
  },
  ur: {
    verification_required_report: "رپورٹ شائع کرنے سے پہلے رکن کی تصدیق کریں۔",
    verification_required_vote: "ووٹ کرنے سے پہلے رکن کی تصدیق کریں۔",
    issue_not_found: "فعال گلبرگ برانچ کے لیے یہ مسئلہ نہیں ملا۔",
    photo_required: "پہلے جم کی حالیہ اصل تصویر شامل کریں۔",
    wrong_branch: "تصدیق فی الحال صرف گلبرگ برانچ کے لیے کھلی ہے۔",
    photo_too_large: "تصویر بہت بڑی ہے۔ 8 MB سے کم اصل تصویر استعمال کریں۔",
    unsupported_format: "EXIF metadata والی اصل JPEG/JPG یا iPhone HEIC/HEIF تصویر اپ لوڈ کریں۔",
    missing_exif: "اس تصویر میں EXIF metadata موجود نہیں۔ فون گیلری سے اصل تصویر دوبارہ آزمائیں۔",
    missing_timestamp: "اس تصویر میں اصل کھینچنے کا وقت موجود نہیں۔",
    photo_not_recent: "تصویر پچھلے {maxAgeDays} دنوں کے اندر کی ہونی چاہیے۔",
    missing_location: "اس تصویر میں مقام کی معلومات موجود نہیں۔ کیمرہ location آن کریں اور اصل تصویر استعمال کریں۔",
    branch_not_found: "تصدیق والی برانچ اس وقت دستیاب نہیں۔",
    outside_branch: "تصویر کا مقام گلبرگ سے تقریباً {distance}m دور ہے۔ یہ {maxDistance}m کے اندر ہونا چاہیے۔",
    bot_check_required: "بوٹ چیک ضروری ہے۔ دوبارہ کوشش کریں۔",
    bot_check_unavailable: "بوٹ چیک دستیاب نہیں۔ دوبارہ کوشش کریں۔",
    bot_check_failed: "بوٹ چیک ناکام ہو گیا۔ دوبارہ کوشش کریں۔"
  }
};

const demoBranches = [
  {
    id: "branch_gulberg",
    name: "Gulberg",
    slug: "gulberg",
    city: "Lahore",
    latitude: 31.539389,
    longitude: 74.350469,
    radius_meters: 220
  }
];

const demoIssues = [
  {
    id: "issue_peak_hours",
    branch_id: "branch_gulberg",
    branch_name: "Gulberg",
    title: "Peak-hour floor crowding",
    body: "Evening sessions are becoming hard to complete because benches and racks stay occupied for long stretches.",
    category: "Facilities",
    staff_name: null,
    staff_role: "Floor management",
    is_anonymous: false,
    display_name: "Hamza",
    status: "published",
    moderation_status: "passed",
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    vote_count: 18
  }
];

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "GET" && url.pathname === "/robots.txt") {
      return robotsTxt(url);
    }

    if (request.method === "GET" && url.pathname === "/sitemap.xml") {
      return sitemapXml(url);
    }

    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env, url);
    }

    const response = await env.ASSETS.fetch(request);
    return response.headers.get("content-type")?.includes("text/html")
      ? withAbsoluteMetaUrls(response, url, env)
      : response;
  }
};

async function withAbsoluteMetaUrls(response, url, env) {
  const canonicalUrl = `${url.origin}/`;
  const imageUrl = `${url.origin}/og-image.png`;
  const robotsMeta = shouldExcludeRobots(url) ? "noindex, nofollow" : "index, follow";
  const turnstileSiteKey = String(env.TURNSTILE_SITE_KEY || "");
  const turnstileRequired = env.TURNSTILE_SECRET_KEY ? "true" : "false";
  const cspNonce = crypto.randomUUID().replaceAll("-", "");
  const html = (await response.text())
    .replaceAll("__CANONICAL_URL__", canonicalUrl)
    .replaceAll("__OG_IMAGE_URL__", imageUrl)
    .replaceAll("__ROBOTS_META__", robotsMeta)
    .replaceAll("__CSP_NONCE__", cspNonce)
    .replaceAll("__TURNSTILE_SITE_KEY__", turnstileSiteKey)
    .replaceAll("__TURNSTILE_REQUIRED__", turnstileRequired);

  const headers = {
    ...Object.fromEntries(response.headers),
    "content-type": "text/html; charset=utf-8",
    ...securityHeaders(url, { html: true, cspNonce })
  };
  if (shouldExcludeRobots(url)) {
    headers["x-robots-tag"] = "noindex, nofollow";
  }

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers
  });
}

function robotsTxt(url) {
  const body = shouldExcludeRobots(url)
    ? "User-agent: *\nDisallow: /\n"
    : "User-agent: *\nAllow: /\nSitemap: " + `${url.origin}/sitemap.xml\n`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
      ...securityHeaders(url)
    }
  });
}

function sitemapXml(url) {
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url.origin}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

  return new Response(body, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=3600",
      ...securityHeaders(url)
    }
  });
}

function shouldExcludeRobots(url) {
  const hostname = url.hostname.toLowerCase();

  return hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".trycloudflare.com");
}

function securityHeaders(url, options = {}) {
  const headers = {
    "cross-origin-opener-policy": "same-origin",
    "x-content-type-options": "nosniff",
    "x-frame-options": "DENY",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), geolocation=(), microphone=()"
  };

  if (options.html) {
    headers["content-security-policy"] = htmlContentSecurityPolicy(options.cspNonce || "");
  }

  if (url.protocol === "https:") {
    headers["strict-transport-security"] = "max-age=31536000; includeSubDomains; preload";
  }

  return headers;
}

async function handleApi(request, env, url) {
  if (request.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  try {
    if (request.method === "GET" && url.pathname === "/api/branches") {
      return json(await listBranches(env));
    }

    if (request.method === "GET" && url.pathname === "/api/issues") {
      return json(await listIssues(env, url.searchParams));
    }

    if (request.method === "POST" && url.pathname === "/api/issues") {
      const result = await createIssue(env, await request.json(), request);
      return json(result.body, result.status);
    }

    if (request.method === "GET" && /^\/api\/issues\/[^/]+$/.test(url.pathname)) {
      const id = url.pathname.split("/").pop();
      const issue = await getIssue(env, id);
      return issue ? json(issue) : json({ error: "Issue not found" }, 404);
    }

    if (request.method === "POST" && /^\/api\/issues\/[^/]+\/vote$/.test(url.pathname)) {
      const id = url.pathname.split("/")[3];
      const result = await voteOnIssue(env, id, request);
      return json(result.body, result.status);
    }

    if (request.method === "GET" && url.pathname === "/api/stats") {
      return json(await getStats(env));
    }

    if (request.method === "POST" && url.pathname === "/api/verify-photo") {
      const result = await verifyPhoto(env, request);
      return json(result.body, result.status);
    }

    if (request.method === "GET" && url.pathname === "/api/verification/status") {
      const result = await getVerificationStatus(env, request);
      return json(result.body, result.status);
    }

    return json({ error: "Route not found" }, 404);
  } catch (error) {
    if (error instanceof InputValidationError) {
      return json({
        error: "invalid_issue",
        status: "invalid_issue",
        field: error.field,
        message: error.message
      }, 400);
    }
    return json({ error: "Unexpected API error", detail: error.message }, 500);
  }
}

async function listBranches(env) {
  if (!env.DB) return { branches: demoBranches };

  const result = await env.DB.prepare(
    "SELECT id, name, slug, city, radius_meters FROM branches WHERE is_active = 1 AND slug = ? ORDER BY name"
  ).bind(focusBranchSlug).all();
  return { branches: result.results };
}

async function listIssues(env, params) {
  if (!env.DB) return filterDemoIssues(params);

  const branch = focusBranchSlug;
  const category = params.get("category");
  const conditions = ["i.status = 'published'", "b.slug = ?"];
  const binds = [branch];

  if (category && category !== "all") {
    conditions.push("i.category = ?");
    binds.push(category);
  }

  const result = await env.DB.prepare(
    `
      SELECT
        i.id,
        i.branch_id,
        b.name AS branch_name,
        i.title,
        i.body,
        i.category,
        i.staff_name,
        i.staff_role,
        i.is_anonymous,
        i.display_name,
        i.status,
        i.moderation_status,
        i.created_at,
        i.updated_at,
        COUNT(v.id) AS vote_count
      FROM issues i
      JOIN branches b ON b.id = i.branch_id
      LEFT JOIN votes v ON v.issue_id = i.id
      WHERE ${conditions.join(" AND ")}
      GROUP BY i.id
      ORDER BY vote_count DESC, i.created_at DESC
      LIMIT 50
    `
  ).bind(...binds).all();

  return { issues: result.results };
}

async function getIssue(env, id) {
  if (!env.DB) {
    return demoIssues.find((issue) => issue.id === id) || null;
  }

  const issue = await env.DB.prepare(
    `
      SELECT
        i.*,
        b.name AS branch_name,
        COUNT(v.id) AS vote_count
      FROM issues i
      JOIN branches b ON b.id = i.branch_id
      LEFT JOIN votes v ON v.issue_id = i.id
      WHERE i.id = ?
        AND b.slug = ?
      GROUP BY i.id
    `
  ).bind(id, focusBranchSlug).first();
  return issue || null;
}

async function createIssue(env, input, request) {
  const issue = validateIssueInput(input);

  const turnstileError = await requireTurnstile(env, request, input?.turnstile_token);
  if (turnstileError) return turnstileError;

  const verification = await getActiveVerification(env, getMemberToken(request));
  if (!verification) {
    return apiError("verification_required", "Verify as a member before publishing a report.", 401, {}, request, {
      messageKey: "verification_required_report"
    });
  }

  const now = new Date().toISOString();
  const id = `issue_${crypto.randomUUID()}`;

  if (!env.DB) {
    return {
      status: 201,
      body: {
        issue: {
          id,
          ...issue,
          author_token_hash: verification.tokenHash,
          branch_name: demoBranches.find((branch) => branch.id === issue.branch_id)?.name || "Selected branch",
          status: "published",
          moderation_status: "pending",
          created_at: now,
          updated_at: now,
          vote_count: 0
        }
      }
    };
  }

  await env.DB.prepare(
    `
      INSERT INTO issues (
        id,
        branch_id,
        author_token_hash,
        title,
        body,
        category,
        staff_name,
        staff_role,
        is_anonymous,
        display_name,
        status,
        moderation_status,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'published', 'pending', ?, ?)
    `
  ).bind(
    id,
    issue.branch_id,
    verification.tokenHash,
    issue.title,
    issue.body,
    issue.category,
    issue.staff_name,
    issue.staff_role,
    issue.is_anonymous ? 1 : 0,
    issue.display_name,
    now,
    now
  ).run();

  return { status: 201, body: { issue: await getIssue(env, id) } };
}

async function voteOnIssue(env, issueId, request) {
  const input = await optionalJson(request);
  const turnstileError = await requireTurnstile(env, request, input.turnstile_token);
  if (turnstileError) return turnstileError;

  const verification = await getActiveVerification(env, getMemberToken(request));
  if (!verification) {
    return apiError("verification_required", "Verify as a member before voting.", 401, {}, request, {
      messageKey: "verification_required_vote"
    });
  }

  if (!env.DB) {
    return { status: 200, body: { issue_id: issueId, voted: true } };
  }

  const issue = await env.DB.prepare(
    `
      SELECT i.id
      FROM issues i
      JOIN branches b ON b.id = i.branch_id
      WHERE i.id = ?
        AND b.slug = ?
    `
  ).bind(issueId, focusBranchSlug).first();

  if (!issue) {
    return apiError("issue_not_found", "Issue not found for the active launch branch.", 404, {
      issue_id: issueId,
      voted: false
    }, request);
  }

  await env.DB.prepare(
    "INSERT OR IGNORE INTO votes (id, issue_id, member_token_hash) VALUES (?, ?, ?)"
  ).bind(`vote_${crypto.randomUUID()}`, issueId, verification.tokenHash).run();

  return { status: 200, body: { issue_id: issueId, voted: true } };
}

async function verifyPhoto(env, request) {
  const form = await request.formData();

  const photo = form.get("photo");
  const branchId = String(form.get("branch_id") || focusBranchId);

  if (!photo || typeof photo.arrayBuffer !== "function") {
    return verificationError("photo_required", "Add a recent original gym photo first.", request);
  }

  if (branchId !== focusBranchId) {
    return verificationError("wrong_branch", "Verification is currently open for Gulberg branch only.", request, {}, emptyVerificationChecks(branchId));
  }

  if (photo.size > maxOriginalPhotoBytes) {
    return verificationError("photo_too_large", "Photo is too large. Use an original image under 8 MB.", request, {}, emptyVerificationChecks(branchId));
  }

  const turnstilePromise = requireTurnstile(env, request, form.get("turnstile_token"));
  const [fullBuffer, branch] = await Promise.all([
    photo.arrayBuffer(),
    getVerificationBranch(env, branchId)
  ]);
  const buffer = fullBuffer.byteLength > maxExifReadBytes
    ? fullBuffer.slice(0, maxExifReadBytes)
    : fullBuffer;

  const metadata = readImageMetadata(buffer);
  const takenAt = parsePhotoTakenAt(metadata);
  const baseChecks = buildVerificationChecks({
    metadata,
    branch,
    branchId,
    takenAt
  });

  if (!metadata.supported) {
    return verificationError("unsupported_format", "Upload an original JPEG/JPG or iPhone HEIC/HEIF photo with EXIF metadata.", request, {}, baseChecks);
  }

  if (!metadata.hasExif) {
    return verificationError("missing_exif", "This photo does not include EXIF metadata. Try an original photo from your phone gallery.", request, {}, baseChecks);
  }

  if (!takenAt) {
    return verificationError("missing_timestamp", "This photo is missing the original capture time.", request, {}, baseChecks);
  }

  const maxAgeDays = numberFromEnv(env.PHOTO_MAX_AGE_DAYS, defaultPhotoMaxAgeDays);
  const oldestAllowed = Date.now() - maxAgeDays * 86400000;
  if (takenAt.getTime() < oldestAllowed || takenAt.getTime() > Date.now() + 3600000) {
    return verificationError("photo_not_recent", `Photo must be from the last ${maxAgeDays} days.`, request, { maxAgeDays }, baseChecks);
  }

  if (metadata.latitude == null || metadata.longitude == null) {
    return verificationError("missing_location", "This photo is missing location metadata. Check that camera location is enabled and use the original photo.", request, {}, baseChecks);
  }

  if (!branch) {
    return verificationError("branch_not_found", "Verification branch is not available right now.", request, {}, baseChecks);
  }

  const distance = distanceMeters(
    Number(branch.latitude),
    Number(branch.longitude),
    metadata.latitude,
    metadata.longitude
  );
  const maxDistance = Number(branch.radius_meters || 220);
  const checks = buildVerificationChecks({
    metadata,
    branch,
    branchId,
    takenAt,
    distance,
    maxDistance
  });

  if (distance > maxDistance) {
    return verificationError(
      "outside_branch",
      `Photo location is about ${Math.round(distance)}m from Gulberg. It needs to be within ${maxDistance}m.`,
      request,
      { distance: Math.round(distance), maxDistance },
      checks
    );
  }

  const turnstileError = await turnstilePromise;
  if (turnstileError) return turnstileError;

  const now = new Date();
  const validDays = numberFromEnv(env.VERIFICATION_VALID_DAYS, defaultVerificationValidDays);
  const expiresAt = new Date(now.getTime() + validDays * 86400000);
  const memberToken = `member_${crypto.randomUUID()}`;

  if (env.DB) {
    const [memberTokenHash, ipHash, userAgentHash] = await Promise.all([
      sha256(memberToken),
      optionalHeaderHash(request, "cf-connecting-ip"),
      optionalHeaderHash(request, "user-agent")
    ]);

    await env.DB.prepare(
      `
        INSERT INTO verifications (
          id,
          branch_id,
          member_token_hash,
          verified_at,
          expires_at,
          photo_taken_at,
          distance_from_branch_meters,
          metadata_status,
          verification_method,
          created_ip_hash,
          user_agent_hash
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'photo_metadata', ?, ?)
      `
    ).bind(
      `verification_${crypto.randomUUID()}`,
      branch.id,
      memberTokenHash,
      now.toISOString(),
      expiresAt.toISOString(),
      takenAt.toISOString(),
      Math.round(distance),
      "gps_and_timestamp",
      ipHash,
      userAgentHash
    ).run();
  }

  return {
    status: 200,
    body: {
      verified: true,
      status: "verified",
      member_token: memberToken,
      expires_at: expiresAt.toISOString(),
      checks
    }
  };
}

async function getVerificationBranch(env, branchId) {
  if (branchId !== focusBranchId) return null;

  const now = Date.now();
  if (cachedFocusBranch && now - cachedFocusBranchLoadedAt < branchCacheTtlMs) {
    return cachedFocusBranch;
  }

  const branch = env.DB
    ? await env.DB.prepare(
      `
        SELECT id, name, slug, latitude, longitude, radius_meters
        FROM branches
        WHERE id = ?
          AND slug = ?
          AND is_active = 1
        LIMIT 1
      `
    ).bind(branchId, focusBranchSlug).first()
    : demoBranches.find((item) => item.id === focusBranchId) || null;

  if (branch) {
    cachedFocusBranch = branch;
    cachedFocusBranchLoadedAt = now;
  }

  return branch;
}

function verificationError(status, message, request, params = {}, checks = null) {
  return {
    status: 400,
    body: {
      verified: false,
      status,
      message: localizedMessage(status, message, request, params),
      ...(checks ? { checks } : {})
    }
  };
}

function emptyVerificationChecks(branchId = focusBranchId) {
  return {
    branch_id: branchId,
    branch: branchId === focusBranchId ? "Gulberg" : null,
    supported_image: null,
    supported_jpeg: null,
    format: "unknown",
    exif_found: null,
    timestamp_found: null,
    gps_found: null,
    photo_taken_at: null,
    distance_from_branch_meters: null,
    max_distance_meters: null,
    metadata_status: "not_checked"
  };
}

function buildVerificationChecks({ metadata, branch, branchId, takenAt, distance = null, maxDistance = null }) {
  const gpsFound = metadata.latitude != null && metadata.longitude != null;

  return {
    branch_id: branch?.id || branchId,
    branch: branch?.name || (branchId === focusBranchId ? "Gulberg" : null),
    supported_image: Boolean(metadata.supported),
    supported_jpeg: Boolean(metadata.supported),
    format: metadata.format || "unknown",
    exif_found: Boolean(metadata.hasExif),
    timestamp_found: Boolean(takenAt),
    gps_found: gpsFound,
    photo_taken_at: takenAt ? takenAt.toISOString() : null,
    distance_from_branch_meters: distance == null ? null : Math.round(distance),
    max_distance_meters: maxDistance == null ? Number(branch?.radius_meters || 220) : maxDistance,
    metadata_status: metadataStatus(metadata, takenAt, distance, maxDistance)
  };
}

function metadataStatus(metadata, takenAt, distance, maxDistance) {
  if (!metadata.supported) return "unsupported_file";
  if (!metadata.hasExif) return "missing_exif";
  if (!takenAt) return "missing_timestamp";
  if (metadata.latitude == null || metadata.longitude == null) return "missing_gps";
  if (distance != null && maxDistance != null && distance > maxDistance) return "outside_branch";
  return "gps_and_timestamp";
}

async function getVerificationStatus(env, request) {
  const verification = await getActiveVerification(env, getMemberToken(request));

  if (!verification) {
    return {
      status: 200,
      body: {
        verified: false,
        status: "unverified"
      }
    };
  }

  return {
    status: 200,
    body: {
      verified: true,
      status: "verified",
      branch_id: verification.branch_id,
      expires_at: verification.expires_at
    }
  };
}

async function getActiveVerification(env, token) {
  if (!token) return null;

  const tokenHash = await sha256(token);

  if (!env.DB) {
    return token.startsWith("member_") || token === "demo_member"
      ? {
          tokenHash,
          branch_id: focusBranchId,
          expires_at: new Date(Date.now() + defaultVerificationValidDays * 86400000).toISOString()
        }
      : null;
  }

  const verification = await env.DB.prepare(
    `
      SELECT v.branch_id, v.expires_at
      FROM verifications v
      JOIN branches b ON b.id = v.branch_id
      WHERE v.member_token_hash = ?
        AND v.expires_at > ?
        AND b.slug = ?
        AND b.is_active = 1
      LIMIT 1
    `
  ).bind(tokenHash, new Date().toISOString(), focusBranchSlug).first();

  return verification ? { ...verification, tokenHash } : null;
}

async function getStats(env) {
  if (!env.DB) return summarize(demoIssues);

  const issueStats = await env.DB.prepare(
    `
      SELECT
        COUNT(DISTINCT i.id) AS issue_count,
        COUNT(v.id) AS vote_count
      FROM issues i
      JOIN branches b ON b.id = i.branch_id
      LEFT JOIN votes v ON v.issue_id = i.id
      WHERE i.status = 'published'
        AND b.slug = ?
        AND i.created_at >= datetime('now', '-30 days')
    `
  ).bind(focusBranchSlug).first();

  const category = await env.DB.prepare(
    `
      SELECT i.category, COUNT(*) AS count
      FROM issues i
      JOIN branches b ON b.id = i.branch_id
      WHERE i.status = 'published'
        AND b.slug = ?
      GROUP BY i.category
      ORDER BY count DESC
      LIMIT 1
    `
  ).bind(focusBranchSlug).first();

  const branch = await env.DB.prepare(
    `
      SELECT b.name, COUNT(*) AS count
      FROM issues i
      JOIN branches b ON b.id = i.branch_id
      WHERE i.status = 'published'
        AND b.slug = ?
      GROUP BY b.id
      ORDER BY count DESC
      LIMIT 1
    `
  ).bind(focusBranchSlug).first();

  const staff = await env.DB.prepare(
    `
      SELECT COALESCE(staff_name, staff_role, 'Unspecified') AS label, COUNT(*) AS count
      FROM issues i
      JOIN branches b ON b.id = i.branch_id
      WHERE i.status = 'published'
        AND b.slug = ?
        AND (i.staff_name IS NOT NULL OR i.staff_role IS NOT NULL)
      GROUP BY label
      ORDER BY count DESC
      LIMIT 5
    `
  ).bind(focusBranchSlug).all();

  return {
    issue_count: issueStats?.issue_count || 0,
    vote_count: issueStats?.vote_count || 0,
    top_category: category?.category || "None yet",
    top_branch: branch?.name || "None yet",
    staff_mentions: staff.results || []
  };
}

function filterDemoIssues(params) {
  const category = params.get("category");
  const issues = demoIssues.filter((issue) => {
    const branchMatch = demoBranches.find((item) => item.id === issue.branch_id)?.slug === focusBranchSlug;
    const categoryMatch = !category || category === "all" || issue.category === category;
    return branchMatch && categoryMatch;
  });

  return { issues };
}

function summarize(issues) {
  const topCategory = mostCommon(issues.map((issue) => issue.category));
  const topBranch = mostCommon(issues.map((issue) => issue.branch_name));
  const staffMentions = Object.entries(
    issues.reduce((summary, issue) => {
      const label = issue.staff_name || issue.staff_role;
      if (label) summary[label] = (summary[label] || 0) + 1;
      return summary;
    }, {})
  ).map(([label, count]) => ({ label, count }));

  return {
    issue_count: issues.length,
    vote_count: issues.reduce((total, issue) => total + issue.vote_count, 0),
    top_category: topCategory || "None yet",
    top_branch: topBranch || "None yet",
    staff_mentions: staffMentions
  };
}

function mostCommon(values) {
  const counts = values.reduce((summary, value) => {
    summary[value] = (summary[value] || 0) + 1;
    return summary;
  }, {});
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
}

function validateIssueInput(input) {
  const required = ["branch_id", "title", "body", "category"];
  for (const key of required) {
    if (!input?.[key] || String(input[key]).trim().length === 0) {
      throw new InputValidationError(`${issueFieldLabel(key)} is required.`, key);
    }
  }

  const isAnonymous = input.is_anonymous !== false && input.is_anonymous !== 0 && input.is_anonymous !== "false";

  return {
    branch_id: focusBranchId,
    title: String(input.title).trim().slice(0, 120),
    body: String(input.body).trim().slice(0, 2000),
    category: String(input.category).trim(),
    staff_name: input.staff_name ? String(input.staff_name).trim().slice(0, 80) : null,
    staff_role: input.staff_role ? String(input.staff_role).trim().slice(0, 80) : null,
    is_anonymous: isAnonymous,
    display_name: !isAnonymous && input.display_name ? String(input.display_name).trim().slice(0, 80) : null
  };
}

function issueFieldLabel(key) {
  const labels = {
    branch_id: "Branch",
    title: "Title",
    body: "Description",
    category: "Category"
  };
  return labels[key] || key;
}

function readImageMetadata(buffer) {
  const bytes = new Uint8Array(buffer);
  if (isJpeg(bytes)) return readJpegExif(buffer);
  if (isHeif(bytes)) return readHeifExif(buffer);
  return { supported: false, hasExif: false, format: "unsupported" };
}

function isJpeg(bytes) {
  return bytes.length >= 4 && bytes[0] === 0xff && bytes[1] === 0xd8;
}

function isHeif(bytes) {
  if (bytes.length < 12 || readAsciiBytes(bytes, 4, 4) !== "ftyp") return false;
  const majorBrand = readAsciiBytes(bytes, 8, 4);
  const brands = new Set(["heic", "heix", "hevc", "hevx", "heim", "heis", "hevm", "hevs", "mif1", "msf1", "heif"]);
  if (brands.has(majorBrand)) return true;

  const ftypSize = readUint32FromBytes(bytes, 0);
  const end = Math.min(bytes.length, ftypSize || 32);
  for (let offset = 16; offset + 4 <= end; offset += 4) {
    if (brands.has(readAsciiBytes(bytes, offset, 4))) return true;
  }
  return false;
}

function readJpegExif(buffer) {
  const bytes = new Uint8Array(buffer);
  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) {
    return { supported: false, hasExif: false };
  }

  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }

    const marker = bytes[offset + 1];
    offset += 2;

    if (marker === 0xda || marker === 0xd9) break;
    if (marker >= 0xd0 && marker <= 0xd7) continue;
    if (offset + 2 > bytes.length) break;

    const segmentLength = (bytes[offset] << 8) | bytes[offset + 1];
    const segmentStart = offset + 2;
    const segmentEnd = offset + segmentLength;
    if (segmentLength < 2 || segmentEnd > bytes.length) break;

    const hasExifHeader =
      marker === 0xe1 &&
      segmentEnd - segmentStart >= 6 &&
      bytes[segmentStart] === 0x45 &&
      bytes[segmentStart + 1] === 0x78 &&
      bytes[segmentStart + 2] === 0x69 &&
      bytes[segmentStart + 3] === 0x66 &&
      bytes[segmentStart + 4] === 0x00 &&
      bytes[segmentStart + 5] === 0x00;

    if (hasExifHeader) {
      return {
        supported: true,
        format: "jpeg",
        hasExif: true,
        ...readTiffMetadata(buffer, segmentStart + 6, segmentEnd)
      };
    }

    offset = segmentEnd;
  }

  return { supported: true, format: "jpeg", hasExif: false };
}

function readHeifExif(buffer) {
  const bytes = new Uint8Array(buffer);
  const metaBox = findTopLevelBox(bytes, "meta");
  if (!metaBox) return { supported: true, format: "heic", hasExif: false };

  const metaStart = metaBox.start + metaBox.headerSize + 4; // skip FullBox version/flags
  const metaEnd = metaBox.end;
  const itemTypes = readHeifItemTypes(bytes, metaStart, metaEnd);
  const exifItemIds = [...itemTypes.entries()]
    .filter(([, type]) => type === "Exif")
    .map(([itemId]) => itemId);
  if (exifItemIds.length === 0) return { supported: true, format: "heic", hasExif: false };

  const locations = readHeifItemLocations(bytes, metaStart, metaEnd);
  for (const itemId of exifItemIds) {
    const location = locations.get(itemId);
    if (!location) continue;

    for (const extent of location.extents) {
      const extentStart = location.constructionMethod === 1
        ? findHeifIdatPayloadStart(bytes, metaStart, metaEnd) + extent.offset
        : location.baseOffset + extent.offset;
      const extentEnd = extentStart + extent.length;
      if (extentStart < 0 || extentEnd > bytes.length || extentStart >= extentEnd) continue;

      const tiffOffset = findTiffHeader(bytes, extentStart, Math.min(extentEnd, extentStart + 64));
      if (tiffOffset != null) {
        return {
          supported: true,
          format: "heic",
          hasExif: true,
          ...readTiffMetadata(buffer, tiffOffset, extentEnd)
        };
      }
    }
  }

  return { supported: true, format: "heic", hasExif: false };
}

function readHeifItemTypes(bytes, start, end) {
  const itemTypes = new Map();
  for (const box of childBoxes(bytes, start, end)) {
    if (box.type !== "iinf") continue;

    const version = bytes[box.start + box.headerSize];
    let offset = box.start + box.headerSize + 4;
    const entryCount = version === 0 ? readUint16FromBytes(bytes, offset) : readUint32FromBytes(bytes, offset);
    offset += version === 0 ? 2 : 4;

    for (let index = 0; index < entryCount; index += 1) {
      const entry = readBox(bytes, offset, box.end);
      if (!entry) break;
      if (entry.type === "infe") {
        const entryVersion = bytes[entry.start + entry.headerSize];
        let entryOffset = entry.start + entry.headerSize + 4;
        let itemId;
        let itemType;
        if (entryVersion >= 2) {
          itemId = entryVersion === 2
            ? readUint16FromBytes(bytes, entryOffset)
            : readUint32FromBytes(bytes, entryOffset);
          entryOffset += entryVersion === 2 ? 2 : 4;
          entryOffset += 2; // item_protection_index
          itemType = readAsciiBytes(bytes, entryOffset, 4);
        }
        if (itemId != null && itemType) itemTypes.set(itemId, itemType);
      }
      offset = entry.end;
    }
  }
  return itemTypes;
}

function readHeifItemLocations(bytes, start, end) {
  const locations = new Map();
  for (const box of childBoxes(bytes, start, end)) {
    if (box.type !== "iloc") continue;

    const version = bytes[box.start + box.headerSize];
    let offset = box.start + box.headerSize + 4;
    const sizes = bytes[offset++];
    const offsetSize = sizes >> 4;
    const lengthSize = sizes & 0x0f;
    const baseSizes = bytes[offset++];
    const baseOffsetSize = baseSizes >> 4;
    const indexSize = version === 1 || version === 2 ? baseSizes & 0x0f : 0;
    const itemCount = version < 2 ? readUint16FromBytes(bytes, offset) : readUint32FromBytes(bytes, offset);
    offset += version < 2 ? 2 : 4;

    for (let itemIndex = 0; itemIndex < itemCount; itemIndex += 1) {
      const itemId = version < 2 ? readUint16FromBytes(bytes, offset) : readUint32FromBytes(bytes, offset);
      offset += version < 2 ? 2 : 4;

      let constructionMethod = 0;
      if (version === 1 || version === 2) {
        constructionMethod = readUint16FromBytes(bytes, offset) & 0x000f;
        offset += 2;
      }

      offset += 2; // data_reference_index
      const baseOffset = readSizedUint(bytes, offset, baseOffsetSize);
      offset += baseOffsetSize;
      const extentCount = readUint16FromBytes(bytes, offset);
      offset += 2;

      const extents = [];
      for (let extentIndex = 0; extentIndex < extentCount; extentIndex += 1) {
        if ((version === 1 || version === 2) && indexSize > 0) {
          offset += indexSize;
        }
        const extentOffset = readSizedUint(bytes, offset, offsetSize);
        offset += offsetSize;
        const extentLength = readSizedUint(bytes, offset, lengthSize);
        offset += lengthSize;
        extents.push({ offset: extentOffset, length: extentLength });
      }

      locations.set(itemId, { constructionMethod, baseOffset, extents });
    }
  }
  return locations;
}

function findHeifIdatPayloadStart(bytes, start, end) {
  const idat = childBoxes(bytes, start, end).find((box) => box.type === "idat");
  return idat ? idat.start + idat.headerSize : 0;
}

function findTiffHeader(bytes, start, end) {
  for (let offset = start; offset + 4 <= end; offset += 1) {
    const littleEndian = bytes[offset] === 0x49 && bytes[offset + 1] === 0x49 && bytes[offset + 2] === 0x2a && bytes[offset + 3] === 0x00;
    const bigEndian = bytes[offset] === 0x4d && bytes[offset + 1] === 0x4d && bytes[offset + 2] === 0x00 && bytes[offset + 3] === 0x2a;
    if (littleEndian || bigEndian) return offset;
  }
  return null;
}

function readTiffMetadata(buffer, tiffOffset, segmentEnd) {
  const view = new DataView(buffer);
  if (tiffOffset + 8 > segmentEnd) return {};

  const byteOrder = readAsciiAt(view, tiffOffset, 2);
  const littleEndian = byteOrder === "II";
  if (!littleEndian && byteOrder !== "MM") return {};
  if (readUint16(view, tiffOffset + 2, littleEndian) !== 42) return {};

  const firstIfdOffset = tiffOffset + readUint32(view, tiffOffset + 4, littleEndian);
  const metadata = {};
  const pointers = {};

  readIfdEntries(view, tiffOffset, firstIfdOffset, segmentEnd, littleEndian, (tag, value) => {
    if (tag === 0x0132) metadata.dateTime = value;
    if (tag === 0x8769) pointers.exif = tiffOffset + Number(value || 0);
    if (tag === 0x8825) pointers.gps = tiffOffset + Number(value || 0);
  });

  if (pointers.exif) {
    readIfdEntries(view, tiffOffset, pointers.exif, segmentEnd, littleEndian, (tag, value) => {
      if (tag === 0x9003) metadata.dateTimeOriginal = value;
      if (tag === 0x9004) metadata.dateTimeDigitized = value;
      if (tag === 0x9010) metadata.offsetTime = value;
      if (tag === 0x9011) metadata.offsetTimeOriginal = value;
      if (tag === 0x9012) metadata.offsetTimeDigitized = value;
    });
  }

  if (pointers.gps) {
    const gps = {};
    readIfdEntries(view, tiffOffset, pointers.gps, segmentEnd, littleEndian, (tag, value) => {
      if (tag === 0x0001) gps.latitudeRef = value;
      if (tag === 0x0002) gps.latitude = value;
      if (tag === 0x0003) gps.longitudeRef = value;
      if (tag === 0x0004) gps.longitude = value;
      if (tag === 0x0007) gps.timeStamp = value;
      if (tag === 0x001d) gps.dateStamp = value;
    });

    metadata.latitude = gpsCoordinate(gps.latitude, gps.latitudeRef);
    metadata.longitude = gpsCoordinate(gps.longitude, gps.longitudeRef);
    metadata.gpsTimeStamp = gps.timeStamp;
    metadata.gpsDateStamp = gps.dateStamp;
  }

  return metadata;
}

function readIfdEntries(view, tiffOffset, ifdOffset, segmentEnd, littleEndian, onEntry) {
  if (!ifdOffset || ifdOffset + 2 > segmentEnd) return;

  const entryCount = readUint16(view, ifdOffset, littleEndian);
  const entriesStart = ifdOffset + 2;
  const entriesEnd = entriesStart + entryCount * 12;
  if (entriesEnd > segmentEnd) return;

  for (let index = 0; index < entryCount; index += 1) {
    const entryOffset = entriesStart + index * 12;
    const tag = readUint16(view, entryOffset, littleEndian);
    const type = readUint16(view, entryOffset + 2, littleEndian);
    const count = readUint32(view, entryOffset + 4, littleEndian);
    const value = readIfdValue(view, tiffOffset, entryOffset, segmentEnd, littleEndian, type, count);
    if (value !== undefined) onEntry(tag, value);
  }
}

function readIfdValue(view, tiffOffset, entryOffset, segmentEnd, littleEndian, type, count) {
  const typeSizes = {
    1: 1,
    2: 1,
    3: 2,
    4: 4,
    5: 8
  };
  const typeSize = typeSizes[type];
  if (!typeSize) return undefined;

  const byteLength = typeSize * count;
  const inlineOffset = entryOffset + 8;
  const valueOffset = byteLength <= 4
    ? inlineOffset
    : tiffOffset + readUint32(view, inlineOffset, littleEndian);
  if (valueOffset < tiffOffset || valueOffset + byteLength > segmentEnd) return undefined;

  if (type === 2) return readAsciiAt(view, valueOffset, count).replace(/\0+$/, "");
  if (type === 3) return count === 1
    ? readUint16(view, valueOffset, littleEndian)
    : readNumberArray(view, valueOffset, count, littleEndian, readUint16, 2);
  if (type === 4) return count === 1
    ? readUint32(view, valueOffset, littleEndian)
    : readNumberArray(view, valueOffset, count, littleEndian, readUint32, 4);
  if (type === 5) return readRationalArray(view, valueOffset, count, littleEndian);

  return undefined;
}

function readNumberArray(view, offset, count, littleEndian, reader, size) {
  return Array.from({ length: count }, (_, index) => reader(view, offset + index * size, littleEndian));
}

function readRationalArray(view, offset, count, littleEndian) {
  return Array.from({ length: count }, (_, index) => {
    const itemOffset = offset + index * 8;
    const numerator = readUint32(view, itemOffset, littleEndian);
    const denominator = readUint32(view, itemOffset + 4, littleEndian);
    return denominator === 0 ? 0 : numerator / denominator;
  });
}

function gpsCoordinate(parts, ref) {
  if (!Array.isArray(parts) || parts.length < 3) return null;
  const coordinate = Number(parts[0]) + Number(parts[1]) / 60 + Number(parts[2]) / 3600;
  if (!Number.isFinite(coordinate)) return null;
  return ref === "S" || ref === "W" ? -coordinate : coordinate;
}

function parsePhotoTakenAt(metadata) {
  return parseExifDate(metadata.dateTimeOriginal, metadata.offsetTimeOriginal) ||
    parseExifDate(metadata.dateTimeDigitized, metadata.offsetTimeDigitized) ||
    parseExifDate(metadata.dateTime, metadata.offsetTime) ||
    parseGpsDateTime(metadata.gpsDateStamp, metadata.gpsTimeStamp);
}

function parseExifDate(value, offset = "") {
  const match = String(value || "").trim().match(
    /^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(?:\s*([+-]\d{2}:?\d{2}|Z))?$/
  );
  if (!match) return null;

  const [, year, month, day, hour, minute, second, inlineOffset] = match;
  return dateFromParts({
    year,
    month,
    day,
    hour,
    minute,
    second,
    offset: inlineOffset || offset
  });
}

function parseGpsDateTime(dateStamp, timeStamp) {
  const dateMatch = String(dateStamp || "").trim().match(/^(\d{4}):(\d{2}):(\d{2})$/);
  if (!dateMatch || !Array.isArray(timeStamp) || timeStamp.length < 3) return null;

  const [, year, month, day] = dateMatch;
  const [hour, minute, second] = timeStamp.map(Number);
  return dateFromParts({
    year,
    month,
    day,
    hour,
    minute,
    second,
    offset: "Z"
  });
}

function dateFromParts({ year, month, day, hour, minute, second, offset = "" }) {
  const values = [year, month, day, hour, minute, second].map(Number);
  if (values.some((value) => !Number.isFinite(value))) return null;

  const [parsedYear, parsedMonth, parsedDay, parsedHour, parsedMinute, parsedSecond] = values;
  if (
    parsedYear < 1970 ||
    parsedMonth < 1 ||
    parsedMonth > 12 ||
    parsedDay < 1 ||
    parsedDay > 31 ||
    parsedHour < 0 ||
    parsedHour > 23 ||
    parsedMinute < 0 ||
    parsedMinute > 59 ||
    parsedSecond < 0 ||
    parsedSecond >= 61
  ) {
    return null;
  }

  const normalizedOffset = normalizeExifOffset(offset);
  const isoDate = `${padDatePart(parsedYear, 4)}-${padDatePart(parsedMonth)}-${padDatePart(parsedDay)}T${padDatePart(parsedHour)}:${padDatePart(parsedMinute)}:${padDatePart(Math.floor(parsedSecond))}`;
  const date = normalizedOffset
    ? new Date(`${isoDate}${normalizedOffset}`)
    : new Date(Date.UTC(parsedYear, parsedMonth - 1, parsedDay, parsedHour, parsedMinute, parsedSecond));

  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeExifOffset(value) {
  const offset = String(value || "").trim();
  if (offset === "Z") return "Z";
  const match = offset.match(/^([+-])(\d{2}):?(\d{2})$/);
  return match ? `${match[1]}${match[2]}:${match[3]}` : "";
}

function padDatePart(value, length = 2) {
  return String(value).padStart(length, "0");
}

function distanceMeters(fromLatitude, fromLongitude, toLatitude, toLongitude) {
  const earthRadiusMeters = 6371000;
  const fromLat = toRadians(fromLatitude);
  const toLat = toRadians(toLatitude);
  const deltaLat = toRadians(toLatitude - fromLatitude);
  const deltaLng = toRadians(toLongitude - fromLongitude);
  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(fromLat) * Math.cos(toLat) * Math.sin(deltaLng / 2) ** 2;
  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRadians(value) {
  return Number(value) * Math.PI / 180;
}

function numberFromEnv(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

async function optionalHeaderHash(request, headerName) {
  const value = request.headers.get(headerName);
  return value ? sha256(value) : null;
}

function getMemberToken(request) {
  return request.headers.get("x-member-token") || "";
}

async function optionalJson(request) {
  const contentType = request.headers.get("content-type") || "";
  if (!contentType.includes("application/json")) return {};

  try {
    return await request.json();
  } catch {
    return {};
  }
}

async function requireTurnstile(env, request, token) {
  const secret = String(env.TURNSTILE_SECRET_KEY || "");
  if (!secret) return null;

  if (!token) {
    return apiError("bot_check_required", "Bot check is required. Please try again.", 403, {}, request);
  }

  const payload = new FormData();
  payload.set("secret", secret);
  payload.set("response", String(token));
  payload.set("idempotency_key", crypto.randomUUID());

  const remoteIp = request.headers.get("cf-connecting-ip");
  if (remoteIp) {
    payload.set("remoteip", remoteIp);
  }

  const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: payload
  });

  if (!response.ok) {
    return apiError("bot_check_unavailable", "Bot check is unavailable. Please try again.", 503, {}, request);
  }

  const result = await response.json();
  if (result.success) return null;

  return apiError(
    "bot_check_failed",
    "Bot check failed. Please try again.",
    403,
    { turnstile_errors: result["error-codes"] || [] },
    request
  );
}

function apiError(status, message, httpStatus = 400, extra = {}, request = null, options = {}) {
  return {
    status: httpStatus,
    body: {
      ...extra,
      error: status,
      status,
      message: localizedMessage(options.messageKey || status, message, request, options.params || {})
    }
  };
}

function localizedMessage(key, fallback, request, params = {}) {
  const locale = localeFromRequest(request);
  const template = apiMessages[locale]?.[key] || apiMessages.en[key] || fallback;
  return template.replace(/\{(\w+)\}/g, (_, paramKey) => String(params[paramKey] ?? ""));
}

function localeFromRequest(request) {
  const requested = String(request?.headers?.get("x-locale") || request?.headers?.get("accept-language") || "").toLowerCase();
  return requested.startsWith("ur") || requested.includes("ur-pk") ? "ur" : "en";
}

function readAsciiAt(view, offset, length) {
  let output = "";
  for (let index = 0; index < length; index += 1) {
    output += String.fromCharCode(view.getUint8(offset + index));
  }
  return output;
}

function readAsciiBytes(bytes, offset, length) {
  let output = "";
  for (let index = 0; index < length; index += 1) {
    output += String.fromCharCode(bytes[offset + index] || 0);
  }
  return output;
}

function readBox(bytes, offset, end) {
  if (offset + 8 > end) return null;

  const size32 = readUint32FromBytes(bytes, offset);
  const type = readAsciiBytes(bytes, offset + 4, 4);
  let size = size32;
  let headerSize = 8;

  if (size32 === 1) {
    if (offset + 16 > end) return null;
    size = readUint64FromBytes(bytes, offset + 8);
    headerSize = 16;
  } else if (size32 === 0) {
    size = end - offset;
  }

  if (type === "uuid") headerSize += 16;
  if (size < headerSize || offset + size > end) return null;

  return {
    start: offset,
    end: offset + size,
    headerSize,
    type
  };
}

function childBoxes(bytes, start, end) {
  const boxes = [];
  let offset = start;
  while (offset + 8 <= end) {
    const box = readBox(bytes, offset, end);
    if (!box) break;
    boxes.push(box);
    offset = box.end;
  }
  return boxes;
}

function findTopLevelBox(bytes, type) {
  return childBoxes(bytes, 0, bytes.length).find((box) => box.type === type) || null;
}

function readSizedUint(bytes, offset, size) {
  if (size === 0) return 0;
  let value = 0;
  for (let index = 0; index < size; index += 1) {
    value = value * 256 + (bytes[offset + index] || 0);
  }
  return value;
}

function readUint32FromBytes(bytes, offset) {
  return ((bytes[offset] || 0) * 0x1000000) +
    ((bytes[offset + 1] || 0) << 16) +
    ((bytes[offset + 2] || 0) << 8) +
    (bytes[offset + 3] || 0);
}

function readUint16FromBytes(bytes, offset) {
  return ((bytes[offset] || 0) << 8) + (bytes[offset + 1] || 0);
}

function readUint64FromBytes(bytes, offset) {
  const high = readUint32FromBytes(bytes, offset);
  const low = readUint32FromBytes(bytes, offset + 4);
  return high * 0x100000000 + low;
}

function readUint16(view, offset, littleEndian) {
  return view.getUint16(offset, littleEndian);
}

function readUint32(view, offset, littleEndian) {
  return view.getUint32(offset, littleEndian);
}

async function sha256(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...jsonHeaders, ...corsHeaders() }
  });
}

function corsHeaders() {
  return {
    "access-control-allow-origin": "*",
    "access-control-allow-methods": "GET, POST, DELETE, OPTIONS",
    "access-control-allow-headers": "content-type, x-member-token, x-locale"
  };
}
