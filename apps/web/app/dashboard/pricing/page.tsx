'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, useToast } from '@repo/ui';
import { Plus, Trash2, DollarSign, Clock, Save, Info } from 'lucide-react';

const durationOptions = [
    '30 Dakika', '45 Dakika', '1 Saat', '1.5 Saat',
    '2 Saat', '3 Saat', '4 Saat', 'Gecelik',
    'Haftalık', 'Vaftalık', '24 Saat'
];

export default function PricingPage() {
    const toast = useToast();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [listingId, setListingId] = useState<string | null>(null);
    const [pricing, setPricing] = useState<any[]>([]);

    useEffect(() => {
        const loadPricing = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Get listing
            const { data: listing } = await supabase
                .from('listings')
                .select('id')
                .eq('user_id', user.id)
                .single();

            if (listing) {
                setListingId(listing.id);
                // Get existing pricing
                const { data: pricingData } = await supabase
                    .from('model_pricing')
                    .select('*')
                    .eq('listing_id', listing.id)
                    .order('created_at', { ascending: true });

                if (pricingData && pricingData.length > 0) {
                    setPricing(pricingData.map(p => ({
                        id: p.id,
                        duration: p.duration,
                        incall: p.incall_price || '',
                        outcall: p.outcall_price || ''
                    })));
                } else {
                    // Default tiers if none exist
                    setPricing([
                        { duration: '1 Saat', incall: '', outcall: '' },
                        { duration: 'Gecelik', incall: '', outcall: '' }
                    ]);
                }
            }
            setLoading(false);
        };
        loadPricing();
    }, []);

    const addTier = () => {
        setPricing([...pricing, { duration: '1 Saat', incall: '', outcall: '' }]);
    };

    const removeTier = (index: number) => {
        setPricing(pricing.filter((_, i) => i !== index));
    };

    const updateTier = (index: number, field: string, value: string) => {
        const newPricing = [...pricing];
        newPricing[index][field] = value;
        setPricing(newPricing);
    };

    const handleSave = async () => {
        if (!listingId) return;
        setSaving(true);

        try {
            // First delete existing pricing for this listing to replace
            await supabase.from('model_pricing').delete().eq('listing_id', listingId);

            // Filter out empty tiers
            const toSave = pricing
                .filter(p => p.incall || p.outcall)
                .map(p => ({
                    listing_id: listingId,
                    duration: p.duration,
                    incall_price: p.incall ? parseFloat(p.incall) : null,
                    outcall_price: p.outcall ? parseFloat(p.outcall) : null
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

    if (loading) return <div>Yükleniyor...</div>;

    if (!listingId) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500 font-bold uppercase tracking-widest text-sm mb-4">Profiliniz bulunamadı.</p>
                <Link href="/profile/create">
                    <Button>Hemen Profil Oluştur</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Fiyatlandırma Yönetimi</h1>
                    <p className="text-gray-500 font-medium">Süre bazlı hizmet ücretlerinizi buradan güncelleyin.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-primary text-white font-black uppercase tracking-widest px-8 h-12 rounded-xl shadow-xl shadow-primary/20"
                >
                    <Save className="w-4 h-4 mr-2" /> {saving ? 'KAYDEDİLİYOR...' : 'DEĞİŞİKLİKLERİ KAYDET'}
                </Button>
            </div>

            <Card className="shadow-sm border-gray-100 rounded-3xl overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                    <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                        <DollarSign className="w-5 h-5 text-primary" /> Ücret Tablosu
                    </CardTitle>
                    <CardDescription>Yeni bir bar ekleyebilir veya mevcut olanları silebilirsiniz.</CardDescription>
                </CardHeader>
                <CardContent className="p-8 space-y-6">
                    <div className="space-y-4">
                        {pricing.map((tier, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100 group animate-in fade-in slide-in-from-left-4 duration-300">
                                <div className="w-full md:w-1/4">
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary opacity-50" />
                                        <select
                                            className="w-full h-11 pl-9 pr-3 rounded-xl border border-gray-200 bg-white text-sm font-bold text-gray-700 focus:ring-2 focus:ring-primary/20 outline-none appearance-none"
                                            value={tier.duration}
                                            onChange={(e) => updateTier(idx, 'duration', e.target.value)}
                                        >
                                            {durationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex-1 w-full grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-black opacity-50">$</span>
                                        <Input
                                            className="pl-8 rounded-xl h-11 border-gray-200 bg-white"
                                            placeholder="Kendi Yerim"
                                            type="number"
                                            value={tier.incall}
                                            onChange={(e) => updateTier(idx, 'incall', e.target.value)}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Kendi Yerim</span>
                                    </div>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary font-black opacity-50">$</span>
                                        <Input
                                            className="pl-8 rounded-xl h-11 border-gray-200 bg-white"
                                            placeholder="Senin Yerin"
                                            type="number"
                                            value={tier.outcall}
                                            onChange={(e) => updateTier(idx, 'outcall', e.target.value)}
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400 uppercase">Senin Yerin</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => removeTier(idx)}
                                    className="p-3 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={addTier}
                        className="w-full h-14 border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center gap-2 text-gray-400 hover:border-primary/30 hover:text-primary hover:bg-primary/5 transition-all font-bold uppercase tracking-widest text-sm"
                    >
                        <Plus className="w-5 h-5" /> YENİ FİYAT BARI EKLE
                    </button>
                </CardContent>
            </Card>

            <div className="bg-blue-50 border border-blue-100 p-6 rounded-3xl flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                    <h4 className="font-black text-blue-900 uppercase tracking-tighter">İpucu</h4>
                    <p className="text-sm text-blue-700/80 font-medium">
                        Fiyatlarınızı piyasa ortalamalarına göre düzenlemek daha fazla rezervasyon almanızı sağlar.
                        Ayrıca "24 Saat" opsiyonu VIP müşterilerin en çok tercih ettiği seçenektir.
                    </p>
                </div>
            </div>
        </div>
    );
}
