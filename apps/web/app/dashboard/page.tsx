'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import {
    Users, MousePointer2, MessageSquare,
    TrendingUp, ArrowUpRight, ArrowDownRight,
    Sparkles, Camera, PlusCircle, Bell, Star
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '../components/AuthProvider';

export default function DashboardPage() {
    const supabase = createClient();
    const { user, loading: authLoading } = useAuth();
    const [loading, setLoading] = useState(true);
    const [userType, setUserType] = useState<string | null>(null);
    const [hasProfile, setHasProfile] = useState<boolean | null>(null);
    const [stats, setStats] = useState({
        views: 0,
        contacts: 0,
        notifications: 0,
        rating: 0
    });
    const [activities, setActivities] = useState<any[]>([]);

    useEffect(() => {
        const loadDashboardData = async () => {
            if (!user) return;

            try {
                const type = (user as any).userType || 'member';
                setUserType(type);

                // Run primary queries in parallel: Notifications, Unread Count, and Profile/Stats
                const [notificationsData, unreadRes, profileRes] = await Promise.all([
                    supabase.from('notifications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
                    supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', user.id).eq('is_read', false),
                    type === 'independent_model' || type === 'agency_owner'
                        ? supabase.from('listings').select(`
                            id,
                            listing_stats(view_count, contact_count),
                            comments(rating_stars)
                          `).eq('user_id', user.id).maybeSingle()
                        : Promise.all([
                            supabase.from('favorites').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
                            supabase.from('comments').select('*', { count: 'exact', head: true }).eq('user_id', user.id).is('parent_id', null)
                        ])
                ]);

                setActivities(notificationsData.data || []);
                const unreadCount = unreadRes.count || 0;

                if (type === 'independent_model' || type === 'agency_owner') {
                    const listing = (profileRes as any).data;
                    if (listing) {
                        setHasProfile(true);

                        const totalViews = listing.listing_stats?.reduce((acc: number, curr: any) => acc + (curr.view_count || 0), 0) || 0;
                        const totalContacts = listing.listing_stats?.reduce((acc: number, curr: any) => acc + (curr.contact_count || 0), 0) || 0;

                        const validRatings = listing.comments?.filter((c: any) => c.rating_stars !== null) || [];
                        const avgRating = validRatings.length > 0
                            ? validRatings.reduce((acc: number, curr: any) => acc + (curr.rating_stars || 0), 0) / validRatings.length
                            : 0;

                        setStats({
                            views: totalViews,
                            contacts: totalContacts,
                            notifications: unreadCount,
                            rating: parseFloat(avgRating.toFixed(1))
                        });
                    } else {
                        setHasProfile(false);
                        setStats(prev => ({ ...prev, notifications: unreadCount }));
                    }
                } else {
                    const [favRes, reviewRes] = profileRes as any;
                    setStats({
                        views: favRes.count || 0,
                        contacts: reviewRes.count || 0,
                        notifications: unreadCount,
                        rating: 5.0
                    });
                    setHasProfile(null);
                }
            } catch (err) {
                console.error('Error loading dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            loadDashboardData();
        }
    }, [user, authLoading]);


    const getTimeAgo = (date: string) => {
        const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return Math.floor(interval) + " yıl önce";
        interval = seconds / 2592000;
        if (interval > 1) return Math.floor(interval) + " ay önce";
        interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " gün önce";
        interval = seconds / 3600;
        if (interval > 1) return Math.floor(interval) + " saat önce";
        interval = seconds / 60;
        if (interval > 1) return Math.floor(interval) + " dakika önce";
        return "az önce";
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'view': return <Users className="w-5 h-5 text-blue-500" />;
            case 'comment': return <MessageSquare className="w-5 h-5 text-purple-500" />;
            case 'story': return <Camera className="w-5 h-5 text-primary" />;
            default: return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black text-gray-400 uppercase tracking-widest text-xs">Veriler Hazırlanıyor...</p>
            </div>
        </div>
    );

    // If no profile, show Onboarding Call to Action
    if (userType === 'independent_model' && hasProfile === false) {
        return (
            <div className="max-w-4xl mx-auto py-12">
                <Card className="border-2 border-dashed border-primary/20 bg-primary/5 rounded-[3rem] overflow-hidden">
                    <CardContent className="p-16 text-center space-y-8">
                        <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center shadow-2xl mx-auto text-primary animate-bounce">
                            <Sparkles className="w-12 h-12" />
                        </div>
                        <div className="space-y-3">
                            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">Profilinizi Henüz Oluşturmadınız!</h1>
                            <p className="text-gray-500 font-bold max-w-md mx-auto leading-relaxed">
                                Platformda öne çıkmak ve müşteri portföyünüzü oluşturmak için hemen profilinizi tamamlayın.
                            </p>
                        </div>
                        <Link href="/profile/create">
                            <button className="h-16 px-12 rounded-2xl bg-primary text-white font-black text-xl uppercase tracking-widest hover:translate-y-[-4px] transition-all shadow-2xl shadow-primary/30 mt-4 active:scale-95">
                                PROFİLİMİ ŞİMDİ OLUŞTUR
                            </button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Real Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {[
                    { label: userType === 'member' ? 'Favorilerim' : 'Profil Görüntülenme', value: stats.views, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
                    { label: userType === 'member' ? 'Yorumlarım' : 'İletişim Tıklamaları', value: stats.contacts, icon: MousePointer2, color: 'text-green-500', bg: 'bg-green-50' },
                    { label: 'Bildirimler', value: stats.notifications, icon: Bell, color: 'text-purple-500', bg: 'bg-purple-50' },
                    { label: 'Ortalama Puan', value: stats.rating || '5.0', icon: Star, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                ].map((stat, i) => (
                    <Card key={i} className="shadow-2xl shadow-gray-200/40 border-gray-100 rounded-[2rem] overflow-hidden hover:scale-[1.02] transition-all group">
                        <CardContent className="p-8">
                            <div className="flex items-center justify-between mb-6">
                                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <span className="bg-gray-50 text-gray-400 text-[10px] font-black px-3 py-1.5 rounded-full uppercase border border-gray-100 italic">
                                    Canlı Veri
                                </span>
                            </div>
                            <div className="space-y-2">
                                <span className="text-gray-400 text-[11px] font-black uppercase tracking-[0.2em] ml-1">{stat.label}</span>
                                <h3 className="text-4xl font-black text-gray-900 tracking-tighter">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-12 gap-10">
                {/* Activity Feed */}
                <Card className="lg:col-span-8 shadow-2xl shadow-gray-200/50 border-gray-100 rounded-[3rem] overflow-hidden bg-white">
                    <CardHeader className="bg-gray-50/50 border-b border-gray-100 p-8">
                        <CardTitle className="text-xl font-black uppercase tracking-tighter flex items-center gap-3">
                            <Sparkles className="w-6 h-6 text-primary" /> Son Etkinlikler
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-50">
                            {activities.length > 0 ? activities.map((activity, i) => (
                                <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50/80 transition-all group">
                                    <div className="flex items-center gap-6">
                                        <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                                            {getIcon(activity.type)}
                                        </div>
                                        <div>
                                            <p className="text-base font-black text-gray-900 tracking-tight">{activity.title}</p>
                                            <p className="text-sm text-gray-400 font-bold mt-0.5">{getTimeAgo(activity.created_at)}</p>
                                        </div>
                                    </div>
                                    <Link href={activity.link || '/dashboard'}>
                                        <button className="h-10 px-6 rounded-xl text-primary text-xs font-black uppercase tracking-widest border border-primary/10 bg-primary/5 hover:bg-primary hover:text-white transition-all">
                                            İncele
                                        </button>
                                    </Link>
                                </div>
                            )) : (
                                <div className="p-20 text-center space-y-4">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto text-gray-200">
                                        <Bell className="w-8 h-8" />
                                    </div>
                                    <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Henüz bir etkinlik bulunmuyor.</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions */}
                <div className="lg:col-span-4 space-y-8">
                    {userType === 'independent_model' && (
                        <Card className="shadow-2xl shadow-primary/20 border-primary/10 rounded-[2.5rem] bg-gray-900 text-white relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Camera className="w-32 h-32" />
                            </div>
                            <CardContent className="p-10 space-y-8 relative z-10">
                                <div className="space-y-4">
                                    <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">HİKAYE<br />PAYLAŞ</h3>
                                    <p className="text-white/40 text-sm font-bold leading-relaxed">Günlük hayatından kareler paylaşarak keşfette daha fazla kişiye ulaşın.</p>
                                </div>
                                <Link href="/dashboard/media">
                                    <button className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase tracking-widest shadow-xl shadow-primary/40 hover:translate-y-[-4px] transition-all flex items-center justify-center gap-3">
                                        <Camera className="w-5 h-5" /> YÜKLEMEYE BAŞLA
                                    </button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="shadow-2xl shadow-gray-200/50 border-gray-100 rounded-[2.5rem] bg-white">
                        <CardHeader className="p-8 pb-4">
                            <CardTitle className="text-lg font-black uppercase tracking-tighter">Hızlı İpuçları</CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 pt-4 space-y-6">
                            <div className="flex gap-4 group">
                                <div className="w-10 h-10 shrink-0 rounded-xl bg-yellow-50 text-yellow-500 flex items-center justify-center group-hover:rotate-12 transition-transform">
                                    <Sparkles className="w-5 h-5" />
                                </div>
                                <p className="text-xs text-gray-400 font-bold leading-relaxed">Profil fotoğrafınızı güncelleyerek tıklanma oranınızı %25 artırabilirsiniz.</p>
                            </div>
                            <div className="flex gap-4 group">
                                <div className="w-10 h-10 shrink-0 rounded-xl bg-green-50 text-green-500 flex items-center justify-center group-hover:rotate-12 transition-transform">
                                    <PlusCircle className="w-5 h-5" />
                                </div>
                                <p className="text-xs text-gray-400 font-bold leading-relaxed">Fiyat seçeneklerinize "Gecelik" ekleyerek VIP talepleri yakalayın.</p>
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
