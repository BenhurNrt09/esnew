import { createServerClient } from '@repo/lib/server';
import { HomePageContent } from './components/HomePageContent';

export const revalidate = 0; // Her zaman güncel kalsın

async function getData() {
    const supabase = createServerClient();

    const [citiesRes, featuredRes, latestRes, categoriesRes, adsRes] = await Promise.all([
        supabase.from('cities').select('*').eq('is_active', true).order('name').limit(81),
        // Premium and VIP listings for the top section (if desired, or just use unified sorting)
        supabase.from('listings')
            .select('*, city:cities(*), category:categories(*), model_pricing(*)')
            .eq('is_active', true)
            .order('is_premium', { ascending: false })
            .order('is_vip', { ascending: false })
            .order('is_featured', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(12),
        // Latest listings (non-premium/vip/featured)
        supabase.from('listings')
            .select('*, city:cities(*), category:categories(*), model_pricing(*)')
            .eq('is_active', true)
            .eq('is_premium', false)
            .eq('is_vip', false)
            .eq('is_featured', false)
            .order('created_at', { ascending: false })
            .limit(12),
        supabase.from('categories').select('*').eq('is_active', true).is('parent_id', null).order('order'),
        supabase.from('banners').select('*').eq('is_active', true).order('order', { ascending: true }),
    ]);

    return {
        cities: citiesRes.data || [],
        featuredListings: featuredRes.data || [],
        latestListings: latestRes.data || [],
        categories: categoriesRes.data || [],
        ads: adsRes.data || [],
    };
}

export default async function HomePage() {
    const data = await getData();

    return <HomePageContent {...data} />;
}
