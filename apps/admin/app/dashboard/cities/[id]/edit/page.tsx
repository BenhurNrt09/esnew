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
            <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase transition-all">Şehir <span className="text-primary italic">Düzenle</span></h1>
                    <p className="text-gray-400 mt-2 font-medium italic">"{formData.name}" bilgilerini düzenleyin</p>
                </div>
            </div>

            <Card className="border-white/10 bg-white/5 backdrop-blur-md shadow-2xl rounded-2xl overflow-hidden">
                <CardHeader className="bg-white/5 border-b border-white/5 py-5">
                    <CardTitle className="text-white font-black uppercase text-sm tracking-widest flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-primary" />
                        Şehir Bilgileri
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-8 bg-black/20">
                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label htmlFor="name" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                Şehir Adı *
                            </label>
                            <Input
                                id="name"
                                value={formData.name}
                                onChange={(e) => handleNameChange(e.target.value)}
                                required
                                disabled={saving}
                                className="bg-black/40 border-white/10 focus:border-primary h-12 shadow-xl font-bold text-white rounded-xl transition-all pl-4"
                            />
                        </div>

                        <div className="space-y-3">
                            <label htmlFor="slug" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                Slug (URL) *
                            </label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                required
                                disabled={saving}
                                className="bg-black/20 border-white/5 text-primary/60 font-mono text-xs h-12 shadow-inner rounded-xl italic cursor-not-allowed"
                                readOnly
                            />
                            <p className="text-[10px] text-gray-500 font-medium italic ml-1">
                                URL'de görünecek: /sehir/{formData.slug}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 bg-white/5 p-4 rounded-xl border border-white/5">
                            <input
                                type="checkbox"
                                id="is_active"
                                checked={formData.is_active}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                disabled={saving}
                                className="w-5 h-5 rounded border-white/10 bg-black/40 text-primary focus:ring-primary focus:ring-offset-0"
                            />
                            <label htmlFor="is_active" className="text-sm font-black text-white uppercase tracking-tight">
                                Sitede Aktif Göster
                            </label>
                        </div>

                        <div className="border-t border-white/10 pt-8 mt-10">
                            <h3 className="font-black text-xs text-primary uppercase tracking-widest mb-6 flex items-center gap-2">
                                <span className="p-1 bg-primary/10 rounded">SEO</span> Ayarları
                            </h3>

                            <div className="space-y-3 mb-6">
                                <label htmlFor="seo_title" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    Meta Başlık
                                </label>
                                <Input
                                    id="seo_title"
                                    value={formData.seo_title || ''}
                                    onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                                    disabled={saving}
                                    placeholder={`${formData.name} Escort İlanları`}
                                    className="bg-black/40 border-white/10 focus:border-primary h-12 shadow-xl font-bold text-white rounded-xl"
                                />
                            </div>

                            <div className="space-y-3">
                                <label htmlFor="seo_description" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                    Meta Açıklama
                                </label>
                                <textarea
                                    id="seo_description"
                                    value={formData.seo_description || ''}
                                    onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                                    disabled={saving}
                                    placeholder={`${formData.name} şehrindeki en yeni escort ilanları ve bağımsız model profilleri.`}
                                    className="flex w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm font-medium text-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all min-h-[120px] outline-none shadow-xl"
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 font-black uppercase text-[10px] tracking-widest animate-pulse">
                                {error}
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-white/5">
                            <div className="flex items-center gap-4 w-full">
                                <Button type="submit" disabled={saving} className="flex-1 bg-gold-gradient hover:opacity-90 text-black h-12 font-black uppercase tracking-tight shadow-xl shadow-primary/20 rounded-xl">
                                    {saving ? 'Kaydediliyor...' : 'Değişiklikleri Kaydet'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => router.back()}
                                    disabled={saving}
                                    className="px-6 h-12 rounded-xl text-gray-400 font-black uppercase text-xs tracking-widest hover:text-white hover:bg-white/5 border border-white/5"
                                >
                                    İptal
                                </Button>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                onClick={handleDelete}
                                disabled={saving}
                                className="w-full sm:w-auto text-gray-500 hover:text-red-500 font-black uppercase text-[10px] tracking-widest px-6 h-10"
                            >
                                Şehri Sil
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
