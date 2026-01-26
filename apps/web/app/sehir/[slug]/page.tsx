import { createServerClient } from '@repo/lib';
import type { City, Listing } from '@repo/types';
import { Button } from '@repo/ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 3600;

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

async function getListings(city_id: string): Promise<Listing[]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('city_id', city_id)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching listings:', error);
        return [];
    }

    return data || [];
}

export async function generateMetadata({
    params
}: {
    params: { slug: string }
}): Promise<Metadata> {
    const city = await getCity(params.slug);

    if (!city) {
        return {
            title: 'Şehir Bulunamadı',
        };
    }

    return {
        title: city.seo_title || `${city.name} İlanları`,
        description: city.seo_description || `${city.name} şehrindeki tüm ilan ve profiller`,
    };
}

export default async function CityPage({
    params
}: {
    params: { slug: string }
}) {
    const city = await getCity(params.slug);

    if (!city) {
        notFound();
    }

    const listings = await getListings(city.id);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-12">
                <div className="container mx-auto px-4">
                    <nav className="text-sm mb-4 opacity-90">
                        <Link href="/" className="hover:underline">Ana Sayfa</Link>
                        {' / '}
                        <Link href="/sehir/istanbul" className="hover:underline">Şehirler</Link>
                        {' / '}
                        <span>{city.name}</span>
                    </nav>
                    <h1 className="text-4xl font-bold mb-2">
                        {city.name} İlanları
                    </h1>
                    <p className="text-lg opacity-90">
                        {listings.length} ilan bulundu
                    </p>
                </div>
            </section>

            {/* Listings Grid */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    {listings.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text- text-muted-foreground mb-6">
                                {city.name} için henüz ilan bulunmuyor.
                            </p>
                            <Button variant="outline" asChild>
                                <Link href="/">Ana Sayfaya Dön</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {listings.map((listing) => (
                                <Link
                                    key={listing.id}
                                    href={`/ilan/${listing.slug}`}
                                    className="group"
                                >
                                    <div className="bg-card rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden h-full">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors line-clamp-2">
                                                    {listing.title}
                                                </h3>
                                                {listing.is_featured && (
                                                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full shrink-0 ml-2">
                                                        Öne Çıkan
                                                    </span>
                                                )}
                                            </div>
                                            {listing.description && (
                                                <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                                                    {listing.description}
                                                </p>
                                            )}
                                            {listing.price && (
                                                <p className="text-lg font-bold text-primary">
                                                    {new Intl.NumberFormat('tr-TR', {
                                                        style: 'currency',
                                                        currency: 'TRY',
                                                    }).format(listing.price)}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-2">
                                                {new Date(listing.created_at).toLocaleDateString('tr-TR')}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
