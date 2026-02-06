'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, useToast } from '@repo/ui';
import { Plus, Trash2, DollarSign, Clock, Save, Info, MapPin, Globe } from 'lucide-react';
import { useAuth } from '../../components/AuthProvider';

const durationOptions = [
    '30 Dakika', '45 Dakika', '1 Saat', '1.5 Saat',
    '2 Saat', '3 Saat', '4 Saat', 'Gecelik',
    'Haftalık', 'Vaftalık', '24 Saat'
];

const currencies = [
    { code: 'TRY', symbol: '₺', label: 'Türk Lirası' },
    { code: 'USD', symbol: '$', label: 'Amerikan Doları' },
    { code: 'EUR', symbol: '€', label: 'Euro' }
];

export default function PricingPage() {
    const toast = useToast();
    const supabase = createClient();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [listingId, setListingId] = useState<string | null>(null);
    const [pricing, setPricing] = useState<any[]>([]);

    useEffect(() => {
        const loadPricing = async () => {
            if (!user) return;

            const { data: listing } = await supabase.from('listings').select('id').eq('user_id', user.id).single();

            if (listing) {
                setListingId(listing.id);
                const { data: pricingData } = await supabase
                    .from('model_pricing')
                    .select('*')
                    .eq('listing_id', listing.id)
                    .order('created_at', { ascending: true });

                if (pricingData && pricingData.length > 0) {
                    setPricing(pricingData.map(p => ({
                        id: p.id,
                        duration: p.duration,
                        price: p.price || '',
                        location: p.location || '',
                        currency: p.currency || 'TRY'
                    })));
                } else {
                    setPricing([{ duration: '1 Saat', price: '', location: 'Kendi Yerim', currency: 'TRY' }]);
                }
            }
            setLoading(false);
        };

        if (!authLoading) {
            loadPricing();
        }
    }, [user, authLoading]);

    const addTier = () => {
        setPricing([...pricing, { duration: '1 Saat', price: '', location: '', currency: 'TRY' }]);
    };

    const removeTier = (index: number) => {
        setPricing(pricing.filter((_, i) => i !== index));
    };

    const updateTier = (index: number, field: string, value: any) => {
        const newPricing = [...pricing];
        newPricing[index][field] = value;
        setPricing(newPricing);
    };

    const handleSave = async () => {
        if (!listingId) return;
        setSaving(true);

        try {
            await supabase.from('model_pricing').delete().eq('listing_id', listingId);

            const toSave = pricing
                .filter(p => p.price)
                .map(p => ({
                    listing_id: listingId,
                    duration: p.duration,
                    price: parseFloat(p.price),
                    location: p.location,
                    currency: p.currency
                }));

            if (toSave.length > 0) {
                const { error } = await supabase.from('model_pricing').insert(toSave);
                if (error) throw error;
            }

            toast.success('Fiyatlandırma başarıyla güncellendi!');
        } catch (err: any) {
            toast.error('Hata: ' + (err.message || 'Bir hata oluştu.'));
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) return <div className="min-h-screen flex items-center justify-center font-black text-gray-400 animate-pulse">YÜKLENİYOR...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Fiyatlandırma Stratejisi</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Hizmet sürelerinizi ve ücretlerinizi modern barlarla yönetin.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-white font-black uppercase tracking-widest px-10 h-14 rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 transition-all"
                >
                    <Save className="w-4 h-4 mr-2" /> {saving ? 'KAYDEDİLİYOR...' : 'FİYATLARI YAYINLA'}
                </Button>
            </div>

            <div className="space-y-4">
                {pricing.map((tier, idx) => (
                    <Card key={idx} className="shadow-2xl shadow-gray-200/50 dark:shadow-none bg-white dark:bg-[#0a0a0a] border-gray-100 dark:border-white/5 rounded-[2rem] overflow-hidden group hover:border-primary/20 transition-all border-l-8 border-l-primary">
                        <CardContent className="p-6 md:p-8 flex flex-col lg:flex-row items-center gap-6">

                            {/* Duration Selection */}
                            <div className="w-full lg:w-1/4 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Hizmet Süresi</label>
                                <div className="relative">
                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                    <select
                                        className="w-full h-12 pl-11 pr-4 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-700 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                                        value={tier.duration}
                                        onChange={(e) => updateTier(idx, 'duration', e.target.value)}
                                    >
                                        {durationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Location Input */}
                            <div className="w-full lg:w-1/4 space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Lokasyon / Yer</label>
                                <div className="relative">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                                    <Input
                                        className="pl-11 h-12 rounded-xl border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-gray-900 dark:text-white"
                                        placeholder="Örn: Kendi Yerim"
                                        value={tier.location}
                                        onChange={(e) => updateTier(idx, 'location', e.target.value)}
                                    />
                                </div>
                            </div>

                            {/* Price & Currency */}
                            <div className="flex-1 w-full flex items-center gap-3">
                                <div className="flex-1 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Ücret</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-black text-xl">
                                            {currencies.find(c => c.code === tier.currency)?.symbol}
                                        </span>
                                        <Input
                                            className="pl-12 h-14 rounded-xl border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-black text-xl text-gray-900 dark:text-white"
                                            placeholder="0.00"
                                            type="number"
                                            value={tier.price}
                                            onChange={(e) => updateTier(idx, 'price', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="w-32 space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Para Birimi</label>
                                    <select
                                        className="w-full h-14 px-4 rounded-xl border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-black text-gray-700 dark:text-white focus:ring-2 focus:ring-primary/20 outline-none"
                                        value={tier.currency}
                                        onChange={(e) => updateTier(idx, 'currency', e.target.value)}
                                    >
                                        {currencies.map(c => <option key={c.code} value={c.code}>{c.code}</option>)}
                                    </select>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="pt-6 lg:pt-0">
                                <button
                                    onClick={() => removeTier(idx)}
                                    className="p-4 rounded-2xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100 active:scale-95 shadow-sm"
                                    title="Dili Sil"
                                >
                                    <Trash2 className="w-6 h-6" />
                                </button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <button
                onClick={addTier}
                className="w-full h-20 border-4 border-dashed border-gray-100 dark:border-white/5 rounded-[2.5rem] flex items-center justify-center gap-3 text-gray-300 dark:text-gray-700 hover:border-primary/40 hover:text-primary hover:bg-primary/5 transition-all font-black uppercase tracking-[0.2em] text-sm group"
            >
                <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" /> YENİ FİYAT BARI EKLE
            </button>

            <div className="bg-gray-900 dark:bg-[#0a0a0a] border border-transparent dark:border-white/5 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-gray-900/40">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Globe className="w-40 h-40" />
                </div>
                <div className="relative z-10 space-y-4">
                    <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-3">
                        <Globe className="w-6 h-6 text-primary" /> Küresel Fiyatlandırma
                    </h3>
                    <p className="text-gray-400 font-medium max-w-2xl leading-relaxed">
                        Farklı para birimleri seçerek hem yerel hem de uluslararası müşterilere hitap edebilirsiniz.
                        Dolar ve Euro bazlı fiyatlandırma, turist müşteriler için daha profesyonel bir görünüm sunar.
                    </p>
                </div>
            </div>
        </div>
    );
}
