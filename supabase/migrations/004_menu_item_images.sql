ALTER TABLE menu_items ADD COLUMN IF NOT EXISTS image_path TEXT;

INSERT INTO storage.buckets (id, name, public)
VALUES ('menu-items', 'menu-items', true)
ON CONFLICT (id) DO NOTHING;
