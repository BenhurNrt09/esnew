

import { createServerClient } from '@repo/lib/server';
import type { City, Listing, Category } from '@repo/types';
import { Button } from '@repo/ui';
import Link from 'next/link';
import { MapPin, ArrowRight, Search, Heart, Star, Sparkles, Clock } from 'lucide-react';
import { formatPrice } from '@repo/lib';
import { HeroSearch } from './components/HeroSearch';
import { AdSidebar } from './components/AdSidebar';

export const revalidate = 0; // Her zaman güncel kalsın

async function getData() {
    const supabase = createServerClient();

    const [citiesRes, featuredRes, latestRes, categoriesRes, adsRes] = await Promise.all([
        supabase.from('cities').select('*').eq('is_active', true).order('name').limit(81),
        supabase.from('listings').select('*, city:cities(*), category:categories(*)').eq('is_active', true).eq('is_featured', true).order('created_at', { ascending: false }).limit(8),
        supabase.from('listings').select('*, city:cities(*), category:categories(*)').eq('is_active', true).eq('is_featured', false).order('created_at', { ascending: false }).limit(8),
        supabase.from('categories').select('*').eq('is_active', true).is('parent_id', null).order('order'),
        supabase.from('banners').select('*').eq('is_active', true).order('order', { ascending: true }),
    ]);

    return {
        cities: citiesRes.data || [],
        featuredListings: featuredRes.data || [],
        latestListings: latestRes.data || [],
        categories: categoriesRes.data || [],
        ads: adsRes.data || [],
    };
}

export default async function HomePage() {
    const { cities, featuredListings, latestListings, categories, ads } = await getData();

    const popularCities = cities.filter(c => ['istanbul', 'ankara', 'izmir', 'antalya', 'bursa'].includes(c.slug));
    const leftAds = ads.filter(a => a.position === 'left');
    const rightAds = ads.filter(a => a.position === 'right');

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-red-600 via-red-700 to-rose-800 text-white overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

                {/* Decorative Blobs */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-red-800/40 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

                <div className="container mx-auto px-4 py-24 md:py-32 relative z-10 text-center">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6 text-red-50 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        ✨ Türkiye'nin En Seçkin Profil Platformu
                    </span>
                    <h1 className="text-4xl md:text-7xl font-black mb-6 tracking-tight leading-none drop-shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        Hayalindeki Profili<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-red-200">Keşfetmeye Başla</span>
                    </h1>
                    <p className="text-lg md:text-2xl mb-12 text-red-100 max-w-2xl mx-auto font-light leading-relaxed animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-100">
                        81 ilde, aradığınız özelliklere sahip doğrulanmış profillerle güvenle iletişim kurun.
                    </p>

                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200 mb-12 relative z-20">
                        <HeroSearch cities={cities} />
                    </div>

                    {/* Quick Cities */}
                    <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
                        <span className="text-red-200 text-sm font-medium self-center mr-2">Popüler Şehirler:</span>
                        {popularCities.map(city => (
                            <Link key={city.id} href={`/sehir/${city.slug}`}>
                                <button className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-white/20 border border-white/10 text-sm transition-all text-white backdrop-blur-sm">
                                    {city.name}
                                </button>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-12 bg-white border-b border-gray-100 relative z-10 -mt-8 mx-4 md:mx-12 rounded-2xl shadow-xl">
                <div className="container mx-auto px-4">
                    <h3 className="text-center text-gray-400 text-xs font-bold uppercase tracking-widest mb-8">KATEGORİLERE GÖRE GÖZ AT</h3>
                    <div className="flex flex-wrap justify-center gap-6 md:gap-10">
                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/kategori/${cat.slug}`}
                                className="group flex flex-col items-center gap-3 p-2 rounded-xl transition-all cursor-pointer"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 text-red-500 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-50 group-hover:text-red-600 transition-all duration-300 shadow-sm group-hover:shadow-red-200 group-hover:shadow-lg border border-gray-100">
                                    <span className="text-2xl transform group-hover:rotate-6 transition-transform">
                                        {cat.slug.includes('sac') ? '💇‍♀️' :
                                            cat.slug.includes('vucut') ? '💃' :
                                                cat.slug.includes('yas') ? '📅' :
                                                    cat.slug.includes('goz') ? '👁️' :
                                                        cat.slug.includes('hizmet') ? '✨' : '🏷️'}
                                    </span>
                                </div>
                                <span className="font-semibold text-gray-700 text-sm group-hover:text-red-600 transition-colors">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Content Area with Ads Layout */}
            <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-12 py-8 flex items-start justify-center gap-8 relative z-10">

                {/* Left Ads Sidebar */}
                <aside className="w-[160px] xl:w-[220px] hidden lg:flex flex-col gap-4 shrink-0">
                    <div className="text-[10px] font-black text-gray-400 bg-gray-100 py-1.5 px-4 rounded-full w-fit mb-2 tracking-widest border border-gray-200">SPONSOR REKLAM</div>
                    <AdSidebar ads={leftAds} />
                </aside>

                {/* Main Content Column */}
                <main className="flex-1 min-w-0 space-y-12">

                    {/* Featured Profiles (Vitrin) */}
                    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 relative overflow-hidden">
                        {/* Vitrin Header */}
                        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4 relative z-10">
                            <div>
                                <span className="text-red-500/10 text-5xl font-black absolute -top-4 -left-2 -z-10 select-none">VİTRİN</span>
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                                    <Sparkles className="h-6 w-6 text-amber-500 fill-amber-500" />
                                    Öne Çıkan Profiller
                                </h2>
                                <p className="text-gray-500 mt-1 font-medium text-sm md:text-base">Editörlerimizin seçtiği en popüler profiller</p>
                            </div>
                            <Link href="/kategori/hizmetler" className="flex items-center text-red-600 font-bold hover:bg-red-50 px-4 py-2 rounded-lg transition-colors group text-sm">
                                Tümünü Gör <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        {/* Vitrin Grid */}
                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            {featuredListings.map((listing) => (
                                <Link key={listing.id} href={`/ilan/${listing.slug}`} className="group block h-full">
                                    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-red-900/10 transition-all duration-300 border border-gray-100 h-full flex flex-col relative group-hover:-translate-y-1">
                                        <div className="aspect-[3/4] bg-gray-200 relative overflow-hidden">
                                            {listing.cover_image ? (
                                                <img src={listing.cover_image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-300 group-hover:scale-110 transition-transform duration-700">
                                                    <span className="text-4xl opacity-40 grayscale group-hover:grayscale-0 transition-all">📸</span>
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"></div>

                                            <div className="absolute top-3 left-3">
                                                <span className="bg-white/90 backdrop-blur-md text-red-950 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wide flex items-center gap-1 shadow-lg">
                                                    <Star className="h-3 w-3 text-amber-500 fill-amber-500" /> Vitrin
                                                </span>
                                            </div>

                                            <div className="absolute top-3 right-3">
                                                <div className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center hover:bg-white hover:text-red-500 transition-all">
                                                    <Heart className="h-4 w-4" />
                                                </div>
                                            </div>

                                            <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                <div className="flex items-center gap-2 text-[10px] font-medium mb-1 opacity-90">
                                                    <span className="bg-red-600 px-1.5 py-0.5 rounded text-white shadow-sm">
                                                        {listing.city?.name}
                                                    </span>
                                                    <span className="bg-white/20 px-1.5 py-0.5 rounded backdrop-blur-md">
                                                        {listing.category?.name}
                                                    </span>
                                                </div>
                                                <h3 className="text-lg font-bold leading-tight mb-1 truncate">{listing.title}</h3>
                                                <div className="h-0 group-hover:h-auto overflow-hidden transition-all duration-300 opacity-0 group-hover:opacity-100">
                                                    <p className="text-xs text-gray-300 line-clamp-2">{listing.description}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-3 flex items-center justify-between mt-auto border-t border-gray-50 bg-white z-10 relative">
                                            <div>
                                                <p className="text-[10px] text-gray-400">Başlangıç</p>
                                                <div className="text-red-600 font-black text-base">
                                                    {listing.price ? formatPrice(listing.price) : 'Görüşülür'}
                                                </div>
                                            </div>
                                            <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center group-hover:bg-red-600 group-hover:border-red-600 group-hover:text-white transition-all text-gray-400">
                                                <ArrowRight className="h-4 w-4 -rotate-45 group-hover:rotate-0 transition-transform" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {featuredListings.length === 0 && (
                                <div className="col-span-full text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                                    <p className="text-gray-500">Henüz vitrin ilanı bulunmuyor.</p>
                                </div>
                            )}
                        </div>
                    </div>


                    {/* Mobile Ads (Only visible on small screens) */}
                    {ads.length > 0 && (
                        <div className="lg:hidden bg-white border border-gray-100 rounded-3xl p-6 shadow-sm overflow-hidden mb-12">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="text-[10px] font-black text-gray-400 bg-gray-50 py-1 px-3 rounded-full tracking-widest">SPONSORLU İÇERİKLER</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {ads.map(ad => (
                                    <Link key={ad.id} href={ad.link || '#'} target="_blank" className="block relative group overflow-hidden rounded-2xl border border-gray-100 shadow-sm bg-white">
                                        <img src={ad.image_url} alt="Reklam" className="w-full h-auto block transition-transform group-hover:scale-105" />
                                        <div className="absolute top-2 right-2">
                                            <span className="bg-black/40 backdrop-blur-md text-[8px] text-white px-2 py-0.5 rounded font-bold">REKLAM</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Latest Profiles (Diğerleri) */}
                    <div>
                        <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                                    <Clock className="h-6 w-6 text-red-500" />
                                    Yeni Eklenenler
                                </h2>
                                <p className="text-gray-500 mt-1 font-medium text-sm">Platforma katılan en yeni üyeler</p>
                            </div>
                            <Link href="/kategori/hizmetler" className="flex items-center text-gray-500 font-bold hover:text-red-600 transition-colors group text-sm">
                                Tüm Profillere Göz At <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                            {latestListings.map((listing) => (
                                <Link key={listing.id} href={`/ilan/${listing.slug}`} className="group block">
                                    <div className="bg-white rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 h-full flex flex-row sm:flex-col shadow-sm">
                                        <div className="w-1/3 sm:w-full sm:aspect-[4/3] bg-gray-200 relative overflow-hidden">
                                            {listing.cover_image ? (
                                                <img src={listing.cover_image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                            ) : (
                                                <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                                                    <span className="text-2xl">📷</span>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 p-4 flex flex-col justify-center">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{listing.city?.name}</span>
                                            </div>
                                            <h3 className="text-base font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors truncate">{listing.title}</h3>
                                            <p className="text-xs text-gray-500 line-clamp-1 mb-2">{listing.category?.name}</p>

                                            <div className="mt-auto pt-2 border-t border-gray-100 flex items-center justify-between">
                                                <div className="text-gray-900 font-bold text-sm">
                                                    {listing.price ? formatPrice(listing.price) : 'Görüşülür'}
                                                </div>
                                                <span className="text-[10px] text-gray-400">{new Date(listing.created_at).toLocaleDateString('tr-TR')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                            {latestListings.length === 0 && (
                                <div className="col-span-full text-center py-12">
                                    <p className="text-gray-500">Henüz başka ilan bulunmuyor.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>

                {/* Right Ads Sidebar */}
                <aside className="w-[160px] xl:w-[220px] hidden lg:flex flex-col gap-4 shrink-0">
                    <div className="text-[10px] font-black text-gray-400 bg-gray-100 py-1.5 px-4 rounded-full w-fit mb-2 tracking-widest border border-gray-200">SPONSOR REKLAM</div>
                    <AdSidebar ads={rightAds} />
                </aside>

            </div>
        </div>
    );
}
