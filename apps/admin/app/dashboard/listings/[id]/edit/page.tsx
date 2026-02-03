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

            router.push('/dashboard/listings');
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
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <div className="text-center">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">İlan Düzenle</h1>
                <p className="text-muted-foreground mt-1">
                    {formData.title}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>İlan Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="title" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <AlignLeft className="h-4 w-4 text-red-500" /> Profil Başlığı *
                                </label>
                                <Input
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    required
                                    disabled={saving}
                                    className="h-11 border-gray-200 focus:border-red-500 shadow-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="phone" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-green-500" /> İletişim Numarası
                                </label>
                                <Input
                                    id="phone"
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+90 5XX XXX XX XX"
                                    disabled={saving}
                                    className="h-11 border-gray-200 focus:border-red-500 shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="city_id" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-red-500" /> Şehir *
                                </label>
                                <select
                                    id="city_id"
                                    value={formData.city_id}
                                    onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                                    required
                                    disabled={saving}
                                    className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 shadow-sm"
                                >
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.id}>
                                            {city.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="category_id" className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <Layers className="h-4 w-4 text-red-500" /> Kategori *
                                </label>
                                <select
                                    id="category_id"
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    required
                                    disabled={saving}
                                    className="flex h-11 w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 shadow-sm"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.parent_id ? `— ${cat.name}` : cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-bold text-gray-700">Profil Açıklaması</label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                disabled={saving}
                                rows={4}
                                className="flex w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 shadow-sm min-h-[120px]"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="price" className="text-sm font-bold text-gray-700">Taban Fiyat (TRY)</label>
                                <Input
                                    id="price"
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    disabled={saving}
                                    className="h-11 border-gray-200 focus:border-red-500 shadow-sm"
                                />
                            </div>
                            <div className="flex items-center gap-6 h-full mt-6">
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="w-5 h-5 rounded-lg border-gray-300 text-red-600 focus:ring-red-500"
                                    />
                                    <label htmlFor="is_active" className="text-sm font-bold text-gray-700">Aktif</label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_featured"
                                        checked={formData.is_featured}
                                        onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                        className="w-5 h-5 rounded-lg border-gray-300 text-red-600 focus:ring-red-500"
                                    />
                                    <label htmlFor="is_featured" className="text-sm font-bold text-gray-700">Vitrin</label>
                                </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="border-red-50 shadow-md">
                    <CardHeader className="bg-red-50/30 border-b border-red-50">
                        <CardTitle className="text-base font-black uppercase tracking-tight">Fiziksel Özellikler</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">Gögüs Bedeni</label>
                                <select
                                    value={formData.breast_size}
                                    onChange={(e) => setFormData({ ...formData, breast_size: e.target.value })}
                                    className="w-full h-10 rounded-lg border border-gray-200 text-xs px-2"
                                >
                                    <option value="">Belirtilmemiş</option>
                                    <option value="a">A</option>
                                    <option value="b">B</option>
                                    <option value="bb">BB</option>
                                    <option value="d">D</option>
                                    <option value="dd">DD</option>
                                    <option value="ff">FF</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">Vücut Tüyü</label>
                                <select
                                    value={formData.body_hair}
                                    onChange={(e) => setFormData({ ...formData, body_hair: e.target.value })}
                                    className="w-full h-10 rounded-lg border border-gray-200 text-xs px-2"
                                >
                                    <option value="shaved">Tıraşlı</option>
                                    <option value="natural">Doğal</option>
                                    <option value="sometimes">Bazen</option>
                                </select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">Cinsiyet</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    className="w-full h-10 rounded-lg border border-gray-200 text-xs px-2"
                                >
                                    <option value="woman">Kadın</option>
                                    <option value="man">Erkek</option>
                                    <option value="trans">Trans</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-2">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">Yaş</label>
                                <Input
                                    type="number"
                                    value={formData.age_value}
                                    onChange={(e) => setFormData({ ...formData, age_value: e.target.value })}
                                    className="h-10 border-gray-200 text-xs"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">Boy</label>
                                <Input
                                    type="number"
                                    value={formData.height}
                                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                                    className="h-10 border-gray-200 text-xs"
                                    placeholder="170"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black uppercase text-gray-400">Kilo</label>
                                <Input
                                    type="number"
                                    value={formData.weight}
                                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                    className="h-10 border-gray-200 text-xs"
                                    placeholder="55"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-2">
                            {[
                                { id: 'smoking', label: 'Sigara', value: formData.smoking },
                                { id: 'alcohol', label: 'Alkol', value: formData.alcohol },
                                { id: 'tattoos', label: 'Dövme', value: formData.tattoos },
                            ].map((item) => (
                                <div key={item.id} className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 bg-gray-50/50">
                                    <input
                                        type="checkbox"
                                        id={item.id}
                                        checked={item.value}
                                        onChange={(e) => setFormData({ ...formData, [item.id]: e.target.checked })}
                                        className="w-4 h-4 rounded text-red-600"
                                    />
                                    <label htmlFor={item.id} className="text-[10px] font-black uppercase text-gray-500 mt-2">{item.label}</label>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-1.5 pt-2">
                            <label className="text-[10px] font-black uppercase text-gray-400">Etnik Köken</label>
                            <Input
                                value={formData.ethnicity}
                                onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}
                                className="h-10 border-gray-200 text-xs"
                            />
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-red-50 shadow-md">
                    <CardHeader className="bg-red-50/30 border-b border-red-50">
                        <CardTitle className="text-base font-black uppercase tracking-tight">Sunulan Hizmetler</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                            {['Anal', 'Oral', '69', 'CIM', 'Kızlık Bozma', 'BDSM', 'Grup', 'Eskort', 'Masaj', 'Kıyafetli', 'Roleplay', 'Duş', 'Gece Boyu'].map((service) => (
                                <div
                                    key={service}
                                    className={`flex items-center gap-2 p-2 rounded-lg border transition-colors cursor-pointer ${formData.services[service] ? 'bg-red-50 border-red-200 text-red-700' : 'bg-white border-gray-100 text-gray-500'
                                        }`}
                                    onClick={() => {
                                        const newServices = { ...formData.services };
                                        newServices[service] = !newServices[service];
                                        setFormData({ ...formData, services: newServices });
                                    }}
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${formData.services[service] ? 'bg-red-500 border-red-500' : 'bg-white border-gray-300'}`}>
                                        {formData.services[service] && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                                    </div>
                                    <span className="text-[11px] font-bold">{service}</span>
                                </div>
                            ))}
                        </div>
                        <p className="text-[9px] text-gray-400 mt-4 italic">* Buradaki değişiklikler anında kaydedilmez, alttaki kaydet butonuyla tamamlanmalıdır.</p>
                    </CardContent>
                </Card>
            </div>

            <div className="flex items-center justify-between bg-white/80 backdrop-blur-md p-6 rounded-2xl border border-red-100 shadow-2xl sticky bottom-4 z-20">
                <div className="flex items-center gap-4">
                    <Button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="bg-red-600 hover:bg-red-700 text-white font-black px-8 h-12 rounded-xl shadow-lg shadow-red-200 transition-all active:scale-95"
                    >
                        {saving ? 'Güncelleniyor...' : 'Profil Ayarlarını Kaydet'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={saving}
                        className="h-12 px-6 rounded-xl border-gray-200 text-gray-500 hover:bg-gray-50"
                    >
                        İptal
                    </Button>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={handleDelete}
                    disabled={saving}
                    className="text-red-400 hover:text-red-600 text-[10px] font-black uppercase tracking-widest"
                >
                    Profili Tamamen Sil
                </Button>
            </div>
        </div>
    );
}
