'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { slugify, createBrowserClient } from '@repo/lib';
import type { Category } from '@repo/types';
import { Combobox } from '../../../components/Combobox';
import { Layers, AlignLeft, Link as LinkIcon, SortAsc, FileText, Info } from 'lucide-react';

export default function NewCategoryPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const parentId = searchParams.get('parent');

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [error, setError] = useState('');

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

            // Eğer varsa slug kontrolü yapmak iyi olabilir ama DB constraint halleder.

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
        <div className="container mx-auto px-4 py-8 max-w-3xl animate-in fade-in duration-500">
            <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase transition-all">
                        {parentId ? 'Yeni' : 'Yeni'} <span className="text-primary italic">{parentId ? 'Alt Kategori' : 'Kategori'}</span>
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium italic">
                        {parentId ? 'Mevcut kategoriye bağlı bir alt özellik grubu ekleyin.' : 'Platform genelinde kullanılacak yeni bir ana kategori oluşturun.'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                <Card className="border-white/10 shadow-lg overflow-visible bg-white/5 backdrop-blur-sm">
                    <CardHeader className="bg-black/40 border-b border-white/5 py-4">
                        <CardTitle className="flex items-center gap-2 text-primary text-lg font-bold">
                            <Layers className="h-5 w-5" /> Kategori Detayları
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 grid gap-6">

                        {!parentId && (
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-300">Ana Kategori (Opsiyonel)</label>
                                <Combobox
                                    options={categories.map(c => ({ value: c.id, label: c.name }))}
                                    value={formData.parent_id}
                                    onChange={(val) => setFormData({ ...formData, parent_id: val })}
                                    placeholder="Ana Kategori Seçiniz (Yoksa boş bırakın)"
                                    searchPlaceholder="Kategori ara..."
                                    className="border-white/10"
                                />
                                <p className="text-xs text-gray-500">
                                    Bir ana kategori seçerseniz, bu kategori onun alt özelliği olur (Örn: Saç Rengi: Sarı).
                                </p>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Kategori Adı *</label>
                            <div className="relative">
                                <AlignLeft className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                                <Input
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="Örn: Hizmetler veya Göz Rengi"
                                    required
                                    className="pl-10 border-white/10 bg-black/40 text-white focus:border-primary/50 h-11 shadow-sm font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300 flex items-center gap-2">
                                <LinkIcon className="h-3 w-3" /> Slug (URL)
                            </label>
                            <Input
                                value={formData.slug}
                                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                placeholder="otomatik-olusturulur"
                                required
                                className="border-white/5 bg-black/60 text-gray-500 font-mono text-sm h-11 shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Sıra No</label>
                            <div className="relative">
                                <SortAsc className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                                <Input
                                    type="number"
                                    value={formData.order}
                                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                                    className="pl-10 border-white/10 bg-black/40 text-white focus:border-primary/50 h-11 shadow-sm"
                                />
                            </div>
                            <p className="text-xs text-gray-500">Menülerde listelenme sırası (Küçük sayılar önce gelir).</p>
                        </div>

                    </CardContent>
                </Card>

                <Card className="border-white/10 shadow-lg overflow-visible bg-white/5 backdrop-blur-sm">
                    <CardHeader className="bg-black/40 border-b border-white/5 py-4">
                        <CardTitle className="flex items-center gap-2 text-primary text-lg font-bold">
                            <FileText className="h-5 w-5" /> SEO Ayarları
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 grid gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">SEO Başlık</label>
                            <Input
                                value={formData.seo_title}
                                onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                                placeholder={`${formData.name || '...'} İlanları`}
                                className="border-white/10 bg-black/40 text-white focus:border-primary/50 h-11 shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">SEO Açıklama</label>
                            <textarea
                                value={formData.seo_description}
                                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                                placeholder={`${formData.name || '...'} kategorisindeki tüm ilanlar ve profiller.`}
                                className="w-full min-h-[100px] rounded-xl border border-white/10 bg-black/40 p-4 text-sm text-white focus:border-primary/50 outline-none shadow-sm transition-all resize-y"
                            />
                        </div>
                    </CardContent>
                </Card>

                {error && (
                    <div className="p-4 bg-red-900/20 text-red-400 rounded-xl border border-red-500/20 flex items-center gap-3 font-medium">
                        <Info className="h-5 w-5" />
                        {error}
                    </div>
                )}

                <div className="flex items-center gap-4 sticky bottom-4 bg-black/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-2xl z-40">
                    <Button type="submit" disabled={loading} className="flex-1 bg-gold-gradient text-black h-14 text-lg font-bold rounded-xl transition-all hover:opacity-90 active:scale-[0.99] shadow-lg shadow-primary/20 border-none">
                        {loading ? 'Ekleniyor...' : (parentId ? 'Alt Kategoriyi Kaydet' : 'Kategoriyi Kaydet')}
                    </Button>
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                        disabled={loading}
                        className="h-14 px-8 rounded-xl border-white/10 text-gray-400 hover:bg-white/5 hover:text-white font-medium"
                    >
                        İptal
                    </Button>
                </div>

                <div className="h-8"></div>
            </form>
        </div>
    );
}
