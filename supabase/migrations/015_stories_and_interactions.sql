-- ============================================
-- Stories, Comments and Statistics Migration
-- ============================================

-- 1. Stories Table
CREATE TABLE IF NOT EXISTS public.stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    model_id UUID NOT NULL REFERENCES public.independent_models(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type TEXT NOT NULL DEFAULT 'image', -- 'image' or 'video'
    caption TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '24 hours'),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for stories
CREATE INDEX IF NOT EXISTS idx_stories_model_id ON public.stories(model_id);
CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON public.stories(expires_at);

-- RLS for stories
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stories are viewable by everyone" ON public.stories FOR SELECT USING (is_active = true AND expires_at > NOW());
CREATE POLICY "Models can manage their own stories" ON public.stories FOR ALL USING (auth.uid() = model_id);

-- 2. Comments Table (If not already exists via other migrations)
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    parent_id UUID REFERENCES public.comments(id) ON DELETE CASCADE, -- For replies
    is_approved BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for comments
CREATE INDEX IF NOT EXISTS idx_comments_listing_id ON public.comments(listing_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON public.comments(parent_id);

-- RLS for comments
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Approved comments are viewable by everyone" ON public.comments FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can insert their own comments" ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Models can view all comments on their listings" ON public.comments FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.listings l 
        WHERE l.id = comments.listing_id 
        AND l.user_id = auth.uid()
    )
);
CREATE POLICY "Models can reply to comments on their listings" ON public.comments FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.listings l 
        WHERE l.id = listing_id 
        AND l.user_id = auth.uid()
    )
);

-- 3. Statistics Table (Views, Clicks)
CREATE TABLE IF NOT EXISTS public.listing_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES public.listings(id) ON DELETE CASCADE,
    view_count INTEGER DEFAULT 0,
    contact_count INTEGER DEFAULT 0, -- Clicks on WhatsApp/Phone
    favorite_count INTEGER DEFAULT 0,
    date DATE DEFAULT CURRENT_DATE,
    UNIQUE(listing_id, date)
);

-- Index for stats
CREATE INDEX IF NOT EXISTS idx_stats_listing_id ON public.listing_stats(listing_id);
CREATE INDEX IF NOT EXISTS idx_stats_date ON public.listing_stats(date);

-- RLS for stats
ALTER TABLE public.listing_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can increment stats" ON public.listing_stats FOR UPDATE USING (true);
CREATE POLICY "Models can view their own stats" ON public.listing_stats FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.listings l 
        WHERE l.id = listing_stats.listing_id 
        AND l.user_id = auth.uid()
    )
);

-- 4. Favorites / Likes
CREATE TABLE IF NOT EXISTS public.favorites (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    listing_id UUID REFERENCES public.listings(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, listing_id)
);

-- RLS for favorites
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own favorites" ON public.favorites FOR ALL USING (auth.uid() = user_id);
