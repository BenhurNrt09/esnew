'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardContent, useToast } from '@repo/ui';
import { cn } from '@repo/ui/src/lib/utils';
import {
    User, Phone, MapPin, Info, Save, Sparkles, Smile, Star,
    Zap, ShieldCheck, Heart, Languages, ChevronDown, Activity,
    Palette, Scissors, Cigarette, Beer, MessageSquare
} from 'lucide-react';
import type { City } from '@repo/types';
import { ModernSelection } from '../../components/ModernSelection';
import { ModernToggle } from '../../components/ModernToggle';
import { ModernMultiSelection } from '../../components/ModernMultiSelection';

const orientationOptions = [
    { value: 'straight', label: 'Heteroseksüel', description: 'Karşı cinse ilgi duyar' },
    { value: 'bisexual', label: 'Biseksüel', description: 'Her iki cinse de ilgi duyar' },
    { value: 'lesbian', label: 'Lezbiyen', description: 'Hemcinsi kadınlara ilgi duyar' },
    { value: 'gay', label: 'Gey', description: 'Hemcinsi erkeklere ilgi duyar' },
    { value: 'fetish', label: 'Fetişist', description: 'Özel fetişlere ilgi duyar' },
];

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

const countryCodes = [
    { code: '+90', flag: '🇹🇷', label: 'TR' },
    { code: '+1', flag: '🇺🇸', label: 'US' },
    { code: '+44', flag: '🇬🇧', label: 'GB' },
    { code: '+49', flag: '🇩🇪', label: 'DE' },
    { code: '+33', flag: '🇫🇷', label: 'FR' },
];

const serviceList = [
    // Oral Services
    { id: 'blowjob_prez', label: 'Sakso (Prezervatifli)', icon: <Zap /> },
    { id: 'blowjob_no_prez', label: 'Sakso (Prezervatifsiz)', icon: <Zap /> },
    { id: 'deepthroat', label: 'Derin Sakso', icon: <Zap /> },
    { id: 'bj_69', label: '69 Pozisyonu', icon: <Activity /> },
    { id: 'blowjob_yuz', label: 'Yüze Boşalma', icon: <Zap /> },

    // Classic Services
    { id: 'anal', label: 'Anal', icon: <Zap /> },
    { id: 'pussy_licking', label: 'Pussy Licking', icon: <Heart /> },
    { id: 'a_rimming_bana', label: 'A-Rimming (Bana)', icon: <Activity /> },
    { id: 'a_rimming_sana', label: 'A-Rimming (Sana)', icon: <Activity /> },
    { id: 'girlfriend_exp', label: 'GFE (Kız Arkadaş)', icon: <Heart /> },
    { id: 'cunnilingus', label: 'Cunnilingus', icon: <Heart /> },

    // Kissing
    { id: 'french_kiss', label: 'Fransız Öpücüğü', icon: <Heart /> },
    { id: 'kiss_lips', label: 'Dudaktan Öpücük', icon: <Heart /> },

    // Massage
    { id: 'massage', label: 'Klasik Masaj', icon: <Sparkles /> },
    { id: 'erotik_masaj', label: 'Erotik Masaj', icon: <Sparkles /> },
    { id: 'nuru_massage', label: 'Nuru Masajı', icon: <Sparkles /> },
    { id: 'happy_ending', label: 'Mutlu Sonlu Masaj', icon: <Sparkles /> },
    { id: 'prostate_massage', label: 'Prostat Masajı', icon: <Activity /> },
    { id: 'foot_massage', label: 'Ayak Masajı', icon: <Sparkles /> },

    // Fetish & BDSM
    { id: 'bdsm_light', label: 'BDSM (Hafif)', icon: <ShieldCheck /> },
    { id: 'bondage', label: 'Bondage', icon: <ShieldCheck /> },
    { id: 'foot_fetish', label: 'Ayak Fetişi', icon: <Activity /> },
    { id: 'stocking_fetish', label: 'Çorap Fetişi', icon: <Activity /> },
    { id: 'roleplay', label: 'Rol Yapma', icon: <Smile /> },
    { id: 'costume', label: 'Kostüm', icon: <Star /> },
    { id: 'spanking', label: 'Spanking', icon: <ShieldCheck /> },
    { id: 'handcuff', label: 'Kelepçe Kullanımı', icon: <ShieldCheck /> },

    // Others
    { id: 'couple', label: 'Çiftlere Hizmet', icon: <ShieldCheck /> },
    { id: 'dinner_companion', label: 'Akşam Yemeği', icon: <Activity /> },
    { id: 'travel_companion', label: 'Seyahat Eşliği', icon: <Star /> },
    { id: 'shower_together', label: 'Duş Birlikteliği', icon: <Activity /> },
    { id: 'multiple_shots', label: 'Çoklu Boşalma', icon: <Zap /> },
    { id: 'rimming', label: 'Rimming', icon: <Activity /> },
    { id: 'face_sitting', label: 'Face Sitting', icon: <Heart /> },
    { id: 'squirting', label: 'Squirting', icon: <Zap /> },
    { id: 'group_sex', label: 'Grup Seks', icon: <ShieldCheck /> },
    { id: 'golden_shower', label: 'Golden Shower', icon: <Activity /> },
    { id: 'dirty_talk', label: 'Kirli Konuşma', icon: <MessageSquare /> },
    { id: 'fingering', label: 'Parmaklama', icon: <Heart /> },
    { id: 'fetish_latex', label: 'Lateks Fetişi', icon: <ShieldCheck /> },
    { id: 'sensual_massage', label: 'Sensual Masaj', icon: <Sparkles /> },
    { id: 'striptease', label: 'Striptiz', icon: <Star /> },
];

import { useAuth } from '../../components/AuthProvider';

export default function ProfileEditPage() {
    const supabase = createClient();
    const { user, loading: authLoading } = useAuth();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userType, setUserType] = useState<string | null>(null);
    const [listingId, setListingId] = useState<string | null>(null);
    const [cities, setCities] = useState<City[]>([]);

    const [formData, setFormData] = useState<any>({
        title: '',
        phone: '',
        phone_country_code: '+90',
        city_id: '',
        description: '',
        breast_size: '',
        body_hair: 'trasli',
        smoking: false,
        alcohol: false,
        gender: 'Kadın',
        orientation: [] as string[],
        ethnicity: 'Avrupalı',
        nationality: '',
        tattoos: false,
        piercings: false,
        services: {} as Record<string, boolean>
    });

    useEffect(() => {
        const safetyTimeout = setTimeout(() => {
            if (loading) {
                console.warn('ProfileEditPage safety timeout triggered');
                setLoading(false);
            }
        }, 5000);

        const loadAllData = async () => {
            if (!user) return;

            try {
                // Load Cities
                const { data: citiesData } = await supabase.from('cities').select('*').order('name');
                if (citiesData) setCities(citiesData);

                const type = (user as any).userType || 'member';
                setUserType(type);

                if (type === 'independent_model') {
                    const { data: listing } = await supabase
                        .from('listings')
                        .select('*')
                        .eq('user_id', user.id)
                        .limit(1)
                        .maybeSingle();

                    if (listing) {
                        setListingId(listing.id);
                        setFormData({
                            title: listing.title || '',
                            phone: listing.phone || '',
                            phone_country_code: listing.phone_country_code || '+90',
                            city_id: listing.city_id || '',
                            description: listing.description || '',
                            breast_size: listing.breast_size || '',
                            body_hair: listing.body_hair || 'trasli',
                            smoking: listing.smoking || false,
                            alcohol: listing.alcohol || false,
                            gender: listing.gender || 'Kadın',
                            orientation: Array.isArray(listing.orientation) ? listing.orientation : [],
                            ethnicity: listing.ethnicity || 'Avrupalı',
                            nationality: listing.nationality || '',
                            tattoos: listing.tattoos || false,
                            piercings: listing.piercings || false,
                            services: listing.services || {}
                        });
                    }
                } else {
                    const { data: member } = await supabase
                        .from('members')
                        .select('*')
                        .eq('id', user.id)
                        .maybeSingle();

                    if (member) {
                        setFormData({
                            username: member.username || '',
                            first_name: member.first_name || '',
                            last_name: member.last_name || '',
                            phone: member.phone || '',
                            phone_country_code: member.phone_country_code || '+90',
                            city_id: '',
                            description: '',
                            breast_size: '',
                            body_hair: 'trasli',
                            smoking: false,
                            alcohol: false,
                            gender: 'Kadın',
                            orientation: [],
                            ethnicity: 'Avrupalı',
                            nationality: '',
                            tattoos: false,
                            piercings: false,
                            services: {}
                        });
                    }
                }
            } catch (err) {
                console.error('Error loading profile data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            loadAllData();
        }

        return () => clearTimeout(safetyTimeout);
    }, [user, authLoading]);

    const toggleService = (id: string) => {
        setFormData((prev: any) => ({
            ...prev,
            services: {
                ...prev.services,
                [id]: !prev.services[id]
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            if (userType === 'independent_model') {
                if (listingId) {
                    const { error } = await supabase.from('listings').update({
                        title: formData.title,
                        phone: formData.phone,
                        phone_country_code: formData.phone_country_code,
                        city_id: formData.city_id,
                        description: formData.description,
                        gender: formData.gender,
                        orientation: formData.orientation,
                        ethnicity: formData.ethnicity,
                        race: formData.ethnicity,
                        nationality: formData.nationality,
                        tattoos: formData.tattoos,
                        piercings: formData.piercings,
                        breast_size: formData.breast_size,
                        body_hair: formData.body_hair,
                        smoking: formData.smoking,
                        alcohol: formData.alcohol,
                        services: formData.services,
                        updated_at: new Date().toISOString()
                    }).eq('id', listingId);
                    if (error) throw error;
                }
            } else if (userType === 'member') {
                const { error } = await supabase.from('members').upsert({
                    id: user.id,
                    email: user.email,
                    username: formData.username || user.email?.split('@')[0],
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone,
                    phone_country_code: formData.phone_country_code,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'id' });

                if (error) throw error;
            } else {
                // If agency or unknown, don't perform a member upsert here
                console.warn('ProfileEditPage: Skipping member upsert for userType:', userType);
            }

            toast.success('Profil başarıyla güncellendi!');
        } catch (err: any) {
            toast.error('Hata: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Profil Getiriliyor...</p>
            </div>
        </div>
    );

    if (userType === 'member') {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Profil Ayarları</h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">Temel bilgilerinizi bu kısımdan güncelleyebilirsiniz.</p>
                    </div>
                </div>

                <Card className="shadow-2xl shadow-gray-200/50 dark:shadow-none border-gray-100 dark:border-white/5 bg-white dark:bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-10 space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Kullanıcı Adı</label>
                                <Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="h-14 rounded-2xl border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 font-bold text-gray-900 dark:text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Adınız</label>
                                <Input value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className="h-14 rounded-2xl border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 font-bold text-gray-900 dark:text-white" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Soyadınız</label>
                                <Input value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className="h-14 rounded-2xl border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 font-bold text-gray-900 dark:text-white" />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-[11px] font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest flex items-center gap-2 ml-1">
                                <Phone className="w-3.5 h-3.5 text-primary" /> İletişim Numarası
                            </label>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <div className="relative min-w-[140px]">
                                    <select
                                        value={formData.phone_country_code}
                                        onChange={(e) => setFormData({ ...formData, phone_country_code: e.target.value })}
                                        className="w-full h-15 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 font-black text-gray-900 dark:text-white px-5 py-4 focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-300 appearance-none cursor-pointer"
                                    >
                                        {countryCodes.map(c => <option key={c.code} value={c.code} className="bg-white dark:bg-[#0a0a0a]">{c.flag} {c.code}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-primary w-4 h-4" />
                                </div>
                                <Input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="5XXXXXXXXX"
                                    className="h-15 rounded-2xl border-2 border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 font-black text-lg text-gray-900 dark:text-white focus:border-primary transition-all pl-4"
                                />
                            </div>
                        </div>

                        <Button onClick={handleSave} disabled={saving} className="w-full h-16 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20">
                            {saving ? 'KAYDEDİLİYOR...' : 'BİLGİLERİ GÜNCELLE'}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">İlan Yönetimi</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold">Profilinizi ve hizmetlerinizi en detaylı şekilde optimize edin.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="w-full lg:w-auto h-16 px-12 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                    <Save className="w-5 h-5 mr-3" /> {saving ? 'GÜNCELLENİYOR...' : 'DEĞİŞİKLİKLERİ YAYINLA'}
                </Button>
            </div>

            <div className="grid lg:grid-cols-12 gap-10 items-start">
                {/* Main Content Info */}
                <div className="lg:col-span-8 space-y-10">
                    <Card className="shadow-2xl shadow-gray-200/50 dark:shadow-none border-gray-100 dark:border-white/5 bg-white dark:bg-[#0a0a0a] rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-gray-50 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.02]">
                            <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 text-gray-900 dark:text-white">
                                <Info className="w-6 h-6 text-primary" /> Temel İlan Bilgileri
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">İlan Başlığı</label>
                                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="h-14 rounded-2xl border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 font-bold text-gray-900 dark:text-white focus:ring-4 focus:ring-primary/5 shadow-sm" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">İletişim Numarası</label>
                                    <div className="flex gap-2">
                                        <div className="relative min-w-[100px]">
                                            <select
                                                value={formData.phone_country_code}
                                                onChange={(e) => setFormData({ ...formData, phone_country_code: e.target.value })}
                                                className="w-full h-14 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 font-black text-sm text-gray-900 dark:text-white px-4 appearance-none outline-none focus:border-primary transition-all"
                                            >
                                                {countryCodes.map(c => <option key={c.code} value={c.code} className="bg-white dark:bg-[#0a0a0a]">{c.flag} {c.code}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                                        </div>
                                        <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-14 rounded-2xl border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 font-black text-gray-900 dark:text-white flex-1 focus:ring-4 focus:ring-primary/5 shadow-sm" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Bulunduğunuz Şehir</label>
                                    <div className="relative">
                                        <select value={formData.city_id} onChange={(e) => setFormData({ ...formData, city_id: e.target.value })} className="w-full h-14 rounded-2xl border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 px-6 font-bold text-gray-900 dark:text-white outline-none appearance-none focus:border-primary transition-all shadow-sm">
                                            <option value="" className="bg-white dark:bg-[#0a0a0a]">Şehir Seçin</option>
                                            {cities.map(c => <option key={c.id} value={c.id} className="bg-white dark:bg-[#0a0a0a]">{c.name}</option>)}
                                        </select>
                                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Kişisel Açıklama</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full h-40 rounded-[2rem] border border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-white/5 p-8 font-bold text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/5 transition-all text-sm leading-relaxed resize-none shadow-sm" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-2xl shadow-gray-200/50 dark:shadow-none border-gray-100 dark:border-white/5 bg-white dark:bg-[#0a0a0a] rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-gray-50 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.02]">
                            <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-3 text-gray-900 dark:text-white">
                                <Zap className="w-6 h-6 text-primary" /> Hizmetler & Kategoriler
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10">
                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                                {serviceList.map((service) => (
                                    <ModernToggle
                                        key={service.id}
                                        label={service.label}
                                        checked={formData.services[service.id] || false}
                                        onChange={() => toggleService(service.id)}
                                        icon={service.icon}
                                        className="h-10 shadow-sm hover:shadow-primary/10 transition-shadow"
                                    />
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Sidebar */}
                <div className="lg:col-span-4 space-y-10">
                    <Card className="shadow-2xl shadow-gray-200/50 dark:shadow-none border-gray-100 dark:border-white/5 bg-white dark:bg-[#0a0a0a] rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-gray-50 dark:border-white/5 bg-gray-50/30 dark:bg-white/[0.02]">
                            <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-3 text-gray-900 dark:text-white">
                                <Heart className="w-6 h-6 text-primary" /> Kişisel Özellikler
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <ModernMultiSelection
                                label="Cinsel Yönelim"
                                values={formData.orientation}
                                onChange={(vals) => setFormData({ ...formData, orientation: vals })}
                                options={orientationOptions}
                                className="space-y-1"
                            />

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Etnik Köken</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {['Avrupalı', 'Asyalı', 'Latin', 'Siyahi', 'Arap'].map(opt => (
                                        <button key={opt} onClick={() => setFormData({ ...formData, ethnicity: opt })} className={cn(
                                            "py-2 rounded-lg border text-[9px] font-black uppercase transition-all",
                                            formData.ethnicity === opt ? "bg-primary text-white border-primary shadow-md shadow-primary/10" : "bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-white/10 hover:bg-white dark:hover:bg-white/10"
                                        )}>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Uyruk (Milliyet)</label>
                                <div className="grid grid-cols-2 gap-2">
                                    {[
                                        { val: 'TR', label: 'Türk' },
                                        { val: 'RU', label: 'Rus' },
                                        { val: 'UA', label: 'Ukrayna' },
                                        { val: 'US', label: 'Amerikan' },
                                        { val: 'OTHER', label: 'Diğer' }
                                    ].map(opt => (
                                        <button key={opt.val} onClick={() => setFormData({ ...formData, nationality: opt.val })} className={cn(
                                            "py-2 rounded-lg border text-[9px] font-black uppercase transition-all",
                                            formData.nationality === opt.val ? "bg-primary text-white border-primary shadow-md shadow-primary/10" : "bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-500 border-gray-100 dark:border-white/10 hover:bg-white dark:hover:bg-white/10"
                                        )}>
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <ModernSelection
                                label="Saç Rengi"
                                value={formData.hair_color}
                                onChange={(val) => setFormData({ ...formData, hair_color: val })}
                                options={[
                                    { value: 'sari', label: 'Sarı', description: 'Blonde' },
                                    { value: 'kumral', label: 'Kumral', description: 'Light Brown' },
                                    { value: 'esmer', label: 'Esmer', description: 'Brunette' },
                                    { value: 'siyah', label: 'Siyah', description: 'Black' },
                                    { value: 'kizil', label: 'Kızıl', description: 'Red' },
                                    { value: 'renkli', label: 'Renkli/Boyalı', description: 'Colorful' },
                                ]}
                            />

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

                            <div className="grid grid-cols-2 gap-4">
                                <ModernToggle label="Sigara" checked={formData.smoking} onChange={(v) => setFormData({ ...formData, smoking: v })} icon={<Cigarette className="w-5 h-5 text-gray-400" />} className="h-20" />
                                <ModernToggle label="Alkol" checked={formData.alcohol} onChange={(v) => setFormData({ ...formData, alcohol: v })} icon={<Beer className="w-5 h-5 text-gray-400" />} className="h-20" />
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-2xl shadow-gray-200/50 border-gray-100 rounded-[3rem] overflow-hidden bg-gray-900 text-white relative group">
                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <CardContent className="p-10 space-y-4 relative z-10">
                            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                                <Sparkles className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Profil Gücü</h3>
                            <p className="text-gray-400 font-bold text-sm leading-relaxed">
                                Bilgilerinizin %100 dolu olması etkileşim oranınızı %40 artırır. Tüm alanları doldurduğunuzdan emin olun.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
