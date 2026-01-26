import { requireAdmin, createServerClient } from '@repo/lib/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';
import {
    MapPin, Layers, Users, TrendingUp, Activity, FileText
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

export const revalidate = 0;

async function getData() {
    const supabase = createServerClient();

    const [listingsRes, citiesRes, categoriesRes, usersRes, recentRes] = await Promise.all([
        supabase.from('listings').select('id, is_active, is_featured'),
        supabase.from('cities').select('id', { count: 'exact', head: true }),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('users').select('id', { count: 'exact', head: true }),
        supabase.from('listings').select('title, created_at, is_active').order('created_at', { ascending: false }).limit(5)
    ]);

    const totalListings = listingsRes.data?.length || 0;
    const activeListings = listingsRes.data?.filter(l => l.is_active).length || 0;
    const featuredListings = listingsRes.data?.filter(l => l.is_featured).length || 0;

    return {
        stats: {
            totalListings,
            activeListings,
            featuredListings,
            totalCities: citiesRes.count || 0,
            totalCategories: categoriesRes.count || 0,
            totalUsers: usersRes.count || 0
        },
        recentActivity: recentRes.data || []
    };
}

export default async function DashboardPage() {
    try {
        await requireAdmin();
    } catch {
        redirect('/login');
    }

    const { stats, recentActivity } = await getData();

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-red-50">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-red-950">Dashboard</h1>
                    <p className="text-gray-500 mt-1">Platform genel durumu</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-100 font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Sistem Aktif
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Toplam Profil"
                    value={stats.totalListings}
                    icon={<Users className="h-5 w-5 text-red-600" />}
                    description={`${stats.activeListings} aktif yayında`}
                    trend="+12%"
                    color="red"
                />
                <StatsCard
                    title="Şehirler"
                    value={stats.totalCities}
                    icon={<MapPin className="h-5 w-5 text-rose-500" />}
                    description="Hizmet bölgesi"
                    trend="Sabit"
                    color="rose"
                />
                <StatsCard
                    title="Kategoriler"
                    value={stats.totalCategories}
                    icon={<Layers className="h-5 w-5 text-amber-600" />}
                    description="Ana/Alt kategori"
                    trend="+2"
                    color="amber"
                />
                <StatsCard
                    title="Vitrin Profiller"
                    value={stats.featuredListings}
                    icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
                    description="Ana sayfa"
                    trend="+5%"
                    color="purple"
                />
            </div>

            {/* Main Content Area - Full Width Activity */}
            <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow">
                <CardHeader className="border-b border-gray-50 bg-gray-50/30">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                        <Activity className="h-5 w-5 text-red-600" />
                        Son Aktiviteler (Canlı)
                    </CardTitle>
                    <CardDescription>
                        Platforma eklenen son ilanlar ve güncellemeler
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-0">
                        {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
                            <div key={i} className="flex gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0 last:pb-0">
                                <div className="mt-1">
                                    <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center border border-red-200">
                                        <FileText className="h-4 w-4 text-red-600" />
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-900 font-medium text-sm">
                                        Yeni İlan: <span className="font-bold">{activity.title}</span>
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-xs text-gray-400">
                                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: tr })}
                                        </p>
                                        {activity.is_active ? (
                                            <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full">Aktif</span>
                                        ) : (
                                            <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">Pasif</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-gray-400 italic">
                                Henüz aktivite yok.
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatsCard({ title, value, icon, description, trend, color }: any) {
    return (
        <Card className={`shadow-sm hover:shadow-lg transition-all duration-300 border-${color}-100 overflow-hidden relative group`}>
            {/* Decorative BG Blob */}
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}-50 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500 opacity-50`} />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-gray-600">
                    {title}
                </CardTitle>
                <div className={`p-2 bg-${color}-50 rounded-lg group-hover:bg-${color}-100 transition-colors`}>
                    {icon}
                </div>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="text-3xl font-black text-gray-900">{value}</div>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                        {description}
                    </p>
                    {trend && (
                        <span className={`text-${color}-600 font-bold text-[10px] bg-${color}-50 px-2 py-1 rounded-full`}>
                            {trend}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
