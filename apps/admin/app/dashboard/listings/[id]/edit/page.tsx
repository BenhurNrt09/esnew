'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { slugify, createBrowserClient } from '@repo/lib';
import type { City, Category, Listing } from '@repo/types';
import { Combobox } from '../../../../components/Combobox';
import { AlignLeft, Link as LinkIcon, MapPin, Layers, Info, CheckCircle2, Star, Plus, Trash2 } from 'lucide-react';
import { cn } from '@repo/ui/src/lib/utils';

export default function EditListingPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [cities, setCities] = useState<City[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        city_id: '',
        category_id: '',
        price: '',
        phone: '',
        is_featured: false,
        is_active: true,
        // Detailed attributes
        breast_size: '',
        body_hair: 'shaved',
        smoking: false,
        alcohol: false,
        gender: 'woman',
        orientation: 'straight',
        ethnicity: 'european',
        nationality: '',
        age_value: '' as string | number,
        height: '',
        weight: '',
        languages: [] as { lang: string, level: number }[],
        tattoos: false,
        services: {} as Record<string, boolean>
    });

    useEffect(() => {
        async function loadData() {
            const supabase = createBrowserClient();

            const [listingRes, citiesRes, categoriesRes] = await Promise.all([
                supabase.from('listings').select('*').eq('id', params.id).single(),
                supabase.from('cities').select('*').eq('is_active', true).order('name'),
                supabase.from('categories').select('*').order('name'),
            ]);

            if (citiesRes.data) setCities(citiesRes.data);
            if (categoriesRes.data) setCategories(categoriesRes.data);

            if (listingRes.data) {
                const l = listingRes.data;
                setFormData({
                    title: l.title,
                    slug: l.slug,
                    description: l.description || '',
                    city_id: l.city_id,
                    category_id: l.category_id,
                    price: l.price?.toString() || '',
                    phone: l.phone || '',
                    is_featured: l.is_featured,
                    is_active: l.is_active,
                    breast_size: l.breast_size || '',
                    body_hair: l.body_hair || 'shaved',
                    smoking: l.smoking || false,
                    alcohol: l.alcohol || false,
                    gender: l.gender || 'woman',
                    orientation: l.orientation || 'straight',
                    ethnicity: l.ethnicity || 'european',
                    nationality: l.nationality || '',
                    age_value: l.age_value || '',
                    height: l.height || '',
                    weight: l.weight || '',
                    languages: Array.isArray(l.languages) ? l.languages : [],
                    tattoos: l.tattoos || false,
                    services: l.services || {}
                });
            }

            setLoading(false);
        }
        loadData();
    }, [params.id]);

    const handleTitleChange = (value: string) => {
        setFormData({
            ...formData,
            title: value,
            slug: slugify(value),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const supabase = createBrowserClient();

            const dataToUpdate = {
                ...formData,
                race: formData.ethnicity, // Sync with race for filters
                price: formData.price ? parseFloat(formData.price) : null,
                age_value: formData.age_value ? parseInt(formData.age_value as string) : null,
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('listings')
                .update(dataToUpdate)
                .eq('id', params.id);

            if (error) throw error;

            router.push('/dashboard/profiles/active');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'İlan güncellenirken bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bu ilanı silmek istediğinizden emin misiniz?')) return;

        setSaving(true);
        try {
            const supabase = createBrowserClient();
            const { error } = await supabase
                .from('listings')
                .delete()
                .eq('id', params.id);

            if (error) throw error;

            router.push('/dashboard/listings');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'İlan silinirken bir hata oluştu');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-4xl text-center">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-10 w-48 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 w-64 bg-gray-100 rounded-full"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">
            <div className="mb-8 items-center flex justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tight">Profil Düzenle</h1>
                    <p className="text-gray-400 mt-1 text-lg">
                        <span className="font-bold text-primary">{formData.title}</span> profilini güncelliyorsunuz
                    </p>
                </div>
                <Button variant="outline" onClick={() => router.back()} className="border-white/10 text-white hover:bg-white/5">Geri Dön</Button>
            </div>

            <Card className="border-white/10 shadow-xl shadow-primary/5 overflow-visible bg-card">
                <CardHeader className="bg-white/5 border-b border-white/5 py-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-lg">
                        <Info className="h-5 w-5" /> Temel Bilgiler
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300">Profil Adı (Başlık) *</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    required
                                    className="border-white/10 focus:border-primary font-medium h-11 shadow-sm bg-white/5 text-white"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                    <LinkIcon className="h-3 w-3" /> Profil Linki (URL)
                                </label>
                                <Input
                                    value={formData.slug}
                                    readOnly
                                    className="border-white/10 bg-white/5 text-gray-500 font-mono text-sm h-11 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Açıklama</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full min-h-[140px] rounded-xl border border-white/10 p-4 text-sm focus:border-primary outline-none shadow-sm transition-all bg-white/5 text-white"
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" /> Şehir
                                </label>
                                <select
                                    value={formData.city_id}
                                    onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                                    className="w-full h-11 rounded-xl border border-white/10 px-3 text-sm focus:border-primary outline-none bg-white/5 text-white"
                                >
                                    {cities.map(c => <option key={c.id} value={c.id} className="bg-black text-white">{c.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300">Kategori</label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    className="w-full h-11 rounded-xl border border-white/10 px-3 text-sm focus:border-primary outline-none bg-white/5 text-white"
                                >
                                    {categories.map(c => <option key={c.id} value={c.id} className="bg-black text-white">{c.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300 font-mono">Fiyat (TL)</label>
                                <Input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="h-11 border-white/10 focus:border-primary shadow-sm bg-white/5 text-white"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" /> WhatsApp Numarası
                            </label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="905xxxxxxxxx"
                                className="h-11 border-white/10 focus:border-green-500 shadow-sm font-bold bg-white/5 text-white"
                            />
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
                <Card className="border-white/10 shadow-xl bg-card">
                    <CardHeader className="bg-white/5 border-b border-white/5">
                        <CardTitle className="text-base font-black uppercase tracking-tight text-white">Fiziksel Özellikler</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-500">Gögüs Bedeni</label>
                                <select
                                    value={formData.breast_size}
                                    onChange={(e) => setFormData({ ...formData, breast_size: e.target.value })}
                                    className="w-full h-10 rounded-lg border border-white/10 text-xs px-2 focus:border-primary outline-none bg-white/5 text-white"
                                >
                                    <option value="" className="bg-black">Seçiniz</option>
                                    <option value="a" className="bg-black">A</option>
                                    <option value="b" className="bg-black">B</option>
                                    <option value="c" className="bg-black">C</option>
                                    <option value="d" className="bg-black">D</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-500">Cinsiyet</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full h-10 rounded-lg border border-white/10 text-xs px-2 focus:border-primary outline-none bg-white/5 text-white"
                                >
                                    <option value="woman" className="bg-black">Kadın</option>
                                    <option value="man" className="bg-black">Erkek</option>
                                    <option value="trans" className="bg-black">Trans</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-500">Yaş</label>
                                <Input type="number" value={formData.age_value} onChange={e => setFormData({ ...formData, age_value: e.target.value })} className="h-10 text-xs bg-white/5 border-white/10 text-white" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-500">Boy</label>
                                <Input type="number" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} className="h-10 text-xs bg-white/5 border-white/10 text-white" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-500">Kilo</label>
                                <Input type="number" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} className="h-10 text-xs bg-white/5 border-white/10 text-white" />
                            </div>
                        </div>

                        {/* Languages Section */}
                        <div className="space-y-3 pt-4 border-t border-white/5">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-black uppercase text-gray-500">Bildiğim Diller</label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setFormData({ ...formData, languages: [...formData.languages, { lang: '', level: 5 }] })}
                                    className="h-7 text-[9px] border-primary/20 text-primary uppercase font-bold px-2"
                                >
                                    <Plus className="w-3 h-3 mr-1" /> Ekle
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {formData.languages.map((lang, idx) => (
                                    <div key={idx} className="flex items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/10 group/lang">
                                        <Input
                                            placeholder="Dil"
                                            value={lang.lang}
                                            onChange={e => {
                                                const newLangs = [...formData.languages];
                                                newLangs[idx].lang = e.target.value;
                                                setFormData({ ...formData, languages: newLangs });
                                            }}
                                            className="h-8 text-xs bg-transparent border-none focus:ring-0 text-white px-1"
                                        />
                                        <div className="flex items-center gap-0.5">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    className={cn(
                                                        "w-3 h-3 cursor-pointer transition-colors",
                                                        star <= lang.level ? "text-primary fill-primary" : "text-gray-600"
                                                    )}
                                                    onClick={() => {
                                                        const newLangs = [...formData.languages];
                                                        newLangs[idx].level = star;
                                                        setFormData({ ...formData, languages: newLangs });
                                                    }}
                                                />
                                            ))}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, languages: formData.languages.filter((_, i) => i !== idx) })}
                                            className="text-gray-500 hover:text-red-500 transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 shadow-xl bg-card">
                    <CardHeader className="bg-white/5 border-b border-white/5">
                        <CardTitle className="text-base font-black uppercase tracking-tight text-white">Durum & Ayarlar</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                            <div>
                                <p className="font-bold text-white">Profil Aktif</p>
                                <p className="text-xs text-gray-400">Sitede görünebilir</p>
                            </div>
                            <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} className="w-6 h-6 rounded-lg text-primary focus:ring-primary bg-black border-white/10" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-primary/5 rounded-2xl border border-primary/10">
                            <div>
                                <p className="font-bold text-primary">Vitrin Profil</p>
                                <p className="text-xs text-primary/70">Öne çıkarılanlar listesi</p>
                            </div>
                            <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} className="w-6 h-6 rounded-lg text-primary focus:ring-primary bg-black border-white/10" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-between bg-black/80 backdrop-blur-md p-6 rounded-3xl border border-white/10 shadow-2xl sticky bottom-4 z-20 mt-12 gap-4">
                <Button
                    onClick={handleSubmit}
                    disabled={saving}
                    className="flex-1 bg-primary hover:bg-primary/90 text-black font-black h-14 rounded-2xl shadow-lg shadow-primary/20 transition-all hover:scale-[1.01]"
                >
                    {saving ? 'Güncelleniyor...' : 'Profil Değişikliklerini Kaydet'}
                </Button>
                <Button
                    variant="outline"
                    onClick={() => router.back()}
                    className="h-14 px-8 rounded-2xl border-white/10 text-white hover:bg-white/5 font-bold"
                >
                    Vazgeç
                </Button>
                <button
                    onClick={handleDelete}
                    className="ml-4 text-gray-500 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-tighter"
                >
                    Profili Sil
                </button>
            </div>
            {error && <p className="mt-4 text-center text-amber-500 font-bold animate-bounce">{error}</p>}
        </div>
    );
}
