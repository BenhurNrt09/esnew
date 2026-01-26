import { requireAdmin, createServerClient } from '@repo/lib/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';
import {
    LayoutDashboard,
    MapPin,
    Layers,
    FileText,
    TrendingUp,
    Users,
    ArrowUpRight,
    Activity,
    CheckCircle2
} from 'lucide-react';

export const revalidate = 0;

async function getStats() {
    const supabase = createServerClient();

    const [listingsRes, citiesRes, categoriesRes, usersRes] = await Promise.all([
        supabase.from('listings').select('id, is_active, is_featured'),
        supabase.from('cities').select('id, is_active'),
        supabase.from('categories').select('id, is_active'),
        supabase.from('users').select('id', { count: 'exact', head: true }),
    ]);

    const totalListings = listingsRes.data?.length || 0;
    const activeListings = listingsRes.data?.filter(l => l.is_active).length || 0;
    const featuredListings = listingsRes.data?.filter(l => l.is_featured).length || 0;

    const totalCities = citiesRes.data?.length || 0;
    const totalCategories = categoriesRes.data?.length || 0;
    const totalUsers = usersRes.count || 1;

    return {
        totalListings,
        activeListings,
        featuredListings,
        totalCities,
        totalCategories,
        totalUsers
    };
}

export default async function DashboardPage() {
    try {
        await requireAdmin();
    } catch {
        redirect('/login');
    }

    const stats = await getStats();

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-xl shadow-sm border border-red-100">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-red-950">Dashboard</h1>
                    <p className="text-gray-500 mt-1">
                        Platform istatistikleri ve yönetim özeti.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 px-4 py-2 rounded-full border border-green-100 font-medium">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse box-shadow-green"></span>
                    Sistem durumu: Aktif
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
                    description="Hizmet verilen bölgeler"
                    trend="Sabit"
                    color="rose"
                />
                <StatsCard
                    title="Kategoriler"
                    value={stats.totalCategories}
                    icon={<Layers className="h-5 w-5 text-amber-600" />}
                    description="Ana ve alt kategoriler"
                    trend="+2"
                    color="amber"
                />
                <StatsCard
                    title="Vitrin Profiller"
                    value={stats.featuredListings}
                    icon={<TrendingUp className="h-5 w-5 text-purple-600" />}
                    description="Ana sayfa vitrini"
                    trend="+5%"
                    color="purple"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity */}
                <Card className="lg:col-span-2 shadow-sm border-gray-100 hover:shadow-md transition-shadow">
                    <CardHeader className="border-b border-gray-50 bg-gray-50/50">
                        <CardTitle className="flex items-center gap-2 text-gray-800">
                            <Activity className="h-5 w-5 text-red-600" />
                            Sistem Aktiviteleri
                        </CardTitle>
                        <CardDescription>
                            Son yapılan işlemler ve sistem bildirimleri
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-8">
                            <div className="relative pl-8 border-l-2 border-red-100 space-y-8">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="relative">
                                        <div className="absolute -left-[39px] bg-red-50 w-6 h-6 rounded-full border-2 border-red-200 flex items-center justify-center">
                                            <div className="w-2 h-2 bg-red-500 rounded-full" />
                                        </div>
                                        <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm ml-2">
                                            <div className="flex items-center gap-2 mb-1">
                                                <FileText className="h-4 w-4 text-red-400" />
                                                <span className="font-bold text-gray-900 text-sm">Yeni ilan eklendi</span>
                                            </div>
                                            <p className="text-xs text-gray-500">2 saat önce sisteme yeni bir profil kaydı yapıldı.</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Start Guide */}
                <Card className="shadow-sm border-gray-100 hover:shadow-md transition-shadow">
                    <CardHeader className="bg-gradient-to-br from-red-50 to-white border-b border-red-50">
                        <CardTitle className="text-lg text-red-950">Hızlı Başlangıç</CardTitle>
                        <CardDescription>Kurulum adımları</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <CheckItem completed={stats.totalCities > 0} label="Şehirleri Ekle" />
                            <CheckItem completed={stats.totalCategories > 0} label="Kategorileri Oluştur" />
                            <CheckItem completed={stats.totalListings > 0} label="İlk İlanı Ekle" />
                            <CheckItem completed={true} label="Siteyi Yayına Al" />
                        </div>

                        <div className="mt-8 pt-4 border-t border-gray-100">
                            <div className="rounded-xl bg-blue-50/50 border border-blue-100 p-4 text-blue-900 text-xs shadow-sm">
                                <p className="font-bold mb-2 flex items-center gap-1">
                                    <span className="text-lg">💡</span> İpucu
                                </p>
                                Seed datayı Supabase'den yükleyerek tüm içeriği otomatik doldurabilirsiniz.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, description, trend, color }: any) {
    return (
        <Card className={`shadow-sm hover:shadow-lg transition-all duration-300 border-${color}-100 overflow-hidden relative group`}>
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

function CheckItem({ completed, label }: { completed: boolean, label: string }) {
    return (
        <div className="flex items-center gap-3 group">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border transition-all duration-300 ${completed
                    ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-200'
                    : 'border-gray-200 bg-gray-50 group-hover:border-blue-400'
                }`}>
                {completed && <CheckCircle2 className="h-3.5 w-3.5" />}
            </div>
            <span className={`text-sm transition-colors ${completed
                    ? 'text-gray-400 font-medium'
                    : 'font-semibold text-gray-700 group-hover:text-blue-600'
                }`}>
                {label}
            </span>
        </div>
    )
}
