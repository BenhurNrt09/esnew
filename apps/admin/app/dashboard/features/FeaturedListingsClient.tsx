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
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3 uppercase tracking-tighter">
                        <Star className="h-8 w-8 text-primary fill-primary" />
                        Vitrin <span className="text-primary italic">Yönetimi</span>
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium">
                        Profilleri vitrine ekleyin ve süre bazlı yönetin
                    </p>
                </div>
                <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gold-gradient hover:opacity-90 text-black font-black uppercase tracking-tight rounded-xl shadow-lg shadow-primary/20 px-6 h-12"
                >
                    <Plus className="mr-2 h-5 w-5" /> Vitrine Ekle
                </Button>
            </div>

            {/* Active Featured Listings */}
            <div className="space-y-6">
                <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    Aktif Vitrin Profilleri ({featuredListings.length})
                </h2>

                {featuredListings.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 rounded-2xl border-2 border-dashed border-white/10 backdrop-blur-sm">
                        <Star className="h-16 w-16 mx-auto text-white/10 mb-6" />
                        <p className="text-gray-400 font-bold text-lg">Henüz vitrin profili yok</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {featuredListings.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl backdrop-blur-sm hover:border-primary/30 transition-all group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="font-black text-white text-lg truncate flex-1 uppercase tracking-tight group-hover:text-primary transition-colors">
                                        {item.listing?.title || 'Bilinmeyen Profil'}
                                    </h3>
                                    <button
                                        onClick={() => removeFromFeatured(item.listing_id)}
                                        className="text-gray-500 hover:text-red-500 transition-colors p-1"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 text-sm text-gray-400 mb-6 bg-black/40 p-3 rounded-xl border border-white/5">
                                    <Clock className="h-4 w-4 text-primary" />
                                    <span className="font-black text-primary font-mono">{getRemainingTime(item.featured_until)}</span>
                                </div>

                                <div className="flex flex-wrap gap-2 pt-4 border-t border-white/5">
                                    {[1, 2, 4, 6].map(hours => (
                                        <button
                                            key={hours}
                                            onClick={() => extendFeatured(item.listing_id, hours)}
                                            className="text-[10px] font-black uppercase tracking-widest px-3 py-2 bg-white/5 hover:bg-gold-gradient hover:text-black rounded-lg transition-all border border-white/5"
                                        >
                                            +{hours}S
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
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 backdrop-blur-md">
                    <div className="bg-zinc-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h2 className="text-xl font-black text-white uppercase tracking-tighter">Vitrine Profil Ekle</h2>
                            <button
                                onClick={() => setShowAddModal(false)}
                                className="text-gray-500 hover:text-white"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {/* Search */}
                            <input
                                type="text"
                                placeholder="Profil ara..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white font-medium placeholder:text-gray-500"
                            />

                            {/* Listing Selection */}
                            <div className="max-h-64 overflow-y-auto border border-white/10 rounded-xl bg-black/20 divide-y divide-white/5">
                                {filteredListings.map((listing) => {
                                    const isFeatured = featuredListings.some(f => f.listing_id === listing.id);
                                    return (
                                        <div
                                            key={listing.id}
                                            onClick={() => !isFeatured && setSelectedListing(listing.id)}
                                            className={`p-4 cursor-pointer transition-all ${selectedListing === listing.id
                                                ? 'bg-primary/10 border-l-4 border-l-primary'
                                                : isFeatured
                                                    ? 'bg-white/5 opacity-50 cursor-not-allowed'
                                                    : 'hover:bg-white/5'
                                                }`}
                                        >
                                            <div className="flex justify-between items-center">
                                                <span className={`text-sm tracking-tight ${selectedListing === listing.id ? 'font-black text-primary uppercase' : 'font-bold text-gray-300'}`}>
                                                    {listing.title}
                                                    {isFeatured && <span className="ml-2 text-[10px] font-black uppercase text-primary/60 italic">Zaten Vitrinde</span>}
                                                </span>
                                                {listing.price && (
                                                    <span className="text-xs font-mono text-gray-500">{listing.price} ₺</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Duration Selection */}
                            {selectedListing && (
                                <div className="space-y-6 pt-6 border-t border-white/10 animate-in slide-in-from-top-4 duration-300">
                                    <h3 className="font-black text-xs text-primary uppercase tracking-widest">Vitrin Süresi Seç:</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {DURATION_OPTIONS.map((option) => (
                                            <button
                                                key={option.hours}
                                                type="button"
                                                onClick={() => setSelectedDuration(option.hours)}
                                                className={`px-4 py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${selectedDuration === option.hours
                                                    ? 'bg-gold-gradient text-black shadow-lg shadow-primary/20 scale-[1.02]'
                                                    : 'bg-white/5 hover:bg-white/10 text-gray-400 border border-white/5'
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
                                                className="w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl pr-16 text-white font-black outline-none focus:ring-1 focus:ring-primary"
                                                placeholder="Özel saat"
                                            />
                                            <span className="absolute right-4 top-3 text-primary font-black text-[10px] uppercase tracking-widest">SAAT</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-4 pt-6 border-t border-white/5">
                                        <Button
                                            variant="ghost"
                                            onClick={() => {
                                                setSelectedListing('');
                                                setSelectedDuration(null);
                                            }}
                                            className="flex-1 h-12 text-gray-400 font-bold hover:text-white hover:bg-white/5"
                                        >
                                            Vazgeç
                                        </Button>
                                        <Button
                                            onClick={() => selectedDuration && addToFeatured(selectedDuration)}
                                            disabled={!selectedDuration}
                                            className="flex-1 bg-gold-gradient hover:opacity-90 text-black font-black uppercase tracking-tight h-12 rounded-xl"
                                        >
                                            <Timer className="mr-2 h-5 w-5" />
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
