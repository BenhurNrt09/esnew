'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { slugify, createBrowserClient } from '@repo/lib';
import { MapPin, AlignLeft, Link as LinkIcon, FileText, Info, CheckCircle2 } from 'lucide-react';

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
        <div className="container mx-auto px-4 py-8 max-w-3xl animate-in fade-in duration-500">
            <div className="mb-10 flex items-center justify-between border-b border-white/10 pb-6">
                <div>
                    <h1 className="text-3xl font-black text-white tracking-tighter uppercase transition-all">
                        Yeni <span className="text-primary italic">Şehir Ekle</span>
                    </h1>
                    <p className="text-gray-400 mt-2 font-medium italic">Platformun hizmet vereceği yeni bir lokasyon tanımlayın.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">

                <Card className="border-white/10 shadow-lg overflow-visible bg-white/5 backdrop-blur-sm">
                    <CardHeader className="bg-black/40 border-b border-white/5 py-4">
                        <CardTitle className="flex items-center gap-2 text-primary text-lg font-bold">
                            <MapPin className="h-5 w-5" /> Şehir Bilgileri
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6 grid gap-6">

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">Şehir Adı *</label>
                            <div className="relative">
                                <AlignLeft className="absolute left-3 top-3.5 h-4 w-4 text-gray-500" />
                                <Input
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="Örn: İstanbul"
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
                                placeholder="istanbul"
                                required
                                className="border-white/5 bg-black/60 text-gray-500 font-mono text-sm h-11 shadow-sm"
                            />
                        </div>

                        {/* Status Toggle Card */}
                        <div
                            className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all cursor-pointer ${formData.is_active
                                ? 'bg-green-500/10 border-green-500/30 shadow-lg shadow-green-500/5'
                                : 'bg-white/5 border-white/5 hover:border-white/10'
                                }`}
                            onClick={() => setFormData({ ...formData, is_active: !formData.is_active })}
                        >
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-sm ${formData.is_active ? 'bg-green-500 text-white' : 'bg-white/5 text-gray-500'}`}>
                                <CheckCircle2 className="w-6 h-6" />
                            </div>
                            <div>
                                <p className={`font-bold text-lg ${formData.is_active ? 'text-green-400' : 'text-gray-400'}`}>Şehir Aktif</p>
                                <p className="text-sm text-gray-500 leading-tight mt-1">Bu şehir sitede listelensin ve kullanıcılar seçim yapabilsin.</p>
                            </div>
                            <div className={`ml-auto w-6 h-6 rounded-full border-2 flex items-center justify-center ${formData.is_active ? 'border-green-500 bg-green-500' : 'border-white/10'}`}>
                                {formData.is_active && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
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
                                placeholder={`${formData.name || '...'} İlanları - En İyi Profiller`}
                                className="border-white/10 bg-black/40 text-white focus:border-primary/50 h-11 shadow-sm"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-300">SEO Açıklama</label>
                            <textarea
                                value={formData.seo_description}
                                onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                                placeholder={`${formData.name || '...'} bölgesindeki en popüler ilanlar ve profiller.`}
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
                        {loading ? 'Ekleniyor...' : 'Şehri Kaydet'}
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
