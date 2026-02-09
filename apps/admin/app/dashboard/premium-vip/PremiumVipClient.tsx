'use client';

import { useEffect, useState } from 'react';
import { Sparkles, Crown, Clock, Plus, X, Timer, Search } from 'lucide-react';
import { Button, cn } from '@repo/ui';

interface Listing {
    id: string;
    title: string;
    slug: string;
    phone: string | null;
    price: number | null;
    created_at: string;
    is_premium: boolean;
    is_vip: boolean;
}

interface TierListing {
    id: string;
    listing_id: string;
    until: string;
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
    { label: '7 Gün', hours: 168 },
    { label: '30 Gün', hours: 720 },
];

export default function PremiumVipClient() {
    const [activeTab, setActiveTab] = useState<'premium' | 'vip'>('premium');
    const [premiumListings, setPremiumListings] = useState<TierListing[]>([]);
    const [vipListings, setVipListings] = useState<TierListing[]>([]);
    const [allListings, setAllListings] = useState<Listing[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedListing, setSelectedListing] = useState<string>('');
    const [selectedDuration, setSelectedDuration] = useState<number | null>(null);
    const [customHours, setCustomHours] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchData = async () => {
        try {
            const [premiumRes, vipRes, listingsRes] = await Promise.all([
                fetch('/api/premium-listings'),
                fetch('/api/vip-listings'),
                fetch('/api/admin/listings')
            ]);

            const premiumData = await premiumRes.json();
            const vipData = await vipRes.json();
            const listingsData = await listingsRes.json();

            setPremiumListings(premiumData.data?.map((d: any) => ({ ...d, until: d.premium_until })) || []);
            setVipListings(vipData.data?.map((d: any) => ({ ...d, until: d.vip_until })) || []);
            setAllListings(listingsData.data || []);
        } catch (error: any) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (hours: number) => {
        if (!selectedListing) return;

        const endpoint = activeTab === 'premium' ? '/api/premium-listings' : '/api/vip-listings';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listing_id: selectedListing, hours }),
            });

            if (res.ok) {
                await fetchData();
                setShowAddModal(false);
                setSelectedListing('');
                setSelectedDuration(null);
            } else {
                const data = await res.json();
                alert(`Hata: ${data.error}`);
            }
        } catch (error) {
            alert('Bir hata oluştu');
        }
    };

    const handleRemove = async (listingId: string) => {
        if (!confirm('Emin misiniz?')) return;
        const endpoint = activeTab === 'premium' ? '/api/premium-listings' : '/api/vip-listings';

        try {
            const res = await fetch(`${endpoint}?listing_id=${listingId}`, {
                method: 'DELETE',
            });

            if (res.ok) await fetchData();
        } catch (error) {
            alert('Silinemedi');
        }
    };

    const handleExtend = async (listingId: string, hours: number) => {
        const endpoint = activeTab === 'premium' ? '/api/premium-listings' : '/api/vip-listings';

        try {
            const res = await fetch(endpoint, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ listing_id: listingId, [activeTab === 'premium' ? 'additional_hours' : 'additional_hours']: hours }),
            });

            if (res.ok) await fetchData();
        } catch (error) {
            alert('Süre uzatılamadı');
        }
    };

    const getRemainingTime = (until: string) => {
        const now = new Date();
        const untilDate = new Date(until);
        const diff = untilDate.getTime() - now.getTime();
        if (diff < 0) return 'Süresi Doldu';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) return `${days}g ${hours}s`;
        return `${hours}s ${minutes}d`;
    };

    const filteredForAdd = allListings.filter(l =>
        l.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const currentTierListings = activeTab === 'premium' ? premiumListings : vipListings;

    if (loading) return <div className="p-12 text-center text-gray-500 font-bold uppercase tracking-widest animate-pulse">Yükleniyor...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <Sparkles className="h-8 w-8 text-primary shadow-glow" />
                        Premium & VIP <span className="text-primary/70 italic">Yönetimi</span>
                    </h1>
                    <p className="text-gray-500 font-bold mt-1 uppercase text-xs tracking-widest">Özel üyelik paketlerini ve sürelerini yönetin</p>
                </div>
                <Button
                    onClick={() => setShowAddModal(true)}
                    className="bg-gold-gradient text-black font-black uppercase tracking-tight h-12 px-8 rounded-xl shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                >
                    <Plus className="mr-2 h-5 w-5" /> Yeni {activeTab === 'premium' ? 'Premium' : 'VIP'} Ekle
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex bg-white/5 p-1 rounded-2xl mb-8 border border-white/5">
                <button
                    onClick={() => setActiveTab('premium')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all",
                        activeTab === 'premium' ? "bg-gold-gradient text-black shadow-lg" : "text-gray-500 hover:text-white"
                    )}
                >
                    <Crown className="h-4 w-4" /> Premium Paketler
                </button>
                <button
                    onClick={() => setActiveTab('vip')}
                    className={cn(
                        "flex-1 flex items-center justify-center gap-2 py-4 rounded-xl font-black uppercase tracking-widest text-xs transition-all",
                        activeTab === 'vip' ? "bg-gold-gradient text-black shadow-lg" : "text-gray-500 hover:text-white"
                    )}
                >
                    <Sparkles className="h-4 w-4" /> VIP Paketler
                </button>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentTierListings.length === 0 ? (
                    <div className="col-span-full py-20 bg-white/5 rounded-3xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            {activeTab === 'premium' ? <Crown className="h-8 w-8 text-white/20" /> : <Sparkles className="h-8 w-8 text-white/20" />}
                        </div>
                        <p className="text-gray-500 font-black uppercase tracking-widest text-sm">Henüz aktif {activeTab} profil yok</p>
                    </div>
                ) : (
                    currentTierListings.map((item) => (
                        <div key={item.id} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:border-primary/50 transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4">
                                <button onClick={() => handleRemove(item.listing_id)} className="text-gray-600 hover:text-red-500 transition-colors">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="mb-6">
                                <h3 className="font-black text-white text-lg uppercase tracking-tight group-hover:text-primary transition-colors truncate pr-8">
                                    {item.listing?.title}
                                </h3>
                                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mt-1">
                                    {item.listing?.city?.name || 'Şehir Belirtilmedi'}
                                </p>
                            </div>

                            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 mb-6 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                        <Clock className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Kalan Süre</p>
                                        <p className="font-black text-primary font-mono text-lg">{getRemainingTime(item.until)}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2">
                                {[6, 12, 24, 72].map(hours => (
                                    <button
                                        key={hours}
                                        onClick={() => handleExtend(item.listing_id, hours)}
                                        className="py-2 bg-white/5 hover:bg-gold-gradient hover:text-black rounded-lg text-[10px] font-black uppercase transition-all border border-white/5"
                                    >
                                        +{hours < 24 ? hours + 'S' : (hours / 24) + 'G'}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-50 flex items-center justify-center p-4">
                    <div className="bg-zinc-900 border border-white/10 rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
                        <div className="p-8 border-b border-white/10 flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                                    {activeTab === 'premium' ? <Crown className="text-primary h-6 w-6" /> : <Sparkles className="text-primary h-6 w-6" />}
                                    {activeTab === 'premium' ? 'Premium' : 'VIP'} Profil Tanımla
                                </h2>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1">Süre ve profil seçerek yetki tanımlayın</p>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-500 hover:text-white transition-colors">
                                <X className="h-8 w-8" />
                            </button>
                        </div>

                        <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                            {/* Search */}
                            <div className="relative">
                                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-500" />
                                <input
                                    type="text"
                                    placeholder="Model veya başlık ile ara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-6 py-4 bg-black/40 border border-white/10 rounded-2xl focus:ring-2 focus:ring-primary focus:border-transparent outline-none text-white font-bold"
                                />
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {filteredForAdd.map(l => {
                                    const isAlready = activeTab === 'premium' ? l.is_premium : l.is_vip;
                                    return (
                                        <button
                                            key={l.id}
                                            onClick={() => !isAlready && setSelectedListing(l.id)}
                                            className={cn(
                                                "p-4 rounded-2xl border transition-all text-left group",
                                                selectedListing === l.id
                                                    ? "bg-primary/10 border-primary"
                                                    : isAlready
                                                        ? "opacity-40 grayscale cursor-not-allowed border-white/5 bg-white/5"
                                                        : "bg-white/5 border-white/5 hover:border-white/20"
                                            )}
                                        >
                                            <p className={cn("font-black uppercase tracking-tight text-sm", selectedListing === l.id ? "text-primary" : "text-white")}>{l.title}</p>
                                            <p className="text-[10px] font-bold text-gray-500 mt-1 uppercase tracking-widest">
                                                {isAlready ? `Zaten ${activeTab}` : l.slug}
                                            </p>
                                        </button>
                                    );
                                })}
                            </div>

                            {selectedListing && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="flex items-center gap-4 text-primary bg-primary/5 p-4 rounded-2xl border border-primary/10 font-black uppercase text-xs tracking-widest">
                                        <Timer className="h-5 w-5" /> Süre Belirleyin
                                    </div>
                                    <div className="grid grid-cols-4 gap-3">
                                        {DURATION_OPTIONS.map(opt => (
                                            <button
                                                key={opt.hours}
                                                onClick={() => setSelectedDuration(opt.hours)}
                                                className={cn(
                                                    "py-4 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all border",
                                                    selectedDuration === opt.hours
                                                        ? "bg-gold-gradient text-black border-transparent shadow-lg"
                                                        : "bg-white/5 text-gray-500 border-white/5 hover:bg-white/10"
                                                )}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex gap-4 pt-4">
                                        <input
                                            type="number"
                                            placeholder="Özel saat..."
                                            value={customHours}
                                            onChange={(e) => {
                                                const v = parseInt(e.target.value) || 1;
                                                setCustomHours(v);
                                                setSelectedDuration(v);
                                            }}
                                            className="flex-1 bg-black/40 border border-white/10 rounded-xl px-6 py-3 text-white font-black"
                                        />
                                        <Button
                                            onClick={() => selectedDuration && handleAdd(selectedDuration)}
                                            disabled={!selectedDuration}
                                            className="flex-[2] bg-gold-gradient text-black font-black uppercase tracking-tight rounded-xl h-12"
                                        >
                                            Tanımlamayı Onayla
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
