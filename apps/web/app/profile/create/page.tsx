'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, useToast } from '@repo/ui';
import { cn } from '@repo/ui/src/lib/utils';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@repo/lib/i18n';
import type { Category, City } from '@repo/types';
import { ModernSelection } from '../../components/ModernSelection';
import { ModernToggle } from '../../components/ModernToggle';
import { ModernMultiSelection } from '../../components/ModernMultiSelection';
import {
    Phone, User, MapPin, DollarSign, Clock,
    Sparkles, Camera, Heart, Zap, Info,
    Beer, Cigarette, Scissors, Palette, Layers,
    Activity, Plus, Trash2, Globe, ChevronDown, Smile, Star,
    MessageSquare
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

const orientationOptions = [
    { value: 'straight', label: 'Heteroseksüel', description: 'Karşı cinse ilgi duyar' },
    { value: 'bisexual', label: 'Biseksüel', description: 'Her iki cinse de ilgi duyar' },
    { value: 'lesbian', label: 'Lezbiyen', description: 'Hemcinsi kadınlara ilgi duyar' },
    { value: 'gay', label: 'Gey', description: 'Hemcinsi erkeklere ilgi duyar' },
    { value: 'fetish', label: 'Fetişist', description: 'Özel fetişlere ilgi duyar' },
];

const countryCodes = [
    { code: '+90', flag: '🇹🇷', label: 'TR' },
    { code: '+1', flag: '🇺🇸', label: 'US' },
    { code: '+44', flag: '🇬🇧', label: 'GB' },
    { code: '+49', flag: '🇩🇪', label: 'DE' },
    { code: '+33', flag: '🇫🇷', label: 'FR' },
];

const currencyOptions = [
    { value: 'TRY', label: '₺ TL', symbol: '₺' },
    { value: 'USD', label: '$ USD', symbol: '$' },
    { value: 'EUR', label: '€ EUR', symbol: '€' },
];

const durationOptions = ['30 Dakika', '45 Dakika', '1 Saat', '2 Saat', '3 Saat', 'Gecelik', 'Haftalık', '24 Saat'];

const serviceList = [
    // Oral Services
    { id: 'blowjob_prez', label: 'Sakso (Prezervatifli)', icon: <Zap className="w-4 h-4" /> },
    { id: 'blowjob_no_prez', label: 'Sakso (Prezervatifsiz)', icon: <Zap className="w-4 h-4" /> },
    { id: 'deepthroat', label: 'Derin Sakso', icon: <Zap className="w-4 h-4" /> },
    { id: 'bj_69', label: '69 Pozisyonu', icon: <Activity className="w-4 h-4" /> },
    { id: 'blowjob_yuz', label: 'Yüze Boşalma', icon: <Zap className="w-4 h-4" /> },

    // Classic Services
    { id: 'anal', label: 'Anal', icon: <Zap className="w-4 h-4" /> },
    { id: 'pussy_licking', label: 'Pussy Licking', icon: <Heart className="w-4 h-4" /> },
    { id: 'a_rimming_bana', label: 'A-Rimming (Bana)', icon: <Activity className="w-4 h-4" /> },
    { id: 'a_rimming_sana', label: 'A-Rimming (Sana)', icon: <Activity className="w-4 h-4" /> },
    { id: 'girlfriend_exp', label: 'GFE (Kız Arkadaş)', icon: <Heart className="w-4 h-4" /> },
    { id: 'cunnilingus', label: 'Cunnilingus', icon: <Heart className="w-4 h-4" /> },

    // Kissing
    { id: 'french_kiss', label: 'Fransız Öpücüğü', icon: <Heart className="w-4 h-4" /> },
    { id: 'kiss_lips', label: 'Dudaktan Öpücük', icon: <Heart className="w-4 h-4" /> },

    // Massage
    { id: 'massage', label: 'Klasik Masaj', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'erotik_masaj', label: 'Erotik Masaj', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'nuru_massage', label: 'Nuru Masajı', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'happy_ending', label: 'Mutlu Sonlu Masaj', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'prostate_massage', label: 'Prostat Masajı', icon: <Activity className="w-4 h-4" /> },
    { id: 'foot_massage', label: 'Ayak Masajı', icon: <Sparkles className="w-4 h-4" /> },

    // Fetish & BDSM
    { id: 'bdsm_light', label: 'BDSM (Hafif)', icon: <Layers className="w-4 h-4" /> },
    { id: 'bondage', label: 'Bondage', icon: <Layers className="w-4 h-4" /> },
    { id: 'foot_fetish', label: 'Ayak Fetişi', icon: <Activity className="w-4 h-4" /> },
    { id: 'stocking_fetish', label: 'Çorap Fetişi', icon: <Activity className="w-4 h-4" /> },
    { id: 'roleplay', label: 'Rol Yapma', icon: <Smile className="w-4 h-4" /> },
    { id: 'costume', label: 'Kostüm', icon: <Star className="w-4 h-4" /> },
    { id: 'spanking', label: 'Spanking', icon: <Layers className="w-4 h-4" /> },
    { id: 'handcuff', label: 'Kelepçe Kullanımı', icon: <Layers className="w-4 h-4" /> },

    // Others
    { id: 'couple', label: 'Çiftlere Hizmet', icon: <Layers className="w-4 h-4" /> },
    { id: 'dinner_companion', label: 'Akşam Yemeği', icon: <Activity className="w-4 h-4" /> },
    { id: 'travel_companion', label: 'Seyahat Eşliği', icon: <Star className="w-4 h-4" /> },
    { id: 'shower_together', label: 'Duş Birlikteliği', icon: <Activity className="w-4 h-4" /> },
    { id: 'multiple_shots', label: 'Çoklu Boşalma', icon: <Zap className="w-4 h-4" /> },
    { id: 'rimming', label: 'Rimming', icon: <Activity className="w-4 h-4" /> },
    { id: 'face_sitting', label: 'Face Sitting', icon: <Heart className="w-4 h-4" /> },
    { id: 'squirting', label: 'Squirting', icon: <Zap className="w-4 h-4" /> },
    { id: 'group_sex', label: 'Grup Seks', icon: <Layers className="w-4 h-4" /> },
    { id: 'golden_shower', label: 'Golden Shower', icon: <Activity className="w-4 h-4" /> },
    { id: 'dirty_talk', label: 'Kirli Konuşma', icon: <Info className="w-4 h-4" /> },
    { id: 'fingering', label: 'Parmaklama', icon: <Heart className="w-4 h-4" /> },
    { id: 'fetish_latex', label: 'Lateks Fetişi', icon: <Layers className="w-4 h-4" /> },
    { id: 'sensual_massage', label: 'Sensual Masaj', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'striptease', label: 'Striptiz', icon: <Star className="w-4 h-4" /> },
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
        phone_country_code: '+90',
        city_id: '',
        description: '',
        breast_size: '',
        body_hair: '',
        orientation: [] as string[],
        tattoos: false,
        piercings: false,
        smoking: false,
        alcohol: false,
        currency: 'TRY',
        services: {} as Record<string, boolean>,
        model_pricing: [
            { duration: '1 Saat', incall: '', outcall: '' },
            { duration: 'Gecelik', incall: '', outcall: '' },
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

    const addPricingRow = () => {
        setFormData({
            ...formData,
            model_pricing: [...formData.model_pricing, { duration: '1 Saat', incall: '', outcall: '' }]
        });
    };

    const removePricingRow = (index: number) => {
        if (formData.model_pricing.length <= 1) return;
        const newPricing = formData.model_pricing.filter((_, i) => i !== index);
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

            const categoryId = catData?.id || 'd9e07248-8120-410e-a844-0a3075a34e8f';

            // 1. Create Listings entry
            const listingPayload = {
                user_id: user.id,
                title: formData.title,
                slug: `${formData.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now()}`,
                city_id: formData.city_id,
                description: formData.description,
                phone: formData.phone,
                phone_country_code: formData.phone_country_code,
                breast_size: formData.breast_size,
                body_hair: formData.body_hair,
                orientation: formData.orientation,
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

            if (listingError) {
                console.error('Listing Error:', listingError);
                throw listingError;
            }

            // 2. Insert Pricing tiers
            const pricingData = formData.model_pricing
                .filter(p => p.incall || p.outcall)
                .map(p => ({
                    listing_id: listing.id,
                    duration: p.duration,
                    incall_price: p.incall ? parseFloat(p.incall) : null,
                    outcall_price: p.outcall ? parseFloat(p.outcall) : null,
                    currency: formData.currency
                }));

            if (pricingData.length > 0) {
                const { error: pricingError } = await supabase.from('model_pricing').insert(pricingData);
                if (pricingError) throw pricingError;
            }

            // 3. Update Model profile
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
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-black text-primary uppercase tracking-tighter mb-4">
                        PROFİLİNİ OLUŞTUR
                    </h1>
                    <p className="text-gray-500 font-bold text-lg">Bağımsız model olarak yerini al, kazanmaya başla.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-10">

                    {/* 1. Personal & Basic Info */}
                    <Card className="shadow-2xl border-t-8 border-t-primary rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                            <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter">
                                <User className="w-6 h-6 text-primary" /> Temel Bilgiler
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 lg:p-12 space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Sahne Adı *</label>
                                    <Input
                                        placeholder="Örn: Melis"
                                        required
                                        value={formData.title}
                                        onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        className="rounded-2xl h-14 border-2 font-bold text-lg focus:ring-4"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Telefon Numarası *</label>
                                    <div className="flex gap-2">
                                        <div className="relative min-w-[120px]">
                                            <select
                                                required
                                                value={formData.phone_country_code}
                                                onChange={e => setFormData({ ...formData, phone_country_code: e.target.value })}
                                                className="w-full h-14 px-4 rounded-2xl border-2 border-gray-100 bg-white text-base font-black appearance-none outline-none focus:border-primary transition-all"
                                            >
                                                {countryCodes.map(c => <option key={c.code} value={c.code}>{c.flag} {c.code}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                                        </div>
                                        <Input
                                            placeholder="5xx xxx xx xx"
                                            type="tel"
                                            required
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="rounded-2xl h-14 border-2 font-bold text-lg flex-1 focus:ring-4"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Şehir *</label>
                                    <div className="relative">
                                        <select
                                            className="w-full h-14 px-5 rounded-2xl border-2 border-gray-100 bg-white text-base font-black appearance-none outline-none focus:border-primary transition-all"
                                            required
                                            value={formData.city_id}
                                            onChange={e => setFormData({ ...formData, city_id: e.target.value })}
                                        >
                                            <option value="">Şehir Seçiniz</option>
                                            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[11px] font-black text-gray-500 uppercase tracking-widest ml-1">Hakkımda</label>
                                <textarea
                                    className="w-full min-h-[150px] p-6 rounded-3xl border-2 border-gray-100 bg-white text-base font-bold focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                    placeholder="Kendinden bahset, müşterilerin seni neden seçmeli?"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 2. Pricing Section - Modernized */}
                    <Card className="shadow-2xl border-t-8 border-t-primary rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter">
                                        <DollarSign className="w-6 h-6 text-primary" /> Ücretlendirme
                                    </CardTitle>
                                    <CardDescription className="font-bold">Hizmet fiyatlarınızı ve para birimini belirleyin.</CardDescription>
                                </div>
                                <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border-2 border-gray-100">
                                    {currencyOptions.map(opt => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, currency: opt.value })}
                                            className={cn(
                                                "px-4 py-2 rounded-xl text-sm font-black transition-all",
                                                formData.currency === opt.value ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-gray-400 hover:text-primary"
                                            )}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-8 lg:p-12 space-y-6">
                            <div className="space-y-4">
                                {formData.model_pricing.map((tier, idx) => (
                                    <div key={idx} className="flex flex-col lg:flex-row items-start lg:items-center gap-4 p-6 rounded-[2rem] bg-gray-50/50 border-2 border-gray-100 transition-all hover:border-primary/20">
                                        <div className="w-full lg:w-48 relative">
                                            <select
                                                className="w-full h-12 px-4 rounded-xl border-2 border-gray-100 bg-white text-sm font-black text-primary appearance-none outline-none"
                                                value={tier.duration}
                                                onChange={(e) => updatePricing(idx, 'duration', e.target.value)}
                                            >
                                                {durationOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                                        </div>
                                        <div className="flex-1 w-full grid grid-cols-2 gap-4">
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-lg">
                                                    {currencyOptions.find(o => o.value === formData.currency)?.symbol}
                                                </span>
                                                <Input
                                                    className="pl-10 rounded-xl h-12 border-2 border-gray-100 font-black text-lg"
                                                    placeholder="Kendi Yerim"
                                                    type="number"
                                                    value={tier.incall}
                                                    onChange={(e) => updatePricing(idx, 'incall', e.target.value)}
                                                />
                                            </div>
                                            <div className="relative">
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-black text-lg">
                                                    {currencyOptions.find(o => o.value === formData.currency)?.symbol}
                                                </span>
                                                <Input
                                                    className="pl-10 rounded-xl h-12 border-2 border-gray-100 font-black text-lg"
                                                    placeholder="Senin Yerin"
                                                    type="number"
                                                    value={tier.outcall}
                                                    onChange={(e) => updatePricing(idx, 'outcall', e.target.value)}
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removePricingRow(idx)}
                                            className="p-3 text-red-400 hover:text-red-500 transition-colors disabled:opacity-0"
                                            disabled={formData.model_pricing.length <= 1}
                                        >
                                            <Trash2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addPricingRow}
                                className="w-full h-14 rounded-2xl border-2 border-dashed border-primary/30 text-primary font-black uppercase tracking-widest hover:bg-primary/5 transition-all"
                            >
                                <Plus className="w-5 h-5 mr-2" /> Yeni Fiyat Aralığı Ekle
                            </Button>
                        </CardContent>
                    </Card>

                    {/* 3. Physical Attributes & Orientation */}
                    <Card className="shadow-2xl border-t-8 border-t-primary rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                            <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter">
                                <Sparkles className="w-6 h-6 text-primary" /> Kişisel Özellikler
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 lg:p-12 space-y-12">
                            <ModernMultiSelection
                                label="Cinsel Yönelim (Birden fazla seçilebilir)"
                                values={formData.orientation}
                                onChange={(vals) => setFormData({ ...formData, orientation: vals })}
                                options={orientationOptions}
                            />

                            <div className="grid lg:grid-cols-2 gap-12">
                                <ModernSelection
                                    label="Göğüs Ölçekleri"
                                    value={formData.breast_size}
                                    onChange={(val) => setFormData({ ...formData, breast_size: val })}
                                    options={breastOptions}
                                />
                                <ModernSelection
                                    label="Vücut Kıl Tercihi"
                                    value={formData.body_hair}
                                    onChange={(val) => setFormData({ ...formData, body_hair: val })}
                                    options={bodyHairOptions}
                                />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                                <ModernToggle
                                    label="Dövme"
                                    checked={formData.tattoos}
                                    onChange={(val) => setFormData({ ...formData, tattoos: val })}
                                    icon={<Palette className="w-5 h-5" />}
                                    className="h-20"
                                />
                                <ModernToggle
                                    label="Piercing"
                                    checked={formData.piercings}
                                    onChange={(val) => setFormData({ ...formData, piercings: val })}
                                    icon={<Scissors className="w-5 h-5" />}
                                    className="h-20"
                                />
                                <ModernToggle
                                    label="Sigara"
                                    checked={formData.smoking}
                                    onChange={(val) => setFormData({ ...formData, smoking: val })}
                                    icon={<Cigarette className="w-5 h-5" />}
                                    className="h-20"
                                />
                                <ModernToggle
                                    label="Alkol"
                                    checked={formData.alcohol}
                                    onChange={(val) => setFormData({ ...formData, alcohol: val })}
                                    icon={<Beer className="w-5 h-5" />}
                                    className="h-20"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* 4. Services / Activities */}
                    <Card className="shadow-2xl border-t-8 border-t-primary rounded-[2.5rem] overflow-hidden">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                            <CardTitle className="flex items-center gap-3 text-2xl font-black uppercase tracking-tighter">
                                <Heart className="w-6 h-6 text-primary" /> Hizmetler & İzinler
                            </CardTitle>
                            <CardDescription className="font-bold">Müşterilerinize sunduğunuz tüm hizmetleri işaretleyin.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 lg:p-10">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {serviceList.map((service) => (
                                    <ModernToggle
                                        key={service.id}
                                        label={service.label}
                                        checked={formData.services[service.id] || false}
                                        onChange={() => toggleService(service.id)}
                                        icon={service.icon}
                                        className="h-10"
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-2xl border-2 border-primary/20 bg-primary/5 rounded-[2.5rem]">
                        <CardContent className="p-12 text-center flex flex-col items-center gap-6">
                            <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl text-primary animate-bounce">
                                <Camera className="w-12 h-12" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black text-primary uppercase tracking-tighter mb-2">Fotoğraflar ve Onay</h3>
                                <p className="text-gray-500 font-bold max-w-lg mx-auto leading-relaxed">
                                    Profil kaydından sonra dashboard üzerinden premium fotoğraflarınızı yükleyebilirsiniz. Tüm profiller güvenliğiniz için manuel onaydan geçer.
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Button
                        type="submit"
                        size="lg"
                        className="w-full h-24 rounded-[2.5rem] bg-primary text-white font-black text-2xl lg:text-3xl uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/40 border-b-8 border-primary-foreground/20"
                        disabled={loading}
                    >
                        {loading ? 'PROFİL OLUŞTURULUYOR...' : 'PROFİLİ TAMAMLA VE YAYINLA'}
                    </Button>
                </form>
            </div>
        </div>
    );
}

