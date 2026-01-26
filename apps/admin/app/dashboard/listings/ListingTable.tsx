'use client';

import { useState } from 'react';
import { ListingActions } from './ListingActions';
import type { Listing, City, Category } from '@repo/types';
import { Input } from '@repo/ui';
import { Search, Filter, X, SlidersHorizontal } from 'lucide-react';

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
        <div className="space-y-6">
            {/* Modern Filters Bar */}
            <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm transition-all hover:shadow-md">
                <div className="flex items-center gap-2 mb-4 text-gray-800 font-bold text-sm uppercase tracking-wider">
                    <SlidersHorizontal className="h-4 w-4 text-red-500" />
                    Filtreleme Seçenekleri
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    {/* Search */}
                    <div className="md:col-span-4 relative group">
                        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-red-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="İsim, açıklama veya ID ara..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 bg-gray-50/50 text-sm focus:bg-white focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="md:col-span-3">
                        <div className="relative">
                            <select
                                className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all appearance-none cursor-pointer"
                                value={categoryFilter}
                                onChange={(e) => setCategoryFilter(e.target.value)}
                            >
                                <option value="">Tüm Kategoriler</option>
                                {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <Filter className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* City Filter */}
                    <div className="md:col-span-3">
                        <div className="relative">
                            <select
                                className="w-full h-11 px-4 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none transition-all appearance-none cursor-pointer"
                                value={cityFilter}
                                onChange={(e) => setCityFilter(e.target.value)}
                            >
                                <option value="">Tüm Şehirler</option>
                                {cities.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                            <Filter className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    {/* Clear Button */}
                    <div className="md:col-span-2">
                        <button
                            onClick={clearFilters}
                            disabled={!hasFilters}
                            className={`w-full h-11 rounded-lg flex items-center justify-center gap-2 text-sm font-medium transition-all ${hasFilters
                                    ? 'bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700'
                                    : 'bg-gray-50 text-gray-300 cursor-not-allowed'
                                }`}
                        >
                            <X className="h-4 w-4" /> Temizle
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="flex items-center justify-between text-xs text-gray-500 px-1">
                <div>
                    <span className="font-bold text-gray-900">{filteredListings.length}</span> sonuç bulundu
                </div>
                {hasFilters && (
                    <div className="text-red-500 font-medium">
                        * Filtrelenmiş sonuçlar gösteriliyor
                    </div>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50/50 text-xs uppercase border-b border-gray-100">
                            <tr>
                                <th className="text-left py-4 px-6 font-bold text-gray-500 tracking-wider">Profil</th>
                                <th className="text-left py-4 px-6 font-bold text-gray-500 tracking-wider">Konum</th>
                                <th className="text-left py-4 px-6 font-bold text-gray-500 tracking-wider">Kategori</th>
                                <th className="text-left py-4 px-6 font-bold text-gray-500 tracking-wider">Fiyat</th>
                                <th className="text-left py-4 px-6 font-bold text-gray-500 tracking-wider">Durum</th>
                                <th className="text-right py-4 px-6 font-bold text-gray-500 tracking-wider">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredListings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-16">
                                        <div className="flex flex-col items-center justify-center text-gray-400">
                                            <Search className="h-10 w-10 mb-3 opacity-20" />
                                            <p className="font-medium">Sonuç bulunamadı</p>
                                            <p className="text-xs mt-1">Filtrelerinizi değiştirmeyi deneyin.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredListings.map((listing) => (
                                    <tr key={listing.id} className="hover:bg-red-50/30 transition-colors group">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-red-50 to-white flex items-center justify-center text-red-600 font-black text-lg shadow-sm border border-red-100 group-hover:border-red-200 transition-colors">
                                                    {listing.title.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-sm text-gray-900 group-hover:text-red-700 transition-colors">{listing.title}</p>
                                                    <p className="text-[10px] text-gray-400 font-mono mt-0.5 max-w-[120px] truncate">{listing.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm">
                                            <div className="flex items-center gap-1.5 text-gray-600">
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                                                {listing.city?.name || '-'}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm">
                                            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                                                {listing.category?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm font-bold text-gray-700 font-mono">
                                            {listing.price ? (
                                                new Intl.NumberFormat('tr-TR', {
                                                    style: 'currency',
                                                    currency: 'TRY',
                                                }).format(listing.price)
                                            ) : <span className="text-gray-400 font-normal italic text-xs">Belirtilmedi</span>}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex flex-col gap-1.5 items-start">
                                                {listing.is_active ? (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-100 text-[10px] font-bold uppercase tracking-wide">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Yayında
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 text-[10px] font-bold uppercase tracking-wide">
                                                        Pasif
                                                    </span>
                                                )}

                                                {listing.is_featured && (
                                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-bold uppercase tracking-wide ml-1">
                                                        ★ Vitrin
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-right">
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
