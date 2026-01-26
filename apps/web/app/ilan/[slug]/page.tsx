import { createServerClient } from '@repo/lib/server';
import type { Listing, City, Category } from '@repo/types';
import { Button } from '@repo/ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { MapPin, Calendar, Share2, Phone, CheckCircle2, User, Info, ArrowLeft } from 'lucide-react';
import { formatPrice } from '@repo/lib';

export const revalidate = 0; // Her zaman güncel veri

// Extended Listing Type for new columns & missing types
interface ExtendedListing extends Listing {
    city?: City;
    category?: Category;
    details?: Record<string, string>;
    images?: string[];
    cover_image?: string;
    seo_title?: string;
    seo_description?: string;
}

// Key mapping for fixed keys
const labelMap: Record<string, string> = {
    age: 'Yaş',
    height: 'Boy',
    weight: 'Kilo'
};

function formatLabel(key: string) {
    return labelMap[key] || key;
}

function formatValue(key: string, value: string) {
    if (key === 'height') return `${value} cm`;
    if (key === 'weight') return `${value} kg`;
    return value;
}

async function getListing(slug: string): Promise<ExtendedListing | null> {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('listings')
        .select('*, city:cities(*), category:categories(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error || !data) return null;
    return data;
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const listing = await getListing(params.slug);
    if (!listing) return { title: 'Profil Bulunamadı' };
    return {
        title: listing.seo_title || listing.title,
        description: listing.seo_description || listing.description,
        openGraph: {
            images: listing.cover_image ? [listing.cover_image] : [],
        }
    };
}

export default async function ListingPage({ params }: { params: { slug: string } }) {
    const listing = await getListing(params.slug);
    if (!listing) notFound();

    // Galeriye cover image'ı da ekleyelim (en başa)
    const gallery = listing.images || [];
    const allImages = listing.cover_image ? [listing.cover_image, ...gallery] : gallery;

    // Özellikler
    const details = listing.details || {};
    const hasDetails = Object.keys(details).length > 0;

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* HER0 - Cover Image & Title */}
            <div className="relative h-[400px] md:h-[500px] w-full bg-gray-900 overflow-hidden">
                {listing.cover_image ? (
                    <>
                        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${listing.cover_image})` }}></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600 to-rose-900"></div>
                )}

                <div className="absolute top-0 left-0 p-4 md:p-8 z-20">
                    <Button variant="ghost" className="text-white hover:bg-white/10" asChild>
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Ana Sayfa
                        </Link>
                    </Button>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 md:p-12 z-20">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                            <div>
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                        {listing.category?.name}
                                    </span>
                                    {listing.is_featured && (
                                        <span className="bg-amber-400 text-amber-950 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                            Vitrin Profili
                                        </span>
                                    )}
                                </div>
                                <h1 className="text-4xl md:text-6xl font-black text-white mb-2 leading-tight">
                                    {listing.title}
                                </h1>
                                <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm md:text-base">
                                    <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10">
                                        <MapPin className="h-4 w-4 text-red-400" /> {listing.city?.name}
                                    </span>
                                    <span className="flex items-center gap-1.5 bg-white/10 backdrop-blur px-3 py-1.5 rounded-lg border border-white/10">
                                        <Calendar className="h-4 w-4 text-red-400" /> {new Date(listing.created_at).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <Button size="lg" className="bg-green-600 hover:bg-green-700 text-white gap-2 rounded-full h-14 px-8 shadow-lg shadow-green-900/20 text-lg font-bold">
                                    <Phone className="h-5 w-5" /> İletişime Geç
                                </Button>
                                <Button size="icon" variant="secondary" className="h-14 w-14 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur border border-white/10">
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-8 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* LEFT COLUMN: Main Info & Gallery */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* About Card */}
                        <div className="bg-white rounded-2xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="h-6 w-6 text-red-600" /> Hakkımda
                            </h2>
                            <div className="prose prose-red max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
                                {listing.description || 'Açıklama bulunmuyor.'}
                            </div>
                        </div>

                        {/* Gallery Grid */}
                        {allImages.length > 0 && (
                            <div className="bg-white rounded-2xl p-8 shadow-lg shadow-gray-200/50 border border-gray-100">
                                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <CheckCircle2 className="h-6 w-6 text-red-600" /> Galeri
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {allImages.map((img, idx) => (
                                        <div key={idx} className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:opacity-90 transition-opacity border border-gray-100 relative group">
                                            <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Sidebar (Details & Pricing) */}
                    <div className="space-y-6">

                        {/* Pricing Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-xl shadow-red-900/5 border border-red-50 relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-50 rounded-bl-full -mr-8 -mt-8 -z-0"></div>
                            <div className="relative z-10">
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-1">Başlangıç Fiyatı</p>
                                <div className="text-4xl font-black text-red-600 mb-2">
                                    {listing.price ? formatPrice(listing.price) : 'Görüşülür'}
                                </div>
                                <p className="text-xs text-gray-500">
                                    * Hizmet ve detaylara göre fiyat değişkenlik gösterebilir.
                                </p>
                            </div>
                        </div>

                        {/* Fiziksel & Detay Özellikler */}
                        {hasDetails && (
                            <div className="bg-white rounded-2xl p-6 shadow-lg shadow-gray-200/50 border border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-2">
                                    <Info className="h-5 w-5 text-red-600" /> Özellikler
                                </h3>
                                <div className="space-y-3">
                                    {Object.entries(details).map(([key, value]) => (
                                        <div key={key} className="flex justify-between items-center py-2 border-b border-dashed border-gray-100 last:border-0 last:pb-0">
                                            <span className="text-gray-500 font-medium">{formatLabel(key)}</span>
                                            <span className="text-gray-900 font-bold">{formatValue(key, value)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Güvenlik Uyarısı */}
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100 text-amber-800 text-sm">
                            <p className="font-bold mb-1 flex items-center gap-2">⚠️ Güvenlik Uyarısı</p>
                            Bu platform sadece listeleme hizmeti sunar.
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
