'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { slugify, createBrowserClient } from '@repo/lib';
import type { City, Category, Listing } from '@repo/types';

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
        is_featured: false,
        is_active: true,
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
                setFormData({
                    title: listingRes.data.title,
                    slug: listingRes.data.slug,
                    description: listingRes.data.description || '',
                    city_id: listingRes.data.city_id,
                    category_id: listingRes.data.category_id,
                    price: listingRes.data.price?.toString() || '',
                    is_featured: listingRes.data.is_featured,
                    is_active: listingRes.data.is_active,
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
                price: formData.price ? parseFloat(formData.price) : null,
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
                        <div className="space-y-2">
                            <label htmlFor="title" className="text-sm font-medium">
                                İlan Başlığı *
                            </label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleTitleChange(e.target.value)}
                                required
                                disabled={saving}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="slug" className="text-sm font-medium">
                                Slug (URL) *
                            </label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                required
                                disabled={saving}
                            />
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="city_id" className="text-sm font-medium">
                                Şehir *
                            </label>
                            <select
                                id="city_id"
                                value={formData.city_id}
                                onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                                required
                                disabled={saving}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                {cities.map((city) => (
                                    <option key={city.id} value={city.id}>
                                        {city.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="category_id" className="text-sm font-medium">
                                Kategori *
                            </label>
                            <select
                                id="category_id"
                                value={formData.category_id}
                                onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                required
                                disabled={saving}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.parent_id ? `— ${cat.name}` : cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="description" className="text-sm font-medium">
                                Açıklama
                            </label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                disabled={saving}
                                rows={6}
                                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            />
                        </div>

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
                                disabled={saving}
                            />
                        </div>

                        <div className="space-y-3 border-t pt-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                    disabled={saving}
                                    className="w-4 h-4 rounded border-gray-300"
                                />
                                <label htmlFor="is_active" className="text-sm font-medium">
                                    Aktif
                                </label>
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_featured"
                                    checked={formData.is_featured}
                                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                                    disabled={saving}
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

                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Button type="submit" disabled={saving}>
                                    {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={saving}
                                >
                                    İptal
                                </Button>
                            </div>
                            <Button
                                type="button"
                                variant="destructive"
                                onClick={handleDelete}
                                disabled={saving}
                            >
                                Sil
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
