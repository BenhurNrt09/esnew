'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { slugify, createBrowserClient } from '@repo/lib';
import type { Category } from '@repo/types';
import { Combobox } from '../../../../components/Combobox';
import { Layers, AlignLeft, Link as LinkIcon, SortAsc, FileText, Info, Trash2 } from 'lucide-react';

export default function EditCategoryPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);

    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        parent_id: '',
        order: 0,
        seo_title: '',
        seo_description: '',
    });

    useEffect(() => {
        async function loadData() {
            const supabase = createBrowserClient();

            const [categoryRes, parentCategoriesRes] = await Promise.all([
                supabase.from('categories').select('*').eq('id', params.id).single(),
                supabase.from('categories').select('*').is('parent_id', null).order('name')
            ]);

            if (categoryRes.data) {
                const cat = categoryRes.data;
                setFormData({
                    name: cat.name,
                    slug: cat.slug,
                    parent_id: cat.parent_id || '',
                    order: cat.order || 0,
                    seo_title: cat.seo_title || '',
                    seo_description: cat.seo_description || '',
                });
            }

            if (parentCategoriesRes.data) {
                setCategories(parentCategoriesRes.data.filter(c => c.id !== params.id));
            }

            setLoading(false);
        }
        loadData();
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

            const dataToUpdate = {
                ...formData,
                parent_id: formData.parent_id || null,
            };

            const { error } = await supabase
                .from('categories')
                .update(dataToUpdate)
                .eq('id', params.id);

            if (error) throw error;

            router.push('/dashboard/categories');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Kategori güncellenirken bir hata oluştu');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz? Alt kategoriler de etkilenebilir.')) return;

        setSaving(true);
        try {
            const supabase = createBrowserClient();
            const { error } = await supabase
                .from('categories')
                .delete()
                .eq('id', params.id);

            if (error) throw error;

            router.push('/dashboard/categories');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Kategori silinirken bir hata oluştu');
            setSaving(false);
        }
    };

    if (loading) return <div className="container mx-auto px-4 py-20 text-center font-black text-gray-400 uppercase tracking-widest animate-pulse">Kategori Yükleniyor...</div>;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl animate-in fade-in duration-500">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-red-950 tracking-tight">Kategori Düzenle</h1>
                    <p className="text-muted-foreground mt-1">{formData.name} kategorisini güncelliyorsunuz.</p>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50 font-bold gap-2"
                >
                    <Trash2 className="h-4 w-4" /> Sil
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card className="border-red-100 shadow-lg shadow-red-100/20 overflow-visible">
                    <CardHeader className="bg-gradient-to-r from-red-50 to-white border-b border-red-50 py-4">
                        <CardTitle className="flex items-center gap-2 text-red-900 text-lg">
                            <Layers className="h-5 w-5" /> Kategori Detayları
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 grid gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Üst Kategori</label>
                            <Combobox
                                options={categories.map(c => ({ value: c.id, label: c.name }))}
                                value={formData.parent_id}
                                onChange={(val: string) => setFormData({ ...formData, parent_id: val })}
                                placeholder="Ana Kategori Seçiniz (Yoksa boş bırakın)"
                                searchPlaceholder="Kategori ara..."
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Kategori Adı *</label>
                            <div className="relative">
                                <AlignLeft className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                <Input
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="Örn: Hizmetler veya Göz Rengi"
                                    required
                                    className="pl-10 border-gray-200 focus:border-red-500 h-11 shadow-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                <LinkIcon className="h-3 w-3" /> Slug (URL)
                            </label>
                            <Input
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="otomatik-olusturulur"
                                required
                                className="border-gray-200 bg-gray-50 text-gray-500 font-mono text-sm h-11 shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Sıra No</label>
                            <div className="relative">
                                <SortAsc className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                <Input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    className="pl-10 border-gray-200 focus:border-red-500 h-11 shadow-sm"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-red-100 shadow-lg shadow-red-100/20 overflow-visible">
                    <CardHeader className="bg-gradient-to-r from-red-50 to-white border-b border-red-50 py-4">
                        <CardTitle className="flex items-center gap-2 text-red-900 text-lg">
                            <FileText className="h-5 w-5" /> SEO Ayarları
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 grid gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">SEO Başlık</label>
                            <Input
                                value={formData.seo_title}
                                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                                placeholder={`${formData.name || '...'} İlanları`}
                                className="border-gray-200 focus:border-red-500 h-11 shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">SEO Açıklama</label>
                            <textarea
                                value={formData.seo_description}
                                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                                placeholder={`${formData.name || '...'} kategorisindeki tüm ilanlar ve profiller.`}
                                className="w-full min-h-[100px] rounded-xl border border-gray-200 p-4 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none shadow-sm transition-all resize-y"
                            />
                        </div>
                    </CardContent>
                </Card>

                {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-3 font-medium animate-pulse">
                        <Info className="h-5 w-5" />
                        {error}
                    </div>
                )}

                <div className="flex items-center gap-4 sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-2xl z-40">
                    <Button type="submit" disabled={saving} className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white h-14 text-lg font-bold shadow-lg shadow-amber-200 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99]">
                        {saving ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={saving}
                        className="h-14 px-8 rounded-xl border-gray-300 text-gray-600 hover:bg-gray-50 font-medium"
                    >
                        İptal
                    </Button>
                </div>
            </form>
        </div>
    );
}
