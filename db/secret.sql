CREATE TABLE IF NOT EXISTS secret_grants (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  invite_hash TEXT NOT NULL UNIQUE,
  created_at INTEGER NOT NULL,
  invite_expires INTEGER NOT NULL,
  accepted_at INTEGER,
  session_hash TEXT UNIQUE,
  session_expires INTEGER,
  last_seen INTEGER,
  revoked INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS secret_limits (
  action TEXT PRIMARY KEY,
  window INTEGER NOT NULL,
  hits INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS secret_categories (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS secret_links (
  id TEXT PRIMARY KEY,
  category_id TEXT NOT NULL REFERENCES secret_categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT ''
);
CREATE INDEX IF NOT EXISTS secret_links_category ON secret_links(category_id);
INSERT OR IGNORE INTO secret_categories (id, slug, title, description) VALUES
  ('projects', 'projects', 'Projects', 'Things I am building. Some finished, some very much not.'),
  ('tools', 'tools', 'Tools', 'Useful little things and experiments.'),
  ('rabbit-holes', 'rabbit-holes', 'Rabbit holes', 'The stuff that sent me down a rabbit hole.');
