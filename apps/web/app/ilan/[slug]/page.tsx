import { createServerClient } from '@repo/lib/server';
import type { Listing, City, Category } from '@repo/types';
import { Button } from '@repo/ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 3600;

async function getListing(slug: string): Promise<Listing | null> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error || !data) return null;
    return data;
}

async function getCity(id: string): Promise<City | null> {
    const supabase = createServerClient();
    const { data } = await supabase
        .from('cities')
        .select('*')
        .eq('id', id)
        .single();
    return data;
}

async function getCategory(id: string): Promise<Category | null> {
    const supabase = createServerClient();
    const { data } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single();
    return data;
}

export async function generateMetadata({
    params
}: {
    params: { slug: string }
}): Promise<Metadata> {
    const listing = await getListing(params.slug);

    if (!listing) {
        return {
            title: 'İlan Bulunamadı',
        };
    }

    return {
        title: listing.title,
        description: listing.description || `${listing.title} - Detaylı bilgi ve iletişim`,
        openGraph: {
            title: listing.title,
            description: listing.description || '',
            type: 'article',
        },
    };
}

export default async function ListingPage({
    params
}: {
    params: { slug: string }
}) {
    const listing = await getListing(params.slug);

    if (!listing) {
        notFound();
    }

    const [city, category] = await Promise.all([
        getCity(listing.city_id),
        getCategory(listing.category_id),
    ]);

    return (
        <div className="min-h-screen">
            {/* Header */}
            <section className="bg-muted/20 py-8">
                <div className="container mx-auto px-4">
                    <nav className="text-sm mb-4 text-muted-foreground">
                        <Link href="/" className="hover:underline hover:text-foreground">Ana Sayfa</Link>
                        {' / '}
                        {city && (
                            <>
                                <Link href={`/sehir/${city.slug}`} className="hover:underline hover:text-foreground">
                                    {city.name}
                                </Link>
                                {' / '}
                            </>
                        )}
                        {category && (
                            <>
                                <Link href={`/kategori/${category.slug}`} className="hover:underline hover:text-foreground">
                                    {category.name}
                                </Link>
                                {' / '}
                            </>
                        )}
                        <span className="text-foreground">{listing.title}</span>
                    </nav>
                </div>
            </section>

            {/* Main Content */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        {/* Title */}
                        <div className="mb-8">
                            <div className="flex items-start justify-between mb-4">
                                <h1 className="text-4xl font-bold">{listing.title}</h1>
                                {listing.is_featured && (
                                    <span className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full">
                                        Öne Çıkan
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                {city && (
                                    <Link href={`/sehir/${city.slug}`} className="hover:text-primary">
                                        📍 {city.name}
                                    </Link>
                                )}
                                {category && (
                                    <Link href={`/kategori/${category.slug}`} className="hover:text-primary">
                                        🏷️ {category.name}
                                    </Link>
                                )}
                                <span>
                                    📅 {new Date(listing.created_at).toLocaleDateString('tr-TR', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                                </span>
                            </div>
                        </div>

                        {/* Price */}
                        {listing.price && (
                            <div className="bg-primary/10 rounded-lg p-6 mb-8">
                                <p className="text-sm text-muted-foreground mb-1">Fiyat</p>
                                <p className="text-3xl font-bold text-primary">
                                    {new Intl.NumberFormat('tr-TR', {
                                        style: 'currency',
                                        currency: 'TRY',
                                    }).format(listing.price)}
                                </p>
                            </div>
                        )}

                        {/* Description */}
                        {listing.description && (
                            <div className="bg-card rounded-lg p-8 shadow-sm mb-8">
                                <h2 className="text-2xl font-bold mb-4">Açıklama</h2>
                                <div className="prose prose-neutral max-w-none">
                                    <p className="whitespace-pre-line text-muted-foreground leading-relaxed">
                                        {listing.description}
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Contact CTA */}
                        <div className="bg-muted/50 rounded-lg p-8 text-center">
                            <h3 className="text-xl font-bold mb-4">
                                İlgilendiniz mi?
                            </h3>
                            <p className="text-muted-foreground mb-6">
                                Detaylı bilgi için iletişime geçin
                            </p>
                            <Button size="lg">
                                İletişime Geç
                            </Button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Similar Listings Section (Placeholder) */}
            <section className="py-12 bg-muted/20">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-2xl font-bold mb-6">Benzer İlanlar</h2>
                        <p className="text-muted-foreground">
                            Yakında eklenecek...
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
