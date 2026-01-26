'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { slugify, createBrowserClient } from '@repo/lib';
import type { Category } from '@repo/types';

export default function NewCategoryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const parentId = searchParams.get('parent');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        parent_id: parentId || '',
        order: 0,
        seo_title: '',
        seo_description: '',
    });

    useEffect(() => {
        async function loadCategories() {
            const supabase = createBrowserClient();
            const { data } = await supabase
                .from('categories')
                .select('*')
                .is('parent_id', null)
                .order('name');

            if (data) setCategories(data);
        }
        loadCategories();
    }, []);

    const handleNameChange = (value: string) => {
        setFormData({
            ...formData,
            name: value,
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
                parent_id: formData.parent_id || null,
            };

            const { error } = await supabase
                .from('categories')
                .insert([dataToInsert]);

            if (error) throw error;

            router.push('/dashboard/categories');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Kategori eklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    {parentId ? 'Yeni Alt Kategori Ekle' : 'Yeni Kategori Ekle'}
                </h1>
                <p className="text-muted-foreground mt-1">
                    {parentId ? 'Ana kategoriye bağlı yeni alt kategori oluşturun' : 'Yeni ana kategori oluşturun'}
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Kategori Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {!parentId && (
                            <div className="space-y-2">
                                <label htmlFor="parent_id" className="text-sm font-medium">
                                    Ana Kategori (Opsiyonel)
                                </label>
                                <select
                                    id="parent_id"
                                    value={formData.parent_id}
                                    onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
                                    disabled={loading}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                >
                                    <option value="">-- Ana Kategori --</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                                <p className="text-xs text-muted-foreground">
                                    Boş bırakırsanız ana kategori olarak eklenir
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Kategori Adı *
                            </label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="Hizmetler"
                                required
                                disabled={loading}
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
                                placeholder="hizmetler"
                                required
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">
                                URL'de görünecek: /kategori/{formData.slug || 'slug'}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="order" className="text-sm font-medium">
                                Sıra
                            </label>
                            <Input
                                id="order"
                                type="number"
                                value={formData.order}
                                onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">
                                Küçük sayılar önce görünür
                            </p>
                        </div>

                        <div className="border-t pt-6">
                            <h3 className="font-medium mb-4">SEO Ayarları</h3>

                            <div className="space-y-2 mb-4">
                                <label htmlFor="seo_title" className="text-sm font-medium">
                                    SEO Başlık
                                </label>
                                <Input
                                    id="seo_title"
                                    value={formData.seo_title}
                                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                                    placeholder={`${formData.name} İlanları`}
                                    disabled={loading}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="seo_description" className="text-sm font-medium">
                                    SEO Açıklama
                                </label>
                                <textarea
                                    id="seo_description"
                                    value={formData.seo_description}
                                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                                    placeholder={`${formData.name} kategorisindeki tüm ilanlar`}
                                    disabled={loading}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-md">
                                {error}
                            </div>
                        )}

                        <div className="flex items-center gap-4">
                            <Button type="submit" disabled={loading}>
                                {loading ? 'Ekleniyor...' : 'Kategori Ekle'}
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
