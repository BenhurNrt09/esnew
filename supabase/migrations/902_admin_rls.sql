-- ================================================================
-- ADMIN GÖRÜNTÜLEME YETKİLERİ (RLS)
-- ================================================================
-- Bu script, admin kullanıcısının diğer kullanıcıların (üye, model, ajans)
-- bilgilerini (email vb.) görüntüleyebilmesini sağlar.
-- ================================================================

-- 1. Members
CREATE POLICY "Admins can view all members"
    ON public.members FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- 2. Independent Models
CREATE POLICY "Admins can view all models"
    ON public.independent_models FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );

-- 3. Agencies
CREATE POLICY "Admins can view all agencies"
    ON public.agencies FOR SELECT
    USING (
        EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
    );
