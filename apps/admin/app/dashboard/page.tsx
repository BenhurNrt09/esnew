import { requireAdmin, createServerClient } from '@repo/lib/server';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';
import { DashboardHeader } from '../components/DashboardHeader'; // Ensure import
import {
    LayoutDashboard,
    MapPin,
    Layers,
    FileText,
    TrendingUp,
    Users,
    ArrowUpRight,
    Activity
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
    const totalUsers = usersRes.count || 1; // At least admin

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
        <div className="container mx-auto px-4 py-8 space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
                    <p className="text-muted-foreground mt-1">
                        Platform istatistikleri ve yönetim özeti.
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full border">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    Sistem durumu: Aktif
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Toplam İlan"
                    value={stats.totalListings}
                    icon={<FileText className="h-4 w-4 text-blue-500" />}
                    description={`${stats.activeListings} aktif yayında`}
                    trend="+12%"
                />
                <StatsCard
                    title="Şehirler"
                    value={stats.totalCities}
                    icon={<MapPin className="h-4 w-4 text-green-500" />}
                    description="Hizmet verilen bölgeler"
                    trend="Sabit"
                />
                <StatsCard
                    title="Kategoriler"
                    value={stats.totalCategories}
                    icon={<Layers className="h-4 w-4 text-orange-500" />}
                    description="Ana ve alt kategoriler"
                    trend="+2"
                />
                <StatsCard
                    title="Öne Çıkanlar"
                    value={stats.featuredListings}
                    icon={<TrendingUp className="h-4 w-4 text-purple-500" />}
                    description="Vitrin ilanları"
                    trend="+5%"
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Activity / Quick Actions - Spans 2 columns */}
                <Card className="lg:col-span-2 shadow-md border-muted/60">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="h-5 w-5 text-primary" />
                            Sistem Aktiviteleri
                        </CardTitle>
                        <CardDescription>
                            Son yapılan işlemler ve sistem bildirimleri
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-8">
                            {/* Activity Timeline Placeholder */}
                            <div className="relative pl-6 border-l md:pl-0 md:border-l-0 md:grid md:grid-cols-1 gap-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-start gap-4 pb-6 border-b last:border-0 last:pb-0">
                                        <div className="w-2 h-2 mt-2 rounded-full bg-primary shrink-0 md:hidden absolute -left-[5px]"></div>
                                        <div className="bg-muted w-10 h-10 rounded-full flex items-center justify-center shrink-0">
                                            <FileText className="h-5 w-5 text-muted-foreground" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">Yeni ilan eklendi</p>
                                            <p className="text-xs text-muted-foreground mt-1">2 saat önce</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Start Guide */}
                <Card className="shadow-md border-muted/60">
                    <CardHeader className="bg-primary/5 border-b">
                        <CardTitle className="text-lg">Hızlı Başlangıç</CardTitle>
                        <CardDescription>Kurulum adımları</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-4">
                            <CheckItem completed={stats.totalCities > 0} label="Şehirleri Ekle" />
                            <CheckItem completed={stats.totalCategories > 0} label="Kategorileri Oluştur" />
                            <CheckItem completed={stats.totalListings > 0} label="İlk İlanı Ekle" />
                            <CheckItem completed={true} label="Siteyi Yayına Al" />
                        </div>

                        <div className="mt-8 pt-4 border-t">
                            <div className="rounded-lg bg-blue-50 p-3 text-blue-900 text-xs">
                                <p className="font-bold mb-1">💡 İpucu</p>
                                Seed datayı Supabase'den yükleyerek tüm içeriği otomatik doldurabilirsiniz.
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatsCard({ title, value, icon, description, trend }: any) {
    return (
        <Card className="shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
                    {description}
                    {trend && <span className="text-green-600 font-medium flex items-center text-[10px] bg-green-50 px-1.5 py-0.5 rounded-full ring-1 ring-green-600/20">{trend}</span>}
                </p>
            </CardContent>
        </Card>
    )
}

function CheckItem({ completed, label }: { completed: boolean, label: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${completed ? 'bg-primary border-primary text-primary-foreground' : 'border-muted-foreground/30'}`}>
                {completed && <ArrowUpRight className="h-4 w-4" />}
            </div>
            <span className={completed ? 'text-muted-foreground line-through decoration-primary/50' : 'font-medium'}>
                {label}
            </span>
        </div>
    )
}
