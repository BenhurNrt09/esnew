'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Filter, ChevronDown, MapPin, Search, Grid, Scale, Ruler, User } from 'lucide-react';
import { cn } from "@repo/ui/src/lib/utils";
import { ProfileCard } from './ProfileCard';
import { AdSidebar } from './AdSidebar';

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

    const handleFilterChange = (key: string, value: string) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className="w-full max-w-[2200px] mx-auto px-4 md:px-8 py-8">
            <div className="flex flex-col lg:flex-row gap-8 xl:gap-16">

                {/* COLUMN 1: LEFT ADS (Skinny) - Desktop Only */}
                {leftAds.length > 0 && (
                    <aside className="hidden xl:block w-40 shrink-0">
                        <div className="sticky top-24 space-y-4">
                            <div className="text-[10px] font-black text-primary/50 uppercase tracking-[0.2em] text-center mb-4">Sponsorlu</div>
                            <AdSidebar ads={leftAds} />
                        </div>
                    </aside>
                )}

                {/* COLUMN 2: FILTERS (Sidebar) */}
                <aside className="w-full lg:w-72 shrink-0">
                    <div className="lg:sticky lg:top-24 space-y-6">

                        {/* Search Box */}
                        <div className="bg-white dark:bg-black border border-gray-100 dark:border-white/5 rounded-2xl p-5 shadow-xl relative group overflow-hidden transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <div className="relative z-10">
                                <h3 className="font-black text-xs mb-4 flex items-center gap-2 uppercase tracking-[0.15em] text-gray-900 dark:text-gray-200">
                                    <Search className="w-4 h-4 text-primary" /> Hızlı Profil Ara
                                </h3>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="İsim veya özellik..."
                                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl pl-9 pr-4 py-3 text-xs text-gray-900 dark:text-white focus:outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-gray-400 placeholder:italic placeholder:dark:text-gray-600"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Advanced Filters */}
                        <div className="bg-white dark:bg-black border border-gray-100 dark:border-white/5 rounded-2xl p-5 shadow-xl relative group transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                            <div className="relative z-10 flex items-center justify-between mb-6 border-b border-gray-100 dark:border-white/10 pb-4">
                                <h3 className="font-black text-xs flex items-center gap-2 uppercase tracking-[0.15em] text-gray-900 dark:text-gray-200">
                                    <Filter className="w-4 h-4 text-primary" /> Detaylı Filtreleme
                                </h3>
                                <button
                                    onClick={() => {
                                        setFilters({ age: 'all', height: 'all', weight: 'all', breast: 'all', hair: 'all', race: 'all' });
                                        setSelectedCity(null);
                                        setSearchQuery('');
                                    }}
                                    className="text-[9px] font-black text-primary hover:text-primary/70 uppercase tracking-widest transition-colors"
                                >
                                    Temizle
                                </button>
                            </div>

                            <div className="relative z-10 space-y-5">
                                {/* Race/Ethnicity */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest ml-1">Etnik Köken</label>
                                    <div className="relative">
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary pointer-events-none" />
                                        <select
                                            className="w-full h-11 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all outline-none appearance-none cursor-pointer hover:border-gray-300 dark:hover:border-gray-300"
                                            value={filters.race}
                                            onChange={(e) => handleFilterChange('race', e.target.value)}
                                        >
                                            <option value="all">Tüm Kökenler</option>
                                            <option value="turk">Türk</option>
                                            <option value="rus">Rus / Slav</option>
                                            <option value="latin">Latin</option>
                                            <option value="asian">Asyalı</option>
                                            <option value="black">Siyahi</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Hair Color */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest ml-1">Saç Rengi</label>
                                    <div className="relative">
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary pointer-events-none" />
                                        <select
                                            className="w-full h-11 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all outline-none appearance-none cursor-pointer hover:border-gray-300 dark:hover:border-gray-300"
                                            value={filters.hair}
                                            onChange={(e) => handleFilterChange('hair', e.target.value)}
                                        >
                                            <option value="all">Tüm Renkler</option>
                                            <option value="sarışın">Sarışın</option>
                                            <option value="esmer">Esmer</option>
                                            <option value="kumral">Kumral</option>
                                            <option value="kızıl">Kızıl</option>
                                            <option value="siyah">Siyah</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Age Filter */}
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest ml-1">Yaş Aralığı</label>
                                    <div className="relative">
                                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-primary pointer-events-none" />
                                        <select
                                            className="w-full h-11 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 text-xs font-bold text-gray-700 dark:text-gray-200 focus:ring-4 focus:ring-primary/5 focus:border-primary/40 transition-all outline-none appearance-none cursor-pointer hover:border-gray-300 dark:hover:border-gray-300"
                                            value={filters.age}
                                            onChange={(e) => handleFilterChange('age', e.target.value)}
                                        >
                                            <option value="all">Tüm Yaşlar</option>
                                            <option value="18-25">18 - 25 Yaş</option>
                                            <option value="25-30">25 - 30 Yaş</option>
                                            <option value="30-35">30 - 35 Yaş</option>
                                            <option value="35-plus">35 Üstü</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest ml-1">Boy</label>
                                        <select
                                            className="w-full h-11 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 text-xs font-bold text-gray-700 dark:text-gray-200 focus:outline-none focus:border-primary/40 appearance-none cursor-pointer"
                                            value={filters.height}
                                            onChange={(e) => handleFilterChange('height', e.target.value)}
                                        >
                                            <option value="all">Tümü</option>
                                            <option value="short">Minyon</option>
                                            <option value="medium">Orta</option>
                                            <option value="tall">Uzun</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-widest ml-1">Kilo</label>
                                        <select
                                            className="w-full h-11 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl px-4 text-xs font-bold text-gray-700 dark:text-gray-200 focus:outline-none focus:border-primary/40 appearance-none cursor-pointer"
                                            value={filters.weight}
                                            onChange={(e) => handleFilterChange('weight', e.target.value)}
                                        >
                                            <option value="all">Tümü</option>
                                            <option value="skinny">Zayıf</option>
                                            <option value="normal">Fit</option>
                                            <option value="curvy">Kıvrımlı</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* City Filter */}
                        <div className="bg-white dark:bg-black border border-gray-100 dark:border-white/5 rounded-2xl p-5 shadow-xl transition-colors">
                            <h3 className="font-black text-xs mb-4 flex items-center gap-2 uppercase tracking-[0.15em] text-gray-900 dark:text-gray-200">
                                <MapPin className="w-4 h-4 text-primary" /> Popüler Şehirler
                            </h3>
                            <div className="space-y-1.5 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
                                <button
                                    onClick={() => setSelectedCity(null)}
                                    className={cn(
                                        "w-full text-left px-4 py-3 rounded-xl text-[11px] font-black transition-all flex justify-between items-center group/btn border border-transparent",
                                        selectedCity === null
                                            ? "bg-gold-gradient text-black shadow-lg shadow-primary/20"
                                            : "text-gray-500 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white border-transparent hover:border-gray-200 dark:hover:border-white/10"
                                    )}
                                >
                                    <span className="uppercase tracking-widest">Tüm Şehirler</span>
                                    <span className={cn("text-[9px] font-black bg-black/20 px-2 py-0.5 rounded-full",
                                        selectedCity === null ? "text-black" : "text-gray-500 group-hover/btn:text-gray-300"
                                    )}>{listings.length}</span>
                                </button>
                                {cities.map(city => (
                                    <button
                                        key={city.id}
                                        onClick={() => setSelectedCity(city.slug)}
                                        className={cn(
                                            "w-full text-left px-4 py-3 rounded-xl text-[11px] font-black transition-all flex justify-between items-center group/btn border border-transparent",
                                            selectedCity === city.slug
                                                ? "bg-gold-gradient text-black shadow-lg shadow-primary/20"
                                                : "text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-100 hover:text-black hover:border-gray-200"
                                        )}
                                    >
                                        <span className="uppercase tracking-widest">{city.name}</span>
                                        <ChevronDown className={cn("w-3 h-3 -rotate-90 opacity-0 group-hover/btn:opacity-100 transition-all",
                                            selectedCity === city.slug ? "text-black opacity-100" : "text-primary"
                                        )} />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Categories */}
                        {!hideCategories && (
                            <div className="bg-white dark:bg-black border border-gray-100 dark:border-white/5 rounded-2xl p-5 shadow-xl transition-colors">
                                <h3 className="font-black text-xs mb-4 flex items-center gap-2 uppercase tracking-[0.15em] text-gray-900 dark:text-gray-200">
                                    <Grid className="w-4 h-4 text-primary" /> Kategoriler
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {categories.map(cat => (
                                        <Link
                                            key={cat.id}
                                            href={`/ilanlar?category=${cat.slug}`}
                                            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-100 border border-gray-200 dark:border-gray-200 rounded-full text-[9px] font-black uppercase tracking-widest text-gray-500 hover:bg-primary hover:text-black hover:border-primary transition-all active:scale-95 duration-300"
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
                <main className="flex-1">
                    <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between bg-white dark:bg-black p-5 rounded-2xl border border-gray-100 dark:border-white/5 shadow-2xl gap-4">
                        <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <span className="w-1.5 h-8 bg-gold-gradient rounded-full inline-block" />
                            <span className="text-gray-900 dark:text-white">
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
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-5 2xl:grid-cols-5 gap-4 animate-in fade-in slide-in-from-bottom-5 duration-700">
                            {filteredListings.map(listing => (
                                <ProfileCard key={listing.id} listing={listing} isFeatured={listing.is_featured} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-600 bg-white dark:bg-black rounded-3xl border border-dashed border-gray-100 dark:border-white/5 shadow-inner">
                            <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mb-6 border border-primary/10">
                                <Search className="w-10 h-10 opacity-20 text-primary" />
                            </div>
                            <p className="font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">Sonuç bulunamadı</p>
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
                {
                    rightAds.length > 0 && (
                        <aside className="hidden xl:block w-40 shrink-0">
                            <div className="sticky top-24 space-y-4">
                                <div className="text-[10px] font-black text-primary/50 uppercase tracking-[0.2em] text-center mb-4">Sponsorlu</div>
                                <AdSidebar ads={rightAds} />
                            </div>
                        </aside>
                    )
                }

            </div >
        </div >
    );
}
