'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { slugify, createBrowserClient } from '@repo/lib';
import type { City, Category } from '@repo/types';

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

            const { error } = await supabase
                .from('listings')
                .insert([dataToInsert]);

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
                <h1 className="text-3xl font-bold">Yeni İlan Ekle</h1>
                <p className="text-muted-foreground mt-1">
                    Platform'a yeni bir ilan ekleyin
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>İlan Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">
                                İlan Başlığı *
                            </label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                placeholder="Profesyonel Temizlik Hizmeti"
                                required
                                disabled={loading}
                            />
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <label htmlFor="slug" className="text-sm font-medium">
                                Slug (URL) *
                            </label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="profesyonel-temizlik-hizmeti"
                                required
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">
                                URL: /ilan/{formData.slug || 'slug'}
                            </p>
                        </div>

                        {/* City */}
                        <div className="space-y-2">
                            <label htmlFor="city_id" className="text-sm font-medium">
                                Şehir *
                            </label>
                            <select
                                id="city_id"
                                value={formData.city_id}
                                onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                                required
                                disabled={loading}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="">Şehir seçin...</option>
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Category */}
                        <div className="space-y-2">
                            <label htmlFor="category_id" className="text-sm font-medium">
                                Kategori *
                            </label>
                            <select
                                id="category_id"
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                required
                                disabled={loading}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="">Kategori seçin...</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.parent_id ? `— ${cat.name}` : cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">
                                Açıklama
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="İlan açıklaması..."
                                disabled={loading}
                                rows={6}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

                        {/* Price */}
                        <div className="space-y-2">
                            <label htmlFor="price" className="text-sm font-medium">
                                Fiyat (TRY)
                            </label>
                            <Input
                                id="price"
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                placeholder="500.00"
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">
                                Boş bırakılırsa fiyat gösterilmez
                            </p>
                        </div>

                        {/* Checkboxes */}
                        <div className="space-y-3 border-t pt-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    disabled={loading}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium">
                                    Aktif (Web sitesinde görünsün)
                                </label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    disabled={loading}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                                <label htmlFor="is_featured" className="text-sm font-medium">
                                    Öne Çıkan
                                </label>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Ekleniyor...' : 'İlan Ekle'}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => router.back()}
                                disabled={loading}
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
