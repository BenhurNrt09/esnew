import { createServerClient } from '@repo/lib/server';
import type { City, Listing, Category } from '@repo/types';
import { Button } from '@repo/ui';
import Link from 'next/link';
import { MapPin, ArrowRight, Search, Heart, Star } from 'lucide-react';
import { formatPrice } from '@repo/lib';

export const revalidate = 3600;

async function getData() {
    const supabase = createServerClient();

    const [citiesRes, listingsRes, categoriesRes] = await Promise.all([
        supabase.from('cities').select('*').eq('is_active', true).order('name').limit(12),
        supabase.from('listings').select('*, city:cities(*), category:categories(*)').eq('is_active', true).eq('is_featured', true).order('created_at', { ascending: false }).limit(8),
        supabase.from('categories').select('*').eq('is_active', true).is('parent_id', null).order('order'),
    ]);

    return {
        cities: citiesRes.data || [],
        featuredListings: listingsRes.data || [],
        categories: categoriesRes.data || [],
    };
}

export default async function HomePage() {
    const { cities, featuredListings, categories } = await getData();

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-violet-600 to-indigo-600 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
                <div className="container mx-auto px-4 py-24 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
                        En Seçkin Profilleri Keşfedin
                    </h1>
                    <p className="text-xl md:text-2xl mb-10 text-indigo-100 max-w-2xl mx-auto font-light">
                        81 ilde aradığınız özelliklere sahip profilleri güvenle bulun.
                    </p>

                    {/* Quick Search Buttons */}
                    <div className="flex flex-wrap justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        {cities.slice(0, 5).map(city => (
                            <Link key={city.id} href={`/sehir/${city.slug}`}>
                                <Button variant="secondary" className="rounded-full px-6 bg-white/10 hover:bg-white/20 border-0 text-white backdrop-blur-sm">
                                    <MapPin className="mr-2 h-4 w-4" /> {city.name}
                                </Button>
                            </Link>
                        ))}
                        <Link href="/sehir/istanbul">
                            <Button variant="secondary" className="rounded-full px-6 bg-white text-indigo-600 hover:bg-indigo-50 font-semibold">
                                Tümünü Gör
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories Section (Features) */}
            <section className="py-12 bg-white border-b">
                <div className="container mx-auto px-4">
                    <div className="flex flex-wrap justify-center gap-4 md:gap-8">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/kategori/${cat.slug}`}
                                className="group flex flex-col items-center gap-3 p-4 min-w-[100px] rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                            >
                                <div className="w-16 h-16 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                    {/* Icon placeholder logic based on slug */}
                                    <span className="text-2xl">
                                        {cat.slug.includes('sac') ? '💇‍♀️' :
                                            cat.slug.includes('vucut') ? '💃' :
                                                cat.slug.includes('yas') ? '📅' :
                                                    cat.slug.includes('irk') ? '🌍' : '✨'}
                                    </span>
                                </div>
                                <span className="font-medium text-gray-700 group-hover:text-indigo-600">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Profiles Grid */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-end mb-10">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Vitrin Profilleri</h2>
                            <p className="text-gray-500 mt-2">Özenle seçilmiş, popüler profiller</p>
                        </div>
                        <Link href="/kategori/hizmetler" className="hidden md:flex items-center text-indigo-600 font-medium hover:underline">
                            Tümünü Gör <ArrowRight className="ml-1 h-4 w-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredListings.map((listing) => (
                            <Link key={listing.id} href={`/ilan/${listing.slug}`} className="group block">
                                <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 relative h-full">
                                    {/* Image Area */}
                                    <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
                                        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-500">
                                            {/* Gerçek resim olmadığı için placeholder */}
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
                                                <MapPin className="h-3 w-3" /> {listing.city?.name}
                                            </div>
                                            <h3 className="text-xl font-bold leading-tight mb-1 truncate">{listing.title}</h3>
                                            <div className="flex items-center gap-2 text-xs opacity-80">
                                                <span className="bg-white/20 px-2 py-0.5 rounded backdrop-blur-md">
                                                    {listing.category?.name}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Area (Minimal) */}
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="text-indigo-600 font-bold text-lg">
                                            {listing.price ? formatPrice(listing.price) : 'Görüşülür'}
                                        </div>
                                        <Button size="icon" variant="ghost" className="rounded-full hover:bg-pink-50 hover:text-pink-500">
                                            <Heart className="h-5 w-5" />
                                        </Button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Sticky Mobile Filter Button (Optional) */}
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 md:hidden z-40">
                <Link href="/kategori/hizmetler">
                    <Button size="lg" className="rounded-full shadow-lg bg-indigo-600 hover:bg-indigo-700 px-8">
                        <Search className="mr-2 h-5 w-5" /> Profilleri Ara
                    </Button>
                </Link>
            </div>
        </div>
    );
}
