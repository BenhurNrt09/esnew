'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { slugify } from '@repo/lib';
import { createBrowserClient } from '@repo/lib';

export default function NewCityPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        is_active: true,
        seo_title: '',
        seo_description: '',
    });

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

            const { error } = await supabase
                .from('cities')
                .insert([formData]);

            if (error) throw error;

            router.push('/dashboard/cities');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Şehir eklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Yeni Şehir Ekle</h1>
                <p className="text-muted-foreground mt-1">
                    Platform'a yeni bir şehir ekleyin
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Şehir Bilgileri</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                Şehir Adı *
                            </label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                placeholder="İstanbul"
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
                                placeholder="istanbul"
                                required
                                disabled={loading}
                            />
                            <p className="text-xs text-muted-foreground">
                                URL'de görünecek: /sehir/{formData.slug || 'slug'}
                            </p>
                        </div>

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
                                Aktif
                            </label>
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
                                    placeholder={`${formData.name}'da en iyi hizmet ve profil ilanları`}
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
                                {loading ? 'Ekleniyor...' : 'Şehir Ekle'}
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
