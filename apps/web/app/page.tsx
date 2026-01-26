import { createServerClient } from '@repo/lib/server';
import type { City, Listing } from '@repo/types';
import { Button } from '@repo/ui';
import Link from 'next/link';

export const revalidate = 3600; // Revalidate every hour

async function getCities(): Promise<City[]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('cities')
        .select('*')
        .eq('is_active', true)
        .order('name');

    if (error) {
        console.error('Error fetching cities:', error);
        return [];
    }

    return data || [];
}

async function getFeaturedListings(): Promise<Listing[]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('is_active', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false })
        .limit(6);

    if (error) {
        console.error('Error fetching featured listings:', error);
        return [];
    }

    return data || [];
}

export default async function HomePage() {
    const [cities, featuredListings] = await Promise.all([
        getCities(),
        getFeaturedListings(),
    ]);

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20">
                <div className="container mx-auto px-4">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Türkiye'nin En Kapsamlı İlan Platformu
                        </h1>
                        <p className="text-xl md:text-2xl mb-8 opacity-90">
                            Aradığınız hizmet ve profilleri kolayca bulun
                        </p>
                    </div>
                </div>
            </section>

            {/* Cities Section */}
            <section className="py-16 bg-muted/20">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Şehir Seçin
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {cities.map((city) => (
                            <Link
                                key={city.id}
                                href={`/sehir/${city.slug}`}
                                className="p-6 bg-card hover:bg-accent rounded-lg shadow-sm hover:shadow-md transition-all text-center"
                            >
                                <h3 className="font-semibold text-lg">{city.name}</h3>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Listings */}
            {featuredListings.length > 0 && (
                <section className="py-16">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold text-center mb-12">
                            Öne Çıkan İlanlar
                        </h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredListings.map((listing) => (
                                <Link
                                    key={listing.id}
                                    href={`/ilan/${listing.slug}`}
                                    className="group"
                                >
                                    <div className="bg-card rounded-lg shadow-sm hover:shadow-lg transition-all overflow-hidden">
                                        <div className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                                                    {listing.title}
                                                </h3>
                                                {listing.is_featured && (
                                                    <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                                                        Öne Çıkan
                                                    </span>
                                                )}
                                            </div>
                                            {listing.description && (
                                                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
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
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Section */}
            <section className="py-16 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">
                        Hemen Aramaya Başlayın
                    </h2>
                    <p className="text-lg mb-8 opacity-90">
                        Binlerce ilan arasından size en uygun olanı bulun
                    </p>
                    <Button
                        size="lg"
                        variant="secondary"
                        asChild
                    >
                        <Link href="/kategori/hizmetler">
                            İlanları Görüntüle
                        </Link>
                    </Button>
                </div>
            </section>
        </div>
    );
}
