-- Profil detayları ve resimler için gerekli güncellemeler
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS cover_image text,
ADD COLUMN IF NOT EXISTS details jsonb DEFAULT '{}';

-- Resim yükleme alanı (bucket) oluşturma
INSERT INTO storage.buckets (id, name, public) 
VALUES ('listings', 'listings', true)
ON CONFLICT (id) DO NOTHING;

-- Storage izinleri (Hata önlemek için önce silip sonra oluşturuyoruz)
-- Not: Eğer başka bucketlar için de aynı isimde policy varsa onları da etkileyebilir.
-- Bu yüzden policy isimlerini özelleştirdik.

DROP POLICY IF EXISTS "Listings Public Access" ON storage.objects;
CREATE POLICY "Listings Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'listings');

DROP POLICY IF EXISTS "Listings Auth Upload" ON storage.objects;
CREATE POLICY "Listings Auth Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'listings' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Listings Auth Update" ON storage.objects;
CREATE POLICY "Listings Auth Update" ON storage.objects FOR UPDATE USING (bucket_id = 'listings' AND auth.role() = 'authenticated');

-- Eğer önceki denemeden kalan "Public Access" policy'si hata veriyorsa, onu silmeye çalışmayalım (belki başka bucket içindir).
-- Sadece yeni (özelleştirilmiş) isimleri kullanıyoruz.
