PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS branches (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  city TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  radius_meters INTEGER NOT NULL DEFAULT 200,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS verifications (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL,
  member_token_hash TEXT NOT NULL UNIQUE,
  verified_at TEXT NOT NULL,
  expires_at TEXT NOT NULL,
  photo_taken_at TEXT NOT NULL,
  distance_from_branch_meters REAL NOT NULL,
  metadata_status TEXT NOT NULL,
  verification_method TEXT NOT NULL DEFAULT 'photo_metadata',
  created_ip_hash TEXT,
  user_agent_hash TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id)
);

CREATE TABLE IF NOT EXISTS issues (
  id TEXT PRIMARY KEY,
  branch_id TEXT NOT NULL,
  author_token_hash TEXT,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  category TEXT NOT NULL,
  staff_name TEXT,
  staff_role TEXT,
  is_anonymous INTEGER NOT NULL DEFAULT 1,
  display_name TEXT,
  status TEXT NOT NULL DEFAULT 'published',
  cluster_id TEXT,
  moderation_status TEXT NOT NULL DEFAULT 'pending',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (branch_id) REFERENCES branches(id),
  FOREIGN KEY (cluster_id) REFERENCES issue_clusters(id)
);

CREATE TABLE IF NOT EXISTS votes (
  id TEXT PRIMARY KEY,
  issue_id TEXT NOT NULL,
  member_token_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE,
  UNIQUE (issue_id, member_token_hash)
);

CREATE TABLE IF NOT EXISTS issue_clusters (
  id TEXT PRIMARY KEY,
  canonical_issue_id TEXT,
  summary TEXT NOT NULL,
  embedding_id TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (canonical_issue_id) REFERENCES issues(id)
);

CREATE TABLE IF NOT EXISTS moderation_events (
  id TEXT PRIMARY KEY,
  issue_id TEXT NOT NULL,
  model TEXT NOT NULL,
  result TEXT NOT NULL,
  reason TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (issue_id) REFERENCES issues(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_issues_status_created_at ON issues(status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_issues_branch_category ON issues(branch_id, category);
CREATE INDEX IF NOT EXISTS idx_votes_issue_id ON votes(issue_id);
CREATE INDEX IF NOT EXISTS idx_verifications_expires_at ON verifications(expires_at);
