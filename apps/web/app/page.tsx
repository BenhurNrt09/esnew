import { createServerClient } from '@repo/lib/server';
import { HomePageContent } from './components/HomePageContent';

export const revalidate = 0; // Her zaman güncel kalsın

async function getData() {
    const supabase = createServerClient();

    const [citiesRes, featuredRes, latestRes, categoriesRes, adsRes] = await Promise.all([
        supabase.from('cities').select('*').eq('is_active', true).order('name').limit(81),
        supabase.from('listings').select('*, city:cities(*), category:categories(*), model_pricing(*)').eq('is_active', true).eq('is_featured', true).order('created_at', { ascending: false }).limit(8),
        supabase.from('listings').select('*, city:cities(*), category:categories(*), model_pricing(*)').eq('is_active', true).eq('is_featured', false).order('created_at', { ascending: false }).limit(8),
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
