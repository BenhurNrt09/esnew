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
        .select('view_count, contact_count, listing:listings!inner(title, slug)')
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
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                    Sistem <span className="text-primary">İstatistikleri</span>
                </h1>
                <p className="text-gray-300 mt-1 font-medium italic">Platform genelindeki etkileşim ve performans verileri.</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Toplam Görüntülenme', value: data.totalViews, icon: Eye, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
                    { label: 'İletişim Tıklamaları', value: data.totalContacts, icon: MousePointer2, color: 'text-green-500', bg: 'bg-green-500/10', border: 'border-green-500/20' },
                    { label: 'Favoriye Ekleme', value: data.totalFavorites, icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20' },
                    { label: 'Ortalama Puan', value: data.avgRating, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10', border: 'border-purple-500/20' },
                ].map((stat, i) => (
                    <Card key={i} className={`bg-white/5 border-white/10 shadow-lg hover:shadow-primary/5 transition-all overflow-hidden relative group`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} border ${stat.border} group-hover:scale-110 transition-transform`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
                                <h3 className="text-2xl font-black text-white mt-1 group-hover:text-primary transition-colors">{stat.value}</h3>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Top Listings Table */}
                <Card className="bg-white/5 border-white/10 shadow-lg overflow-hidden flex flex-col">
                    <CardHeader className="bg-black/40 border-b border-white/5">
                        <CardTitle className="text-lg font-black uppercase text-white tracking-tighter flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-primary" /> En Çok Tıklanan Profiller
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1">
                        <div className="divide-y divide-white/5 h-full">
                            {data.topListings.map((item: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-black text-primary flex items-center justify-center font-black text-xs shrink-0 border border-white/10 group-hover:border-primary/50 transition-all">
                                            {i + 1}
                                        </div>
                                        <div>
                                            <p className="font-black text-white group-hover:text-primary transition-colors line-clamp-1 uppercase tracking-tight">{item.listing?.title}</p>
                                            <p className="text-[10px] text-primary/70 font-mono tracking-tighter lowercase font-bold">/{item.listing?.slug}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 shrink-0">
                                        <div className="text-right">
                                            <p className="text-xs font-black text-white">{item.view_count}</p>
                                            <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest opacity-80">İzlenme</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs font-black text-primary font-mono">{item.contact_count}</p>
                                            <p className="text-[9px] text-gray-400 uppercase font-black tracking-widest opacity-80">İletişim</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* System Activity Summary */}
                <Card className="bg-white/5 border-white/10 shadow-lg overflow-hidden">
                    <CardHeader className="bg-black/40 border-b border-white/5">
                        <CardTitle className="text-lg font-black uppercase text-white tracking-tighter flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" /> Sistem Özeti
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 space-y-8">
                        <div className="flex items-center justify-between p-6 rounded-2xl bg-black/40 border border-white/5">
                            <div>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Aktif Profil Oranı</p>
                                <h4 className="text-2xl font-black text-white">
                                    %{data.totalListings > 0 ? Math.round((data.activeListings / data.totalListings) * 100) : 0}
                                </h4>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Toplam Liste</p>
                                <h4 className="text-2xl font-black text-primary">{data.totalListings}</h4>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h5 className="text-[10px] font-black text-primary/70 uppercase tracking-widest">Performans Notu</h5>
                            <div className="p-6 rounded-2xl bg-black/60 text-white shadow-xl shadow-primary/5 border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl" />
                                <p className="text-sm font-bold leading-relaxed opacity-90 relative z-10">
                                    Sistem şu anda <span className="text-primary font-black">{data.totalViews}</span> görüntülenme ile stabil çalışıyor.
                                    İletişim dönüşüm oranı <span className="text-primary font-black">%{data.totalViews > 0 ? ((data.totalContacts / data.totalViews) * 100).toFixed(1) : 0}</span> seviyesinde.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
