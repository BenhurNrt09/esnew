'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import {
    Users, MousePointer2, MessageSquare,
    TrendingUp, ArrowUpRight, ArrowDownRight,
    Sparkles, Camera, PlusCircle
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const supabase = createClient();
    const [hasProfile, setHasProfile] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        views: 1240,
        contacts: 42,
        messages: 12,
        rating: 4.8
    });

    useEffect(() => {
        const checkProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: listing } = await supabase
                .from('listings')
                .select('id')
                .eq('user_id', user.id)
                .single();

            setHasProfile(!!listing);
            setLoading(false);
        };
        checkProfile();
    }, []);

    if (loading) return <div>Yükleniyor...</div>;

    // If no profile, show Onboarding Call to Action
    if (hasProfile === false) {
        return (
            <div className="max-w-4xl mx-auto py-12">
                <Card className="border-2 border-dashed border-primary/20 bg-primary/5 rounded-3xl overflow-hidden">
                    <CardContent className="p-12 text-center space-y-6">
                        <div className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-xl mx-auto text-primary">
                            <Sparkles className="w-12 h-12" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Profilinizi Henüz Oluşturmadınız!</h1>
                            <p className="text-gray-500 font-medium max-w-md mx-auto">
                                Platformda öne çıkmak ve müşteri portföyünüzü oluşturmak için hemen profilinizi tamamlayın.
                            </p>
                        </div>
                        <Link href="/profile/create">
                            <button className="h-16 px-12 rounded-2xl bg-primary text-white font-black text-xl uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-primary/20 mt-4">
                                PROFİLİMİ ŞİMDİ OLUŞTUR
                            </button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Real Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Profil Görüntülenme', value: stats.views, icon: Users, color: 'text-blue-500', trend: '+12%' },
                    { label: 'İletişim Tıklamaları', value: stats.contacts, icon: MousePointer2, color: 'text-green-500', trend: '+5%' },
                    { label: 'Yeni Mesajlar', value: stats.messages, icon: MessageSquare, color: 'text-purple-500', trend: '-2%' },
                    { label: 'Ortalama Puan', value: stats.rating, icon: TrendingUp, color: 'text-yellow-500', trend: '+0.1' },
                ].map((stat, i) => (
                    <Card key={i} className="shadow-sm border-gray-100 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl bg-gray-50 ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                                <span className={cn(
                                    "text-xs font-bold px-2 py-1 rounded-lg flex items-center gap-1",
                                    stat.trend.startsWith('+') ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                                )}>
                                    {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                    {stat.trend}
                                </span>
                            </div>
                            <div className="space-y-1">
                                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</span>
                                <h3 className="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <Card className="lg:col-span-2 shadow-sm border-gray-100 rounded-3xl">
                    <CardHeader>
                        <CardTitle className="text-lg font-black uppercase tracking-tighter">Son Etkinlikler</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-50">
                            {[1, 2, 3, 4, 5].map((_, i) => (
                                <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                            <Users className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">Bir kullanıcı profilinizi görüntüledi</p>
                                            <p className="text-xs text-gray-400 font-medium">{i + 1} saat önce • İstanbul</p>
                                        </div>
                                    </div>
                                    <button className="text-primary text-xs font-bold">Detay</button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <Card className="shadow-sm border-gray-100 rounded-3xl bg-primary text-white">
                        <CardContent className="p-6 space-y-4">
                            <div className="space-y-2">
                                <h3 className="text-xl font-black uppercase tracking-tighter">Hikaye Paylaş</h3>
                                <p className="text-white/80 text-xs font-medium">Günlük hayatından kareler paylaş, daha fazla kişiye ulaş.</p>
                            </div>
                            <Link href="/dashboard/media">
                                <button className="w-full h-12 rounded-xl bg-white text-primary font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                                    <Camera className="w-4 h-4" /> PAYLAŞMAYA BAŞLA
                                </button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-gray-100 rounded-3xl">
                        <CardHeader>
                            <CardTitle className="text-lg font-black uppercase tracking-tighter">Hızlı İpuçları</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 shrink-0 rounded-lg bg-yellow-50 text-yellow-500 flex items-center justify-center">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <p className="text-xs text-gray-500 font-medium">Profil fotoğrafınızı güncelleyerek %25 daha fazla tık alabilirsiniz.</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 shrink-0 rounded-lg bg-green-50 text-green-500 flex items-center justify-center">
                                    <PlusCircle className="w-4 h-4" />
                                </div>
                                <p className="text-xs text-gray-500 font-medium">Fiyatlandırma seçeneklerinize "Gecelik" eklemeyi unutmayın.</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
