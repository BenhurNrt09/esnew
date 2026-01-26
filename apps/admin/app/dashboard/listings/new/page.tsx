'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { slugify, createBrowserClient } from '@repo/lib';
import type { City, Category } from '@repo/types';
import { Combobox } from '../../../components/Combobox';
import {
    Star,
    CheckCircle2,
    UploadCloud,
    X,
    Image as ImageIcon,
    User,
    MapPin,
    Info,
    Link as LinkIcon,
    RefreshCw,
    Database
} from 'lucide-react';

export default function NewProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [seeding, setSeeding] = useState(false); // Seeding state
    const [error, setError] = useState('');

    // Data
    const [cities, setCities] = useState<City[]>([]);
    const [featureGroups, setFeatureGroups] = useState<{ parent: Category, subs: Category[] }[]>([]);

    // Form
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        description: '',
        city_id: '',
        category_id: '',
        price: '',
        is_featured: false,
        is_active: true,
        details: {} as Record<string, string>,
        cover_image: null as File | null,
        gallery_images: [] as File[],
    });

    const [coverPreview, setCoverPreview] = useState<string | null>(null);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

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
            const groups = parents.map(parent => ({
                parent,
                subs: allCats.filter(c => c.parent_id === parent.id)
            })).filter(g => g.subs.length > 0);

            // "Hizmetler" kategorisi özeldir, onu özellikler listesinde göstermek yerine yukarıda combobox olarak gösteriyoruz
            // Ama details içinde de seçilebilir. İhtiyaca göre filtreleyebiliriz.
            // Şimdilik hepsini gösteriyoruz.
            setFeatureGroups(groups);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    const handleInitialize = async () => {
        setSeeding(true);
        try {
            const supabase = createBrowserClient();

            // GELİŞMİŞ VE PROJEYE ÖZEL KATEGORİ SETİ
            const seedData = [
                {
                    name: 'Saç Rengi',
                    slug: 'sac-rengi',
                    subs: ['Sarı', 'Esmer', 'Kumral', 'Kızıl', 'Siyah', 'Boyalı / Renkli']
                },
                {
                    name: 'Göz Rengi',
                    slug: 'goz-rengi',
                    subs: ['Mavi', 'Yeşil', 'Kahverengi', 'Ela', 'Siyah', 'Lens']
                },
                {
                    name: 'Vücut Tipi',
                    slug: 'vucut-tipi',
                    subs: ['Zayıf', 'Fit / Sportif', 'Balık Etli', 'Dolgun', 'Büyük Beden', 'Minyon']
                },
                {
                    name: 'Uyruk / Köken',
                    slug: 'uyruk',
                    subs: ['Türk', 'Rus', 'Ukrayna', 'Azerbaycan', 'Latin', 'Avrupa', 'Asya', 'Afro', 'Arap', 'Moldova', 'Özbek', 'İran']
                },
                {
                    name: 'Hizmetler',
                    slug: 'hizmetler',
                    subs: ['Eskort', 'Masaj', 'Dans / Show', 'Partner', 'VIP Eşlik', 'Seyahat Arkadaşlığı']
                },
                {
                    name: 'Bildiği Diller',
                    slug: 'diller',
                    subs: ['Türkçe', 'İngilizce', 'Rusça', 'Arapça', 'Almanca', 'Fransızca']
                },
                {
                    name: 'Mekan Tercihi',
                    slug: 'mekan',
                    subs: ['Kendi Yerim Var', 'Otele Giderim', 'Eve Giderim', 'Ofise Giderim']
                },
                {
                    name: 'Seyahat Durumu',
                    slug: 'seyahat',
                    subs: ['Seyahat Edebilirim', 'Şehir Dışına Çıkarım', 'Yurt Dışına Çıkarım', 'Sadece Şehir İçi']
                },
                {
                    name: 'Sigara Kullanımı',
                    slug: 'sigara',
                    subs: ['Kullanıyorum', 'Kullanmıyorum', 'Sosyal İçici']
                }
            ];

            for (const cat of seedData) {
                // 1. Create/Get Parent
                const { data: existing } = await supabase.from('categories').select('id').eq('slug', cat.slug).single();
                let parentId = existing?.id;

                if (!parentId) {
                    const { data: created } = await supabase.from('categories').insert({
                        name: cat.name,
                        slug: cat.slug,
                        is_active: true
                    }).select().single();
                    if (created) parentId = created.id;
                }

                // 2. Create Subs
                if (parentId) {
                    for (const sub of cat.subs) {
                        const subSlug = slugify(sub);
                        await supabase.from('categories').upsert({
                            name: sub,
                            slug: subSlug,
                            parent_id: parentId,
                            is_active: true
                        }, { onConflict: 'slug' }); // Use slug as constraint if unique, otherwise duplicate inputs might occur but upsert helps
                    }
                }
            }

            // Reload
            await loadData();
            alert('Tüm özellik kategorileri (Diller, Mekan vb. dahil) başarıyla yüklendi!');

        } catch (err: any) {
            console.error(err);
            alert('Hata: ' + err.message);
        } finally {
            setSeeding(false);
        }
    };

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
                    details: formData.details,
                }])
                .select()
                .single();

            if (insertError) throw insertError;

            if (profile) {
                const profileId = profile.id;
                let coverUrl = null;
                const galleryUrls = [];

                if (formData.cover_image) {
                    const ext = formData.cover_image.name.split('.').pop();
                    const path = `${profileId}/cover.${ext}`;
                    const { error: uploadError } = await supabase.storage.from('listings').upload(path, formData.cover_image);
                    if (!uploadError) {
                        const { data: publicUrl } = supabase.storage.from('listings').getPublicUrl(path);
                        coverUrl = publicUrl.publicUrl;
                    }
                }

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

                if (coverUrl || galleryUrls.length > 0) {
                    await supabase.from('listings').update({ cover_image: coverUrl, images: galleryUrls }).eq('id', profileId);
                }
            }

            router.push('/dashboard/listings');
            router.refresh();
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Profil oluşturulurken hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl animate-in fade-in duration-500">
            <div className="mb-8 flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-black text-red-950 tracking-tight">Yeni Profil Oluştur</h1>
                    <p className="text-muted-foreground mt-1">Platforma detaylı bir profesyonel profil ekleyin</p>
                </div>
                <Button
                    onClick={handleInitialize}
                    disabled={seeding}
                    variant="outline"
                    className="border-amber-200 text-amber-800 hover:bg-amber-50"
                >
                    {seeding ? (
                        <><RefreshCw className="mr-2 h-4 w-4 animate-spin" /> Yükleniyor...</>
                    ) : (
                        <><Database className="mr-2 h-4 w-4" /> Eksik Özellikleri Yükle</>
                    )}
                </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                {/* 1. KİŞİSEL BİLGİLER */}
                <Card className="border-red-100 shadow-lg shadow-red-100/20 overflow-visible">
                    <CardHeader className="bg-gradient-to-r from-red-50 to-white border-b border-red-50 py-4">
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
                                    className="border-gray-200 focus:border-red-500 font-medium h-11 text-base shadow-sm"
                                />
                                <p className="text-xs text-gray-400">Profilinizin ana başlığı.</p>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <LinkIcon className="h-3 w-3" /> Profil Linki (URL)
                                </label>
                                <Input
                                    value={formData.slug}
                                    readOnly
                                    placeholder="Otomatik oluşturulur..."
                                    className="border-gray-200 bg-gray-50 text-gray-500 font-mono text-sm h-11 shadow-sm cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-400">Profil adınıza göre otomatik oluşturulur.</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Hakkımda / Biyografi</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Kendinizden bahsedin..."
                                className="w-full min-h-[140px] rounded-xl border border-gray-200 p-4 text-sm focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none shadow-sm transition-all resize-y"
                            />
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-red-500" /> Şehir / İl
                                </label>
                                <Combobox
                                    options={cities.map(c => ({ value: c.id, label: c.name }))}
                                    value={formData.city_id}
                                    onChange={(val) => setFormData({ ...formData, city_id: val })}
                                    placeholder="Şehir Seçiniz..."
                                    searchPlaceholder="Şehir ara..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Hizmet Kategorisi</label>
                                <Combobox
                                    options={featureGroups.map(g => ({ value: g.parent.id, label: g.parent.name }))}
                                    value={formData.category_id}
                                    onChange={(val) => setFormData({ ...formData, category_id: val })}
                                    placeholder="Kategori Seçiniz..."
                                    searchPlaceholder="Kategori ara..."
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Saatlik Ücret (TL)</label>
                                <Input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    placeholder="0.00"
                                    className="border-gray-200 h-11 shadow-sm"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* 2. FİZİKSEL & DETAYLI ÖZELLİKLER */}
                <Card className="border-red-100 shadow-lg shadow-red-100/20 overflow-visible">
                    <CardHeader className="bg-gradient-to-r from-red-50 to-white border-b border-red-50 py-4">
                        <CardTitle className="flex items-center gap-2 text-red-900 text-lg">
                            <Info className="h-5 w-5" /> Fiziksel Özellikler & Detaylar
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Yaş</label>
                                <Input
                                    type="number"
                                    placeholder="25"
                                    value={formData.details['age'] || ''}
                                    onChange={e => handleFeatureChange('age', e.target.value)}
                                    className="border-gray-200 focus:border-red-500 h-11 shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Boy (cm)</label>
                                <Input
                                    type="number"
                                    placeholder="175"
                                    value={formData.details['height'] || ''}
                                    onChange={e => handleFeatureChange('height', e.target.value)}
                                    className="border-gray-200 focus:border-red-500 h-11 shadow-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Kilo (kg)</label>
                                <Input
                                    type="number"
                                    placeholder="60"
                                    value={formData.details['weight'] || ''}
                                    onChange={e => handleFeatureChange('weight', e.target.value)}
                                    className="border-gray-200 focus:border-red-500 h-11 shadow-sm"
                                />
                            </div>

                            {/* Dinamik Combobox'lar */}
                            {featureGroups.length > 0 ? featureGroups.map(group => {
                                // Hizmetler ve Hizmet Kategorisi karışıklığını önlemek için 
                                // eğer ana formda kategori seçtiysek ve bu grup o değilse göster.
                                return (
                                    <div key={group.parent.id} className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700">{group.parent.name}</label>
                                        <Combobox
                                            options={group.subs.map(sub => ({ value: sub.name, label: sub.name }))}
                                            value={formData.details[group.parent.name] || ''}
                                            onChange={(val) => handleFeatureChange(group.parent.name, val)}
                                            placeholder={`${group.parent.name} Seçiniz...`}
                                            searchPlaceholder="Ara..."
                                        />
                                    </div>
                                );
                            }) : (
                                <div className="col-span-full py-8 text-center bg-amber-50 rounded-xl border border-dashed border-amber-200 text-amber-800">
                                    <Info className="h-8 w-8 mx-auto mb-2 text-amber-500" />
                                    <p className="font-bold">Özellik kategorileri henüz yüklenmemiş olabilir.</p>
                                    <p className="text-sm mb-4">Eksik kategorileri yüklemek için yukarıdaki 'Eksik Özellikleri Yükle' butonunu kullanın.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* 3. MEDYA GALERİSİ */}
                <Card className="border-red-100 shadow-lg shadow-red-100/20">
                    <CardHeader className="bg-gradient-to-r from-red-50 to-white border-b border-red-50 py-4">
                        <CardTitle className="flex items-center gap-2 text-red-900 text-lg">
                            <ImageIcon className="h-5 w-5" /> Fotoğraf Galerisi
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-8">

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-gray-700 block">Kapak Fotoğrafı (Ana Resim)</label>
                            <div className="flex items-start gap-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100 border-dashed">
                                <div
                                    className="w-40 h-56 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center bg-white cursor-pointer hover:border-red-400 hover:bg-red-50/10 transition-all overflow-hidden relative shadow-sm"
                                    onClick={() => document.getElementById('cover_input')?.click()}
                                >
                                    {coverPreview ? (
                                        <img src={coverPreview} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-center text-gray-400 px-4">
                                            <UploadCloud className="h-10 w-10 mx-auto mb-2 text-gray-300" />
                                            <span className="text-sm font-medium">Kapak Resmi Yükle</span>
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
                                <div className="text-sm text-gray-500 pt-2 flex-1">
                                    <h4 className="font-bold text-gray-800 mb-1">Görsel Talimatları</h4>
                                    <ul className="list-disc list-inside space-y-1 text-xs text-gray-400">
                                        <li>Yüksek çözünürlüklü dikey (portrait) fotoğraflar önerilir.</li>
                                        <li>Yüz hatlarının belirgin olduğu, aydınlık fotoğraflar etkileşimi artırır.</li>
                                        <li>Maksimum dosya boyutu 5MB.</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-gray-700">Galeri Resimleri (Çoklu)</label>
                                <Button type="button" variant="outline" size="sm" onClick={() => document.getElementById('gallery_input')?.click()} className="border-red-200 text-red-600 hover:bg-red-50">
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
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {galleryPreviews.map((preview, idx) => (
                                        <div key={idx} className="aspect-[3/4] rounded-xl border border-gray-200 overflow-hidden relative group shadow-sm hover:shadow-md transition-all">
                                            <img src={preview} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button
                                                    type="button"
                                                    onClick={() => removeGalleryImage(idx)}
                                                    className="bg-red-600 text-white rounded-full p-2 transform scale-0 group-hover:scale-100 transition-transform duration-200 hover:bg-red-700 shadow-lg"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <div
                                        className="aspect-[3/4] rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center cursor-pointer hover:border-red-300 hover:bg-red-50/10 transition-colors bg-gray-50/30"
                                        onClick={() => document.getElementById('gallery_input')?.click()}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center mb-2 shadow-sm">
                                            <span className="text-2xl text-gray-400 font-light">+</span>
                                        </div>
                                        <span className="text-xs text-gray-400 font-medium">Daha Ekle</span>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    className="border-2 border-dashed border-gray-200 rounded-xl p-10 text-center cursor-pointer hover:bg-gray-50 hover:border-red-300 transition-all group"
                                    onClick={() => document.getElementById('gallery_input')?.click()}
                                >
                                    <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                        <ImageIcon className="h-8 w-8 text-red-300 group-hover:text-red-500" />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-700">Fotoğraf Yükle</h3>
                                    <p className="text-sm text-gray-400 mt-1">Sürükleyip bırakın veya seçmek için tıklayın</p>
                                </div>
                            )}
                        </div>

                    </CardContent>
                </Card>

                {/* 4. YAYIN AYARLARI */}
                <Card className="border-red-100 shadow-md bg-white overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div
                                className={`flex-1 flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${formData.is_featured
                                        ? 'bg-amber-50 border-amber-300 shadow-lg shadow-amber-100/50'
                                        : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                    }`}
                                onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm ${formData.is_featured ? 'bg-amber-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <Star className="w-6 h-6 fill-current" />
                                </div>
                                <div>
                                    <p className={`font-bold text-lg ${formData.is_featured ? 'text-amber-900' : 'text-gray-700'}`}>Vitrine Ekle</p>
                                    <p className="text-sm text-muted-foreground leading-tight mt-1">Bu profili ana sayfa vitrininde öne çıkarın.</p>
                                </div>
                                <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.is_featured ? 'border-amber-500 bg-amber-500' : 'border-gray-300'}`}>
                                    {formData.is_featured && <CheckCircle2 className="w-4 h-4 text-white" />}
                                </div>
                            </div>

                            <div
                                className={`flex-1 flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${formData.is_active
                                        ? 'bg-green-50 border-green-300 shadow-lg shadow-green-100/50'
                                        : 'bg-white border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                                    }`}
                                onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                            >
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm ${formData.is_active ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                    <CheckCircle2 className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className={`font-bold text-lg ${formData.is_active ? 'text-green-900' : 'text-gray-700'}`}>Profil Yayında</p>
                                    <p className="text-sm text-muted-foreground leading-tight mt-1">Kaydettikten sonra hemen yayınlansın.</p>
                                </div>
                                <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.is_active ? 'border-green-500 bg-green-500' : 'border-gray-300'}`}>
                                    {formData.is_active && <CheckCircle2 className="w-4 h-4 text-white" />}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {error && (
                    <div className="p-4 bg-red-50 text-red-700 rounded-xl border border-red-200 flex items-center gap-3 font-medium animate-pulse">
                        <Info className="h-5 w-5" />
                        {error}
                    </div>
                )}

                <div className="flex items-center gap-4 sticky bottom-4 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-2xl z-40 transform translate-y-2">
                    <Button type="submit" disabled={loading} className="flex-1 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white h-14 text-lg font-bold shadow-lg shadow-red-200 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99]">
                        {loading ? 'Profil Oluşturuluyor...' : 'Profili Kaydet ve Yayınla'}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => router.back()} className="h-14 px-8 rounded-xl border-gray-300 text-gray-600 hover:bg-gray-50 font-medium">
                        İptal
                    </Button>
                </div>

                <div className="h-8"></div> {/* Bottom Spacer */}
            </form>
        </div>
    );
}
