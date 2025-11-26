-- migrations/create_links_table.sql

CREATE TABLE IF NOT EXISTS links (
  code VARCHAR(8) PRIMARY KEY,
  url TEXT NOT NULL,
  clicks INTEGER DEFAULT 0 NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  last_clicked TIMESTAMPTZ
);
