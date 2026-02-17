-- ================================================================
-- 028_segregate_agency_listing_data.sql
-- ================================================================
-- Bu migration, ajans modellerinin (listings) verilerini ayrıştırmak için:
-- 1. stories tablosuna listing_id ekler.
-- 2. RLS politikalarını listing_id üzerinden günceller.
-- ================================================================

-- 1. Stories tablosunu güncelle
ALTER TABLE public.stories 
ADD COLUMN IF NOT EXISTS listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE;

-- Mevcut stories verilerini (bağımsız modeller için) eşleştirmeye çalış 
-- (Bağımsız modellerde auth.uid() = user_id = model_id = listings.user_id)
UPDATE public.stories s
SET listing_id = (SELECT id FROM public.listings l WHERE l.user_id = s.model_id LIMIT 1)
WHERE listing_id IS NULL;

-- 2. Stories RLS politikalarını güncelle
-- Önce eski politikaları temizle
DROP POLICY IF EXISTS "Stories are viewable by everyone" ON public.stories;
DROP POLICY IF EXISTS "Models can manage their own stories" ON public.stories;

-- Yeni politikalar
CREATE POLICY "Stories are viewable by everyone" 
    ON public.stories FOR SELECT 
    USING (is_active = true AND expires_at > NOW());

CREATE POLICY "Users can manage stories for their own listings" 
    ON public.stories FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.listings l 
            WHERE l.id = stories.listing_id 
            AND l.user_id = auth.uid()
        )
    );

-- Index ekle
CREATE INDEX IF NOT EXISTS idx_stories_listing_id ON public.stories(listing_id);

DO $$ BEGIN RAISE NOTICE '028_segregate_agency_listing_data migration completed.'; END $$;
