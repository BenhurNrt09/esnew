'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { slugify, createBrowserClient } from '@repo/lib';
import type { City } from '@repo/types';

export default function EditCityPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState<Partial<City>>({
        name: '',
        slug: '',
        is_active: true,
        seo_title: '',
        seo_description: '',
    });

    useEffect(() => {
        async function loadCity() {
            try {
                const supabase = createBrowserClient();
                const { data, error } = await supabase
                    .from('cities')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (error) throw error;
                if (data) setFormData(data);
            } catch (err: any) {
                setError('Şehir yüklenirken hata oluştu');
            } finally {
                setLoading(false);
            }
        }

        loadCity();
    }, [params.id]);

    const handleNameChange = (value: string) => {
        setFormData({
            ...formData,
            name: value,
            slug: slugify(value),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const supabase = createBrowserClient();

            const { error } = await supabase
                .from('cities')
                .update(formData)
                .eq('id', params.id);

            if (error) throw error;

            router.push('/dashboard/cities');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Şehir güncellenirken bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bu şehri silmek istediğinizden emin misiniz?')) return;

        setSaving(true);
        try {
            const supabase = createBrowserClient();
            const { error } = await supabase
                .from('cities')
                .delete()
                .eq('id', params.id);

            if (error) throw error;

            router.push('/dashboard/cities');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Şehir silinirken bir hata oluştu');
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-2xl">
                <div className="text-center">Yükleniyor...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Şehir Düzenle</h1>
                <p className="text-muted-foreground mt-1">
                    {formData.name} bilgilerini düzenleyin
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
                            <p className="text-xs text-muted-foreground">
                                URL'de görünecek: /sehir/{formData.slug}
                            </p>
                        </div>

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

                        <div className="border-t pt-6">
                            <h3 className="font-medium mb-4">SEO Ayarları</h3>

                            <div className="space-y-2 mb-4">
                                <label htmlFor="seo_title" className="text-sm font-medium">
                                    SEO Başlık
                                </label>
                                <Input
                                    id="seo_title"
                                    value={formData.seo_title || ''}
                                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                                    disabled={saving}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="seo_description" className="text-sm font-medium">
                                    SEO Açıklama
                                </label>
                                <textarea
                                    id="seo_description"
                                    value={formData.seo_description || ''}
                                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                                    disabled={saving}
                                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px]"
                                />
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
