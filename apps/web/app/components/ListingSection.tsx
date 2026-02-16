'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Filter, ChevronDown, MapPin, Search, Grid, Scale, Ruler, User, Sparkles } from 'lucide-react';
import { cn } from "@repo/ui/src/lib/utils";
import { ProfileCard } from './ProfileCard';
import { StackedListingCard } from './StackedListingCard';
import { AdSidebar } from './AdSidebar';

// Premium Custom Select Component
function CustomSelect({ label, value, options, onChange, icon: Icon }: any) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const selectedOption = options.find((opt: any) => opt.value === value) || options[0];

    return (
        <div className={cn("space-y-2 group/field relative", isOpen ? "z-[60]" : "z-10")} ref={containerRef}>
            {label && (
                <label className="text-[9px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-[0.2em] ml-1 group-focus-within/field:text-primary transition-colors flex items-center gap-1.5">
                    {label}
                </label>
            )}
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={cn(
                        "w-full h-11 bg-white dark:bg-zinc-950/50 border border-gray-200 dark:border-white/10 rounded-xl px-4 text-[11px] font-bold text-gray-700 dark:text-gray-200 flex items-center justify-between transition-all duration-300 hover:border-primary/50 group-hover/field:shadow-[0_0_15px_rgba(212,175,55,0.1)]",
                        isOpen && "ring-2 ring-primary/20 border-primary shadow-lg"
                    )}
                >
                    <span className="flex items-center gap-2">
                        {Icon && <Icon className="w-3.5 h-3.5 text-primary/60" />}
                        {selectedOption.label}
                    </span>
                    <ChevronDown className={cn("w-3.5 h-3.5 text-primary transition-transform duration-300", isOpen && "rotate-180")} />
                </button>

                {isOpen && (
                    <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-white/10 rounded-xl shadow-2xl py-1.5 z-[100] animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl">
                        <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                            {options.map((option: any) => (
                                <button
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setIsOpen(false);
                                    }}
                                    className={cn(
                                        "w-full text-left px-4 py-2.5 text-[11px] font-bold transition-all flex items-center justify-between group/opt",
                                        value === option.value
                                            ? "text-primary bg-primary/10"
                                            : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-primary"
                                    )}
                                >
                                    {option.label}
                                    {value === option.value && <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_10px_#D4AF37]" />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

interface ListingSectionProps {
    cities: any[];
    listings: any[];
    categories: any[];
    leftAds?: any[];
    rightAds?: any[];
    hideCategories?: boolean;
}

export function ListingSection({ cities, listings, categories, leftAds = [], rightAds = [], hideCategories = false }: ListingSectionProps) {
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        age: 'all',
        height: 'all',
        weight: 'all',
        breast: 'all',
        hair: 'all',
        race: 'all'
    });

    // Filtering Logic
    const filteredListings = useMemo(() => {
        return listings.filter(l => {
            // City Filter
            if (selectedCity && l.city?.slug !== selectedCity) return false;

            // Search Filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                if (!l.title?.toLowerCase().includes(query) &&
                    !l.description?.toLowerCase().includes(query)) {
                    return false;
                }
            }

            const listing = l as any;

            // Age Filter - Inclusive Ranges
            if (filters.age !== 'all') {
                const age = listing.age || listing.age_value;
                if (!age) return false;
                if (filters.age === '18-25' && !(age >= 18 && age <= 25)) return false;
                if (filters.age === '25-30' && !(age >= 25 && age <= 30)) return false;
                if (filters.age === '30-35' && !(age >= 30 && age <= 35)) return false;
                if (filters.age === '35-plus' && !(age >= 35)) return false;
            }

            // Height Filter
            if (filters.height !== 'all') {
                const height = listing.height || listing.height_value;
                if (!height) return false;
                if (filters.height === 'short' && height >= 160) return false;
                if (filters.height === 'medium' && (height < 160 || height > 175)) return false;
                if (filters.height === 'tall' && height <= 175) return false;
            }

            // Weight Filter
            if (filters.weight !== 'all') {
                const weight = listing.weight || listing.weight_value;
                if (!weight) return false;
                if (filters.weight === 'skinny' && weight >= 50) return false;
                if (filters.weight === 'normal' && (weight < 50 || weight > 65)) return false;
                if (filters.weight === 'curvy' && weight <= 65) return false;
            }

            // Race/Ethnicity Filter
            if (filters.race !== 'all') {
                const ethnicity = (listing.ethnicity || listing.nationality || '').toLowerCase();
                if (filters.race === 'turk' && !['tr', 'türk', 'turk'].includes(ethnicity)) return false;
                if (filters.race === 'rus' && !['ru', 'ua', 'rus', 'slavic'].includes(ethnicity)) return false;
                if (filters.race === 'latin' && !['latin', 'ispanyol'].includes(ethnicity)) return false;
                if (filters.race === 'asian' && !['asian', 'asya'].includes(ethnicity)) return false;
                if (filters.race === 'black' && !['black', 'zenci', 'afrika'].includes(ethnicity)) return false;
            }

            // Hair Color Filter
            if (filters.hair !== 'all') {
                const hair = (listing.hair_color || '').toLowerCase();
                if (hair !== filters.hair.toLowerCase()) return false;
            }

            return true;
        });
    }, [listings, selectedCity, searchQuery, filters]);

    // Split into tiers
    const premiumListings = useMemo(() => filteredListings.filter(l => l.is_premium), [filteredListings]);
    const vipListings = useMemo(() => filteredListings.filter(l => l.is_vip && !l.is_premium), [filteredListings]);
    const normalListings = useMemo(() => filteredListings.filter(l => !l.is_premium && !l.is_vip), [filteredListings]);

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="w-full max-w-[1500px] mx-auto px-4 md:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 xl:gap-20">

                {/* COLUMN 1: LEFT ADS (Skinny) - Desktop Only */}
                {leftAds.length > 0 && (
                    <aside className="hidden lg:block w-28 xl:w-32 shrink-0">
                        <div className="sticky top-24 space-y-4">
                            <div className="text-[10px] font-black text-primary/50 uppercase tracking-[0.2em] text-center mb-4">Sponsorlu</div>
                            <AdSidebar ads={leftAds} />
                        </div>
                    </aside>
                )}

                {/* COLUMN 2: FILTERS (Sidebar) */}
                <aside className="w-full lg:w-72 shrink-0 relative z-30">
                    <div className="lg:sticky lg:top-24 space-y-5">

                        {/* Search Box */}
                        {/* Ultra-Premium Search Box */}
                        <div className="bg-card backdrop-blur-2xl border border-border rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group transition-all duration-500 z-50">
                            {/* Animated Background Glow */}
                            <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-all duration-700 pointer-events-none" />
                            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-zinc-400/10 dark:bg-zinc-800/10 rounded-full blur-[80px] pointer-events-none" />

                            <div className="relative z-10">
                                <h3 className="font-black text-[10px] mb-5 flex items-center gap-2.5 uppercase tracking-[0.3em] text-gray-500 dark:text-zinc-400 group-hover:text-primary transition-colors">
                                    <Search className="w-3.5 h-3.5 text-primary" />
                                    <span>Hızlı Profil Ara</span>
                                    <Sparkles className="w-3 h-3 text-primary/40 animate-pulse ml-auto" />
                                </h3>
                                <div className="relative group/search">
                                    <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl opacity-0 group-focus-within/search:opacity-100 transition-opacity duration-500 pointer-events-none" />
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-zinc-500 group-focus-within/search:text-primary transition-all duration-300" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="İsim, yaş..."
                                        className="w-full h-12 bg-gray-50/50 dark:bg-zinc-900/50 border border-gray-200 dark:border-white/5 rounded-2xl pl-11 pr-5 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/20 transition-all placeholder:text-gray-400 dark:placeholder:text-zinc-600 placeholder:italic"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        {/* Advanced Filters Container */}
                        <div className="bg-card backdrop-blur-2xl border border-border rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group transition-all duration-500 z-40">
                            <div className="absolute inset-0 bg-gradient-to-t from-primary/[0.02] to-transparent pointer-events-none" />

                            <div className="relative z-10 flex items-center justify-between mb-8 border-b border-border pb-5">
                                <h3 className="font-black text-[10px] flex items-center gap-2.5 uppercase tracking-[0.3em] text-gray-500 dark:text-zinc-400">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Filter className="w-4 h-4 text-primary" />
                                    </div>
                                    <span>Detaylı Filtreleme</span>
                                </h3>
                                <button
                                    onClick={() => {
                                        setFilters({ age: 'all', height: 'all', weight: 'all', breast: 'all', hair: 'all', race: 'all' });
                                        setSelectedCity(null);
                                        setSearchQuery('');
                                    }}
                                    className="px-6 py-2.5 bg-zinc-900 dark:bg-primary border border-primary/20 dark:border-transparent rounded-xl text-[10px] font-black text-primary dark:text-black hover:bg-primary hover:text-black dark:hover:bg-white transition-all duration-500 uppercase tracking-[0.2em] active:scale-95 shadow-xl shadow-primary/10"
                                >
                                    Temizle
                                </button>
                            </div>

                            <div className="relative z-10 space-y-6">
                                <CustomSelect
                                    label="Etnik Köken"
                                    value={filters.race}
                                    options={[
                                        { value: 'all', label: 'Tüm Kökenler' },
                                        { value: 'turk', label: 'Türk' },
                                        { value: 'rus', label: 'Rus / Slav' },
                                        { value: 'latin', label: 'Latin' },
                                        { value: 'asian', label: 'Asyalı' },
                                        { value: 'black', label: 'Siyahi' }
                                    ]}
                                    onChange={(val: string) => handleFilterChange('race', val)}
                                />

                                <CustomSelect
                                    label="Saç Rengi"
                                    value={filters.hair}
                                    options={[
                                        { value: 'all', label: 'Tüm Renkler' },
                                        { value: 'sarışın', label: 'Sarışın' },
                                        { value: 'esmer', label: 'Esmer' },
                                        { value: 'kumral', label: 'Kumral' },
                                        { value: 'kızıl', label: 'Kızıl' },
                                        { value: 'siyah', label: 'Siyah' }
                                    ]}
                                    onChange={(val: string) => handleFilterChange('hair', val)}
                                />

                                <CustomSelect
                                    label="Yaş Aralığı"
                                    value={filters.age}
                                    options={[
                                        { value: 'all', label: 'Tüm Yaşlar' },
                                        { value: '18-25', label: '18 - 25 Yaş' },
                                        { value: '25-30', label: '25 - 30 Yaş' },
                                        { value: '30-35', label: '30 - 35 Yaş' },
                                        { value: '35-plus', label: '35 Üstü' }
                                    ]}
                                    onChange={(val: string) => handleFilterChange('age', val)}
                                />

                                <div className="grid grid-cols-2 gap-3">
                                    <CustomSelect
                                        label="Boy"
                                        value={filters.height}
                                        options={[
                                            { value: 'all', label: 'Tümü' },
                                            { value: 'short', label: 'Minyon' },
                                            { value: 'medium', label: 'Orta' },
                                            { value: 'tall', label: 'Uzun' }
                                        ]}
                                        onChange={(val: string) => handleFilterChange('height', val)}
                                    />
                                    <CustomSelect
                                        label="Kilo"
                                        value={filters.weight}
                                        options={[
                                            { value: 'all', label: 'Tümü' },
                                            { value: 'skinny', label: 'Zayıf' },
                                            { value: 'normal', label: 'Fit' },
                                            { value: 'curvy', label: 'Kıvrımlı' }
                                        ]}
                                        onChange={(val: string) => handleFilterChange('weight', val)}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Ultra-Premium City Selector */}
                        <div className="bg-card backdrop-blur-2xl border border-border rounded-3xl p-5 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative group transition-all duration-500 z-30">
                            <h3 className="font-black text-[10px] mb-6 flex items-center gap-2.5 uppercase tracking-[0.3em] text-gray-500 dark:text-zinc-400 group-hover:text-primary transition-colors">
                                <MapPin className="w-3.5 h-3.5 text-primary" />
                                <span>Popüler Şehirler</span>
                            </h3>
                            <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                                <button
                                    onClick={() => setSelectedCity(null)}
                                    className={cn(
                                        "w-full text-left px-5 py-4 rounded-2xl text-[10px] font-black transition-all duration-500 flex justify-between items-center group/btn border",
                                        selectedCity === null
                                            ? "bg-gold-gradient text-black shadow-[0_10px_20px_rgba(212,175,55,0.2)] border-transparent"
                                            : "text-gray-500 dark:text-zinc-400 bg-gray-50/50 dark:bg-zinc-900/50 border-gray-100 dark:border-white/5 hover:border-primary/40 hover:text-gray-900 dark:hover:text-white"
                                    )}
                                >
                                    <span className="uppercase tracking-[0.2em]">Tüm Şehirler</span>
                                    <span className={cn("text-[9px] font-black px-2.5 py-1 rounded-full transition-all duration-500",
                                        selectedCity === null ? "bg-black/20 text-black" : "bg-primary/10 text-primary group-hover/btn:bg-primary group-hover/btn:text-black"
                                    )}>{listings.length}</span>
                                </button>
                                {cities.map(city => (
                                    <button
                                        key={city.id}
                                        onClick={() => setSelectedCity(city.slug)}
                                        className={cn(
                                            "w-full text-left px-5 py-4 rounded-2xl text-[10px] font-black transition-all duration-500 flex justify-between items-center group/btn border",
                                            selectedCity === city.slug
                                                ? "bg-gold-gradient text-black shadow-[0_10px_20px_rgba(212,175,55,0.2)] border-transparent"
                                                : "text-gray-500 dark:text-zinc-400 bg-gray-50/50 dark:bg-zinc-900/50 border-gray-100 dark:border-white/5 hover:border-primary/40 hover:text-gray-900 dark:hover:text-white"
                                        )}
                                    >
                                        <span className="uppercase tracking-[0.2em]">{city.name}</span>
                                        <ChevronDown className={cn("w-3.5 h-3.5 -rotate-90 transition-all duration-500",
                                            selectedCity === city.slug ? "text-black translate-x-1" : "text-primary/40 group-hover/btn:text-primary group-hover/btn:translate-x-1"
                                        )} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Ultra-Premium Categories Container */}
                        {!hideCategories && (
                            <div className="bg-card backdrop-blur-2xl border border-border rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative transition-all duration-500">
                                <h3 className="font-black text-[10px] mb-6 flex items-center gap-2.5 uppercase tracking-[0.3em] text-zinc-400">
                                    <Grid className="w-3.5 h-3.5 text-primary" />
                                    <span>Kategoriler</span>
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {categories.map(cat => (
                                        <Link
                                            key={cat.id}
                                            href={`/ilanlar?category=${cat.slug}`}
                                            className="px-4 py-2.5 bg-gray-100 dark:bg-zinc-900 border border-gray-200 dark:border-white/5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-zinc-400 hover:bg-gold-gradient hover:text-black hover:border-transparent transition-all duration-500 active:scale-90 shadow-lg"
                                        >
                                            {cat.name}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* COLUMN 3: MAIN GRID */}
                <main className="flex-1 min-w-0">
                    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between bg-card p-5 rounded-2xl border border-border shadow-2xl gap-4">
                        <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-gold-gradient rounded-full inline-block" />
                            <span className="text-foreground">
                                {selectedCity
                                    ? <>{cities.find(c => c.slug === selectedCity)?.name} <span className="text-primary italic">Profilleri</span></>
                                    : <>Tüm <span className="text-primary italic">İlanlar</span></>
                                }
                            </span>
                        </h2>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-primary bg-primary/10 px-4 py-2 rounded-xl uppercase tracking-[0.2em] border border-primary/20">
                                {filteredListings.length} Aktif İlan
                            </span>
                        </div>
                    </div>

                    {filteredListings.length > 0 ? (
                        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-5 duration-700">
                            {/* PREMIUM SECTION */}
                            {premiumListings.length > 0 && (
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-7 bg-gold-gradient rounded-full shadow-[0_0_20px_rgba(234,179,8,0.4)]" />
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

                            {/* VIP SECTION */}
                            {vipListings.length > 0 && (
                                <section className="space-y-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-6 bg-zinc-700/50 rounded-full" />
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

                            {/* NORMAL SECTION (Larger Grid) */}
                            <section className="space-y-6">
                                <div className="flex items-center gap-3">
                                    <div className="w-1 h-6 bg-zinc-800/30 rounded-full" />
                                    <h2 className="text-base md:text-lg font-black text-foreground uppercase tracking-tight opacity-50">
                                        Tüm <span className="italic">Profiller</span>
                                    </h2>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
                                    {normalListings.map((listing) => (
                                        <ProfileCard key={listing.id} listing={listing} isFeatured={listing.is_featured} />
                                    ))}
                                </div>
                            </section>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-muted-foreground bg-card rounded-3xl border border-dashed border-border shadow-inner">
                            <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6 border border-primary/10">
                                <Search className="w-10 h-10 opacity-20 text-primary" />
                            </div>
                            <p className="font-black uppercase tracking-[0.2em] text-foreground">Sonuç bulunamadı</p>
                            <p className="text-xs mt-2 italic">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
                            <button
                                onClick={() => { setFilters({ age: 'all', height: 'all', weight: 'all', breast: 'all', hair: 'all', race: 'all' }); setSelectedCity(null); setSearchQuery(''); }}
                                className="mt-8 text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                            >
                                Tüm Filtreleri Sıfırla
                            </button>
                        </div>
                    )}
                </main>

                {/* COLUMN 4: RIGHT ADS (Skinny) - Desktop Only */}
                {rightAds.length > 0 && (
                    <aside className="hidden lg:block w-28 xl:w-32 shrink-0">
                        <div className="sticky top-24 space-y-4">
                            <div className="text-[10px] font-black text-primary/50 uppercase tracking-[0.2em] text-center mb-4">Sponsorlu</div>
                            <AdSidebar ads={rightAds} />
                        </div>
                    </aside>
                )}
            </div>
        </div>
    );
}
