-- Clean and safe seed script for categories (Fixed Ambiguity)
DO $$
DECLARE 
    v_parent_id uuid; -- Değişken adı çakışmasını önlemek için 'v_' öneki
BEGIN
    -- 1. SAÇ RENGİ (Get ID if exists, insert if not)
    SELECT id INTO v_parent_id FROM categories WHERE slug = 'sac-rengi';
    IF v_parent_id IS NULL THEN
        INSERT INTO categories (name, slug, is_active) VALUES ('Saç Rengi', 'sac-rengi', true) RETURNING id INTO v_parent_id;
    ELSE
        UPDATE categories SET name = 'Saç Rengi', is_active = true WHERE id = v_parent_id;
    END IF;

    -- Sub categories (Conflict -> Nothing)
    INSERT INTO categories (name, slug, parent_id, is_active) VALUES 
    ('Sarı', 'sari', v_parent_id, true),
    ('Esmer', 'esmer', v_parent_id, true),
    ('Kumral', 'kumral', v_parent_id, true),
    ('Kızıl', 'kizil', v_parent_id, true),
    ('Siyah', 'siyah', v_parent_id, true),
    ('Boyalı / Renkli', 'boyali', v_parent_id, true)
    ON CONFLICT (slug) DO NOTHING;


    -- 2. GÖZ RENGİ
    SELECT id INTO v_parent_id FROM categories WHERE slug = 'goz-rengi';
    IF v_parent_id IS NULL THEN
        INSERT INTO categories (name, slug, is_active) VALUES ('Göz Rengi', 'goz-rengi', true) RETURNING id INTO v_parent_id;
    ELSE
        UPDATE categories SET name = 'Göz Rengi', is_active = true WHERE id = v_parent_id;
    END IF;

    INSERT INTO categories (name, slug, parent_id, is_active) VALUES 
    ('Mavi', 'mavi', v_parent_id, true),
    ('Yeşil', 'yesil', v_parent_id, true),
    ('Kahverengi', 'kahverengi', v_parent_id, true),
    ('Ela', 'ela', v_parent_id, true),
    ('Siyah', 'goz-siyah', v_parent_id, true)
    ON CONFLICT (slug) DO NOTHING;

    -- 3. UYRUK / KÖKEN
    SELECT id INTO v_parent_id FROM categories WHERE slug = 'uyruk';
    IF v_parent_id IS NULL THEN
        INSERT INTO categories (name, slug, is_active) VALUES ('Uyruk / Köken', 'uyruk', true) RETURNING id INTO v_parent_id;
    ELSE
         UPDATE categories SET name = 'Uyruk / Köken', is_active = true WHERE id = v_parent_id;
    END IF;

    INSERT INTO categories (name, slug, parent_id, is_active) VALUES 
    ('Türk', 'turk', v_parent_id, true),
    ('Rus', 'rus', v_parent_id, true),
    ('Ukrayna', 'ukrayna', v_parent_id, true),
    ('Azerbaycan', 'azerbaycan', v_parent_id, true),
    ('Latin', 'latin', v_parent_id, true),
    ('Avrupa', 'avrupa', v_parent_id, true),
    ('Asya', 'asya', v_parent_id, true),
    ('Afro', 'afro', v_parent_id, true),
    ('Arap', 'arap', v_parent_id, true)
    ON CONFLICT (slug) DO NOTHING;

    -- 4. VÜCUT TİPİ
    SELECT id INTO v_parent_id FROM categories WHERE slug = 'vucut-tipi';
    IF v_parent_id IS NULL THEN
        INSERT INTO categories (name, slug, is_active) VALUES ('Vücut Tipi', 'vucut-tipi', true) RETURNING id INTO v_parent_id;
    ELSE
        UPDATE categories SET name = 'Vücut Tipi', is_active = true WHERE id = v_parent_id;
    END IF;

    INSERT INTO categories (name, slug, parent_id, is_active) VALUES 
    ('Zayıf', 'zayif', v_parent_id, true),
    ('Fit / Sportif', 'fit', v_parent_id, true),
    ('Balık Etli', 'balik-etli', v_parent_id, true),
    ('Dolgun', 'dolgun', v_parent_id, true),
    ('Büyük Beden', 'buyuk-beden', v_parent_id, true)
    ON CONFLICT (slug) DO NOTHING;
    
    -- 5. HİZMETLER (Ana Kategori)
    SELECT id INTO v_parent_id FROM categories WHERE slug = 'hizmetler';
    IF v_parent_id IS NULL THEN
        INSERT INTO categories (name, slug, is_active) VALUES ('Hizmetler', 'hizmetler', true) RETURNING id INTO v_parent_id;
    ELSE
        UPDATE categories SET name = 'Hizmetler', is_active = true WHERE id = v_parent_id;
    END IF;
    
    INSERT INTO categories (name, slug, parent_id, is_active) VALUES 
    ('Eskort', 'eskort', v_parent_id, true),
    ('Masaj', 'masaj', v_parent_id, true),
    ('Dans / Show', 'dans', v_parent_id, true),
    ('Partner', 'partner', v_parent_id, true)
    ON CONFLICT (slug) DO NOTHING;

END $$;
