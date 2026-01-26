'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { slugify, createBrowserClient } from '@repo/lib';
import type { City, Category } from '@repo/types';
import {
    Star,
    CheckCircle2,
    UploadCloud,
    X,
    Image as ImageIcon,
    User,
    MapPin,
    Info,
    Layers
} from 'lucide-react';

export default function NewProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Data
    const [cities, setCities] = useState<City[]>([]);
    const [featureGroups, setFeatureGroups] = useState<{ parent: Category, subs: Category[] }[]>([]);
    const [mainCategory, setMainCategory] = useState<string>(''); // Ana kategori (ör: Escort, Masaj vb. eğer varsa)

    // Form
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        city_id: '',
        category_id: '', // Ana kategori (Hizmet türü)
        price: '',
        is_featured: false,
        is_active: true,
        details: {} as Record<string, string>, // Dinamik özellikler { "Sac Rengi": "Sarı" }
        cover_image: null as File | null,
        gallery_images: [] as File[],
    });

    // Preview URLs
    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

    useEffect(() => {
        async function loadData() {
            const supabase = createBrowserClient();
            const [citiesRes, categoriesRes] = await Promise.all([
                supabase.from('cities').select('*').eq('is_active', true).order('name'),
                supabase.from('categories').select('*').order('name'),
            ]);

            if (citiesRes.data) setCities(citiesRes.data);

            if (categoriesRes.data) {
                const allCats = categoriesRes.data as Category[];
                const parents = allCats.filter(c => !c.parent_id);

                // Gruplandır
                const groups = parents.map(parent => ({
                    parent,
                    subs: allCats.filter(c => c.parent_id === parent.id)
                })).filter(g => g.subs.length > 0); // Alt özelliği olanları özellik grubu yap

                setFeatureGroups(groups);
            }
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

    const handleFeatureChange = (parentName: string, value: string) => {
        setFormData(prev => ({
            ...prev,
            details: {
                ...prev.details,
                [parentName]: value
            }
        }));
    };

    const handleCoverSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, cover_image: file }));
            setCoverPreview(URL.createObjectURL(file));
        }
    };

    const handleGallerySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            setFormData(prev => ({
                ...prev,
                gallery_images: [...prev.gallery_images, ...files]
            }));

            const newPreviews = files.map(f => URL.createObjectURL(f));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery_images: prev.gallery_images.filter((_, i) => i !== index)
        }));
        setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const supabase = createBrowserClient();

            // 1. Profil Oluştur
            const { data: profile, error: insertError } = await supabase
                .from('listings')
                .insert([{
                    title: formData.title,
                    slug: formData.slug,
                    description: formData.description,
                    city_id: formData.city_id,
                    category_id: formData.category_id,
                    price: formData.price ? parseFloat(formData.price) : null,
                    is_active: formData.is_active,
                    is_featured: formData.is_featured,
                    details: formData.details, // JSONB
                    // images ve cover_image kolonları varsa buraya eklenecek, yoksa hata vermez ama kaydetmez
                }])
                .select()
                .single();

            if (insertError) throw insertError;

            // 2. Resim Yükleme (Eğer profil oluştuysa)
            if (profile) {
                const profileId = profile.id;
                let coverUrl = null;
                const galleryUrls = [];

                // Bucket kontrolü yapamıyoruz client'tan create bucket yetkisi yok genelde.
                // Varsayalım bucket var: 'listings'

                // Cover
                if (formData.cover_image) {
                    const ext = formData.cover_image.name.split('.').pop();
                    const path = `${profileId}/cover.${ext}`;
                    const { error: uploadError } = await supabase.storage.from('listings').upload(path, formData.cover_image);

                    if (!uploadError) {
                        const { data: publicUrl } = supabase.storage.from('listings').getPublicUrl(path);
                        coverUrl = publicUrl.publicUrl;
                    }
                }

                // Gallery
                for (let i = 0; i < formData.gallery_images.length; i++) {
                    const file = formData.gallery_images[i];
                    const ext = file.name.split('.').pop();
                    const path = `${profileId}/gallery_${i}.${ext}`;
                    const { error: uploadError } = await supabase.storage.from('listings').upload(path, file);

                    if (!uploadError) {
                        const { data: publicUrl } = supabase.storage.from('listings').getPublicUrl(path);
                        galleryUrls.push(publicUrl.publicUrl);
                    }
                }

                // URL'leri update et
                if (coverUrl || galleryUrls.length > 0) {
                    await supabase
                        .from('listings')
                        .update({
                            cover_image: coverUrl,
                            images: galleryUrls
                        })
                        .eq('id', profileId);
                }
            }

            router.push('/dashboard/listings');
            router.refresh();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Profil oluşturulurken bir hata oluştu. Veritabanı güncel olmayabilir.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-red-950">Yeni Profil Oluştur</h1>
                    <p className="text-muted-foreground mt-1">Platforma detaylı bir profil ekleyin</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* 1. KİŞİSEL BİLGİLER */}
                <Card className="border-red-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-red-50/50 border-b border-red-100 py-4">
                        <CardTitle className="flex items-center gap-2 text-red-900 text-lg">
                            <User className="h-5 w-5" /> Temel Bilgiler
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 grid gap-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Profil Adı (Başlık) *</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => handleTitleChange(e.target.value)}
                                    placeholder="Örn: Ayşe Yılmaz"
                                    required
                                    className="border-gray-300 focus:border-red-500 font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">URL Slug *</label>
                                <Input
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="ayse-yilmaz"
                                    required
                                    className="border-gray-300 bg-gray-50 font-mono text-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Hakkımda / Biyografi</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Kendinizden bahsedin..."
                                className="w-full min-h-[120px] rounded-lg border border-gray-300 p-3 text-sm focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none"
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-red-500" /> Şehir / İl
                                </label>
                                <select
                                    value={formData.city_id}
                                    onChange={(e) => setFormData({ ...formData, city_id: e.target.value })}
                                    required
                                    className="w-full h-10 rounded-lg border border-gray-300 px-3 bg-white focus:border-red-500 outline-none"
                                >
                                    <option value="">Seçiniz...</option>
                                    {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Hizmet Kategorisi</label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    required
                                    className="w-full h-10 rounded-lg border border-gray-300 px-3 bg-white focus:border-red-500 outline-none"
                                >
                                    <option value="">Seçiniz...</option>
                                    {/* Sadece parent olmayan kategorileri ana kategori yapalım isterseniz, veya hepsini */}
                                    {featureGroups.map(g => (
                                        <option key={g.parent.id} value={g.parent.id}>{g.parent.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Saatlik Ücret (TL)</label>
                                <Input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0.00"
                                    className="border-gray-300"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. FİZİKSEL & DETAYLI ÖZELLİKLER */}
                <Card className="border-red-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-red-50/50 border-b border-red-100 py-4">
                        <CardTitle className="flex items-center gap-2 text-red-900 text-lg">
                            <Info className="h-5 w-5" /> Fiziksel Özellikler & Detaylar
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Sabit Inputlar (İstek üzerine) */}
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Yaş</label>
                                <Input
                                    type="number"
                                    placeholder="25"
                                    value={formData.details['age'] || ''}
                                    onChange={e => handleFeatureChange('age', e.target.value)}
                                    className="border-gray-300 focus:border-red-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Boy (cm)</label>
                                <Input
                                    type="number"
                                    placeholder="175"
                                    value={formData.details['height'] || ''}
                                    onChange={e => handleFeatureChange('height', e.target.value)}
                                    className="border-gray-300 focus:border-red-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Kilo (kg)</label>
                                <Input
                                    type="number"
                                    placeholder="60"
                                    value={formData.details['weight'] || ''}
                                    onChange={e => handleFeatureChange('weight', e.target.value)}
                                    className="border-gray-300 focus:border-red-500"
                                />
                            </div>

                            {/* Dinamik Kategorilerden Gelen Seçenekler */}
                            {featureGroups.map(group => (
                                <div key={group.parent.id} className="space-y-2">
                                    <label className="text-sm font-bold text-gray-700">{group.parent.name}</label>
                                    <select
                                        className="w-full h-10 rounded-lg border border-gray-300 px-3 bg-white focus:border-red-500 outline-none"
                                        onChange={(e) => handleFeatureChange(group.parent.name, e.target.value)}
                                    >
                                        <option value="">Seçiniz...</option>
                                        {group.subs.map(sub => (
                                            <option key={sub.id} value={sub.name}>{sub.name}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* 3. MEDYA GALERİSİ */}
                <Card className="border-red-100 shadow-sm overflow-hidden">
                    <CardHeader className="bg-red-50/50 border-b border-red-100 py-4">
                        <CardTitle className="flex items-center gap-2 text-red-900 text-lg">
                            <ImageIcon className="h-5 w-5" /> Fotoğraf Galerisi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">

                        {/* Cover Image */}
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Kapak Fotoğrafı (Ana Resim)</label>
                            <div className="flex items-start gap-4">
                                <div
                                    className="w-32 h-32 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 cursor-pointer hover:border-red-400 overflow-hidden relative"
                                    onClick={() => document.getElementById('cover_input')?.click()}
                                >
                                    {coverPreview ? (
                                        <img src={coverPreview} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-gray-400">
                                            <UploadCloud className="h-8 w-8 mx-auto mb-1" />
                                            <span className="text-xs">Profil Resmi</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    id="cover_input"
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleCoverSelect}
                                />
                                <div className="text-xs text-gray-500 pt-2">
                                    <p>Bu resim listelerde ve arama sonuçlarında görünecektir.</p>
                                    <p>Tavsiye: Dikey (Portrait) format, yüksek kalite.</p>
                                </div>
                            </div>
                        </div>

                        {/* Gallery Images */}
                        <div className="space-y-2 border-t pt-6">
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold text-gray-700">Galeri Resimleri (Çoklu)</label>
                                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('gallery_input')?.click()}>
                                    + Resim Ekle
                                </Button>
                            </div>

                            <input
                                id="gallery_input"
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleGallerySelect}
                            />

                            {galleryPreviews.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                    {galleryPreviews.map((preview, idx) => (
                                        <div key={idx} className="aspect-[3/4] rounded-lg border border-gray-200 overflow-hidden relative group">
                                            <img src={preview} className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => removeGalleryImage(idx)}
                                                className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div
                                    className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 cursor-pointer hover:bg-gray-50 hover:border-red-300 transition-colors"
                                    onClick={() => document.getElementById('gallery_input')?.click()}
                                >
                                    <ImageIcon className="h-10 w-10 mx-auto mb-3 opacity-50" />
                                    <p className="font-medium">Resimleri buraya sürükleyin veya seçmek için tıklayın</p>
                                    <p className="text-xs mt-1">Birden fazla resim seçebilirsiniz.</p>
                                </div>
                            )}
                        </div>

                    </CardContent>
                </Card>

                {/* 4. YAYIN AYARLARI */}
                <Card className="border-red-100 shadow-sm bg-gray-50/50">
                    <CardContent className="pt-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div
                                className={`flex-1 flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${formData.is_featured
                                        ? 'bg-amber-50 border-amber-200 shadow-sm ring-1 ring-amber-200'
                                        : 'bg-white border-gray-200 hover:border-amber-200'
                                    }`}
                                onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${formData.is_featured ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <Star className="w-6 h-6 fill-current" />
                                </div>
                                <div>
                                    <p className={`font-bold ${formData.is_featured ? 'text-amber-900' : 'text-gray-700'}`}>Vitrine Ekle</p>
                                    <p className="text-xs text-muted-foreground">Ana sayfada öne çıkar.</p>
                                </div>
                            </div>

                            <div
                                className={`flex-1 flex items-center gap-4 p-4 rounded-xl border transition-all cursor-pointer ${formData.is_active
                                        ? 'bg-green-50 border-green-200 shadow-sm ring-1 ring-green-200'
                                        : 'bg-white border-gray-200 hover:border-green-200'
                                    }`}
                                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                            >
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${formData.is_active ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`font-bold ${formData.is_active ? 'text-green-900' : 'text-gray-700'}`}>Profil Yayında</p>
                                    <p className="text-xs text-muted-foreground">Hemen erişime aç.</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        {error}
                    </div>
                )}

                <div className="flex items-center gap-4 sticky bottom-4 bg-white/90 backdrop-blur p-4 rounded-xl border border-gray-200 shadow-lg z-50">
                    <Button type="submit" disabled={loading} className="flex-1 bg-red-600 hover:bg-red-700 text-white h-12 text-lg shadow-red-200">
                        {loading ? 'Profil Oluşturuluyor...' : 'Profili Kaydet ve Yayınla'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()} className="h-12 px-8">
                        İptal
                    </Button>
                </div>

            </form>
        </div>
    );
}
