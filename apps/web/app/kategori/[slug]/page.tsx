
import { createServerClient } from '@repo/lib/server';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ListingSection } from '../../components/ListingSection';
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
        <div className="min-h-screen bg-white dark:bg-black">
            {/* Minimal Category Header */}
            <div className="bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white py-8 border-b border-gray-100 dark:border-white/10">
                <div className="container mx-auto px-4">
                    <div className="flex items-center gap-4 mb-2">
                        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80 dark:text-white/50 dark:hover:text-white p-0 h-auto">
                            <Link href="/">
                                <ArrowLeft className="w-4 h-4 mr-1" /> Ana Sayfa
                            </Link>
                        </Button>
                    </div>
                    <div className="flex items-end gap-4">
                        <h1 className="text-3xl font-black uppercase tracking-tight text-primary">
                            {category.name}
                        </h1>
                        <span className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-1.5 border-l border-gray-200 dark:border-gray-700 pl-4">
                            {listings.length} İlan bulundu
                        </span>
                    </div>
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

            {/* SEO Description Section */}
            <div className="bg-gray-50 dark:bg-[#050505] py-20 border-t border-gray-100 dark:border-white/10">
                <div className="container mx-auto px-6">
                    <div className="max-w-4xl">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-8 flex items-center gap-4">
                            <div className="w-2 h-8 bg-gold-gradient" />
                            {category.name} Hakkında
                        </h2>
                        <div className="bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 p-10 rounded-[2.5rem] relative overflow-hidden group shadow-sm dark:shadow-none">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-all duration-700" />
                            <p className="text-gray-600 dark:text-gray-400 text-lg font-medium leading-loose italic relative z-10">
                                {category.seo_description || `${category.name} kategorisinde hayalinizdeki deneyimi yaşatacak en seçkin ve profesyonel modellerin ilanlarını bulabilirsiniz. VeloraEscortWorld güvencesiyle en kaliteli hizmete ulaşın.`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
