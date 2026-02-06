-- Seeding main navigation categories with SEO content
DO $$
DECLARE
    v_parent_id uuid;
BEGIN
    -- Ensure Top Level categories exist or update them
    
    -- 1. TRANS & TRANSSEKSÜEL
    INSERT INTO categories (name, slug, is_active, seo_title, seo_description)
    VALUES (
        'Trans & Transseksüel', 
        'trans', 
        true, 
        'En İyi Trans ve Transseksüel İlanları | VeloraEscortWorld', 
        'Türkiye genelindeki en seçkin trans ve transseksüel modellerin güncel ilanlarına ulaşın. Güvenilir ve kaliteli hizmet için doğru adres.'
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        seo_title = EXCLUDED.seo_title,
        seo_description = EXCLUDED.seo_description;

    -- 2. BAĞIMSIZ
    INSERT INTO categories (name, slug, is_active, seo_title, seo_description)
    VALUES (
        'Bağımsız', 
        'bagimsiz', 
        true, 
        'Bağımsız Escort İlanları | VeloraEscortWorld', 
        'Herhangi bir ajansa bağlı olmayan, bağımsız çalışan profesyonel modellerin en güncel ilanlarını keşfedin.'
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        seo_title = EXCLUDED.seo_title,
        seo_description = EXCLUDED.seo_description;

    -- 3. PORNO YILDIZLARI
    INSERT INTO categories (name, slug, is_active, seo_title, seo_description)
    VALUES (
        'Porno Yıldızları', 
        'porn-star', 
        true, 
        'Porno Yıldızı Escort İlanları | VeloraEscortWorld', 
        'Sektörün tanınmış isimleri ve porno yıldızlarının özel ilanlarına VeloraEscortWorld farkıyla ulaşın.'
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        seo_title = EXCLUDED.seo_title,
        seo_description = EXCLUDED.seo_description;

    -- 4. DOMİNATRİX
    INSERT INTO categories (name, slug, is_active, seo_title, seo_description)
    VALUES (
        'Dominatrix', 
        'dominatrix', 
        true, 
        'Dominatrix ve BDSM İlanları | VeloraEscortWorld', 
        'Özel fantezileriniz ve BDSM deneyimleriniz için en profesyonel dominatrix ilanları burada.'
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        seo_title = EXCLUDED.seo_title,
        seo_description = EXCLUDED.seo_description;

    -- 5. ŞEHİR TURLARI (Kategori olarak da kalsın)
    INSERT INTO categories (name, slug, is_active, seo_title, seo_description)
    VALUES (
        'Şehir Turları', 
        'sehir-turlari', 
        true, 
        'Güncel Şehir Turları ve Gezici Escort İlanları', 
        'Şu anda şehrinizde bulunan veya yakında gelecek olan gezici modellerin tur programlarını takip edin.'
    )
    ON CONFLICT (slug) DO UPDATE SET
        name = EXCLUDED.name,
        seo_title = EXCLUDED.seo_title,
        seo_description = EXCLUDED.seo_description;

END $$;
