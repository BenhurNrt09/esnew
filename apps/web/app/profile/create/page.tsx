'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, useToast } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@repo/lib/i18n';
import type { Category, City } from '@repo/types';
import { ModernSelection } from '../../components/ModernSelection';
import { ModernToggle } from '../../components/ModernToggle';
import {
    Phone, User, MapPin, DollarSign, Clock,
    Sparkles, Camera, Heart, Zap, Info,
    Beer, Cigarette, Scissors, Palette, Layers,
    Activity
} from 'lucide-react';

// Options for selection
const breastOptions = [
    { value: 'a', label: 'A Kup', description: 'Küçük' },
    { value: 'b', label: 'B Kup', description: 'Orta' },
    { value: 'bb', label: 'BB Kup', description: 'Dolgun Orta' },
    { value: 'd', label: 'D Kup', description: 'Büyük' },
    { value: 'dd', label: 'DD Kup', description: 'Çok Büyük' },
    { value: 'ff', label: 'FF Kup', description: 'Ekstra Büyük' },
    { value: 'vc', label: 'VC', description: 'Vücutçu' },
];

const bodyHairOptions = [
    { value: 'trasli', label: 'Tıraşlı', description: 'Tamamen pürüzsüz' },
    { value: 'degil', label: 'Tıraşsız', description: 'Doğal görünüm' },
    { value: 'arasira', label: 'Trimli / Bakımlı', description: 'Kısaltılmış' },
];

const durationOptions = ['30 Dakika', '45 Dakika', '1 Saat', '2 Saat', '3 Saat', 'Gecelik', 'Haftalık', '24 Saat'];

const serviceList = [
    { id: 'a_rimming_bana', label: 'A-Rimming (Bana)', icon: <Activity className="w-4 h-4" /> },
    { id: 'a_rimming_sana', label: 'A-Rimming (Sana)', icon: <Activity className="w-4 h-4" /> },
    { id: 'pussy_licking', label: 'Pussy Licking', icon: <Heart className="w-4 h-4" /> },
    { id: 'blowjob', label: 'Sakso', icon: <Zap className="w-4 h-4" /> },
    { id: 'cobf', label: 'COBF', icon: <Zap className="w-4 h-4" /> },
    { id: 'cim', label: 'CIM', icon: <Zap className="w-4 h-4" /> },
    { id: 'deepthroat', label: 'Deepthroat', icon: <Zap className="w-4 h-4" /> },
    { id: 'anal', label: 'Anal', icon: <Zap className="w-4 h-4" /> },
    { id: 'massage', label: 'Masaj', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'girlfriend_exp', label: 'GFE (Kız Arkadaş)', icon: <Heart className="w-4 h-4" /> },
    { id: 'couple', label: 'Çiftlere Hizmet', icon: <Layers className="w-4 h-4" /> },
    { id: 'bondage', label: 'Bondage', icon: <Layers className="w-4 h-4" /> },
];

export default function CreateProfilePage() {
    const router = useRouter();
    const toast = useToast();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState<City[]>([]);
    const supabase = createClient();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        phone: '',
        city_id: '',
        description: '',
        breast_size: '',
        body_hair: '',
        tattoos: false,
        piercings: false,
        smoking: false,
        alcohol: false,
        services: {} as Record<string, boolean>,
        model_pricing: [
            { duration: '1 Saat', incall: '', outcall: '' },
            { duration: 'Gecelik', incall: '', outcall: '' },
            { duration: '24 Saat', incall: '', outcall: '' },
        ]
    });

    useEffect(() => {
        const loadData = async () => {
            const { data } = await supabase.from('cities').select('*').order('name');
            if (data) setCities(data);
        };
        loadData();
    }, []);

    const updatePricing = (index: number, field: string, value: string) => {
        const newPricing = [...formData.model_pricing];
        (newPricing[index] as any)[field] = value;
        setFormData({ ...formData, model_pricing: newPricing });
    };

    const toggleService = (id: string) => {
        setFormData({
            ...formData,
            services: {
                ...formData.services,
                [id]: !formData.services[id]
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Oturum bulunamadı.');

            // Get eskort category ID
            const { data: catData } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', 'eskort')
                .single();

            const categoryId = catData?.id || 'd9e07248-8120-410e-a844-0a3075a34e8f'; // fallback

            // 1. Create Listings entry
            const listingPayload = {
                user_id: user.id,
                title: formData.title,
                slug: `${formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
                city_id: formData.city_id,
                description: formData.description,
                breast_size: formData.breast_size,
                body_hair: formData.body_hair,
                tattoos: formData.tattoos,
                piercings: formData.piercings,
                smoking: formData.smoking,
                alcohol: formData.alcohol,
                services: formData.services,
                category_id: categoryId,
                is_active: false,
                metadata: {},
            };

            const { data: listing, error: listingError } = await supabase
                .from('listings')
                .insert(listingPayload)
                .select()
                .single();

            if (listingError) throw listingError;

            // 2. Insert Pricing tiers
            const pricingData = formData.model_pricing
                .filter(p => p.incall || p.outcall)
                .map(p => ({
                    listing_id: listing.id,
                    duration: p.duration,
                    incall_price: p.incall ? parseFloat(p.incall) : null,
                    outcall_price: p.outcall ? parseFloat(p.outcall) : null,
                }));

            if (pricingData.length > 0) {
                const { error: pricingError } = await supabase.from('model_pricing').insert(pricingData);
                if (pricingError) throw pricingError;
            }

            // 3. Update Model profile (Phone number)
            await supabase.from('independent_models').update({
                phone_number: formData.phone,
                full_name: formData.title
            }).eq('id', user.id);

            toast.success('Profiliniz başarıyla oluşturuldu! Onay sürecinden sonra yayına alınacaktır.');
            router.push('/dashboard');

        } catch (err: any) {
            toast.error('Hata: ' + (err.message || 'Bir hata oluştu.'));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen py-12 bg-muted/20 px-4">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-black text-primary uppercase tracking-tighter mb-2">
                        PROFİLİNİ OLUŞTUR
                    </h1>
                    <p className="text-gray-500 font-medium">Bağımsız model olarak yerini al, kazanmaya başla.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* 1. Personal & Basic Info */}
                    <Card className="shadow-xl border-t-4 border-t-primary rounded-3xl overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-2 text-xl font-bold">
                                <User className="w-5 h-5 text-primary" /> Temel Bilgiler
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">İsim / Sahne Adı *</label>
                                    <Input
                                        placeholder="Örn: Melis"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="rounded-xl h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Telefon Numarası *</label>
                                    <Input
                                        placeholder="05xx xxx xx xx"
                                        required
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        className="rounded-xl h-12"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700 ml-1">Şehir *</label>
                                    <select
                                        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        required
                                        value={formData.city_id}
                                        onChange={e => setFormData({ ...formData, city_id: e.target.value })}
                                    >
                                        <option value="">Şehir Seçiniz</option>
                                        {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 ml-1">Hakkımda</label>
                                <textarea
                                    className="w-full min-h-[120px] p-4 rounded-2xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    placeholder="Kendinden bahset, müşterilerin seni neden seçmeli?"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Pricing Bars */}
                    <Card className="shadow-xl border-t-4 border-t-primary rounded-3xl overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-2 text-xl font-bold">
                                <DollarSign className="w-5 h-5 text-primary" /> Ücretlendirme
                            </CardTitle>
                            <CardDescription>Süre bazlı kendi yerin ve dışarı fiyatlarını belirleyin.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            {formData.model_pricing.map((tier, idx) => (
                                <div key={idx} className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                                    <div className="w-full md:w-1/4">
                                        <select
                                            className="w-full h-11 px-3 rounded-xl border border-gray-200 bg-white text-sm font-bold text-primary"
                                            value={tier.duration}
                                            onChange={(e) => updatePricing(idx, 'duration', e.target.value)}
                                        >
                                            {durationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex-1 w-full grid grid-cols-2 gap-4">
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                            <Input
                                                className="pl-8 rounded-xl h-11 border-gray-200"
                                                placeholder="Kendi Yerim"
                                                type="number"
                                                value={tier.incall}
                                                onChange={(e) => updatePricing(idx, 'incall', e.target.value)}
                                            />
                                        </div>
                                        <div className="relative">
                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-bold">$</span>
                                            <Input
                                                className="pl-8 rounded-xl h-11 border-gray-200"
                                                placeholder="Senin Yerin"
                                                type="number"
                                                value={tier.outcall}
                                                onChange={(e) => updatePricing(idx, 'outcall', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <p className="text-[10px] text-gray-400 italic text-center">* En az bir fiyat alanı doldurulmalıdır.</p>
                        </CardContent>
                    </Card>

                    {/* 3. Physical Attributes */}
                    <Card className="shadow-xl border-t-4 border-t-primary rounded-3xl overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-2 text-xl font-bold">
                                <Sparkles className="w-5 h-5 text-primary" /> Fiziksel Özellikler
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-10">
                            <ModernSelection
                                label="Göğüs Seviyesi"
                                value={formData.breast_size}
                                onChange={(val) => setFormData({ ...formData, breast_size: val })}
                                options={breastOptions}
                            />
                            <ModernSelection
                                label="Vücut Kıl Durumu"
                                value={formData.body_hair}
                                onChange={(val) => setFormData({ ...formData, body_hair: val })}
                                options={bodyHairOptions}
                            />

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <ModernToggle
                                    label="Dövme Var mı?"
                                    checked={formData.tattoos}
                                    onChange={(val) => setFormData({ ...formData, tattoos: val })}
                                    icon={<Palette className="w-4 h-4" />}
                                />
                                <ModernToggle
                                    label="Piercing Var mı?"
                                    checked={formData.piercings}
                                    onChange={(val) => setFormData({ ...formData, piercings: val })}
                                    icon={<Scissors className="w-4 h-4" />}
                                />
                                <ModernToggle
                                    label="Sigara Kullanımı"
                                    checked={formData.smoking}
                                    onChange={(val) => setFormData({ ...formData, smoking: val })}
                                    icon={<Cigarette className="w-4 h-4" />}
                                />
                                <ModernToggle
                                    label="Alkol Kullanımı"
                                    checked={formData.alcohol}
                                    onChange={(val) => setFormData({ ...formData, alcohol: val })}
                                    icon={<Beer className="w-4 h-4" />}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 4. Services / Activities */}
                    <Card className="shadow-xl border-t-4 border-t-primary rounded-3xl overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <CardTitle className="flex items-center gap-2 text-xl font-bold">
                                <Heart className="w-5 h-5 text-primary" /> Hizmetler & İzinler
                            </CardTitle>
                            <CardDescription>Hangi hizmetleri verdiğinizi işaretleyin.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {serviceList.map((service) => (
                                    <ModernToggle
                                        key={service.id}
                                        label={service.label}
                                        checked={formData.services[service.id] || false}
                                        onChange={() => toggleService(service.id)}
                                        icon={service.icon}
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-xl border-2 border-primary/20 bg-primary/5 rounded-3xl">
                        <CardContent className="p-8 text-center flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg text-primary">
                                <Camera className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-primary">Fotoğraflar ve Onay</h3>
                                <p className="text-sm text-gray-500 max-w-md mx-auto">
                                    Profilinizi oluşturduktan sonra dashboard üzerinden fotoğraflarınızı yükleyebilirsiniz. Tüm profiller manuel onaydan geçmektedir.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full h-16 rounded-3xl bg-primary text-white font-black text-xl uppercase tracking-widest hover:scale-[1.02] transition-all shadow-2xl shadow-primary/30"
                        disabled={loading}
                    >
                        {loading ? 'PROFİL OLUŞTURULUYOR...' : 'PROFİLİ TAMAMLA VE KAYDET'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
