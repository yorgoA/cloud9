-- Cloud9 Café - Initial Schema
-- Run this in Supabase SQL Editor or via Supabase CLI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Customers (linked to auth.users for loyalty)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  points_balance INTEGER NOT NULL DEFAULT 0 CHECK (points_balance >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Loyalty claims: one per customer per day
CREATE TABLE IF NOT EXISTS loyalty_claims (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  claim_date DATE NOT NULL,
  points_awarded INTEGER NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(customer_id, claim_date)
);

-- Reward catalog
CREATE TABLE IF NOT EXISTS reward_catalog (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  points_required INTEGER NOT NULL CHECK (points_required > 0),
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Reward redemptions (after staff validation)
CREATE TABLE IF NOT EXISTS reward_redemptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES reward_catalog(id) ON DELETE RESTRICT,
  points_used INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'validated', 'expired', 'cancelled')),
  redeem_token UUID UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  validated_at TIMESTAMPTZ
);

-- Pending redemption tokens (single-use, short-lived)
CREATE TABLE IF NOT EXISTS redemption_tokens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  reward_id UUID NOT NULL REFERENCES reward_catalog(id) ON DELETE RESTRICT,
  points_required INTEGER NOT NULL,
  token UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Daily codes (one active at a time for customer claim)
CREATE TABLE IF NOT EXISTS daily_codes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code TEXT NOT NULL,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Weekly QR (rotating weekly; QR links to loyalty claim page with week_key)
CREATE TABLE IF NOT EXISTS weekly_qr (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  token TEXT NOT NULL UNIQUE,
  week_key DATE NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Cloud9 weekly mood message
CREATE TABLE IF NOT EXISTS cloud9_moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  week_key DATE NOT NULL UNIQUE,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Menu items (for public menu + admin management)
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  price_cents INTEGER,
  category TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Gallery images (storage paths; actual files in Supabase Storage)
CREATE TABLE IF NOT EXISTS gallery_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  path TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Admin users (simple: store admin user_ids; use Supabase Auth for login)
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_loyalty_claims_customer_date ON loyalty_claims(customer_id, claim_date);
CREATE INDEX IF NOT EXISTS idx_reward_redemptions_customer ON reward_redemptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_redemption_tokens_token ON redemption_tokens(token);
CREATE INDEX IF NOT EXISTS idx_redemption_tokens_expires ON redemption_tokens(expires_at) WHERE used_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_daily_codes_active ON daily_codes(active) WHERE active = true;
CREATE INDEX IF NOT EXISTS idx_weekly_qr_week ON weekly_qr(week_key);

-- RLS policies (enable RLS on all tables)
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE reward_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE redemption_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_qr ENABLE ROW LEVEL SECURITY;
ALTER TABLE cloud9_moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Customers: users can read/update own row; service role can do all
CREATE POLICY "Users can read own customer" ON customers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own customer" ON customers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own customer" ON customers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Service role full access customers" ON customers FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Loyalty claims: customers can read own; insert via service/function only to enforce rules
CREATE POLICY "Users can read own claims" ON loyalty_claims FOR SELECT USING (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);
CREATE POLICY "Service role full access claims" ON loyalty_claims FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Reward catalog: public read active only
CREATE POLICY "Anyone can read active rewards" ON reward_catalog FOR SELECT USING (active = true);
CREATE POLICY "Service role full access reward_catalog" ON reward_catalog FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Reward redemptions: customer read own
CREATE POLICY "Users can read own redemptions" ON reward_redemptions FOR SELECT USING (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);
CREATE POLICY "Service role full access redemptions" ON reward_redemptions FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Redemption tokens: create/read by customer for own; validate by service/staff
CREATE POLICY "Users can read own redemption_tokens" ON redemption_tokens FOR SELECT USING (
  customer_id IN (SELECT id FROM customers WHERE user_id = auth.uid())
);
CREATE POLICY "Service role full access redemption_tokens" ON redemption_tokens FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Daily codes: no direct public read (code checked server-side); admin via service
CREATE POLICY "Service role full access daily_codes" ON daily_codes FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Weekly QR: public can read current week
CREATE POLICY "Anyone can read weekly_qr" ON weekly_qr FOR SELECT USING (true);
CREATE POLICY "Service role full access weekly_qr" ON weekly_qr FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Cloud9 moods: public read
CREATE POLICY "Anyone can read cloud9_moods" ON cloud9_moods FOR SELECT USING (true);
CREATE POLICY "Service role full access cloud9_moods" ON cloud9_moods FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Menu: public read active
CREATE POLICY "Anyone can read active menu" ON menu_items FOR SELECT USING (active = true);
CREATE POLICY "Service role full access menu_items" ON menu_items FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Gallery: public read
CREATE POLICY "Anyone can read gallery" ON gallery_images FOR SELECT USING (true);
CREATE POLICY "Service role full access gallery_images" ON gallery_images FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Admin: only admins can read admin_users (to check if current user is admin)
CREATE POLICY "Admins can read admin_users" ON admin_users FOR SELECT USING (
  EXISTS (SELECT 1 FROM admin_users au WHERE au.user_id = auth.uid())
);
CREATE POLICY "Service role full access admin_users" ON admin_users FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- Function: create customer on first signup (call from app or trigger)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.customers (user_id, email)
  VALUES (NEW.id, NEW.email)
  ON CONFLICT (user_id) DO UPDATE SET email = EXCLUDED.email, updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: auto-create customer when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed one daily code (run once; deactivate others if you add more)
INSERT INTO daily_codes (code, active) SELECT 'CLOUD9', true WHERE NOT EXISTS (SELECT 1 FROM daily_codes WHERE active = true LIMIT 1);

-- Seed default rewards (run once)
INSERT INTO reward_catalog (name, description, points_required, sort_order)
SELECT * FROM (VALUES
  ('€2 discount', '€2 off your next order', 1000, 1),
  ('Small souvenir', 'A little Cloud9 keepsake', 1800, 2),
  ('Free signature drink', 'One free signature drink of your choice', 2500, 3)
) AS v(name, description, points_required, sort_order)
WHERE NOT EXISTS (SELECT 1 FROM reward_catalog LIMIT 1);
