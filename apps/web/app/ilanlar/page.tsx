
import { createServerClient } from '@repo/lib/server';
import { ListingSection } from '../components/ListingSection';
import { StorySection } from '../components/StorySection';
import { SubNavigation } from '../components/SubNavigation';
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
        <div className="min-h-screen bg-black">
            {/* Premium Category Header (Minimal for Search) */}
            <div className="bg-zinc-950/80 backdrop-blur-xl text-white py-12 border-b border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gold-gradient opacity-5 blur-[100px]" />
                <div className="container max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <Button variant="ghost" size="sm" asChild className="text-zinc-500 hover:text-primary p-0 h-auto uppercase text-[10px] font-black tracking-widest">
                            <Link href="/">
                                <ArrowLeft className="w-4 h-4 mr-2" /> Ana Sayfa
                            </Link>
                        </Button>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3 mb-1">
                                <div className="w-1.5 h-6 bg-gold-gradient rounded-full" />
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Liste</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                                {isVitrinOnly ? 'Vitrin' : (categorySlug ? 'Kategori' : 'Tüm')} <span className="text-primary italic">İlanlar</span>
                            </h1>
                        </div>
                        <div className="flex items-center gap-4 bg-zinc-900/50 px-6 py-3 rounded-2xl border border-white/5 backdrop-blur-sm">
                            <div className="text-right">
                                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Toplam</div>
                                <div className="text-xl font-black text-primary leading-none mt-1">{listings.length}</div>
                            </div>
                            <div className="h-8 w-px bg-white/5" />
                            <div className="text-zinc-400 font-bold text-[10px] uppercase tracking-wider">Aktif İlan</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub-Navigation Menu */}
            <SubNavigation />

            {/* Story Circle Section */}
            <StorySection listings={listings.filter((l: any) => l.is_premium || l.is_vip)} />

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
