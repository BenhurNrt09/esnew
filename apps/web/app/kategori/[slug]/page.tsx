import { createServerClient } from '@repo/lib/server';
import type { Category, Listing } from '@repo/types';
import { Button } from '@repo/ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { formatPrice } from '@repo/lib';
import { MapPin, Heart, Star, Calendar } from 'lucide-react';

export const revalidate = 3600;

async function getCategory(slug: string): Promise<Category | null> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

    if (error || !data) return null;
    return data;
}

async function getListings(category_id: string): Promise<Listing[]> {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('listings')
        .select('*, city:cities(*)')
        .eq('category_id', category_id)
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
    const category = await getCategory(params.slug);

    if (!category) {
        return {
            title: 'Kategori Bulunamadı',
        };
    }

    return {
        title: category.seo_title || `${category.name} Profilleri`,
        description: category.seo_description || `${category.name} kategorisindeki tüm ilan ve profiller`,
    };
}

export default async function CategoryPage({
    params
}: {
    params: { slug: string }
}) {
    const category = await getCategory(params.slug);

    if (!category) {
        notFound();
    }

    const listings = await getListings(category.id);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <section className="bg-white border-b sticky top-0 md:static z-20">
                <div className="container mx-auto px-4 py-8">
                    <nav className="text-sm mb-4 text-gray-500">
                        <Link href="/" className="hover:text-indigo-600">Ana Sayfa</Link>
                        <span className="mx-2">/</span>
                        <span className="font-semibold text-gray-900">{category.name}</span>
                    </nav>
                    <div className="flex items-baseline justify-between">
                        <h1 className="text-3xl font-bold text-gray-900">
                            {category.name} <span className="text-indigo-600 font-light">Profilleri</span>
                        </h1>
                        <span className="text-sm font-medium bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                            {listings.length} sonuç
                        </span>
                    </div>
                </div>
            </section>

            {/* Listings Grid */}
            <section className="py-8">
                <div className="container mx-auto px-4">
                    {listings.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                                🔍
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">Henüz profil bulunamadı</h3>
                            <p className="text-gray-500 mb-6">
                                Bu kategoride henüz aktif ilan bulunmuyor.
                            </p>
                            <Button variant="outline" asChild>
                                <Link href="/">Diğer Kategorilere Bak</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {listings.map((listing) => (
                                <Link
                                    key={listing.id}
                                    href={`/ilan/${listing.slug}`}
                                    className="group block"
                                >
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative h-full flex flex-col">
                                        {/* Image Area */}
                                        <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-500">
                                                <span className="text-4xl opacity-30">📷</span>
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60"></div>

                                            {/* Badges */}
                                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                                                {listing.is_featured && (
                                                    <span className="bg-amber-400 text-amber-950 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide flex items-center gap-1">
                                                        <Star className="h-3 w-3 fill-current" /> Vitrin
                                                    </span>
                                                )}
                                            </div>

                                            <div className="absolute bottom-4 left-4 right-4 text-white">
                                                <div className="flex items-center gap-1 text-sm font-medium mb-1 opacity-90">
                                                    <MapPin className="h-3 w-3" /> {(listing as any).city?.name || 'Konum Belirtilmemiş'}
                                                </div>
                                                <h3 className="text-lg font-bold leading-tight line-clamp-1">{listing.title}</h3>
                                            </div>
                                        </div>

                                        {/* Info Area */}
                                        <div className="p-4 flex items-center justify-between mt-auto bg-white">
                                            <div className="text-indigo-600 font-bold text-lg">
                                                {listing.price ? formatPrice(listing.price) : 'Görüşülür'}
                                            </div>
                                            <div className="text-xs text-gray-400 flex items-center gap-1">
                                                <Calendar className="h-3 w-3" />
                                                {new Date(listing.created_at).toLocaleDateString('tr-TR')}
                                            </div>
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
