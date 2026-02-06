
import { createServerClient } from '@repo/lib/server';
import { ListingSection } from '../components/ListingSection';
import { Button } from '@repo/ui';
import Link from 'next/link';
import { ArrowLeft, MapPin, Globe } from 'lucide-react';
import type { Metadata } from 'next';

export const revalidate = 0;

export const metadata: Metadata = {
    title: 'Şehir Turları ve Gezici Escort İlanları | VeloraEscortWorld',
    description: 'Türkiye genelinde şehir turları yapan ve gezici olarak hizmet veren en seçkin modellerin güncel programlarını keşfedin.',
};

export default async function CityToursPage() {
    const supabase = createServerClient();

    // 1. Fetch "Şehir Turları" category
    const { data: category } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', 'sehir-turlari')
        .single();

    // 2. Fetch Listings for this category
    const listingsQuery = supabase
        .from('listings')
        .select('*, city:cities(*), category:categories(*), model_pricing(*)')
        .eq('category_id', category?.id)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

    // 3. Fetch Dependencies
    const [listingsRes, citiesRes, categoriesRes, adsRes] = await Promise.all([
        listingsQuery,
        supabase.from('cities').select('*').eq('is_active', true).order('name'),
        supabase.from('categories').select('*').eq('is_active', true).is('parent_id', null).order('order'),
        supabase.from('banners').select('*').eq('is_active', true).order('order', { ascending: true }),
    ]);

    const listings = listingsRes.data || [];
    const ads = adsRes.data || [];
    const leftAds = ads.filter((a: any) => a.position === 'left');
    const rightAds = ads.filter((a: any) => a.position === 'right');

    return (
        <div className="min-h-screen bg-white dark:bg-black">
            {/* Header */}
            <div className="bg-gray-50 dark:bg-[#050505] text-gray-900 dark:text-white py-12 border-b border-gray-100 dark:border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-gold-gradient opacity-5 blur-[100px]" />
                <div className="container mx-auto px-4 relative z-10">
                    <div className="flex items-center gap-4 mb-4">
                        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-primary/80 dark:text-white/50 dark:hover:text-white p-0 h-auto">
                            <Link href="/">
                                <ArrowLeft className="w-4 h-4 mr-1" /> Ana Sayfa
                            </Link>
                        </Button>
                    </div>
                    <div className="max-w-3xl">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-2xl bg-gold-gradient flex items-center justify-center shadow-lg shadow-primary/20">
                                <Globe className="w-6 h-6 text-black" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-primary dark:text-white">
                                ŞEHİR <span className="text-primary text-gold-gradient bg-clip-text text-transparent">TURLARI</span>
                            </h1>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 text-lg font-medium leading-relaxed mb-8">
                            Türkiye'nin en seçkin bağımsız modellerinin güncel gezi ve tur programlarını buradan takip edebilirsiniz. Şehrinize gelecek olan profesyonellerle hemen iletişime geçin.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
                                <MapPin className="w-5 h-5 text-primary" />
                                <span className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">{citiesRes.data?.length || 0} ŞEHİR AKTİF</span>
                            </div>
                            <div className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
                                <Globe className="w-5 h-5 text-primary" />
                                <span className="text-xs font-black uppercase tracking-widest text-gray-900 dark:text-white">{listings.length} TUR İLANI</span>
                            </div>
                        </div>
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

            {/* Tour Info Section */}
            <div className="bg-gray-50 dark:bg-[#050505] py-20 border-t border-gray-100 dark:border-white/10">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl">
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-8 flex items-center gap-4">
                            <div className="w-2 h-8 bg-gold-gradient" />
                            Şehir Turları Hakkında Bilgilendirme
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <h3 className="text-primary font-black uppercase tracking-widest text-sm">Tur Programları Nasıl Takip Edilir?</h3>
                                <p className="text-gray-600 dark:text-gray-500 font-medium leading-relaxed italic">
                                    Modellerimiz genellikle belirli tarihler arasında farklı şehirleri ziyaret etmektedir. İlan detaylarında yer alan tur tarihlerini ve konaklama bölgelerini inceleyerek randevu oluşturabilirsiniz.
                                </p>
                            </div>
                            <div className="space-y-6">
                                <h3 className="text-primary font-black uppercase tracking-widest text-sm">Rezervasyon ve İletişim</h3>
                                <p className="text-gray-600 dark:text-gray-500 font-medium leading-relaxed italic">
                                    Tur dönemlerinde modellerin takvimi oldukça yoğun olabilmektedir. Bu nedenle, ilginizi çeken model ile tur başlangıcından önce iletişime geçmeniz tavsiye edilir.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
