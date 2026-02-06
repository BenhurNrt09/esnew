'use client';

import { useState } from 'react';
import { ListingActions } from './ListingActions';
import type { Listing, City, Category } from '@repo/types';
import { Input, Button } from '@repo/ui';
import { Search, Filter, X, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { Combobox } from '../../components/Combobox';

interface ListingTableProps {
    listings: (Listing & { city?: City; category?: Category })[];
    cities: City[];
    categories: Category[];
}

export function ListingTable({ listings, cities, categories }: ListingTableProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');

    const filteredListings = listings.filter((listing) => {
        const matchesSearch = listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            listing.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter ? listing.category_id === categoryFilter : true;
        const matchesCity = cityFilter ? listing.city_id === cityFilter : true;

        return matchesSearch && matchesCategory && matchesCity;
    });

    const clearFilters = () => {
        setSearchTerm('');
        setCategoryFilter('');
        setCityFilter('');
    };

    const hasFilters = searchTerm || categoryFilter || cityFilter;

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-5 duration-500">
            {/* Modern Filters Bar */}
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 shadow-xl backdrop-blur-sm relative z-30">
                <div className="flex items-center gap-2 mb-6 text-primary font-black text-sm uppercase tracking-widest">
                    <SlidersHorizontal className="h-4 w-4" />
                    Hızlı Filtreleme
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Search */}
                    <div className="md:col-span-4 relative group">
                        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            type="text"
                            placeholder="İsim, Açıklama veya ID ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-11 pl-10 border-white/10 bg-black/40 text-sm focus:bg-black focus:border-primary shadow-sm text-white"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="md:col-span-3">
                        <Combobox
                            options={[{ value: '', label: 'Tüm Kategoriler' }, ...categories.map(c => ({ value: c.id, label: c.name }))]}
                            value={categoryFilter}
                            onChange={(val) => setCategoryFilter(val)}
                            placeholder="Tüm Kategoriler"
                            searchPlaceholder="Kategori ara..."
                            className="w-full"
                        />
                    </div>

                    {/* City Filter */}
                    <div className="md:col-span-3">
                        <Combobox
                            options={[{ value: '', label: 'Tüm Şehirler' }, ...cities.map(c => ({ value: c.id, label: c.name }))]}
                            value={cityFilter}
                            onChange={(val) => setCityFilter(val)}
                            placeholder="Tüm Şehirler"
                            searchPlaceholder="Şehir ara..."
                            className="w-full"
                        />
                    </div>

                    {/* Clear Button */}
                    <div className="md:col-span-2">
                        <Button
                            onClick={clearFilters}
                            disabled={!hasFilters}
                            variant="outline"
                            className={`w-full h-11 rounded-lg border-dashed ${hasFilters
                                ? 'border-primary/30 text-primary hover:bg-primary/5 hover:border-primary/50'
                                : 'border-gray-200 text-gray-300 cursor-not-allowed'
                                }`}
                        >
                            <X className="h-4 w-4 mr-2" /> Temizle
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-between text-xs text-gray-300 px-2 font-medium">
                <div>
                    Toplam <span className="font-black text-primary text-sm">{filteredListings.length}</span> profil listeleniyor
                </div>
                {hasFilters && (
                    <div className="text-black bg-gold-gradient px-3 py-1 rounded-full border-none flex items-center gap-2 shadow-lg">
                        <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></div>
                        Filtrelenmiş sonuçlar
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white/5 rounded-2xl border border-white/10 shadow-sm overflow-hidden backdrop-blur-sm">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-black/60 text-[10px] uppercase border-b border-white/5 backdrop-blur-sm">
                            <tr>
                                <th className="text-left py-5 px-6 font-black text-gray-400 tracking-widest w-[300px]">Profil Detayı</th>
                                <th className="text-left py-5 px-6 font-black text-gray-400 tracking-widest">İl / Kategori</th>
                                <th className="text-left py-5 px-6 font-black text-gray-400 tracking-widest">Saatlik Ücret</th>
                                <th className="text-left py-5 px-6 font-black text-gray-400 tracking-widest">Durum</th>
                                <th className="text-right py-5 px-6 font-black text-gray-400 tracking-widest">Yönetim</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredListings.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="text-center py-20">
                                        <div className="flex flex-col items-center justify-center text-gray-300">
                                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                                                <Search className="h-8 w-8 text-primary" />
                                            </div>
                                            <p className="font-black text-white text-lg uppercase tracking-wider">Sonuç bulunamadı</p>
                                            <p className="text-sm mt-1 text-gray-400">Arama kriterlerinizi değiştirerek tekrar deneyin.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredListings.map((listing) => (
                                    <tr key={listing.id} className="hover:bg-primary/5 transition-colors group">
                                        <td className="py-5 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-sm border overflow-hidden relative ${listing.cover_image ? 'border-white/10' : 'bg-black/40 border-white/10'
                                                    }`}>
                                                    {listing.cover_image ? (
                                                        <img src={listing.cover_image} alt="" className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" />
                                                    ) : (
                                                        <ImageIcon className="h-6 w-6 text-primary/40" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-black text-base text-white group-hover:text-primary transition-colors">{listing.title}</p>
                                                    <p className="text-[11px] text-gray-400 font-mono mt-1 flex items-center gap-1">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60"></span>
                                                        {listing.slug}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
                                                    <span className="text-primary">•</span>
                                                    {listing.city?.name || 'Şehir Yok'}
                                                </div>
                                                <div className="text-xs text-gray-300 bg-white/5 inline-block px-2 py-0.5 rounded border border-white/10 w-fit font-bold">
                                                    {listing.category?.name || 'Kategori Yok'}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-5 px-6">
                                            {listing.price ? (
                                                <span className="text-sm font-bold text-white font-mono bg-green-500/10 text-green-500 px-2 py-1 rounded-md border border-green-500/20">
                                                    {new Intl.NumberFormat('tr-TR', {
                                                        style: 'currency',
                                                        currency: 'TRY',
                                                        minimumFractionDigits: 0
                                                    }).format(listing.price)}
                                                </span>
                                            ) : <span className="text-gray-600 text-xs italic">Fiyat Yok</span>}
                                        </td>
                                        <td className="py-5 px-6">
                                            <div className="flex flex-col gap-1.5 items-start">
                                                {listing.is_active ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] font-bold uppercase tracking-wide">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Yayında
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-bold uppercase tracking-wide">
                                                        Pasif
                                                    </span>
                                                )}

                                                {listing.is_featured && (
                                                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold uppercase tracking-wide">
                                                        ★ Vitrin
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-5 px-6 text-right">
                                            <ListingActions
                                                id={listing.id}
                                                slug={listing.slug}
                                                isActive={listing.is_active || false}
                                                isFeatured={listing.is_featured || false}
                                            />
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
