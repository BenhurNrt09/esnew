import { createServerClient } from '@repo/lib/server';
import type { City, Listing, Category } from '@repo/types';
import { Button } from '@repo/ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MapPin, Calendar, Heart, ArrowRight, Tag } from 'lucide-react';
import { formatPrice } from '@repo/lib';
import { ProfileCard } from '../../components/ProfileCard';
import { ListingSection } from '../../components/ListingSection';
import { StorySection } from '../../components/StorySection';
import { SubNavigation } from '../../components/SubNavigation';

export const revalidate = 0;

async function getCity(slug: string): Promise<City | null> {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error || !data) return null;
    return data;
}

async function getListings(city_id: string): Promise<any[]> {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('listings')
        .select('*, city:cities(*), category:categories(*), model_pricing(*), listing_stats(view_count, contact_count)')
        .eq('city_id', city_id)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const city = await getCity(params.slug);
    if (!city) return { title: 'Şehir Bulunamadı' };
    return {
        title: city.seo_title || `${city.name} İlanları`,
        description: city.seo_description || `${city.name} şehrindeki tüm ilan ve profiller`,
    };
}

export default async function CityPage({ params }: { params: { slug: string } }) {
    const city = await getCity(params.slug);
    if (!city) notFound();

    const supabase = createServerClient(); // Initialize supabase here for new fetches
    const listings = await getListings(city.id);

    // 2. Fetch Dependencies
    const [citiesRes, categoriesRes, adsRes] = await Promise.all([
        supabase.from('cities').select('*').eq('is_active', true).order('name').limit(81),
        supabase.from('categories').select('*').eq('is_active', true).is('parent_id', null).order('order'),
        supabase.from('banners').select('*').eq('is_active', true).order('order', { ascending: true }),
    ]);

    const ads = adsRes.data || [];
    const leftAds = ads.filter((a: any) => a.position === 'left');
    const rightAds = ads.filter((a: any) => a.position === 'right');

    return (
        <div className="min-h-screen bg-black">
            {/* Premium City Hero Header */}
            <div className="relative bg-zinc-950 text-white py-24 md:py-32 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449824913929-de6321ac588b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10 mix-blend-soft-light" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,_rgba(212,175,55,0.05)_0%,_transparent_50%)]" />

                <div className="container max-w-[1400px] mx-auto px-4 md:px-8 relative z-10 text-center space-y-8">
                    <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 bg-white/5 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
                        <span className="opacity-30">/</span>
                        <span className="text-white">{city.name}</span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black mb-6 tracking-tighter uppercase">
                        <span className="text-white">{city.name}</span> <span className="text-primary italic">Profilleri</span>
                    </h1>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <div className="flex items-center gap-4 bg-black/40 backdrop-blur-xl px-10 py-5 rounded-[2rem] border border-white/5 shadow-2xl">
                            <div className="text-left">
                                <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">Toplam</div>
                                <div className="text-3xl font-black text-primary leading-none mt-2">{listings.length}</div>
                            </div>
                            <div className="h-10 w-px bg-white/10" />
                            <div className="text-zinc-400 font-bold text-[11px] max-w-[120px] leading-tight text-left uppercase tracking-wider">
                                {city.name} Bölgesinde Aktif İlan
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub-Navigation Menu */}
            <SubNavigation />

            {/* Story Circle Section */}
            <StorySection listings={listings.filter(l => l.is_premium || l.is_vip)} />

            {/* Common ListingSection for city page */}
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
