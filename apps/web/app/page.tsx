import { createServerClient } from '@repo/lib/server';
import { HomePageContent } from './components/HomePageContent';

export const revalidate = 0; // Her zaman güncel kalsın

async function getData() {
    const supabase = createServerClient();

    const [citiesRes, premiumRes, vipRes, normalRes, categoriesRes, adsRes] = await Promise.all([
        supabase.from('cities').select('*').eq('is_active', true).order('name').limit(81),
        // Premium listings
        supabase.from('listings')
            .select('*, city:cities(*), category:categories(*), model_pricing(*)')
            .eq('is_active', true)
            .eq('is_premium', true)
            .order('created_at', { ascending: false })
            .limit(20),
        // VIP listings (treat featured as VIP if not premium)
        supabase.from('listings')
            .select('*, city:cities(*), category:categories(*), model_pricing(*)')
            .eq('is_active', true)
            .eq('is_premium', false)
            .or('is_vip.eq.true,is_featured.eq.true')
            .order('created_at', { ascending: false })
            .limit(20),
        // Normal listings
        supabase.from('listings')
            .select('*, city:cities(*), category:categories(*), model_pricing(*)')
            .eq('is_active', true)
            .eq('is_premium', false)
            .eq('is_vip', false)
            .eq('is_featured', false)
            .order('created_at', { ascending: false })
            .limit(20),
        supabase.from('categories').select('*').eq('is_active', true).is('parent_id', null).order('order'),
        supabase.from('banners').select('*').eq('is_active', true).order('order', { ascending: true }),
    ]);

    return {
        cities: citiesRes.data || [],
        premiumListings: premiumRes.data || [],
        vipListings: vipRes.data || [],
        normalListings: normalRes.data || [],
        categories: categoriesRes.data || [],
        ads: adsRes.data || [],
    };
}

export default async function HomePage() {
    const data = await getData();

    return <HomePageContent {...data} />;
}
