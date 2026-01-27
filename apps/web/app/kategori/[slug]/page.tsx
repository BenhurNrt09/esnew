import { createServerClient } from '@repo/lib/server';
import type { City, Listing, Category } from '@repo/types';
import { Button } from '@repo/ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MapPin, Calendar, Heart, ArrowRight, Tag, Layers } from 'lucide-react';
import { formatPrice } from '@repo/lib';

export const revalidate = 3600;

async function getCategory(slug: string): Promise<Category | null> {
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

// Recursively get all subcategory IDs if needed, but for now simple match
async function getListings(category_id: string): Promise<(Listing & { city?: City })[]> {
    const supabase = createServerClient();

    // First, find if this category has children to include their listings too?
    // For simplicity, let's just match exact category for now or use the view strategy if we had one.
    // If it's a parent category (e.g. "Sac Rengi"), maybe we want to show all subs?
    // Let's stick to simple ID match for now to be safe.

    const { data, error } = await supabase
        .from('listings')
        .select('*, city:cities(*)')
        .eq('category_id', category_id)
        .eq('is_active', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) return [];
    return data || [];
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
    const category = await getCategory(params.slug);
    if (!category) notFound();

    const listings = await getListings(category.id);

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Modern Hero Header - RED THEME */}
            <div className="relative bg-gradient-to-r from-red-600 to-rose-900 text-white py-20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>

                <div className="container mx-auto px-4 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2 text-red-100 bg-white/10 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm mb-6 border border-white/10">
                        <Layers className="h-4 w-4" />
                        <Link href="/" className="hover:text-white transition-colors">Ana Sayfa</Link>
                        <span className="opacity-50">/</span>
                        <Link href="/kullanici-kategorileri" className="hover:text-white transition-colors">Kategoriler</Link>
                        <span className="opacity-50">/</span>
                        <span>{category.name}</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tight drop-shadow-lg">
                        {category.name}
                    </h1>
                    <p className="text-xl text-red-100 max-w-2xl mx-auto font-light">
                        {listings.length > 0
                            ? `"${category.name}" kategorisinde ${listings.length} özel profil listeleniyor.`
                            : 'Bu kategoride henüz aktif ilan bulunmuyor.'}
                    </p>
                </div>
            </div>

            {/* Listings Section */}
            <section className="py-12 -mt-8 relative z-20">
                <div className="container mx-auto px-4">
                    {listings.length === 0 ? (
                        <div className="bg-white rounded-2xl shadow-xl p-12 text-center max-w-2xl mx-auto border border-gray-100">
                            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Layers className="h-8 w-8 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{category.name} Kategorisi Boş</h3>
                            <p className="text-gray-500 mb-8">
                                Bu kategoride henüz ilan bulunmuyor.
                            </p>
                            <Button asChild className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-6 h-auto text-lg">
                                <Link href="/">Tüm Kategorilere Bak</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {listings.map((listing) => (
                                <Link
                                    key={listing.id}
                                    href={`/ilan/${listing.slug}`}
                                    className="group block"
                                >
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-red-900/10 hover:-translate-y-1 transition-all duration-300 border border-gray-100 h-full flex flex-col relative">
                                        {/* Image */}
                                        <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
                                            {listing.cover_image ? (
                                                <img src={listing.cover_image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-300">
                                                    <span className="text-4xl opacity-40 grayscale group-hover:grayscale-0 transition-all">📸</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>

                                            {/* Badges */}
                                            <div className="absolute top-3 left-3 flex flex-col gap-2">
                                                {listing.is_featured && (
                                                    <span className="bg-amber-400 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg flex items-center gap-1 uppercase tracking-tight">
                                                        ★ VİTRİN
                                                    </span>
                                                )}
                                                <span className="bg-white/90 backdrop-blur text-gray-800 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1 uppercase tracking-tight">
                                                    <MapPin className="h-3 w-3 text-red-500" /> {listing.city?.name || 'Konum'}
                                                </span>
                                            </div>

                                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                                <h3 className="text-base font-bold leading-tight mb-1 truncate">{listing.title}</h3>
                                                <p className="text-[10px] text-gray-300 line-clamp-1">{listing.description}</p>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-3 flex items-center justify-between mt-auto border-t border-gray-50 bg-white">
                                            <div>
                                                <p className="text-[10px] text-gray-400">Fiyat</p>
                                                <div className="text-red-600 font-black text-sm">
                                                    {listing.price ? formatPrice(listing.price) : 'Görüşülür'}
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[10px] text-gray-400">Tarih</p>
                                                <span className="text-[10px] text-gray-500">{new Date(listing.created_at).toLocaleDateString('tr-TR')}</span>
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
