'use client';

import React from 'react';
import { StackedListingCard } from './StackedListingCard';
import { motion } from 'framer-motion';
import { useLanguage } from '@repo/lib/i18n';
import { HeroSearch } from './HeroSearch';
import { SubNavigation } from './SubNavigation';
import { StorySection } from './StorySection';
import type { City, Listing, Category } from '@repo/types';
import Link from 'next/link';
import { useState } from 'react';
import { Sparkles, MessageCircle, Send, X } from 'lucide-react';
import { AdSidebar } from './AdSidebar';
import { ProfileCard } from './ProfileCard';
import { StoryBalloons } from './StoryBalloons';

type ExtendedListing = Listing & {
    is_premium?: boolean;
    is_vip?: boolean;
    age_value?: number;
};

interface HomePageContentProps {
    cities: City[];
    premiumListings: ExtendedListing[];
    vipListings: ExtendedListing[];
    normalListings: ExtendedListing[];
    categories: Category[];
    ads: any[];
}

export function HomePageContent({
    cities,
    premiumListings,
    vipListings,
    normalListings,
    categories,
    ads
}: HomePageContentProps) {
    const { t } = useLanguage();

    const leftAds = ads.filter(a => a.position === 'left');
    const rightAds = ads.filter(a => a.position === 'right');

    const [showSocialModal, setShowSocialModal] = useState(false);
    const hasNoVip = vipListings.length === 0;

    return (
        <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
            {/* Ad Space Placeholder / Top Banner Area */}
            <div className="h-2 w-full bg-primary/10 border-b border-border dark:border-white/10"></div>
            {/* Header/Hero Section - Ultra-Premium Impact Layout */}
            <section className="relative bg-[#050505] py-10 md:py-20 border-b border-white/5 overflow-hidden">
                <div className="container max-w-[1400px] mx-auto px-4 md:px-8 relative z-10">
                    <div className="flex flex-col items-center justify-center">
                        <div className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-24 w-full">
                            {/* Left Extreme CTA */}
                            <button
                                onClick={() => setShowSocialModal(true)}
                                className="hidden md:flex items-center gap-3 bg-gradient-to-r from-red-600 to-orange-500 text-white text-xs font-black px-10 py-5 rounded-2xl uppercase tracking-[0.25em] animate-blink animate-shine shadow-gold-heavy hover:scale-110 transition-all border border-white/20 active:scale-95"
                            >
                                <Sparkles className="w-5 h-5" /> İLAN VERMEK İÇİN TIKLA
                            </button>

                            {/* Centered Logo - Focused */}
                            <div className="text-center group cursor-pointer transition-transform duration-700 hover:scale-110">
                                <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4">
                                    <span className="text-white">Velora</span> <span className="text-primary italic drop-shadow-[0_0_20px_rgba(212,175,55,0.6)]">Escort</span>
                                </h1>
                                <div className="flex items-center justify-center gap-6">
                                    <div className="h-0.5 w-12 md:w-24 bg-gradient-to-r from-transparent to-primary/50" />
                                    <p className="text-[10px] md:text-sm text-primary font-black tracking-[0.6em] uppercase opacity-90">
                                        V.I.P Luxury Service
                                    </p>
                                    <div className="h-0.5 w-12 md:w-24 bg-gradient-to-l from-transparent to-primary/50" />
                                </div>
                            </div>

                            {/* Right Extreme CTA */}
                            <button
                                onClick={() => setShowSocialModal(true)}
                                className="hidden md:flex items-center gap-3 bg-gradient-to-r from-primary to-yellow-600 text-black text-xs font-black px-10 py-5 rounded-2xl uppercase tracking-[0.25em] animate-blink animate-shine shadow-gold-heavy hover:scale-110 transition-all border border-black/20 active:scale-95"
                            >
                                İLAN VERMEK İÇİN TIKLA <Sparkles className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Mobile Impact CTA */}
                        <button
                            onClick={() => setShowSocialModal(true)}
                            className="md:hidden mt-12 flex items-center gap-3 bg-primary text-black text-xs font-black px-12 py-6 rounded-2xl uppercase tracking-widest animate-blink shadow-[0_0_30px_rgba(212,175,55,0.4)]"
                        >
                            İLAN VERMEK İÇİN TIKLA
                        </button>
                    </div>
                </div>

                {/* Intense Background Effects */}
                <div className="absolute top-1/2 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.15)_0,transparent_70%)] pointer-events-none -translate-y-1/2" />
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] -z-1 opacity-50 animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-primary/20 rounded-full blur-[150px] -z-1 opacity-50 animate-pulse" />
            </section>

            {/* Social Contact Modal */}
            {showSocialModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/90 backdrop-blur-xl animate-in fade-in duration-500"
                        onClick={() => setShowSocialModal(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative w-full max-w-lg bg-zinc-900 border border-white/10 p-8 md:p-12 rounded-[2.5rem] shadow-2xl animate-in zoom-in-95 duration-500">
                        <button
                            onClick={() => setShowSocialModal(false)}
                            className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="text-center space-y-8">
                            <div className="space-y-2">
                                <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter text-white">
                                    İletişim <span className="text-primary italic">Kanalları</span>
                                </h2>
                                <p className="text-zinc-500 text-xs md:text-sm font-bold uppercase tracking-[0.2em]">
                                    İLAN VERMEK İÇİN BİZE ULAŞIN
                                </p>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                <a
                                    href="https://wa.me/905300000000"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative flex items-center justify-between bg-[#4ade80] hover:bg-[#22c55e] p-6 rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 shadow-lg shadow-[#4ade80]/20"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <MessageCircle className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none mb-1">Hızlı İletişim</p>
                                            <p className="text-lg font-black text-white uppercase tracking-tighter">WhatsApp</p>
                                        </div>
                                    </div>
                                    <Sparkles className="w-5 h-5 text-white/40 group-hover:text-white animate-pulse" />
                                </a>

                                <a
                                    href="https://t.me/veloraofficial"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="group relative flex items-center justify-between bg-[#0088cc] hover:bg-[#0077b5] p-6 rounded-2xl transition-all duration-500 hover:scale-105 active:scale-95 shadow-lg shadow-[#0088cc]/20"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                                            <Send className="w-6 h-6 text-white" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-none mb-1">Resmi Kanal</p>
                                            <p className="text-lg font-black text-white uppercase tracking-tighter">Telegram</p>
                                        </div>
                                    </div>
                                    <Sparkles className="w-5 h-5 text-white/40 group-hover:text-white animate-pulse" />
                                </a>
                            </div>

                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                                7/24 MÜŞTERİ DESTEĞİ
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Story Circle Section (Only if stories exist) */}
            <StoryBalloons />

            {/* Main Marketplace Layout: Ads | Content | Ads */}
            <div className="mx-auto w-full max-w-[1500px] px-4 md:px-8 mt-8 flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-20">

                {/* Left Ad Sidebar */}
                <aside className="hidden lg:block w-28 xl:w-32 flex-shrink-0">
                    <AdSidebar ads={leftAds} />
                </aside>

                {/* Main Listing Area */}
                <main className="flex-1 min-w-0 space-y-12">

                    {/* 1. PREMIUM SECTION (Compact) */}
                    {premiumListings.length > 0 && (
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-gold-gradient rounded-full shadow-[0_0_20px_rgba(234,179,8,0.3)]" />
                                <h2 className="text-xl md:text-2xl font-black text-foreground uppercase tracking-tighter">
                                    Premium <span className="text-primary italic">İlanlar</span>
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {premiumListings.map((listing, i) => (
                                    <StackedListingCard key={listing.id} listing={listing} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 2. VIP SECTION (Compact) */}
                    {vipListings.length > 0 && (
                        <section className="space-y-6">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-6 bg-zinc-700 rounded-full" />
                                <h2 className="text-lg md:text-xl font-black text-foreground uppercase tracking-tight">
                                    VIP <span className="text-zinc-500 italic">Üyeler</span>
                                </h2>
                            </div>
                            <div className="grid grid-cols-1 gap-4">
                                {vipListings.map((listing, i) => (
                                    <StackedListingCard key={listing.id} listing={listing} index={i} />
                                ))}
                            </div>
                        </section>
                    )}

                    {/* 3. NORMAL SECTION (Larger Grid) */}
                    <section className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-1 h-6 bg-zinc-800 rounded-full" />
                            <h2 className="text-base md:text-lg font-black text-foreground uppercase tracking-tight opacity-50">
                                Normal <span className="italic">İlanlar</span>
                            </h2>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                            {normalListings.map((listing) => (
                                <ProfileCard key={listing.id} listing={listing} />
                            ))}
                        </div>
                    </section>
                </main>

                {/* Right Ad Sidebar */}
                <aside className="hidden lg:block w-28 xl:w-32 flex-shrink-0">
                    <AdSidebar ads={rightAds} />
                </aside>
            </div>
        </div>
    );
}
