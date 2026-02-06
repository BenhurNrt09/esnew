'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MapPin, ArrowRight, Star, Sparkles, Clock, Heart } from 'lucide-react';
import { formatPrice } from '@repo/lib';
import { useLanguage } from '@repo/lib/i18n';
import { createClient } from '@repo/lib/supabase/client';
import { HeroSearch } from './HeroSearch';
import { AdSidebar } from './AdSidebar';
import { StoryBalloons } from './StoryBalloons';
import { HorizontalFilterBar } from './HorizontalFilterBar';
import { Button } from '@repo/ui';
import { ProfileCard } from './ProfileCard';
import { ListingSection } from './ListingSection';
import { SubNavigation } from './SubNavigation';
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
        if (filters.race !== 'all') {
            const val = l.race || l.ethnicity;
            if (val !== filters.race) return false;
        }

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

    const combinedListings = [...featuredListings, ...latestListings];

    return (
        <div className="min-h-screen bg-background">
            {/* Minimal Hero Section with Metallic Gold & Background Image */}
            <section className="relative bg-[#DAA520] dark:bg-gray-900 py-12 border-b border-white/10 transition-colors duration-300 overflow-hidden shadow-xl">
                {/* Background Image Overlay */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-25 dark:opacity-40 mix-blend-overlay">
                    <img
                        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=2800&auto=format&fit=crop"
                        alt="Background"
                        className="w-full h-full object-cover grayscale"
                    />
                </div>

                <div className="container mx-auto px-4 text-center space-y-6 relative z-10">
                    <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight drop-shadow-sm">
                        <span className="text-white">Velora</span> <span className="text-black dark:text-primary">Escort</span> <span className="text-white">World</span>
                    </h1>
                    <div className="max-w-2xl mx-auto">
                        <HeroSearch cities={cities} />
                    </div>
                </div>
            </section>

            {/* Sub-Navigation Menu */}
            <SubNavigation />

            {/* Main Listing Section */}
            <ListingSection
                cities={cities}
                listings={combinedListings}
                categories={categories}
                leftAds={leftAds}
                rightAds={rightAds}
                hideCategories={true}
            />
        </div>
    );
}
