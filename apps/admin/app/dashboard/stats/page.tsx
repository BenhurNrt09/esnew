import { createServerClient } from '@repo/lib/server';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@repo/ui';
import { BarChart3, TrendingUp, Users, MousePointer2, Star, Eye } from 'lucide-react';

export const revalidate = 0;

async function getStats() {
    const supabase = createServerClient();

    // Total stats
    const [statsRes, commentsRes, listingsRes] = await Promise.all([
        supabase.from('listing_stats').select('view_count, contact_count, favorite_count'),
        supabase.from('comments').select('rating_stars').not('rating_stars', 'is', null).is('parent_id', null),
        supabase.from('listings').select('id, title, is_active')
    ]);

    const stats = statsRes.data || [];
    const totalViews = stats.reduce((acc, curr) => acc + (curr.view_count || 0), 0);
    const totalContacts = stats.reduce((acc, curr) => acc + (curr.contact_count || 0), 0);
    const totalFavorites = stats.reduce((acc, curr) => acc + (curr.favorite_count || 0), 0);

    const ratings = commentsRes.data || [];
    const avgRating = ratings.length > 0
        ? (ratings.reduce((acc, curr) => acc + (curr.rating_stars || 0), 0) / ratings.length).toFixed(1)
        : '0.0';

    // Top listings by views
    const { data: topListings } = await supabase
        .from('listing_stats')
        .select('view_count, contact_count, listing:listings(title, slug)')
        .order('view_count', { ascending: false })
        .limit(10);

    return {
        totalViews,
        totalContacts,
        totalFavorites,
        avgRating,
        totalListings: listingsRes.data?.length || 0,
        activeListings: listingsRes.data?.filter(l => l.is_active).length || 0,
        topListings: topListings || []
    };
}

export default async function StatsPage() {
    const data = await getStats();

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-black text-red-950 tracking-tight uppercase">Sistem İstatistikleri</h1>
                <p className="text-muted-foreground mt-1">Platform genelindeki etkileşim ve performans verileri.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Toplam Görüntülenme', value: data.totalViews, icon: Eye, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'İletişim Tıklamaları', value: data.totalContacts, icon: MousePointer2, color: 'text-green-600', bg: 'bg-green-50' },
                    { label: 'Favoriye Ekleme', value: data.totalFavorites, icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
                    { label: 'Ortalama Puan', value: data.avgRating, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
                ].map((stat, i) => (
                    <Card key={i} className="border-red-50 shadow-sm hover:shadow-md transition-all">
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                            <div>
                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-2xl font-black text-gray-900 mt-1">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Top Listings Table */}
                <Card className="border-red-50 shadow-sm">
                    <CardHeader className="bg-red-50/30 border-b border-red-50">
                        <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-red-600" /> En Çok Tıklanan Profiller
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-gray-100">
                            {data.topListings.map((item: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-red-950 text-white flex items-center justify-center font-black text-xs shrink-0">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900 line-clamp-1">{item.listing?.title}</p>
                                            <p className="text-[10px] text-gray-400 font-mono tracking-tight lowercase">/{item.listing?.slug}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 shrink-0">
                                        <div className="text-right">
                                            <p className="text-xs font-black text-gray-900">{item.view_count}</p>
                                            <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">İzlenme</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-red-600">{item.contact_count}</p>
                                            <p className="text-[9px] text-gray-400 uppercase font-bold tracking-widest">İletişim</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* System Activity Summary */}
                <Card className="border-red-50 shadow-sm">
                    <CardHeader className="bg-red-50/30 border-b border-red-50">
                        <CardTitle className="text-lg font-black uppercase tracking-tighter flex items-center gap-2">
                            <Users className="w-5 h-5 text-red-600" /> Sistem Özeti
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-gray-50 border border-gray-100">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Aktif Profil Oranı</p>
                                <h4 className="text-2xl font-black text-gray-900">
                                    %{data.totalListings > 0 ? Math.round((data.activeListings / data.totalListings) * 100) : 0}
                                </h4>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Toplam Liste</p>
                                <h4 className="text-2xl font-black text-gray-900">{data.totalListings}</h4>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h5 className="text-xs font-black text-red-950 uppercase tracking-widest">Performans Notu</h5>
                            <div className="p-6 rounded-2xl bg-red-950 text-white shadow-xl shadow-red-900/20">
                                <p className="text-sm font-bold leading-relaxed opacity-90">
                                    Sistem şu anda <span className="text-red-400 font-black">{data.totalViews}</span> görüntülenme ile stabil çalışıyor.
                                    İletişim dönüşüm oranı <span className="text-red-400 font-black">%{data.totalViews > 0 ? ((data.totalContacts / data.totalViews) * 100).toFixed(1) : 0}</span> seviyesinde.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
