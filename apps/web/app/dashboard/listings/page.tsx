'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardContent, Button, useToast } from '@repo/ui';
import {
    Users, Plus, Edit2, Trash2, Eye,
    BarChart3, Camera, DollarSign, ExternalLink,
    AlertCircle, Sparkles, Star
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../../components/AuthProvider';
import { cn } from '@repo/ui/src/lib/utils';

export default function AgencyListingsPage() {
    const supabase = createClient();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [listings, setListings] = useState<any[]>([]);
    const toast = useToast();

    const loadListings = async () => {
        if (!user) return;
        try {
            const { data, error } = await supabase
                .from('listings')
                .select(`
                    id,
                    title,
                    slug,
                    is_active,
                    rating_average,
                    review_count,
                    cover_image,
                    images,
                    listing_stats(view_count, contact_count)
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setListings(data || []);
        } catch (err: any) {
            console.error('Error loading listings:', err);
            toast.error('İlanlar yüklenirken bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading) {
            loadListings();
        }
    }, [user, authLoading]);

    const handleDelete = async (id: string) => {
        if (!confirm('Bu profili silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return;

        try {
            const { error } = await supabase.from('listings').delete().eq('id', id);
            if (error) throw error;
            toast.success('Profil başarıyla silindi.');
            setListings(prev => prev.filter(l => l.id !== id));
        } catch (err: any) {
            toast.error('Silme işlemi başarısız: ' + err.message);
        }
    };

    if (loading) return (
        <div className="min-h-[400px] flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Modeller Getiriliyor...</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Modellerim</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-bold italic">Ajansınıza bağlı tüm model profillerini buradan yönetebilirsiniz.</p>
                </div>
                <Link href="/profile/create">
                    <Button className="h-16 px-8 bg-gold-gradient text-black font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.05] transition-all flex items-center gap-3">
                        <Plus className="w-6 h-6" /> YENİ MODEL EKLE
                    </Button>
                </Link>
            </div>

            {listings.length === 0 ? (
                <Card className="border-2 border-dashed border-gray-100 dark:border-white/5 bg-gray-50/30 dark:bg-[#0a0a0a] rounded-[3rem] p-20 text-center">
                    <div className="max-w-md mx-auto space-y-8">
                        <div className="w-24 h-24 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto text-gray-300 dark:text-gray-700">
                            <Users className="w-12 h-12" />
                        </div>
                        <div className="space-y-3">
                            <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Henüz Modeliniz Yok</h3>
                            <p className="text-gray-500 font-bold italic">İlk modelinizi ekleyerek ajans portföyünüzü oluşturmaya başlayın.</p>
                        </div>
                        <Link href="/profile/create">
                            <Button className="h-14 px-10 bg-primary text-white font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20">
                                İLK MODELİ EKLE
                            </Button>
                        </Link>
                    </div>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {listings.map((listing) => {
                        const totalViews = listing.listing_stats?.reduce((acc: number, s: any) => acc + (s.view_count || 0), 0) || 0;
                        const totalContacts = listing.listing_stats?.reduce((acc: number, s: any) => acc + (s.contact_count || 0), 0) || 0;
                        const coverImage = listing.cover_image || (listing.images && listing.images[0]) || null;

                        return (
                            <Card key={listing.id} className="group relative bg-white dark:bg-[#0a0a0a] border-gray-100 dark:border-white/5 shadow-2xl shadow-gray-200/50 dark:shadow-none rounded-[2.5rem] overflow-hidden hover:scale-[1.02] transition-all duration-500">
                                {/* Status Badge */}
                                <div className="absolute top-6 left-6 z-10">
                                    <span className={cn(
                                        "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest italic border",
                                        listing.is_active
                                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                    )}>
                                        {listing.is_active ? 'Yayında' : 'Onay Bekliyor'}
                                    </span>
                                </div>

                                {/* Images/Preview */}
                                <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 dark:bg-black">
                                    {coverImage ? (
                                        <img
                                            src={coverImage}
                                            alt={listing.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                                            <Camera className="w-12 h-12 opacity-20" />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-8 gap-3">
                                        <Link href={`/${listing.slug}`} target="_blank" className="flex-1">
                                            <Button variant="outline" className="w-full bg-white/10 backdrop-blur-md border-white/20 text-white font-black uppercase text-[10px] h-12 rounded-xl hover:bg-white hover:text-black transition-all">
                                                <ExternalLink className="w-4 h-4 mr-2" /> ÖNİZLEME
                                            </Button>
                                        </Link>
                                    </div>
                                </div>

                                <CardContent className="p-8 space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter truncate max-w-[70%]">{listing.title}</h3>
                                        <div className="flex items-center gap-1.5 bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20">
                                            <Star className="w-3.5 h-3.5 text-primary fill-primary" />
                                            <span className="text-xs font-black text-primary italic">{listing.rating_average?.toFixed(1) || '0.0'}</span>
                                        </div>
                                    </div>

                                    {/* Mini Stats */}
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-1">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Görüntülenme</p>
                                            <p className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">{totalViews}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 space-y-1">
                                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">İletişim</p>
                                            <p className="text-xl font-black text-gray-900 dark:text-white tracking-tighter">{totalContacts}</p>
                                        </div>
                                    </div>

                                    {/* Action Grid */}
                                    <div className="grid grid-cols-2 gap-3">
                                        <Link href={`/dashboard/profile?listingId=${listing.id}`}>
                                            <Button variant="outline" className="w-full h-12 rounded-xl border-gray-100 dark:border-white/10 hover:border-primary hover:text-primary transition-all text-[10px] font-black uppercase tracking-widest">
                                                <Edit2 className="w-3.5 h-3.5 mr-2" /> Bilgiler
                                            </Button>
                                        </Link>
                                        <Link href={`/dashboard/media?listingId=${listing.id}`}>
                                            <Button variant="outline" className="w-full h-12 rounded-xl border-gray-100 dark:border-white/10 hover:border-primary hover:text-primary transition-all text-[10px] font-black uppercase tracking-widest">
                                                <Camera className="w-3.5 h-3.5 mr-2" /> Galeri
                                            </Button>
                                        </Link>
                                        <Link href={`/dashboard/pricing?listingId=${listing.id}`}>
                                            <Button variant="outline" className="w-full h-12 rounded-xl border-gray-100 dark:border-white/10 hover:border-primary hover:text-primary transition-all text-[10px] font-black uppercase tracking-widest">
                                                <DollarSign className="w-3.5 h-3.5 mr-2" /> Fiyat
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="outline"
                                            onClick={() => handleDelete(listing.id)}
                                            className="w-full h-12 rounded-xl border-gray-100 dark:border-white/10 hover:border-red-500 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-widest"
                                        >
                                            <Trash2 className="w-3.5 h-3.5 mr-2" /> Kaldır
                                        </Button>
                                    </div>

                                    <Link href={`/dashboard/stats?listingId=${listing.id}`}>
                                        <Button variant="outline" className="w-full h-12 rounded-xl border-primary/20 bg-primary/5 text-primary hover:bg-primary hover:text-black transition-all text-[10px] font-black uppercase tracking-widest">
                                            <BarChart3 className="w-4 h-4 mr-2" /> DETAYLI İSTATİSTİKLER
                                        </Button>
                                    </Link>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
