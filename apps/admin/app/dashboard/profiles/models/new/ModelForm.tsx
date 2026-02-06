'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { User, Mail, Lock, Phone, MapPin, Layers, Save, ArrowLeft, Info, Camera } from 'lucide-react';
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

export function ModelForm({ categories, cities }: { categories: Category[]; cities: City[] }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        phone: '',
        city_id: '',
        gender: 'female',
    });

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
        const coverFile = form.get('cover_image_file') as File;
        const galleryFiles = form.getAll('gallery_files') as File[];
        const videoFile = form.get('video_file') as File;
        const storyFiles = form.getAll('story_files') as File[];

        try {
            // Upload Cover
            if (coverFile && coverFile.size > 0) {
                const url = await uploadFile(coverFile, 'listings', `covers/${formData.username}`);
                form.set('cover_image', url);
            }

            // Upload Gallery
            const galleryUrls: string[] = [];
            for (const file of galleryFiles) {
                if (file.size > 0) {
                    const url = await uploadFile(file, 'listings', `gallery/${formData.username}`);
                    galleryUrls.push(url);
                }
            }
            if (galleryUrls.length > 0) {
                // Pass as JSON string or individual fields? FormData getAll handles arrays if keys match
                // But for actions, simpler to pass as JSON or separate appends
                galleryUrls.forEach(url => form.append('gallery_images', url));
            }

            // Upload Video
            if (videoFile && videoFile.size > 0) {
                // Ensure bucket allows video
                const url = await uploadFile(videoFile, 'listings', `videos/${formData.username}`);
                form.set('video_url', url);
            }

            // Upload Stories
            // Stories need separate handling on server, store URLs first
            const storyUrls: { url: string, type: 'image' | 'video' }[] = [];
            for (const file of storyFiles) {
                if (file.size > 0) {
                    const type = file.type.startsWith('video') ? 'video' : 'image';
                    const url = await uploadFile(file, 'stories', `${formData.username}`);
                    form.append('story_urls', JSON.stringify({ url, type }));
                }
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
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl animate-in fade-in duration-500">
            {/* Account Info */}
            <Card className="border-white/10 shadow-lg overflow-visible bg-white/5 backdrop-blur-sm">
                <CardHeader className="bg-black/40 border-b border-white/5 py-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-xl font-bold">
                        <User className="h-5 w-5" /> Hesap Bilgileri
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
                            className="bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">E-Posta *</label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                placeholder="ornek@site.com"
                                required
                                className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 h-11"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Şifre *</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                            <Input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                placeholder="******"
                                required
                                minLength={6}
                                className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 h-11"
                            />
                        </div>
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
                                className="pl-9 bg-black/40 border-white/10 text-white placeholder:text-gray-500 focus:border-primary/50 h-11"
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Profile Details */}
            <Card className="border-white/10 shadow-lg overflow-visible bg-white/5 backdrop-blur-sm">
                <CardHeader className="bg-black/40 border-b border-white/5 py-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-xl font-bold">
                        <MapPin className="h-5 w-5" /> Profil Detayları
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Şehir</label>
                        <select
                            name="city_id"
                            className="w-full h-11 rounded-lg border border-white/10 bg-black/40 text-white px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
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
                            className="w-full h-11 rounded-lg border border-white/10 bg-black/40 text-white px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
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
                            className="w-full h-11 rounded-lg border border-white/10 bg-black/40 text-white px-3 py-2 text-sm focus:outline-none focus:border-primary/50 transition-all font-medium"
                            value={formData.gender}
                            onChange={e => setFormData({ ...formData, gender: e.target.value })}
                        >
                            <option value="female" className="bg-gray-900">Kadın</option>
                            <option value="male" className="bg-gray-900">Erkek</option>
                            <option value="trans" className="bg-gray-900">Trans</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Uyruk</label>
                        <select
                            name="nationality"
                            className="w-full h-10 rounded-md border border-white/10 bg-black/50 text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary/50"
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
                            className="w-full h-10 rounded-md border border-white/10 bg-black/50 text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary/50"
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

            {/* Media Uploads (New) */}
            <Card className="border-white/10 shadow-lg overflow-visible bg-white/5 backdrop-blur-sm">
                <CardHeader className="bg-black/40 border-b border-white/5 py-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-xl font-bold">
                        <Camera className="h-5 w-5" /> Medya Yükleme
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Kapak Fotoğrafı (Zorunlu)</label>
                        <Input
                            type="file"
                            name="cover_image_file"
                            accept="image/*"
                            className="bg-black/50 border-white/10 text-white file:bg-primary file:text-black file:font-bold file:rounded-md file:border-0 hover:file:bg-primary/80"
                        />
                        <p className="text-[10px] text-gray-500">Profil kartlarında görünecek ana fotoğraf.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Galeri Fotoğrafları</label>
                        <Input
                            type="file"
                            name="gallery_files"
                            accept="image/*"
                            multiple
                            className="bg-black/50 border-white/10 text-white file:bg-primary file:text-black file:font-bold file:rounded-md file:border-0 hover:file:bg-primary/80"
                        />
                        <p className="text-[10px] text-gray-500">Profil detayında slayt olarak gösterilecek fotoğraflar.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Tanıtım Videosu</label>
                        <Input
                            type="file"
                            name="video_file"
                            accept="video/*"
                            className="bg-black/50 border-white/10 text-white file:bg-primary file:text-black file:font-bold file:rounded-md file:border-0 hover:file:bg-primary/80"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Hikayeler (Story)</label>
                        <Input
                            type="file"
                            name="story_files"
                            accept="image/*,video/*"
                            multiple
                            className="bg-black/50 border-white/10 text-white file:bg-primary file:text-black file:font-bold file:rounded-md file:border-0 hover:file:bg-primary/80"
                        />
                        <p className="text-[10px] text-gray-500">24 saat sonra kaybolacak hikaye medyaları.</p>
                    </div>
                </CardContent>
            </Card>

            {/* Listing Details */}
            <Card className="border-white/10 shadow-lg overflow-visible bg-white/5 backdrop-blur-sm">
                <CardHeader className="bg-black/40 border-b border-white/5 py-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-xl font-bold">
                        <Layers className="h-5 w-5" /> İlan Detayları
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">İlan Başlığı</label>
                        <Input name="title" placeholder="Örn: Genç ve Enerjik Model" className="bg-black/40 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50 h-11" required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Açıklama</label>
                        <textarea
                            name="description"
                            className="w-full h-32 rounded-xl border border-white/10 bg-black/40 text-white px-3 py-2 text-sm focus-visible:outline-none focus-visible:border-primary/50 resize-none placeholder:text-gray-600"
                            placeholder="Kendinizi tanıtın..."
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Boy (cm)</label>
                            <Input name="height" type="number" placeholder="175" className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Kilo (kg)</label>
                            <Input name="weight" type="number" placeholder="60" className="bg-black/50 border-white/10 text-white placeholder:text-gray-600 focus:border-primary/50" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Physical Attributes */}
            <Card className="border-white/10 shadow-lg overflow-visible bg-white/5 backdrop-blur-sm">
                <CardHeader className="bg-black/40 border-b border-white/5 py-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-xl font-bold">
                        <Info className="h-5 w-5" /> Fiziksel Özellikler
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-6 grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Göğüs Ölçüsü</label>
                        <select name="breast_size" className="w-full h-10 rounded-md border border-white/10 bg-black/50 text-white px-3 py-2 text-sm">
                            <option value="">Seçiniz</option>
                            {breastOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Vücut Kılı</label>
                        <select name="body_hair" className="w-full h-10 rounded-md border border-white/10 bg-black/50 text-white px-3 py-2 text-sm">
                            <option value="">Seçiniz</option>
                            {bodyHairOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">Etnik Köken</label>
                        <select name="ethnicity" className="w-full h-10 rounded-md border border-white/10 bg-black/50 text-white px-3 py-2 text-sm">
                            <option value="">Seçiniz</option>
                            {ethnicityOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                </CardContent>
            </Card>

            {/* Services */}
            <Card className="border-white/10 shadow-lg overflow-visible bg-white/5 backdrop-blur-sm">
                <CardHeader className="bg-black/40 border-b border-white/5 py-4">
                    <CardTitle className="flex items-center gap-2 text-primary text-xl font-bold">
                        <Layers className="h-5 w-5" /> Hizmetler
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

            <div className="flex justify-end gap-4 sticky bottom-4 z-10 bg-black/80 p-4 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md">
                <Button type="button" variant="outline" onClick={() => router.back()} className="h-12 px-6 border-white/10 text-gray-400 hover:bg-white/5 hover:text-white font-medium">
                    İptal
                </Button>
                <Button type="submit" disabled={loading} className="bg-gold-gradient hover:opacity-90 text-black font-bold h-12 px-10 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
                    {uploading ? 'Dosyalar Yükleniyor...' : (loading ? 'Kaydediliyor...' : 'Modeli Kaydet')}
                </Button>
            </div>
        </form>
    );
}
