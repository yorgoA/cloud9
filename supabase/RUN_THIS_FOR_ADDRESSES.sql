-- Copy and paste this into Supabase → SQL Editor → New query → Run
-- Creates the site_contact table for the Addresses admin page

CREATE TABLE IF NOT EXISTS site_contact (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  address_line1 TEXT DEFAULT '123 Cloud Street',
  address_line2 TEXT DEFAULT 'Sky District',
  address_line3 TEXT DEFAULT 'Your City',
  phone TEXT DEFAULT '+1 234 567 890',
  email TEXT DEFAULT 'hello@cloud9.cafe',
  instagram TEXT DEFAULT 'https://instagram.com/cloud9',
  tiktok TEXT DEFAULT 'https://tiktok.com/@cloud9',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO site_contact (id, address_line1, address_line2, address_line3, phone, email, instagram, tiktok)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  '123 Cloud Street',
  'Sky District',
  'Your City',
  '+1 234 567 890',
  'hello@cloud9.cafe',
  'https://instagram.com/cloud9',
  'https://tiktok.com/@cloud9'
)
ON CONFLICT (id) DO NOTHING;

ALTER TABLE site_contact ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can read site_contact" ON site_contact;
CREATE POLICY "Anyone can read site_contact" ON site_contact FOR SELECT USING (true);

DROP POLICY IF EXISTS "Service role full access site_contact" ON site_contact;
CREATE POLICY "Service role full access site_contact" ON site_contact FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');
