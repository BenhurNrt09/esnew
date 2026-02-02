-- ============================================
-- Notifications and Real-time Support
-- ============================================

-- 1. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'system', 'message', 'view', 'comment', 'story'
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for notifications
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- RLS for notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- 2. Trigger for View Notifications (Example)
-- This is a placeholder for actual view tracking logic if implemented via database
CREATE OR REPLACE FUNCTION notify_on_profile_view()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.notifications (user_id, type, title, message, link)
    VALUES (NEW.user_id, 'view', 'Profil Görüntüleme', 'Bir kullanıcı profilinizi görüntüledi.', '/dashboard/stats');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Enable Realtime for specific tables
-- Note: This requires high-level permissions, usually set via Supabase Dashboard if this fails.
-- But we can try to add tables to the publication.
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications, public.listings, public.stories, public.comments;
    ELSE
        CREATE PUBLICATION supabase_realtime FOR TABLE public.notifications, public.listings, public.stories, public.comments;
    END IF;
END $$;
