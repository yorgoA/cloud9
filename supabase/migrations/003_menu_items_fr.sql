-- Bilingual menu item fields (name/description stay English, *_fr holds French)
ALTER TABLE menu_items
  ADD COLUMN IF NOT EXISTS name_fr TEXT,
  ADD COLUMN IF NOT EXISTS description_fr TEXT;
