-- ============================================
-- Project Refinement Migration
-- ============================================

-- 1. Add phone number column to listings
ALTER TABLE public.listings 
ADD COLUMN IF NOT EXISTS phone TEXT;

-- 2. Delete irrelevant categories and their children
DO $$
DECLARE
    emlak_id UUID;
    arac_id UUID;
    is_id UUID;
BEGIN
    SELECT id INTO emlak_id FROM categories WHERE slug = 'emlak';
    SELECT id INTO arac_id FROM categories WHERE slug = 'araclar';
    SELECT id INTO is_id FROM categories WHERE slug = 'is-kariyer';

    -- Delete subcategories first (due to FK if not cascade, but schema has cascade)
    -- Actually Cascade handles it, but let's be explicit if needed or just delete parents
    
    IF emlak_id IS NOT NULL THEN
        DELETE FROM categories WHERE id = emlak_id OR parent_id = emlak_id;
    END IF;

    IF arac_id IS NOT NULL THEN
        DELETE FROM categories WHERE id = arac_id OR parent_id = arac_id;
    END IF;

    IF is_id IS NOT NULL THEN
        DELETE FROM categories WHERE id = is_id OR parent_id = is_id;
    END IF;
END $$;

-- 3. Ensure 'hizmetler' is the primary category if not already
UPDATE categories SET "order" = 1 WHERE slug = 'hizmetler';