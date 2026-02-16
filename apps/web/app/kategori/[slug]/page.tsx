
import { createServerClient } from '@repo/lib/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ListingSection } from '../../components/ListingSection';
import { StorySection } from '../../components/StorySection';
import { SubNavigation } from '../../components/SubNavigation';
import { Button } from '@repo/ui';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const revalidate = 0;

async function getCategory(slug: string) {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error || !data) return null;
    return data;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const category = await getCategory(params.slug);
    if (!category) return { title: 'Kategori Bulunamadı' };
    return {
        title: category.seo_title || `${category.name} İlanları`,
        description: category.seo_description || `${category.name} kategorisindeki tüm ilanlar`,
    };
}

export default async function CategoryPage({ params }: { params: { slug: string } }) {
    const supabase = createServerClient();
    const category = await getCategory(params.slug);
    if (!category) notFound();

    // 1. Fetch Listings
    const listingsQuery = supabase
        .from('listings')
        .select('*, city:cities(*), category:categories(*), model_pricing(*)')
        .eq('category_id', category.id)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

    // 2. Fetch Dependencies
    const [listingsRes, citiesRes, categoriesRes, adsRes] = await Promise.all([
        listingsQuery,
        supabase.from('cities').select('*').eq('is_active', true).order('name').limit(81),
        supabase.from('categories').select('*').eq('is_active', true).is('parent_id', null).order('order'),
        supabase.from('banners').select('*').eq('is_active', true).order('order', { ascending: true }),
    ]);

    const listings = listingsRes.data || [];
    const ads = adsRes.data || [];
    const leftAds = ads.filter((a: any) => a.position === 'left');
    const rightAds = ads.filter((a: any) => a.position === 'right');

    return (
        <div className="min-h-screen bg-black">
            {/* Premium Category Header */}
            <div className="bg-black/50 backdrop-blur-md text-white py-12 border-b border-white/5 relative overflow-hidden">
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
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Kategori</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                                {category.name} <span className="text-primary italic">İlanları</span>
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
            <StorySection listings={listings.filter(l => l.is_premium || l.is_vip)} />

            <ListingSection
                cities={citiesRes.data || []}
                listings={listings}
                categories={categoriesRes.data || []}
                leftAds={leftAds}
                rightAds={rightAds}
                hideCategories={true}
            />

            {/* Premium SEO Section */}
            <div className="bg-zinc-950 py-24 border-t border-white/5 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
                <div className="container max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-2 h-10 bg-gold-gradient rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)]" />
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                                {category.name} <span className="text-zinc-500 italic">Hakkında</span>
                            </h2>
                        </div>
                        <div className="bg-zinc-900/30 border border-white/5 p-12 rounded-[3.5rem] relative overflow-hidden group shadow-2xl backdrop-blur-sm">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-all duration-700" />
                            <p className="text-zinc-400 text-lg md:text-xl font-medium leading-relaxed italic relative z-10">
                                {category.seo_description || `${category.name} kategorisinde hayalinizdeki deneyimi yaşatacak en seçkin ve profesyonel modellerin ilanlarını bulabilirsiniz. VeloraEscortWorld güvencesiyle en kaliteli hizmete ulaşın.`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
