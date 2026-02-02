'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ArrowRight, Star, Sparkles, Clock, Heart } from 'lucide-react';
import { formatPrice } from '@repo/lib';
import { useLanguage } from '@repo/lib/i18n';
import { HeroSearch } from './HeroSearch';
import { AdSidebar } from './AdSidebar';
import { StoryBalloons } from './StoryBalloons';
import { HorizontalFilterBar } from './HorizontalFilterBar';
import { Button } from '@repo/ui';
import type { City, Listing, Category } from '@repo/types';

interface HomePageContentProps {
    cities: City[];
    featuredListings: Listing[];
    latestListings: Listing[];
    categories: Category[];
    ads: any[];
}

export function HomePageContent({
    cities,
    featuredListings,
    latestListings,
    categories,
    ads
}: HomePageContentProps) {
    const { t } = useLanguage();
    const [filters, setFilters] = React.useState({
        race: 'all',
        age: 'all',
        height: 'all',
        breast: 'all',
        weight: 'all',
        hair: 'all'
    });

    const popularCities = cities.filter(c => ['istanbul', 'ankara', 'izmir', 'antalya', 'bursa'].includes(c.slug));
    const leftAds = ads.filter(a => a.position === 'left');
    const rightAds = ads.filter(a => a.position === 'right');

    const h = t.home;

    const filteredLatest = latestListings.filter(listing => {
        const l = listing as any;
        if (filters.race !== 'all' && l.race !== filters.race) return false;

        if (filters.breast !== 'all') {
            const size = l.breast_size?.toLowerCase();
            if (filters.breast === 'small' && !['a', 'b'].includes(size || '')) return false;
            if (filters.breast === 'medium' && !['c', 'd'].includes(size || '')) return false;
            if (filters.breast === 'large' && !['dd', 'e', 'f'].includes(size || '')) return false;
        }

        if (filters.age !== 'all') {
            const age = l.age_value;
            if (filters.age === '18-25' && !(age >= 18 && age <= 25)) return false;
            if (filters.age === '25-35' && !(age > 25 && age <= 35)) return false;
            if (filters.age === '35-plus' && !(age > 35)) return false;
        }

        if (filters.hair !== 'all' && l.hair_color !== filters.hair) return false;

        if (filters.height !== 'all') {
            const height = parseInt(l.height);
            if (filters.height === 'short' && height >= 160) return false;
            if (filters.height === 'medium' && !(height >= 160 && height <= 175)) return false;
            if (filters.height === 'tall' && height < 175) return false;
        }

        if (filters.weight !== 'all') {
            const weight = parseInt(l.weight);
            if (filters.weight === '45-55' && !(weight >= 45 && weight <= 55)) return false;
            if (filters.weight === '55-65' && !(weight > 55 && weight <= 65)) return false;
            if (filters.weight === '65-plus' && weight <= 65) return false;
        }

        return true;
    });

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary via-primary/95 to-primary/90 text-white overflow-hidden pb-12">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492633423870-43d1cd2775eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>

                <div className="container mx-auto px-4 py-16 md:py-24 relative z-10 text-center">
                    <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight leading-none drop-shadow-sm animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        {h.heroTitle}<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">{h.heroTitleHighlight}</span>
                    </h1>

                    <div className="max-w-4xl mx-auto mb-12 relative z-20 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
                        <HeroSearch cities={cities} />
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 animate-in fade-in slide-in-from-bottom-10 duration-1000 delay-300">
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

            <HorizontalFilterBar filters={filters} setFilters={setFilters} />

            <div className="mt-8">
                <StoryBalloons />
            </div>

            <div className="max-w-[1600px] mx-auto px-4 py-12">
                <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
                    {/* Left Ad */}
                    <div className="hidden xl:block w-64 shrink-0">
                        <div className="sticky top-40">
                            <div className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest text-center">{h.sponsorAd}</div>
                            <AdSidebar ads={leftAds} />
                        </div>
                    </div>

                    {/* Main Content */}
                    <main className="flex-1 space-y-20 min-w-0">
                        {/* Featured (Vitrin) Listings */}
                        <section>
                            <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tighter">
                                        <Sparkles className="h-7 w-7 text-primary animate-pulse" /> {h.featuredProfiles}
                                    </h2>
                                    <p className="text-gray-500 mt-1 font-medium">{h.featuredProfilesSub}</p>
                                </div>
                                <Link href="/ilanlar?vitrin=true" className="text-primary font-bold text-sm flex items-center gap-1.5 hover:gap-3 transition-all">
                                    {h.viewAll} <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {featuredListings.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                    {featuredListings.map((listing) => (
                                        <ProfileCard key={listing.id} listing={listing} isFeatured={true} translations={h} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                    <Sparkles className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold">{h.noFeatured}</p>
                                </div>
                            )}
                        </section>

                        {/* Recent Listings */}
                        <section>
                            <div className="flex items-end justify-between mb-8 border-b border-gray-100 pb-4">
                                <div>
                                    <h2 className="text-2xl md:text-3xl font-black text-gray-900 flex items-center gap-3 uppercase tracking-tighter">
                                        <Clock className="h-7 w-7 text-primary" /> {h.latestProfiles}
                                    </h2>
                                    <p className="text-gray-500 mt-1 font-medium">{h.latestProfilesSub}</p>
                                </div>
                                <Link href="/ilanlar" className="text-primary font-bold text-sm flex items-center gap-1.5 hover:gap-3 transition-all">
                                    {h.viewAll} <ArrowRight className="h-4 w-4" />
                                </Link>
                            </div>

                            {filteredLatest.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                                    {filteredLatest.map((listing) => (
                                        <ProfileCard key={listing.id} listing={listing} translations={h} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                                    <Clock className="h-12 w-12 text-gray-200 mx-auto mb-4" />
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Aradığınız kriterlere uygun ilan bulunamadı.</p>
                                </div>
                            )}

                            {/* View All Button */}
                            <div className="mt-12 text-center">
                                <Link href="/ilanlar">
                                    <Button size="lg" className="rounded-full px-12 h-14 font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all hover:scale-105">
                                        {h.viewAllProfiles}
                                    </Button>
                                </Link>
                            </div>
                        </section>
                    </main>

                    {/* Right Ad */}
                    <div className="hidden xl:block w-64 shrink-0">
                        <div className="sticky top-40">
                            <div className="text-[10px] font-bold text-gray-400 mb-4 uppercase tracking-widest text-center">{h.sponsorAd}</div>
                            <AdSidebar ads={rightAds} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function ProfileCard({ listing, isFeatured = false, translations }: { listing: Listing, isFeatured?: boolean, translations: any }) {
    const h = translations;
    return (
        <Link href={`/ilan/${listing.slug}`} className="group h-full">
            <div className={`relative bg-white rounded-3xl overflow-hidden transition-all duration-300 h-full flex flex-col border border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 ${isFeatured ? 'ring-2 ring-primary/10' : ''}`}>
                <div className="relative aspect-[3/4] overflow-hidden">
                    <img
                        src={listing.cover_image || (listing.images && listing.images[0]) || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600'}
                        alt={listing.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>

                    {/* Badges */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {isFeatured && (
                            <span className="bg-primary text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg flex items-center gap-1 animate-pulse">
                                <Sparkles className="w-3 h-3" /> {h.vitrinBadge}
                            </span>
                        )}
                        <span className="bg-white/90 backdrop-blur-md text-gray-900 text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tighter shadow-lg flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary" /> {listing.city?.name}
                        </span>
                    </div>

                    <button className="absolute top-4 right-4 p-2.5 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-primary hover:text-white transition-all shadow-lg group/heart">
                        <Heart className="w-4 h-4 transition-transform group-hover/heart:scale-125" />
                    </button>

                    <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-white text-lg font-black leading-tight uppercase tracking-tighter drop-shadow-md group-hover:text-primary transition-colors">{listing.title}</h3>
                        <p className="text-white/70 text-[10px] font-bold mt-1 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping"></span>
                            {listing.category?.name}
                        </p>
                    </div>
                </div>

                <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{h.startingFrom}</span>
                            <span className="text-primary font-black text-xl tracking-tighter">
                                {listing.price ? formatPrice(listing.price) : h.negotiable}
                            </span>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary transition-colors">
                            <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
