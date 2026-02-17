'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { User, Mail, Lock, Phone, MapPin, Layers, Save, ArrowLeft, Info, Camera, Plus, Trash2 } from 'lucide-react';
import { Combobox } from '../../../../components/Combobox';
import { createModelProfile } from '../../actions';
import { createClient } from '@repo/lib/supabase/client';

interface Category {
    id: string;
    name: string;
    parent_id: string | null;
}

interface City {
    id: string;
    name: string;
}

const serviceList = [
    // Oral Services
    { id: 'blowjob_prez', label: 'Sakso (Prezervatifli)' },
    { id: 'blowjob_no_prez', label: 'Sakso (Prezervatifsiz)' },
    { id: 'deepthroat', label: 'Derin Sakso' },
    { id: 'bj_69', label: '69 Pozisyonu' },
    { id: 'blowjob_yuz', label: 'Yüze Boşalma' },
    // Classic Services
    { id: 'anal', label: 'Anal' },
    { id: 'pussy_licking', label: 'Pussy Licking' },
    { id: 'a_rimming_bana', label: 'A-Rimming (Bana)' },
    { id: 'a_rimming_sana', label: 'A-Rimming (Sana)' },
    { id: 'girlfriend_exp', label: 'GFE (Kız Arkadaş)' },
    { id: 'cunnilingus', label: 'Cunnilingus' },
    // Kissing
    { id: 'french_kiss', label: 'Fransız Öpücüğü' },
    { id: 'kiss_lips', label: 'Dudaktan Öpücük' },
    // Massage
    { id: 'massage', label: 'Klasik Masaj' },
    { id: 'erotik_masaj', label: 'Erotik Masaj' },
    { id: 'nuru_massage', label: 'Nuru Masajı' },
    { id: 'happy_ending', label: 'Mutlu Sonlu Masaj' },
    { id: 'prostate_massage', label: 'Prostat Masajı' },
    // Fetish & BDSM
    { id: 'bdsm_light', label: 'BDSM (Hafif)' },
    { id: 'bondage', label: 'Bondage' },
    { id: 'foot_fetish', label: 'Ayak Fetişi' },
    { id: 'roleplay', label: 'Rol Yapma' },
    { id: 'costume', label: 'Kostüm' },
    // Others
    { id: 'couple', label: 'Çiftlere Hizmet' },
    { id: 'dinner_companion', label: 'Akşam Yemeği' },
    { id: 'travel_companion', label: 'Seyahat Eşliği' },
    { id: 'shower_together', label: 'Duş Birlikteliği' },
    { id: 'rimming', label: 'Rimming' },
    { id: 'striptease', label: 'Striptiz' },
];

const breastOptions = [
    { value: 'a', label: 'A Kup' },
    { value: 'b', label: 'B Kup' },
    { value: 'bb', label: 'BB Kup' },
    { value: 'd', label: 'D Kup' },
    { value: 'dd', label: 'DD Kup' },
    { value: 'ff', label: 'FF Kup' },
    { value: 'vc', label: 'VC / Silikon' },
];

const bodyHairOptions = [
    { value: 'trasli', label: 'Tıraşlı' },
    { value: 'degil', label: 'Tıraşsız' },
    { value: 'arasira', label: 'Trimli / Bakımlı' },
];

const ethnicityOptions = ['Avrupalı', 'Asyalı', 'Latin', 'Siyahi', 'Arap'];

const sexualOrientationOptions = [
    { value: 'heteroseksuel', label: 'Heteroseksüel' },
    { value: 'biseksuel', label: 'Biseksüel' },
    { value: 'homoseksuel', label: 'Homoseksüel' },
];

const yesNoOptions = [
    { value: 'evet', label: 'Evet' },
    { value: 'hayir', label: 'Hayır' },
];

const varYokOptions = [
    { value: 'var', label: 'Var' },
    { value: 'yok', label: 'Yok' },
];

export function ModelForm({ categories, cities }: { categories: Category[]; cities: City[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        phone: '',
        city_id: '',
        gender: 'woman',
        smoking: 'hayir',
        alcohol: 'hayir',
        tattoo: 'yok',
        piercing: 'yok',
    });

    const [pricing, setPricing] = useState([
        { duration: '1 Saat', incall: '', outcall: '', currency: 'TL' },
        { duration: '2 Saat', incall: '', outcall: '', currency: 'TL' },
        { duration: '3 Saat', incall: '', outcall: '', currency: 'TL' },
    ]);

    const addPricingRow = () => {
        setPricing([...pricing, { duration: '', incall: '', outcall: '', currency: 'TL' }]);
    };

    const updatePricingRow = (index: number, field: string, value: string) => {
        const newPricing = [...pricing];
        (newPricing[index] as any)[field] = value;
        setPricing(newPricing);
    };

    const removePricingRow = (index: number) => {
        setPricing(pricing.filter((_, i) => i !== index));
    };

    // Media States
    const [coverFile, setCoverFile] = useState<File | null>(null);
    const [coverPreview, setCoverPreview] = useState<string>('');
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
    const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
    const [storyFiles, setStoryFiles] = useState<File[]>([]);
    const [storyPreviews, setStoryPreviews] = useState<string[]>([]);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreview, setVideoPreview] = useState<string>('');

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'cover' | 'gallery' | 'story' | 'video') => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (type === 'cover') {
            const file = files[0];
            setCoverFile(file);
            setCoverPreview(URL.createObjectURL(file));
        } else if (type === 'video') {
            const file = files[0];
            setVideoFile(file);
            setVideoPreview(URL.createObjectURL(file));
        } else if (type === 'gallery') {
            const newFiles = Array.from(files);
            setGalleryFiles(prev => [...prev, ...newFiles]);
            const newPreviews = newFiles.map(f => URL.createObjectURL(f));
            setGalleryPreviews(prev => [...prev, ...newPreviews]);
        } else if (type === 'story') {
            const newFiles = Array.from(files);
            setStoryFiles(prev => [...prev, ...newFiles]);
            const newPreviews = newFiles.map(f => URL.createObjectURL(f));
            setStoryPreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeFile = (index: number, type: 'cover' | 'gallery' | 'story' | 'video') => {
        if (type === 'cover') {
            setCoverFile(null);
            setCoverPreview('');
        } else if (type === 'video') {
            setVideoFile(null);
            setVideoPreview('');
        } else if (type === 'gallery') {
            setGalleryFiles(prev => prev.filter((_, i) => i !== index));
            setGalleryPreviews(prev => prev.filter((_, i) => i !== index));
        } else if (type === 'story') {
            setStoryFiles(prev => prev.filter((_, i) => i !== index));
            setStoryPreviews(prev => prev.filter((_, i) => i !== index));
        }
    };

    async function uploadFile(file: File, bucket: 'listings' | 'stories', path: string) {
        const supabase = createClient();
        const fileExt = file.name.split('.').pop();
        const fileName = `${path}/${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError, data } = await supabase.storage
            .from(bucket)
            .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
            .from(bucket)
            .getPublicUrl(fileName);

        return publicUrl;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setLoading(true);
        setUploading(true);
        setError('');

        const form = new FormData(e.currentTarget);
        form.set('pricing_data', JSON.stringify(pricing));

        try {
            // Upload Cover
            if (coverFile) {
                const url = await uploadFile(coverFile, 'listings', `covers/${formData.username}`);
                form.set('cover_image', url);
            }

            // Upload Gallery
            const galleryUrls: string[] = [];
            for (const file of galleryFiles) {
                const url = await uploadFile(file, 'listings', `gallery/${formData.username}`);
                galleryUrls.push(url);
            }
            if (galleryUrls.length > 0) {
                galleryUrls.forEach(url => form.append('gallery_images', url));
            }

            // Upload Video
            if (videoFile && videoFile.size > 0) {
                const url = await uploadFile(videoFile, 'listings', `videos/${formData.username}`);
                form.set('video_url', url);
            }

            // Upload Stories
            for (const file of storyFiles) {
                const type = file.type.startsWith('video') ? 'video' : 'image';
                const url = await uploadFile(file, 'stories', `${formData.username}`);
                form.append('story_urls', JSON.stringify({ url, type }));
            }

            setUploading(false); // Validating server action

            const result = await createModelProfile(form);
            if (result.success) {
                router.push('/dashboard/profiles/models');
            } else {
                setError(result.error || 'Bir hata oluştu');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Dosya yükleme hatası');
        } finally {
            setLoading(false);
            setUploading(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5 max-w-4xl animate-in fade-in duration-500 pb-20">
            {/* Account Info */}
            <Card className="border-white/10 shadow-lg overflow-visible bg-white/5 backdrop-blur-sm">
                <CardHeader className="bg-black/40 border-b border-white/5 py-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-base font-bold">
                        <User className="h-4 w-4" /> Hesap Bilgileri
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Kullanıcı Adı *</label>
                        <Input
                            name="username"
                            value={formData.username}
                            onChange={e => setFormData({ ...formData, username: e.target.value })}
                            placeholder="Kullanıcı Adı"
                            required
                            className="bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 h-9 text-sm"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Telefon</label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                name="phone"
                                value={formData.phone}
                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="0555 555 55 55"
                                className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 h-9 text-sm"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Pricing Section (New) */}
            <Card className="border-white/10 shadow-lg overflow-visible bg-white/5 backdrop-blur-sm">
                <CardHeader className="bg-black/40 border-b border-white/5 py-4 flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-primary text-base font-bold">
                        <Save className="h-4 w-4" /> Fiyatlandırma
                    </CardTitle>
                    <Button type="button" size="sm" variant="outline" onClick={addPricingRow} className="h-7 text-[10px] border-primary/20 text-primary hover:bg-primary/10">
                        <Plus className="h-3 w-3 mr-1" /> Bar Ekle
                    </Button>
                </CardHeader>
                <CardContent className="pt-6 space-y-4">
                    <div className="hidden md:grid grid-cols-5 gap-4 px-2 text-[10px] font-bold text-gray-500 uppercase">
                        <div>Süre</div>
                        <div>Kendi Yerim</div>
                        <div>Senin Yerin</div>
                        <div>Para Birimi</div>
                        <div></div>
                    </div>
                    {pricing.map((row, index) => (
                        <div key={index} className="grid grid-cols-2 md:grid-cols-5 gap-3 p-3 rounded-lg bg-black/20 border border-white/5 items-center">
                            <div className="space-y-1.5 md:space-y-0">
                                <label className="md:hidden text-[10px] font-bold text-gray-500">SÜRE</label>
                                <Input
                                    value={row.duration}
                                    onChange={e => updatePricingRow(index, 'duration', e.target.value)}
                                    placeholder="1 Saat"
                                    className="bg-black/40 border-white/10 h-8 text-xs"
                                />
                            </div>
                            <div className="space-y-1.5 md:space-y-0">
                                <label className="md:hidden text-[10px] font-bold text-gray-500">KENDİ YERİM</label>
                                <Input
                                    type="number"
                                    value={row.incall}
                                    onChange={e => updatePricingRow(index, 'incall', e.target.value)}
                                    placeholder="0"
                                    className="bg-black/40 border-white/10 h-8 text-xs"
                                />
                            </div>
                            <div className="space-y-1.5 md:space-y-0">
                                <label className="md:hidden text-[10px] font-bold text-gray-500">SENİN YERİN</label>
                                <Input
                                    type="number"
                                    value={row.outcall}
                                    onChange={e => updatePricingRow(index, 'outcall', e.target.value)}
                                    placeholder="0"
                                    className="bg-black/40 border-white/10 h-8 text-xs"
                                />
                            </div>
                            <div className="space-y-1.5 md:space-y-0">
                                <label className="md:hidden text-[10px] font-bold text-gray-500">PARA BİRİMİ</label>
                                <select
                                    value={row.currency}
                                    onChange={e => updatePricingRow(index, 'currency', e.target.value)}
                                    className="w-full h-8 rounded-md border border-white/10 bg-black/40 text-white px-2 py-1 text-xs focus:outline-none focus:border-primary/50"
                                >
                                    <option value="TL">TL</option>
                                    <option value="EUR">€ (Euro)</option>
                                    <option value="USD">$ (Dolar)</option>
                                </select>
                            </div>
                            <div className="col-span-2 md:col-span-1 flex justify-end">
                                <Button type="button" variant="ghost" size="sm" onClick={() => removePricingRow(index)} className="h-8 w-8 p-0 text-red-500/50 hover:text-red-500 hover:bg-red-500/10">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Profile Details */}
            <Card className="border-white/10 shadow-lg overflow-visible bg-white/5 backdrop-blur-sm">
                <CardHeader className="bg-black/40 border-b border-white/5 py-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-base font-bold">
                        <MapPin className="h-4 w-4" /> Profil Detayları
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Şehir</label>
                        <select
                            name="city_id"
                            className="w-full h-9 rounded-lg border border-white/10 bg-black/40 text-white px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                            value={formData.city_id}
                            onChange={e => setFormData({ ...formData, city_id: e.target.value })}
                        >
                            <option value="" className="text-gray-500 bg-gray-900">Şehir Seçiniz</option>
                            {cities.map(city => (
                                <option key={city.id} value={city.id} className="bg-gray-900 text-white">{city.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Kategori</label>
                        <select
                            name="category_id"
                            className="w-full h-9 rounded-lg border border-white/10 bg-black/40 text-white px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                            required
                        >
                            <option value="" className="text-gray-500 bg-gray-900">Kategori Seçiniz</option>
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.id} className="bg-gray-900 text-white">{cat.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Cinsiyet</label>
                        <select
                            name="gender"
                            className="w-full h-9 rounded-lg border border-white/10 bg-black/40 text-white px-3 py-1.5 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                            value={formData.gender}
                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        >
                            <option value="woman" className="bg-gray-900">Kadın</option>
                            <option value="man" className="bg-gray-900">Erkek</option>
                            <option value="transsexual" className="bg-gray-900">Trans</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Uyruk</label>
                        <select
                            name="nationality"
                            className="w-full h-9 rounded-md border border-white/10 bg-black/50 text-white px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:border-primary/50"
                            defaultValue=""
                        >
                            <option value="" className="text-gray-500 bg-gray-900">Seçiniz</option>
                            <option value="TR" className="bg-gray-900">Türk</option>
                            <option value="RU" className="bg-gray-900">Rus</option>
                            <option value="UA" className="bg-gray-900">Ukrayna</option>
                            <option value="US" className="bg-gray-900">Amerikan</option>
                            <option value="OTHER" className="bg-gray-900">Diğer</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Saç Rengi</label>
                        <select
                            name="hair_color"
                            className="w-full h-9 rounded-md border border-white/10 bg-black/50 text-white px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:border-primary/50"
                            defaultValue=""
                        >
                            <option value="" className="text-gray-500 bg-gray-900">Seçiniz</option>
                            <option value="sari" className="bg-gray-900">Sarı</option>
                            <option value="kumral" className="bg-gray-900">Kumral</option>
                            <option value="esmer" className="bg-gray-900">Esmer</option>
                            <option value="siyah" className="bg-gray-900">Siyah</option>
                            <option value="kizil" className="bg-gray-900">Kızıl</option>
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Media Uploads */}
            <Card className="border-white/10 shadow-lg overflow-visible bg-white/5 backdrop-blur-sm">
                <CardHeader className="bg-black/40 border-b border-white/5 py-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-base font-bold">
                        <Camera className="h-4 w-4" /> Medya Yükleme
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid gap-6">
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-300">Kapak Fotoğrafı (Zorunlu)</label>
                        <div className="flex items-center gap-4">
                            <div
                                className="w-32 h-44 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center bg-black/40 cursor-pointer overflow-hidden relative group"
                                onClick={() => document.getElementById('cover_input')?.click()}
                            >
                                {coverPreview ? (
                                    <>
                                        <img src={coverPreview} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                            <Trash2 className="w-6 h-6 text-red-500" onClick={(e: any) => { e.stopPropagation(); removeFile(0, 'cover'); }} />
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center text-gray-500">
                                        <Plus className="h-8 w-8 mx-auto mb-1" />
                                        <span className="text-[10px]">Seç</span>
                                    </div>
                                )}
                            </div>
                            <input
                                id="cover_input"
                                type="file"
                                name="cover_image_file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, 'cover')}
                            />
                            <div className="text-[11px] text-gray-500 max-w-[200px]">
                                Profil kartlarında görünecek ana fotoğraf.
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-300">Galeri Fotoğrafları</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                            {galleryPreviews.map((p, i) => (
                                <div key={i} className="aspect-[3/4] rounded-xl border border-white/5 overflow-hidden relative group">
                                    <img src={p} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(i, 'gallery')}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <div
                                className="aspect-[3/4] rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center bg-black/20 cursor-pointer hover:border-primary/50 transition-all"
                                onClick={() => document.getElementById('gallery_input')?.click()}
                            >
                                <Plus className="w-6 h-6 text-gray-500" />
                            </div>
                        </div>
                        <input
                            id="gallery_input"
                            type="file"
                            name="gallery_files"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'gallery')}
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-300">Tanıtım Videosu</label>
                        <div className="flex items-center gap-4">
                            <div
                                className="w-40 h-24 rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center bg-black/40 cursor-pointer overflow-hidden relative group"
                                onClick={() => document.getElementById('video_input')?.click()}
                            >
                                {videoPreview ? (
                                    <>
                                        <video src={videoPreview} className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-bold text-xs">
                                            DEĞİŞTİR
                                        </div>
                                    </>
                                ) : (
                                    <Plus className="h-6 w-6 text-gray-500" />
                                )}
                            </div>
                            <input
                                id="video_input"
                                type="file"
                                name="video_file"
                                accept="video/*"
                                className="hidden"
                                onChange={(e) => handleFileChange(e, 'video')}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <label className="text-sm font-bold text-gray-300">Hikayeler (Story)</label>
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
                            {storyPreviews.map((p, i) => (
                                <div key={i} className="aspect-[9/16] rounded-xl border border-white/5 overflow-hidden relative group">
                                    <img src={p} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeFile(i, 'story')}
                                        className="absolute top-1 right-1 bg-red-500 text-white rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            ))}
                            <div
                                className="aspect-[9/16] rounded-xl border-2 border-dashed border-white/10 flex items-center justify-center bg-black/20 cursor-pointer hover:border-primary/50 transition-all"
                                onClick={() => document.getElementById('story_input')?.click()}
                            >
                                <Plus className="w-5 h-5 text-gray-500" />
                            </div>
                        </div>
                        <input
                            id="story_input"
                            type="file"
                            name="story_files"
                            accept="image/*,video/*"
                            multiple
                            className="hidden"
                            onChange={(e) => handleFileChange(e, 'story')}
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Listing Details */}
            <Card className="border-white/10 shadow-lg overflow-visible bg-white/5 backdrop-blur-sm">
                <CardHeader className="bg-black/40 border-b border-white/5 py-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-base font-bold">
                        <Layers className="h-4 w-4" /> İlan Detayları
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 grid gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-300">İlan Başlığı</label>
                        <Input name="title" placeholder="Örn: Genç ve Enerjik Model" className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 h-9" required />
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-300">Açıklama</label>
                        <textarea
                            name="description"
                            className="w-full h-24 rounded-xl border border-white/10 bg-black/40 text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary/50 resize-none placeholder:text-gray-600"
                            placeholder="Kendinizi tanıtın..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-300">Boy (cm)</label>
                            <Input name="height" type="number" placeholder="175" className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 h-9" />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-300">Kilo (kg)</label>
                            <Input name="weight" type="number" placeholder="60" className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 h-9" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Physical Attributes */}
            <Card className="border-white/10 shadow-lg overflow-visible bg-white/5 backdrop-blur-sm">
                <CardHeader className="bg-black/40 border-b border-white/5 py-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-base font-bold">
                        <Info className="h-4 w-4" /> Fiziksel Özellikler
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 grid md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-300">Göğüs Ölçüsü</label>
                        <select name="breast_size" className="w-full h-9 rounded-md border border-white/10 bg-black/50 text-white px-3 py-1.5 text-sm">
                            <option value="">Seçiniz</option>
                            {breastOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-300">Vücut Kılı</label>
                        <select name="body_hair" className="w-full h-9 rounded-md border border-white/10 bg-black/50 text-white px-3 py-1.5 text-sm">
                            <option value="">Seçiniz</option>
                            {bodyHairOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-sm font-bold text-gray-300">Etnik Köken</label>
                        <select name="ethnicity" className="w-full h-9 rounded-md border border-white/10 bg-black/50 text-white px-3 py-1.5 text-sm">
                            <option value="">Seçiniz</option>
                            {ethnicityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Lifestyle & Preferences */}
            <Card className="border-white/10 shadow-lg overflow-visible bg-white/5 backdrop-blur-sm">
                <CardHeader className="bg-black/40 border-b border-white/5 py-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-base font-bold">
                        <Info className="h-4 w-4" /> Yaşam Tarzı
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-4 grid gap-6">
                    {/* Sexual Orientation - Multi-select */}
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Cinsel Yönelim</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {sexualOrientationOptions.map(opt => (
                                <label key={opt.value} className="flex items-center gap-2 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                                    <input type="checkbox" name="sexual_orientation" value={opt.value} className="w-4 h-4 rounded border-gray-500 text-primary focus:ring-primary" />
                                    <span className="text-sm text-gray-300 font-medium">{opt.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-300">Sigara Kullanımı</label>
                            <select
                                name="smoking"
                                value={formData.smoking}
                                onChange={e => setFormData({ ...formData, smoking: e.target.value })}
                                className="w-full h-9 rounded-md border border-white/10 bg-black/50 text-white px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:border-primary/50"
                            >
                                {yesNoOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-gray-900">{opt.label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-300">Alkol Kullanımı</label>
                            <select
                                name="alcohol"
                                value={formData.alcohol}
                                onChange={e => setFormData({ ...formData, alcohol: e.target.value })}
                                className="w-full h-9 rounded-md border border-white/10 bg-black/50 text-white px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:border-primary/50"
                            >
                                {yesNoOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-gray-900">{opt.label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-300">Dövme</label>
                            <select
                                name="tattoo"
                                value={formData.tattoo}
                                onChange={e => setFormData({ ...formData, tattoo: e.target.value })}
                                className="w-full h-9 rounded-md border border-white/10 bg-black/50 text-white px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:border-primary/50"
                            >
                                {varYokOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-gray-900">{opt.label}</option>)}
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm font-bold text-gray-300">Piercing</label>
                            <select
                                name="piercing"
                                value={formData.piercing}
                                onChange={e => setFormData({ ...formData, piercing: e.target.value })}
                                className="w-full h-9 rounded-md border border-white/10 bg-black/50 text-white px-3 py-1.5 text-sm focus-visible:outline-none focus-visible:border-primary/50"
                            >
                                {varYokOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-gray-900">{opt.label}</option>)}
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Services */}
            <Card className="border-white/10 shadow-lg overflow-visible bg-white/5 backdrop-blur-sm">
                <CardHeader className="bg-black/40 border-b border-white/5 py-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-base font-bold">
                        <Layers className="h-4 w-4" /> Hizmetler
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {serviceList.map(service => (
                            <label key={service.id} className="flex items-center gap-2 p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors">
                                <input type="checkbox" name="services" value={service.id} className="w-4 h-4 rounded border-gray-500 text-primary focus:ring-primary" />
                                <span className="text-sm text-gray-300 font-medium">{service.label}</span>
                            </label>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="p-4 bg-primary/10 border border-primary/20 text-primary-foreground rounded-lg flex items-start gap-3 text-sm">
                <Info className="h-5 w-5 shrink-0 mt-0.5 text-primary" />
                <div className="text-gray-300">
                    <strong className="text-primary block mb-1">Bilgi:</strong>
                    Profil oluşturulduktan sonra ilan ekleyerek kategorileri seçebilirsiniz.
                    Bağımsız modeller için doğrudan kategori seçimi şu an ilan oluşturma aşamasında yapılmaktadır.
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/20 text-red-400 rounded-lg font-bold">
                    {error}
                </div>
            )}

            <div className="flex justify-end gap-3 sticky bottom-4 z-10 bg-black/80 p-3 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
                <Button type="button" variant="outline" onClick={() => router.back()} className="h-10 px-4 border-white/10 text-gray-400 hover:bg-white/5 hover:text-white font-medium text-sm">
                    İptal
                </Button>
                <Button type="submit" disabled={loading} className="bg-gold-gradient hover:opacity-90 text-black font-bold h-10 px-8 shadow-lg shadow-primary/20 transition-all active:scale-[0.98] text-sm">
                    {uploading ? 'Dosyalar Yükleniyor...' : (loading ? 'Kaydediliyor...' : 'Modeli Kaydet')}
                </Button>
            </div>
        </form>
    );
}
