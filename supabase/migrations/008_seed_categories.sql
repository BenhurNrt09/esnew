-- Clean ve safe seed script for categories
DO $$
DECLARE 
    parent_id uuid;
BEGIN
    -- 1. SAÇ RENGİ (Get ID if exists, insert if not)
    SELECT id INTO parent_id FROM categories WHERE slug = 'sac-rengi';
    IF parent_id IS NULL THEN
        INSERT INTO categories (name, slug, is_active) VALUES ('Saç Rengi', 'sac-rengi', true) RETURNING id INTO parent_id;
    ELSE
        -- Update name just in case
        UPDATE categories SET name = 'Saç Rengi', is_active = true WHERE id = parent_id;
    END IF;

    -- Sub categories (Conflict -> Nothing)
    INSERT INTO categories (name, slug, parent_id, is_active) VALUES 
    ('Sarı', 'sari', parent_id, true),
    ('Esmer', 'esmer', parent_id, true),
    ('Kumral', 'kumral', parent_id, true),
    ('Kızıl', 'kizil', parent_id, true),
    ('Siyah', 'siyah', parent_id, true),
    ('Boyalı / Renkli', 'boyali', parent_id, true)
    ON CONFLICT (slug) DO NOTHING;


    -- 2. GÖZ RENGİ
    SELECT id INTO parent_id FROM categories WHERE slug = 'goz-rengi';
    IF parent_id IS NULL THEN
        INSERT INTO categories (name, slug, is_active) VALUES ('Göz Rengi', 'goz-rengi', true) RETURNING id INTO parent_id;
    ELSE
        UPDATE categories SET name = 'Göz Rengi', is_active = true WHERE id = parent_id;
    END IF;

    INSERT INTO categories (name, slug, parent_id, is_active) VALUES 
    ('Mavi', 'mavi', parent_id, true),
    ('Yeşil', 'yesil', parent_id, true),
    ('Kahverengi', 'kahverengi', parent_id, true),
    ('Ela', 'ela', parent_id, true),
    ('Siyah', 'goz-siyah', parent_id, true)
    ON CONFLICT (slug) DO NOTHING;

    -- 3. UYRUK / KÖKEN
    SELECT id INTO parent_id FROM categories WHERE slug = 'uyruk';
    IF parent_id IS NULL THEN
        INSERT INTO categories (name, slug, is_active) VALUES ('Uyruk / Köken', 'uyruk', true) RETURNING id INTO parent_id;
    ELSE
         UPDATE categories SET name = 'Uyruk / Köken', is_active = true WHERE id = parent_id;
    END IF;

    INSERT INTO categories (name, slug, parent_id, is_active) VALUES 
    ('Türk', 'turk', parent_id, true),
    ('Rus', 'rus', parent_id, true),
    ('Ukrayna', 'ukrayna', parent_id, true),
    ('Azerbaycan', 'azerbaycan', parent_id, true),
    ('Latin', 'latin', parent_id, true),
    ('Avrupa', 'avrupa', parent_id, true),
    ('Asya', 'asya', parent_id, true),
    ('Afro', 'afro', parent_id, true),
    ('Arap', 'arap', parent_id, true)
    ON CONFLICT (slug) DO NOTHING;

    -- 4. VÜCUT TİPİ
    SELECT id INTO parent_id FROM categories WHERE slug = 'vucut-tipi';
    IF parent_id IS NULL THEN
        INSERT INTO categories (name, slug, is_active) VALUES ('Vücut Tipi', 'vucut-tipi', true) RETURNING id INTO parent_id;
    ELSE
        UPDATE categories SET name = 'Vücut Tipi', is_active = true WHERE id = parent_id;
    END IF;

    INSERT INTO categories (name, slug, parent_id, is_active) VALUES 
    ('Zayıf', 'zayif', parent_id, true),
    ('Fit / Sportif', 'fit', parent_id, true),
    ('Balık Etli', 'balik-etli', parent_id, true),
    ('Dolgun', 'dolgun', parent_id, true),
    ('Büyük Beden', 'buyuk-beden', parent_id, true)
    ON CONFLICT (slug) DO NOTHING;
    
    -- 5. HİZMETLER (Ana Kategori)
    SELECT id INTO parent_id FROM categories WHERE slug = 'hizmetler';
    IF parent_id IS NULL THEN
        INSERT INTO categories (name, slug, is_active) VALUES ('Hizmetler', 'hizmetler', true) RETURNING id INTO parent_id;
    ELSE
        UPDATE categories SET name = 'Hizmetler', is_active = true WHERE id = parent_id;
    END IF;
    
    INSERT INTO categories (name, slug, parent_id, is_active) VALUES 
    ('Eskort', 'eskort', parent_id, true),
    ('Masaj', 'masaj', parent_id, true),
    ('Dans / Show', 'dans', parent_id, true),
    ('Partner', 'partner', parent_id, true)
    ON CONFLICT (slug) DO NOTHING;

END $$;
