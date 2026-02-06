'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { slugify, createBrowserClient } from '@repo/lib';
import type { City, Category, Listing } from '@repo/types';
import { Combobox } from '../../../../components/Combobox';
import { AlignLeft, Link as LinkIcon, MapPin, Layers, Info, CheckCircle2 } from 'lucide-react';

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
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Profil Düzenle</h1>
                <p className="text-muted-foreground mt-1 text-lg">
                    <span className="font-bold text-primary">{formData.title}</span> profilini güncelliyorsunuz
                </p>
            </div>

            <Card className="border-primary/20 shadow-xl shadow-primary/5 overflow-visible">
                <CardHeader className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-100 py-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-lg">
                        <Info className="h-5 w-5" /> Temel Bilgiler
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Profil Adı (Başlık) *</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    required
                                    className="border-gray-200 focus:border-primary font-medium h-11 shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <LinkIcon className="h-3 w-3" /> Profil Linki (URL)
                                </label>
                                <Input
                                    value={formData.slug}
                                    readOnly
                                    className="border-gray-200 bg-gray-50 text-gray-500 font-mono text-sm h-11 cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Açıklama</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full min-h-[140px] rounded-xl border border-gray-200 p-4 text-sm focus:border-primary outline-none shadow-sm transition-all"
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" /> Şehir
                                </label>
                                <select
                                    value={formData.city_id}
                                    onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                                    className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:border-primary outline-none"
                                >
                                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Kategori</label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    className="w-full h-11 rounded-xl border border-gray-200 px-3 text-sm focus:border-primary outline-none"
                                >
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 font-mono">Fiyat (TL)</label>
                                <Input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="h-11 border-gray-200 focus:border-primary shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <CheckCircle2 className="h-4 w-4 text-green-500" /> WhatsApp Numarası
                            </label>
                            <Input
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="905xxxxxxxxx"
                                className="h-11 border-gray-200 focus:border-green-500 shadow-sm font-bold"
                            />
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-8 mt-8">
                <Card className="border-primary/5 shadow-xl">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                        <CardTitle className="text-base font-black uppercase tracking-tight">Fiziksel Özellikler</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">Gögüs Bedeni</label>
                                <select
                                    value={formData.breast_size}
                                    onChange={(e) => setFormData({ ...formData, breast_size: e.target.value })}
                                    className="w-full h-10 rounded-lg border border-gray-200 text-xs px-2 focus:border-primary outline-none"
                                >
                                    <option value="">Seçiniz</option>
                                    <option value="a">A</option>
                                    <option value="b">B</option>
                                    <option value="c">C</option>
                                    <option value="d">D</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">Cinsiyet</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full h-10 rounded-lg border border-gray-200 text-xs px-2 focus:border-primary outline-none"
                                >
                                    <option value="woman">Kadın</option>
                                    <option value="man">Erkek</option>
                                    <option value="trans">Trans</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">Yaş</label>
                                <Input type="number" value={formData.age_value} onChange={e => setFormData({ ...formData, age_value: e.target.value })} className="h-10 text-xs" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">Boy</label>
                                <Input type="number" value={formData.height} onChange={e => setFormData({ ...formData, height: e.target.value })} className="h-10 text-xs" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">Kilo</label>
                                <Input type="number" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} className="h-10 text-xs" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-primary/5 shadow-xl">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                        <CardTitle className="text-base font-black uppercase tracking-tight">Durum & Ayarlar</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                            <div>
                                <p className="font-bold text-gray-700">Profil Aktif</p>
                                <p className="text-xs text-gray-400">Sitede görünebilir</p>
                            </div>
                            <input type="checkbox" checked={formData.is_active} onChange={e => setFormData({ ...formData, is_active: e.target.checked })} className="w-6 h-6 rounded-lg text-primary focus:ring-primary" />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <div>
                                <p className="font-bold text-amber-900">Vitrin Profil</p>
                                <p className="text-xs text-amber-600">Öne çıkarılanlar listesi</p>
                            </div>
                            <input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({ ...formData, is_featured: e.target.checked })} className="w-6 h-6 rounded-lg text-amber-600 focus:ring-amber-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-between bg-white/95 backdrop-blur-md p-6 rounded-3xl border border-gray-100 shadow-2xl sticky bottom-4 z-20 mt-12 gap-4">
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
                    className="h-14 px-8 rounded-2xl border-gray-200 text-gray-500 hover:bg-gray-50 font-bold"
                >
                    Vazgeç
                </Button>
                <button
                    onClick={handleDelete}
                    className="ml-4 text-gray-300 hover:text-amber-500 transition-colors text-[10px] font-black uppercase tracking-tighter"
                >
                    Profili Sil
                </button>
            </div>
            {error && <p className="mt-4 text-center text-amber-500 font-bold animate-bounce">{error}</p>}
        </div>
    );
}
