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
            <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase transition-all">Kategori <span className="text-primary italic">Düzenle</span></h1>
                    <p className="text-gray-400 mt-2 font-medium italic">"{formData.name}" kategorisini güncelliyorsunuz.</p>
                </div>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={handleDelete}
                    className="text-gray-500 hover:text-red-500 hover:bg-red-500/5 font-black uppercase text-xs tracking-widest gap-2 h-12 px-6 rounded-xl border border-white/5"
                >
                    <Trash2 className="h-4 w-4" /> Kategoriyi Sil
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <Card className="border-white/10 bg-white/5 backdrop-blur-md shadow-2xl rounded-2xl overflow-visible">
                    <CardHeader className="bg-white/5 border-b border-white/5 py-5">
                        <CardTitle className="flex items-center gap-3 text-white font-black uppercase text-sm tracking-widest">
                            <Layers className="h-5 w-5 text-primary" /> Kategori Detayları
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-8 grid gap-8 bg-black/20">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Üst Kategori</label>
                            <Combobox
                                options={categories.map(c => ({ value: c.id, label: c.name }))}
                                value={formData.parent_id}
                                onChange={(val: string) => setFormData({ ...formData, parent_id: val })}
                                placeholder="Ana Kategori Seçiniz (Yoksa boş bırakın)"
                                searchPlaceholder="Kategori ara..."
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Kategori Adı *</label>
                            <div className="relative group">
                                <AlignLeft className="absolute left-4 top-4 h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                <Input
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="Örn: Hizmetler veya Göz Rengi"
                                    required
                                    className="pl-12 bg-black/40 border-white/10 focus:border-primary h-12 shadow-xl font-bold text-white rounded-xl transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 flex items-center gap-2">
                                <LinkIcon className="h-3 w-3" /> Slug (URL)
                            </label>
                            <Input
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="otomatik-olusturulur"
                                required
                                className="bg-black/20 border-white/5 text-primary/60 font-mono text-xs h-12 shadow-inner rounded-xl italic cursor-not-allowed"
                                readOnly
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sıra No</label>
                            <div className="relative group">
                                <SortAsc className="absolute left-4 top-4 h-4 w-4 text-gray-500 group-focus-within:text-primary transition-colors" />
                                <Input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    className="pl-12 bg-black/40 border-white/10 focus:border-primary h-12 shadow-xl font-black text-white rounded-xl"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-white/10 bg-white/5 backdrop-blur-md shadow-2xl rounded-2xl overflow-visible">
                    <CardHeader className="bg-white/5 border-b border-white/5 py-5">
                        <CardTitle className="flex items-center gap-3 text-white font-black uppercase text-sm tracking-widest">
                            <FileText className="h-5 w-5 text-primary" /> SEO Ayarları
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-8 grid gap-8 bg-black/20">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SEO Başlık</label>
                            <Input
                                value={formData.seo_title}
                                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                                placeholder={`${formData.name || '...'} İlanları`}
                                className="bg-black/40 border-white/10 focus:border-primary h-12 shadow-xl font-bold text-white rounded-xl"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">SEO Açıklama</label>
                            <textarea
                                value={formData.seo_description}
                                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                                placeholder={`${formData.name || '...'} kategorisindeki tüm ilanlar ve profiller.`}
                                className="w-full min-h-[120px] rounded-xl border border-white/10 bg-black/40 p-4 text-sm font-medium text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none shadow-xl transition-all resize-y"
                            />
                        </div>
                    </CardContent>
                </Card>

                {error && (
                    <div className="p-4 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 flex items-center gap-3 font-black uppercase text-xs tracking-widest animate-pulse">
                        <Info className="h-5 w-5" />
                        {error}
                    </div>
                )}

                <div className="flex items-center gap-4 sticky bottom-6 bg-black/80 backdrop-blur-xl p-6 rounded-2xl border border-white/10 shadow-3xl z-40 mt-10">
                    <Button type="submit" disabled={saving} className="flex-1 bg-gold-gradient hover:opacity-90 text-black h-14 text-lg font-black uppercase tracking-tighter shadow-2xl shadow-primary/20 rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]">
                        {saving ? 'Güncelleniyor...' : 'Değişiklikleri Kaydet'}
                    </Button>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => router.back()}
                        disabled={saving}
                        className="h-14 px-10 rounded-xl border border-white/5 text-gray-400 hover:text-white hover:bg-white/5 font-black uppercase text-xs tracking-widest"
                    >
                        İptal
                    </Button>
                </div>
            </form>
        </div>
    );
}
