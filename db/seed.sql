INSERT OR IGNORE INTO branches (id, name, slug, city, latitude, longitude, radius_meters, is_active) VALUES
  ('branch_gulberg', 'Gulberg', 'gulberg', 'Lahore', 31.539389, 74.350469, 220, 1),
  ('branch_johar_town', 'Johar Town', 'johar-town', 'Lahore', 31.4697, 74.2728, 220, 0),
  ('branch_dha_lahore', 'DHA Lahore', 'dha-lahore', 'Lahore', 31.4624, 74.4090, 250, 0),
  ('branch_dha_karachi', 'DHA Karachi', 'dha-karachi', 'Karachi', 24.8042, 67.0643, 250, 0);

UPDATE branches SET is_active = CASE WHEN slug = 'gulberg' THEN 1 ELSE 0 END;

INSERT OR IGNORE INTO issues (
  id,
  branch_id,
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
) VALUES
  (
    'issue_peak_hours',
    'branch_gulberg',
    'Peak-hour floor crowding',
    'Evening sessions are becoming hard to complete because benches and racks stay occupied for long stretches.',
    'Facilities',
    NULL,
    'Floor management',
    0,
    'Hamza',
    'published',
    'passed',
    datetime('now', '-2 days'),
    datetime('now', '-2 days')
  );

INSERT OR IGNORE INTO votes (id, issue_id, member_token_hash, created_at) VALUES
  ('vote_1', 'issue_peak_hours', 'demo_member_1', datetime('now', '-1 day')),
  ('vote_2', 'issue_peak_hours', 'demo_member_2', datetime('now', '-1 day')),
  ('vote_3', 'issue_peak_hours', 'demo_member_3', datetime('now', '-12 hours'));
