import { createServerClient } from '@repo/lib/server';
import type { City, Listing, Category } from '@repo/types';
import { Button } from '@repo/ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MapPin, Calendar, Heart, ArrowRight, Tag } from 'lucide-react';
import { formatPrice } from '@repo/lib';
import { ProfileCard } from '../../components/ProfileCard';

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

    const listings = await getListings(city.id);

    return (
        <div className="min-h-screen bg-background">
            {/* Modern Hero Header */}
            <div className="relative bg-background text-foreground py-20 overflow-hidden border-b border-border">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1449824913929-de6321ac588b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10 dark:opacity-20 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 text-muted-foreground bg-muted/50 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6 border border-border">
                        <MapPin className="h-4 w-4" />
                        <Link href="/" className="hover:text-primary transition-colors">Ana Sayfa</Link>
                        <span className="opacity-50">/</span>
                        <span>{city.name}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight">
                        <span className="text-foreground">{city.name}</span> <span className="text-gold-gradient">Profilleri</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-light">
                        {listings.length > 0
                            ? `${city.name} bölgesinde ${listings.length} aktif ilan listeleniyor.`
                            : 'Bu bölgede henüz aktif ilan bulunmuyor.'}
                    </p>
                </div>
            </div>

            {/* Listings Section */}
            <section className="py-12 -mt-8 relative z-20">
                <div className="container mx-auto px-4">
                    {listings.length === 0 ? (
                        <div className="bg-card rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto border border-border">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                                <MapPin className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">{city.name} için Sonuç Yok</h3>
                            <p className="text-muted-foreground mb-8">
                                Bu şehirde henüz yayınlanmış bir profil ilanı bulunmuyor. Başka bir şehir deneyebilir veya daha sonra tekrar kontrol edebilirsiniz.
                            </p>
                            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 h-auto text-lg shadow-lg shadow-primary/20">
                                <Link href="/">Diğer Şehirleri Keşfet</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6">
                            {listings.map((listing) => (
                                <ProfileCard key={listing.id} listing={listing} isFeatured={listing.is_featured} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
