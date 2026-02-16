import { createServerClient } from '@repo/lib/server';
import { ListingSection } from '../components/ListingSection';
import { Button } from '@repo/ui';
import Link from 'next/link';
import { ArrowLeft, MapPin, Globe, Sparkles } from 'lucide-react';
import type { Metadata } from 'next';
import { StorySection } from '../components/StorySection';
import { SubNavigation } from '../components/SubNavigation';

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
        <div className="min-h-screen bg-black">
            {/* Premium Header */}
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
                                <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Özel Kategori</span>
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                                ŞEHİR <span className="text-primary italic">TURLARI</span>
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

            {/* Tour Info Section (SEO) */}
            <div className="bg-zinc-950 py-24 border-t border-white/5 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] rounded-full" />
                <div className="container max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-2 h-10 bg-gold-gradient rounded-full shadow-[0_0_20px_rgba(212,175,55,0.3)]" />
                            <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
                                ŞEHİR TURLARI <span className="text-zinc-500 italic">BİLGİ</span>
                            </h2>
                        </div>
                        <div className="bg-zinc-900/30 border border-white/5 p-12 rounded-[3.5rem] relative overflow-hidden group shadow-2xl backdrop-blur-sm">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[80px] group-hover:bg-primary/10 transition-all duration-700" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                                <div className="space-y-6">
                                    <h3 className="text-primary font-black uppercase tracking-widest text-xs">Tur Programları Nasıl Takip Edilir?</h3>
                                    <p className="text-zinc-400 text-lg font-medium leading-relaxed italic">
                                        Modellerimiz genellikle belirli tarihler arasında farklı şehirleri ziyaret etmektedir. İlan detaylarında yer alan tur tarihlerini ve konaklama bölgelerini inceleyerek randevu oluşturabilirsiniz.
                                    </p>
                                </div>
                                <div className="space-y-6">
                                    <h3 className="text-primary font-black uppercase tracking-widest text-xs">Rezervasyon ve İletişim</h3>
                                    <p className="text-zinc-400 text-lg font-medium leading-relaxed italic">
                                        Tur dönemlerinde modellerin takvimi oldukça yoğun olabilmektedir. Bu nedenle, ilginizi çeken model ile tur başlangıcından önce iletişime geçmeniz tavsiye edilir.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
