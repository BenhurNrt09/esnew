'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardContent, useToast } from '@repo/ui';
import { User, Phone, MapPin, Info, Save, Sparkles, Smile, Star, Zap, ShieldCheck, Heart, Languages } from 'lucide-react';

const cities = [
    { id: 'istanbul', name: 'İstanbul' },
    { id: 'ankara', name: 'Ankara' },
    { id: 'izmir', name: 'İzmir' },
    { id: 'antalya', name: 'Antalya' },
];

const serviceList = [
    "Anal", "Ağza boşalma", "Yüze boşalma", "Erotik masaj", "Kondomsuz oral", "Fetiş", "Striptiz",
    "Parmaklama", "Videoya izin ver", "Kız arkadaş deneyimi (GFE)", "Deepthroat", "Lezbiyen şov",
    "Dominant", "Takma Penis", "Oyuncaklar", "Vücuda işeme", "Eş değiştirme", "Masaj", "Ayak fetişi",
    "Vajinaya el sokma", "Metres", "Sınırsız Seks", "Olgun", "Ücretli skype oturumları", "Anal yalama",
    "Porno yıldız deneyimi", "BDSM", "Vücuda boşalma", "Rol yapma", "69 Pozisyonu", "BBW", "Bukkake",
    "Fışkırtma", "Yutmak", "Farklı pozisyonlar", "Mastürbasyon", "Yapay Penis ile Oynama",
    "Testisleri yalama ve emme", "Küfürlü Konuşma", "Yüze oturma", "Prostat masajı", "İsveç masajı",
    "Toplu Seks", "Kamasutra", "Birlikte duş", "Dışarıda seks", "Tantrik Seks", "Bondage (bağlama)",
    "Partnerin üzerine işeme", "Bağlamak ve oynaşmak"
];

export default function ProfileEditPage() {
    const supabase = createClient();
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userType, setUserType] = useState<string | null>(null);
    const [listingId, setListingId] = useState<string | null>(null);

    const [formData, setFormData] = useState<any>({
        title: '',
        phone: '',
        city_id: '',
        description: '',
        // Attributes
        breast_size: '',
        body_hair: 'shaved',
        smoking: false,
        alcohol: false,
        gender: 'woman',
        orientation: 'straight',
        ethnicity: 'european',
        nationality: '',
        tattoos: false,
        services: {} as Record<string, boolean>
    });

    useEffect(() => {
        const loadProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const type = user.user_metadata?.user_type || 'member';
            setUserType(type);

            if (type === 'independent_model') {
                const { data: listing } = await supabase
                    .from('listings')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (listing) {
                    setListingId(listing.id);
                    const meta = listing.metadata || {};
                    setFormData({
                        title: listing.title || '',
                        phone: listing.phone || '',
                        city_id: listing.city_id || '',
                        description: listing.description || '',
                        breast_size: meta.breast_size || '',
                        body_hair: meta.body_hair || 'shaved',
                        smoking: meta.smoking || false,
                        alcohol: meta.alcohol || false,
                        gender: listing.gender || 'woman',
                        orientation: listing.orientation || 'straight',
                        ethnicity: listing.ethnicity || 'european',
                        nationality: listing.nationality || '',
                        tattoos: listing.tattoos || false,
                        services: meta.services || {}
                    });
                }
            } else if (type === 'member') {
                const { data: member } = await supabase
                    .from('members')
                    .select('*')
                    .eq('id', user.id)
                    .single();
                if (member) {
                    setFormData({
                        username: member.username || '',
                        first_name: member.first_name || '',
                        last_name: member.last_name || '',
                        phone: member.phone || ''
                    });
                }
            }
            setLoading(false);
        };
        loadProfile();
    }, []);

    const toggleService = (service: string) => {
        setFormData((prev: any) => ({
            ...prev,
            services: {
                ...prev.services,
                [service]: !prev.services[service]
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
                        city_id: formData.city_id,
                        description: formData.description,
                        gender: formData.gender,
                        orientation: formData.orientation,
                        ethnicity: formData.ethnicity,
                        nationality: formData.nationality,
                        tattoos: formData.tattoos,
                        metadata: {
                            breast_size: formData.breast_size,
                            body_hair: formData.body_hair,
                            smoking: formData.smoking,
                            alcohol: formData.alcohol,
                            services: formData.services
                        }
                    }).eq('id', listingId);
                    if (error) throw error;
                }
            } else {
                const { error } = await supabase.from('members').update({
                    username: formData.username,
                    first_name: formData.first_name,
                    last_name: formData.last_name,
                    phone: formData.phone
                }).eq('id', user.id);
                if (error) throw error;
            }

            toast.success('Profil başarıyla güncellendi!');
        } catch (err: any) {
            toast.error('Hata: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-black text-gray-400 uppercase tracking-widest animate-pulse">Profil Bilgileri Getiriliyor...</div>;

    if (userType === 'member') {
        return (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Profil Ayarları</h1>
                        <p className="text-gray-500 font-medium">Temel bilgilerinizi bu kısımdan güncelleyebilirsiniz.</p>
                    </div>
                </div>

                <Card className="shadow-2xl shadow-gray-200/50 border-gray-100 rounded-[2.5rem] overflow-hidden">
                    <CardContent className="p-10 space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kullanıcı Adı</label>
                                <Input value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Telefon</label>
                                <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Adınız</label>
                                <Input value={formData.first_name} onChange={(e) => setFormData({ ...formData, first_name: e.target.value })} className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Soyadınız</label>
                                <Input value={formData.last_name} onChange={(e) => setFormData({ ...formData, last_name: e.target.value })} className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold" />
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
        <div className="max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">İlan Yönetimi</h1>
                    <p className="text-gray-500 font-bold">Profilinizi ve hizmetlerinizi en detaylı şekilde optimize edin.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="h-16 px-12 bg-primary text-white font-black uppercase tracking-widest rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all">
                    <Save className="w-5 h-5 mr-3" /> {saving ? 'GÜNCELLENİYOR...' : 'DEĞİŞİKLİKLERİ YAYINLA'}
                </Button>
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                <div className="lg:col-span-8 space-y-10">
                    {/* Basic Info */}
                    <Card className="shadow-2xl shadow-gray-200/50 border-gray-100 rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-gray-50 bg-gray-50/30">
                            <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                                <Info className="w-6 h-6 text-primary" /> Temel İlan Bilgileri
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">İlan Başlığı</label>
                                <Input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold" placeholder="Örn: Maslak'ta Exclusive Deneyim" />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">İletişim Numarası</label>
                                    <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 font-bold" placeholder="+90 5XX XXX XX XX" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Bulunduğunuz Şehir</label>
                                    <select value={formData.city_id} onChange={(e) => setFormData({ ...formData, city_id: e.target.value })} className="w-full h-14 rounded-2xl border border-gray-100 bg-gray-50/50 px-6 font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all">
                                        <option value="">Şehir Seçin</option>
                                        {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kişisel Açıklama</label>
                                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full h-40 rounded-[2rem] border border-gray-100 bg-gray-50/50 p-8 font-bold outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm leading-relaxed" placeholder="Kendinizden ve sunduğunuz ayrıcalıklardan bahsedin..." />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Services Grid (Massive) */}
                    <Card className="shadow-2xl shadow-gray-200/50 border-gray-100 rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-gray-50 bg-gray-50/30">
                            <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                                <Zap className="w-6 h-6 text-primary" /> Sunulan Hizmetler & Kategoriler
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-10">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {serviceList.map((service) => (
                                    <button
                                        key={service} onClick={() => toggleService(service)}
                                        className={`flex items-center gap-3 p-4 rounded-xl border text-[11px] font-black uppercase tracking-tight transition-all text-left ${formData.services[service]
                                                ? 'bg-primary/5 border-primary text-primary shadow-lg shadow-primary/5'
                                                : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-md flex items-center justify-center border-2 transition-colors ${formData.services[service] ? 'bg-primary border-primary text-white' : 'border-gray-200'}`}>
                                            {formData.services[service] && <Sparkles className="w-3 h-3" />}
                                        </div>
                                        {service}
                                    </button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="lg:col-span-4 space-y-10">
                    {/* Detailed Attributes */}
                    <Card className="shadow-2xl shadow-gray-200/50 border-gray-100 rounded-[3rem] overflow-hidden">
                        <CardHeader className="p-8 border-b border-gray-50 bg-gray-50/30">
                            <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-3">
                                <Heart className="w-6 h-6 text-primary" /> Kişisel Özellikler
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cinsiyet</label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {['Kadın', 'Erkek', 'Trans', 'Fetişist'].map(opt => (
                                            <button key={opt} onClick={() => setFormData({ ...formData, gender: opt })} className={`py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${formData.gender === opt ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-white'}`}>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cinsel Yönelim</label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {['Hetero', 'Bi', 'Lezbiyen', 'Gey'].map(opt => (
                                            <button key={opt} onClick={() => setFormData({ ...formData, orientation: opt })} className={`py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${formData.orientation === opt ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-white'}`}>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Etnik Köken</label>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {['Avrupalı', 'Asyalı', 'Latin', 'Siyahi', 'Arap'].map(opt => (
                                            <button key={opt} onClick={() => setFormData({ ...formData, ethnicity: opt })} className={`py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${formData.ethnicity === opt ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-white'}`}>
                                                {opt}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Uyruk</label>
                                    <Input value={formData.nationality} onChange={(e) => setFormData({ ...formData, nationality: e.target.value })} className="h-12 rounded-xl border-gray-100 bg-gray-50 font-bold" placeholder="Örn: Türk, Rus, Yunan" />
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-primary" />
                                        <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">Dövme Var mı?</span>
                                    </div>
                                    <button onClick={() => setFormData({ ...formData, tattoos: !formData.tattoos })} className={`w-14 h-8 rounded-full transition-all relative ${formData.tattoos ? 'bg-primary shadow-inner shadow-black/10' : 'bg-gray-200'}`}>
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${formData.tattoos ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-primary" />
                                        <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">Sigara</span>
                                    </div>
                                    <button onClick={() => setFormData({ ...formData, smoking: !formData.smoking })} className={`w-14 h-8 rounded-full transition-all relative ${formData.smoking ? 'bg-primary shadow-inner shadow-black/10' : 'bg-gray-200'}`}>
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${formData.smoking ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <Zap className="w-5 h-5 text-primary" />
                                        <span className="text-xs font-black text-gray-900 uppercase tracking-tighter">Alkol</span>
                                    </div>
                                    <button onClick={() => setFormData({ ...formData, alcohol: !formData.alcohol })} className={`w-14 h-8 rounded-full transition-all relative ${formData.alcohol ? 'bg-primary shadow-inner shadow-black/10' : 'bg-gray-200'}`}>
                                        <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow-md transition-all ${formData.alcohol ? 'left-7' : 'left-1'}`} />
                                    </button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="shadow-2xl shadow-gray-200/50 border-gray-100 rounded-[3rem] overflow-hidden bg-gray-900 text-white relative">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <Sparkles className="w-32 h-32" />
                        </div>
                        <CardContent className="p-10 space-y-6 relative z-10">
                            <h3 className="text-2xl font-black uppercase tracking-tighter">Premium Profil</h3>
                            <p className="text-gray-400 font-bold text-sm leading-relaxed">
                                Tüm metriklerin dolu olması profilinizi diğerlerinin önüne çıkarır ve %40 daha fazla etkileşim almanızı sağlar.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

