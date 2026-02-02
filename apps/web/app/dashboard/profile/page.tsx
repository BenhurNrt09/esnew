'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent, useToast } from '@repo/ui';
import { useRouter } from 'next/navigation';
import {
    User, Phone, MapPin, AlignLeft,
    Sparkles, Cigarette, Wine, Scissors,
    Smile, Star, Save
} from 'lucide-react';
import { ModernSelection } from '../../components/ModernSelection';
import { ModernToggle } from '../../components/ModernToggle';

export default function ProfileEditPage() {
    const router = useRouter();
    const toast = useToast();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [cities, setCities] = useState<any[]>([]);

    const [formData, setFormData] = useState<any>({
        title: '',
        phone: '',
        city_id: '',
        description: '',
        breast_size: '',
        body_hair: '',
        smoking: false,
        alcohol: false,
        tattoos: false,
        piercings: false,
        services: {}
    });

    useEffect(() => {
        const loadProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            // Load cities
            const { data: citiesData } = await supabase.from('cities').select('*').eq('is_active', true).order('name');
            setCities(citiesData || []);

            // Load listing
            const { data: listing } = await supabase
                .from('listings')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (listing) {
                setFormData({
                    title: listing.title,
                    phone: listing.phone || '',
                    city_id: listing.city_id,
                    description: listing.description,
                    breast_size: listing.metadata?.breast_size || '',
                    body_hair: listing.metadata?.body_hair || '',
                    smoking: listing.metadata?.smoking || false,
                    alcohol: listing.metadata?.alcohol || false,
                    tattoos: listing.metadata?.tattoos || false,
                    piercings: listing.metadata?.piercings || false,
                    services: listing.metadata?.services || {}
                });
            }
            setLoading(false);
        };
        loadProfile();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { error } = await supabase
                .from('listings')
                .update({
                    title: formData.title,
                    phone: formData.phone,
                    city_id: formData.city_id,
                    description: formData.description,
                    metadata: {
                        ...formData.services, // To keep services flat if desired, or better:
                        breast_size: formData.breast_size,
                        body_hair: formData.body_hair,
                        smoking: formData.smoking,
                        alcohol: formData.alcohol,
                        tattoos: formData.tattoos,
                        piercings: formData.piercings,
                        services: formData.services
                    }
                })
                .eq('user_id', user?.id);

            if (error) throw error;
            toast.success('Profil başarıyla güncellendi!');
        } catch (err: any) {
            toast.error('Hata: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div>Yükleniyor...</div>;

    const breastSizes = [
        { value: 'A', label: 'A Kupa', icon: '🍒' },
        { value: 'B', label: 'B Kupa', icon: '🍊' },
        { value: 'C', label: 'C Kupa', icon: '🍎' },
        { value: 'D', label: 'D Kupa', icon: '🍈' },
        { value: 'DD', label: 'DD Kupa', icon: '🍉' },
        { value: 'E+', label: 'E+ Kupa', icon: '💎' },
    ];

    const bodyHairOptions = [
        { value: 'shaved', label: 'Tamamen Tıraşlı', icon: '✨' },
        { value: 'trimmed', label: 'Bakımlı / Trimlenmiş', icon: '✂️' },
        { value: 'natural', label: 'Doğal', icon: '🌿' },
    ];

    const serviceList = [
        { id: 'a_rimming', label: 'A-Rimming', icon: <Smile className="w-4 h-4" /> },
        { id: 'anal', label: 'Anal', icon: <Star className="w-4 h-4" /> },
        { id: 'blowjob', label: 'Blowjob (Sakso)', icon: <Star className="w-4 h-4" /> },
        { id: 'classic', label: 'Klasik Seks', icon: <Smile className="w-4 h-4" /> },
        { id: 'cunnilingus', label: 'Cunnilingus (Yalama)', icon: <Smile className="w-4 h-4" /> },
        { id: 'erotic_massage', label: 'Erotik Masaj', icon: <Scissors className="w-4 h-4" /> },
    ];

    return (
        <form onSubmit={handleSave} className="max-w-6xl mx-auto space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Profil Bilgileri</h1>
                    <p className="text-gray-500 font-medium">Kişisel detaylarınızı ve hizmet tercihlerinizi güncelleyin.</p>
                </div>
                <Button
                    type="submit"
                    disabled={saving}
                    className="bg-primary text-white font-black uppercase tracking-widest px-8 h-12 rounded-xl shadow-xl shadow-primary/20"
                >
                    <Save className="w-4 h-4 mr-2" /> {saving ? 'GÜNCELLENİYOR...' : 'PROFİLİ GÜNCELLE'}
                </Button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Basic Info */}
                <Card className="shadow-sm border-gray-100 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                        <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                            <User className="w-5 h-5 text-primary" /> Temel Bilgiler
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Sahne Adı / Başlık</label>
                            <Input
                                placeholder="Örn: Esmer Güzeli Merve"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="rounded-xl h-12"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Telefon</label>
                                <Input
                                    placeholder="05xx..."
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    className="rounded-xl h-12"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Şehir</label>
                                <select
                                    className="w-full h-12 rounded-xl border border-gray-200 bg-white px-3 font-bold text-gray-700"
                                    value={formData.city_id}
                                    onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                                    required
                                >
                                    <option value="">Şehir Seçin</option>
                                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-700 uppercase tracking-widest ml-1">Hakkımda</label>
                            <textarea
                                className="w-full h-32 rounded-xl border border-gray-200 bg-white p-4 font-medium text-gray-600 focus:ring-2 focus:ring-primary/20 outline-none"
                                placeholder="Kendinizi tanıtın..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Physical Attributes */}
                <Card className="shadow-sm border-gray-100 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                        <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-primary" /> Fiziksel Bilgiler
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <ModernSelection
                            label="GÖĞÜS ÖLÇÜSÜ"
                            options={breastSizes}
                            value={formData.breast_size}
                            onChange={(val) => setFormData({ ...formData, breast_size: val })}
                        />
                        <ModernSelection
                            label="VÜCUT KILLARI"
                            options={bodyHairOptions}
                            value={formData.body_hair}
                            onChange={(val) => setFormData({ ...formData, body_hair: val })}
                        />
                        <div className="grid grid-cols-2 gap-4 pt-4">
                            <ModernToggle
                                label="SİGARA"
                                icon={<Cigarette className="w-4 h-4" />}
                                checked={formData.smoking}
                                onChange={(val) => setFormData({ ...formData, smoking: val })}
                            />
                            <ModernToggle
                                label="ALKOL"
                                icon={<Wine className="w-4 h-4" />}
                                checked={formData.alcohol}
                                onChange={(val) => setFormData({ ...formData, alcohol: val })}
                            />
                            <ModernToggle
                                label="DÖVME"
                                checked={formData.tattoos}
                                onChange={(val) => setFormData({ ...formData, tattoos: val })}
                            />
                            <ModernToggle
                                label="PIERCING"
                                checked={formData.piercings}
                                onChange={(val) => setFormData({ ...formData, piercings: val })}
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Services */}
                <Card className="lg:col-span-2 shadow-sm border-gray-100 rounded-3xl overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                        <CardTitle className="text-lg font-black uppercase tracking-tighter">Hizmetler & Aktiviteler</CardTitle>
                        <CardDescription>Hangi hizmetleri sunduğunuzu seçin.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {serviceList.map((service) => (
                                <ModernToggle
                                    key={service.id}
                                    label={service.label}
                                    icon={service.icon}
                                    checked={formData.services[service.id] || false}
                                    onChange={(val) => setFormData({
                                        ...formData,
                                        services: { ...formData.services, [service.id]: val }
                                    })}
                                />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
}
