'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { slugify, createBrowserClient } from '@repo/lib';
import type { City, Category } from '@repo/types';
import { Star, CheckCircle2 } from 'lucide-react';

export default function NewListingPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
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
        is_featured: false,
        is_active: true,
    });

    useEffect(() => {
        async function loadData() {
            const supabase = createBrowserClient();
            const [citiesRes, categoriesRes] = await Promise.all([
                supabase.from('cities').select('*').eq('is_active', true).order('name'),
                supabase.from('categories').select('*').order('name'),
            ]);

            if (citiesRes.data) setCities(citiesRes.data);
            if (categoriesRes.data) setCategories(categoriesRes.data);
        }
        loadData();
    }, []);

    const handleTitleChange = (value: string) => {
        setFormData({
            ...formData,
            title: value,
            slug: slugify(value),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const supabase = createBrowserClient();
            const dataToInsert = {
                ...formData,
                price: formData.price ? parseFloat(formData.price) : null,
            };

            const { error } = await supabase.from('listings').insert([dataToInsert]);
            if (error) throw error;

            router.push('/dashboard/listings');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'İlan eklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-red-950">Yeni İlan Ekle</h1>
                <p className="text-muted-foreground mt-1">Platform'a yeni bir ilan ekleyin</p>
            </div>

            <Card className="border-red-100 shadow-sm">
                <CardHeader className="bg-red-50/50 border-b border-red-50">
                    <CardTitle className="text-red-900">İlan Bilgileri</CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">İlan Başlığı *</label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="Örn: Profesyonel Mankenlik Hizmeti"
                                required
                                disabled={loading}
                                className="border-gray-300 focus:border-red-500"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label htmlFor="city_id" className="text-sm font-medium">Şehir *</label>
                                <select
                                    id="city_id"
                                    value={formData.city_id}
                                    onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                                    required
                                    disabled={loading}
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                >
                                    <option value="">Seçiniz...</option>
                                    {cities.map((city) => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="category_id" className="text-sm font-medium">Kategori *</label>
                                <select
                                    id="category_id"
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    required
                                    disabled={loading}
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                                >
                                    <option value="">Seçiniz...</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.parent_id ? `— ${cat.name}` : cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="price" className="text-sm font-medium">Fiyat (Opsiyonel)</label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="0.00"
                                disabled={loading}
                                className="border-gray-300 focus:border-red-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">Description</label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="İlan detayları..."
                                className="flex min-h-[120px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        {/* Custom Checkboxes */}
                        <div className="flex flex-col gap-4 border-t pt-6">
                            {/* Featured Box */}
                            <div
                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${formData.is_featured
                                        ? 'bg-amber-50 border-amber-200 shadow-sm'
                                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${formData.is_featured ? 'bg-amber-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                    <Star className="w-5 h-5 fill-current" />
                                </div>
                                <div className="flex-1">
                                    <p className={`font-bold ${formData.is_featured ? 'text-amber-900' : 'text-gray-700'}`}>Vitrine Ekle</p>
                                    <p className="text-xs text-muted-foreground">Bu ilanı ana sayfadaki "Öne Çıkanlar" bölümünde göster.</p>
                                </div>
                                <div className={`w-6 h-6 rounded border flex items-center justify-center ${formData.is_featured ? 'bg-amber-500 border-amber-500' : 'border-gray-300 bg-white'}`}>
                                    {formData.is_featured && <CheckCircle2 className="w-4 h-4 text-white" />}
                                </div>
                            </div>

                            {/* Active Box */}
                            <div
                                className={`flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${formData.is_active
                                        ? 'bg-green-50 border-green-200 shadow-sm'
                                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                                    }`}
                                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${formData.is_active ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'}`}>
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className={`font-bold ${formData.is_active ? 'text-green-900' : 'text-gray-700'}`}>Yayında (Aktif)</p>
                                    <p className="text-xs text-muted-foreground">İlan web sitesinde herkese açık olarak görünecek.</p>
                                </div>
                                <div className={`w-6 h-6 rounded border flex items-center justify-center ${formData.is_active ? 'bg-green-500 border-green-500' : 'border-gray-300 bg-white'}`}>
                                    {formData.is_active && <CheckCircle2 className="w-4 h-4 text-white" />}
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-100 rounded-md font-medium">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center gap-4 pt-4">
                            <Button type="submit" disabled={loading} className="bg-red-600 hover:bg-red-700 text-white min-w-[150px]">
                                {loading ? 'Ekleniyor...' : 'İlanı Kaydet'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={loading}
                                className="border-red-200 text-red-700 hover:bg-red-50"
                            >
                                İptal
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
