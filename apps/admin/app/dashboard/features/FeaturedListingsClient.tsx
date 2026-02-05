'use client';

import { useEffect, useState } from 'react';
import { Star, Clock, Plus, X, Timer } from 'lucide-react';
import { Button } from '@repo/ui';

interface Listing {
    id: string;
    title: string;
    slug: string;
    phone: string | null;
    price: number | null;
    created_at: string;
    is_featured: boolean;
}

interface FeaturedListing {
    id: string;
    listing_id: string;
    featured_until: string;
    created_at: string;
    listing: Listing;
}

const DURATION_OPTIONS = [
    { label: '1 Saat', hours: 1 },
    { label: '2 Saat', hours: 2 },
    { label: '4 Saat', hours: 4 },
    { label: '6 Saat', hours: 6 },
    { label: '12 Saat', hours: 12 },
    { label: '24 Saat', hours: 24 },
];

export default function FeaturedListingsClient() {
    const [featuredListings, setFeaturedListings] = useState<FeaturedListing[]>([]);
    const [allListings, setAllListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedListing, setSelectedListing] = useState<string>('');
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
    const [customHours, setCustomHours] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
        // Refresh every minute to update countdowns
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            // Fetch featured listings
            const featuredRes = await fetch('/api/featured-listings');
            const featuredData = await featuredRes.json();
            if (featuredData.error) throw new Error(featuredData.error);
            setFeaturedListings(featuredData.data || []);

            // Fetch all listings
            const listingsRes = await fetch('/api/admin/listings');
            const listingsData = await listingsRes.json();
            if (listingsData.error) throw new Error(listingsData.error);
            setAllListings(listingsData.data || []);
        } catch (error: any) {
            console.error('Error fetching data:', error);
            alert(`Veriler alınamadı: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const addToFeatured = async (hours: number) => {
        if (!selectedListing) {
            alert('Lütfen önce bir profil seçin');
            return;
        }

        try {
            const res = await fetch('/api/featured-listings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listing_id: selectedListing, hours }),
            });

            if (res.ok) {
                await fetchData(); // Wait for refresh
                setShowAddModal(false);
                setSelectedListing('');
                setSearchQuery('');
            } else {
                const data = await res.json();
                alert(`Hata: ${data.error || 'Vitrine eklenemedi'}`);
            }
        } catch (error) {
            console.error('Error adding to featured:', error);
            alert('Bir hata oluştu');
        }
    };

    const removeFromFeatured = async (listingId: string) => {
        if (!confirm('Bu profili vitrinden çıkarmak istediğinizden emin misiniz?')) return;

        try {
            const res = await fetch(`/api/featured-listings?listing_id=${listingId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                await fetchData();
            } else {
                alert('Vitrinden çıkarılamadı');
            }
        } catch (error) {
            console.error('Error removing from featured:', error);
            alert('Bir hata oluştu');
        }
    };

    const extendFeatured = async (listingId: string, hours: number) => {
        try {
            const res = await fetch('/api/featured-listings', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listing_id: listingId, additional_hours: hours }),
            });

            if (res.ok) {
                await fetchData();
            } else {
                alert('Süre uzatılamadı');
            }
        } catch (error) {
            console.error('Error extending featured:', error);
            alert('Bir hata oluştu');
        }
    };

    const getRemainingTime = (featuredUntil: string) => {
        const now = new Date();
        const until = new Date(featuredUntil);
        const diff = until.getTime() - now.getTime();

        if (diff < 0) return 'Süresi Doldu';

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        return `${hours}s ${minutes}d`;
    };

    const filteredListings = allListings.filter(listing =>
        listing.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return <div className="p-8 text-center">Yükleniyor...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <Star className="h-8 w-8 text-primary fill-primary" />
                        Vitrin Yönetimi
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        Profilleri vitrine ekleyin ve süre bazlı yönetin
                    </p>
                </div>
                <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-primary hover:bg-primary/90 text-black font-bold"
                >
                    <Plus className="mr-2 h-4 w-4" /> Vitrine Ekle
                </Button>
            </div>

            {/* Active Featured Listings */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray-900">Aktif Vitrin Profilleri ({featuredListings.length})</h2>

                {featuredListings.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                        <Star className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <p className="text-gray-500">Henüz vitrin profili yok</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {featuredListings.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border border-amber-100 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="font-bold text-gray-900 truncate flex-1">
                                        {item.listing?.title || 'Bilinmeyen Profil'}
                                    </h3>
                                    <button
                                        onClick={() => removeFromFeatured(item.listing_id)}
                                        className="text-gray-400 hover:text-amber-600 transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                    <Clock className="h-4 w-4" />
                                    <span className="font-medium text-amber-600">{getRemainingTime(item.featured_until)}</span>
                                </div>

                                <div className="flex flex-wrap gap-2">
                                    {[1, 2, 4, 6].map(hours => (
                                        <button
                                            key={hours}
                                            onClick={() => extendFeatured(item.listing_id, hours)}
                                            className="text-xs px-2 py-1 bg-gray-100 hover:bg-primary hover:text-black rounded transition-colors"
                                        >
                                            +{hours}s
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add to Featured Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold">Vitrine Profil Ekle</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Profil ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            />

                            {/* Listing Selection */}
                            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
                                {filteredListings.map((listing) => {
                                    const isFeatured = featuredListings.some(f => f.listing_id === listing.id);
                                    return (
                                        <div
                                            key={listing.id}
                                            onClick={() => !isFeatured && setSelectedListing(listing.id)}
                                            className={`p-3 border-b border-gray-100 cursor-pointer transition-colors ${selectedListing === listing.id
                                                ? 'bg-primary/10 border-l-4 border-l-primary'
                                                : isFeatured
                                                    ? 'bg-gray-50 opacity-50 cursor-not-allowed'
                                                    : 'hover:bg-gray-50'
                                                }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium text-sm">
                                                    {listing.title}
                                                    {isFeatured && <span className="ml-2 text-xs text-amber-600">Zaten Vitrinde</span>}
                                                </span>
                                                {listing.price && (
                                                    <span className="text-xs text-gray-500">{listing.price} ₺</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Duration Selection */}
                            {selectedListing && (
                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                    <h3 className="font-bold text-sm">Vitrin Süresi Seç:</h3>
                                    <div className="grid grid-cols-3 gap-2">
                                        {DURATION_OPTIONS.map((option) => (
                                            <button
                                                key={option.hours}
                                                type="button"
                                                onClick={() => setSelectedDuration(option.hours)}
                                                className={`px-4 py-3 rounded-lg font-medium text-sm transition-colors ${selectedDuration === option.hours
                                                    ? 'bg-primary text-black ring-2 ring-primary ring-offset-2'
                                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                    }`}
                                            >
                                                {option.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Custom Duration */}
                                    <div className="flex gap-2">
                                        <div className="relative flex-1">
                                            <input
                                                type="number"
                                                min="1"
                                                value={customHours}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value) || 1;
                                                    setCustomHours(val);
                                                    setSelectedDuration(val);
                                                }}
                                                className="w-full px-4 py-2 border border-gray-200 rounded-lg pr-10"
                                                placeholder="Özel saat"
                                            />
                                            <span className="absolute right-3 top-2.5 text-gray-400 text-sm">saat</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                                        <Button
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedListing('');
                                                setSelectedDuration(null);
                                            }}
                                            className="flex-1"
                                        >
                                            Vazgeç
                                        </Button>
                                        <Button
                                            onClick={() => selectedDuration && addToFeatured(selectedDuration)}
                                            disabled={!selectedDuration}
                                            className="flex-1 bg-primary hover:bg-primary/90 text-black font-bold"
                                        >
                                            <Timer className="mr-2 h-4 w-4" />
                                            Vitrine Ekle
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
