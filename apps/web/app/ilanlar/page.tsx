
import { createServerClient } from '@repo/lib/server';
import { ListingSection } from '../components/ListingSection';
import { Button } from '@repo/ui';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 0;

export default async function IlanlarPage({
    searchParams,
}: {
    searchParams: { vitrin?: string; yeni?: string; filter?: string; category?: string };
}) {
    const supabase = createServerClient();
    const isVitrinOnly = searchParams.vitrin === 'true';
    const isYeniOnly = searchParams.yeni === 'true';
    const categorySlug = searchParams.category;

    // 1. Base Query for Listings
    let query = supabase
        .from('listings')
        .select(`
            *,
            city:cities(id, name, slug),
            category:categories(id, name, slug),
            model_pricing(*)
        `)
        .eq('is_active', true);

    // Apply Filters
    if (isVitrinOnly) {
        query = query.eq('is_featured', true);
    }

    // Category Filter (Server-side)
    if (categorySlug) {
        // We need category ID, but we only have slug. 
        // Ideally we join or subquery, but Supabase simple client might need a separate fetch or join filter.
        // Simple approach: Fetch category first.
        const { data: cat } = await supabase.from('categories').select('id').eq('slug', categorySlug).single();
        if (cat) {
            query = query.eq('category_id', cat.id);
        }
    }

    query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });

    // 2. Fetch Dependencies (Cities, Categories, Ads)
    const [listingsRes, citiesRes, categoriesRes, adsRes] = await Promise.all([
        query,
        supabase.from('cities').select('*').eq('is_active', true).order('name').limit(81),
        supabase.from('categories').select('*').eq('is_active', true).is('parent_id', null).order('order'),
        supabase.from('banners').select('*').eq('is_active', true).order('order', { ascending: true }),
    ]);

    const listings = listingsRes.data || [];
    const ads = adsRes.data || [];
    const leftAds = ads.filter((a: any) => a.position === 'left');
    const rightAds = ads.filter((a: any) => a.position === 'right');

    const title = isVitrinOnly ? 'Vitrin Profiller' : (categorySlug ? 'Kategori İlanları' : 'Tüm İlanlar');

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            {/* Minimal Header for SEO/Context */}
            <div className="bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white py-8 border-b border-gray-100 dark:border-white/10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-2">
                        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80 dark:text-white/50 dark:hover:text-white p-0 h-auto">
                            <Link href="/">
                                <ArrowLeft className="w-4 h-4 mr-1" /> Ana Sayfa
                            </Link>
                        </Button>
                    </div>
                    <h1 className="text-3xl font-black uppercase tracking-tight">
                        <span className="text-primary">{title}</span>
                    </h1>
                </div>
            </div>

            <ListingSection
                cities={citiesRes.data || []}
                listings={listings}
                categories={categoriesRes.data || []}
                leftAds={leftAds}
                rightAds={rightAds}
                hideCategories={true}
            />
        </div>
    );
}
