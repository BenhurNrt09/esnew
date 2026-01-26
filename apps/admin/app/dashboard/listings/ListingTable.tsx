'use client';

import { useState } from 'react';
import { ListingActions } from './ListingActions';
import type { Listing, City, Category } from '@repo/types';
import { Input } from '@repo/ui';
import { Search, Filter, X } from 'lucide-react';

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

    return (
        <div className="space-y-4">
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-white p-4 rounded-lg border shadow-sm">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="İsim veya açıklama ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                    />
                </div>

                <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                >
                    <option value="">Tüm Kategoriler</option>
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                >
                    <option value="">Tüm Şehirler</option>
                    {cities.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                </select>

                {(searchTerm || categoryFilter || cityFilter) && (
                    <button
                        onClick={clearFilters}
                        className="flex items-center justify-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                        <X className="h-4 w-4" /> Filtreleri Temizle
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-muted/40 text-xs uppercase border-b">
                            <tr>
                                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Profil</th>
                                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Konum</th>
                                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Kategori</th>
                                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Fiyat</th>
                                <th className="text-left py-4 px-6 font-medium text-muted-foreground">Durum</th>
                                <th className="text-right py-4 px-6 font-medium text-muted-foreground">İşlemler</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {filteredListings.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-muted-foreground">
                                        {listings.length === 0
                                            ? "Henüz profil bulunmuyor."
                                            : "Aramanızla eşleşen profil bulunamadı."}
                                    </td>
                                </tr>
                            ) : (
                                filteredListings.map((listing) => (
                                    <tr key={listing.id} className="hover:bg-muted/30 transition-colors">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold overflow-hidden border border-red-200">
                                                    {listing.title.charAt(0).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-sm text-foreground">{listing.title}</p>
                                                    <p className="text-xs text-muted-foreground font-mono">{listing.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6 text-sm">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                {listing.city?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                                {listing.category?.name || '-'}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6 text-sm font-medium">
                                            {listing.price ? (
                                                new Intl.NumberFormat('tr-TR', {
                                                    style: 'currency',
                                                    currency: 'TRY',
                                                }).format(listing.price)
                                            ) : <span className="text-muted-foreground text-xs">Görüşülür</span>}
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center gap-2">
                                                {listing.is_active ? (
                                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-green-50 border border-green-100">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                                                        <span className="text-xs font-medium text-green-700">Yayında</span>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-gray-50 border border-gray-100">
                                                        <div className="h-1.5 w-1.5 rounded-full bg-gray-400" />
                                                        <span className="text-xs font-medium text-gray-500">Pasif</span>
                                                    </div>
                                                )}
                                                {listing.is_featured && (
                                                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-amber-50 border border-amber-100" title="Vitrin">
                                                        <span className="text-xs font-bold text-amber-600">★ Vitrin</span>
                                                    </div>
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
