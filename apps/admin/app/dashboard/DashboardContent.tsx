'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, cn } from '@repo/ui';
import { Activity, UserPlus, Clock, LifeBuoy, ImageIcon, Star, Globe, MapPin, Layers } from 'lucide-react';
import { useLanguage } from '@repo/lib/i18n';
import Link from 'next/link';

interface DashboardContentProps {
    stats: {
        totalListings: number;
        activeListings: number;
        featuredListings: number;
        totalCities: number;
        totalCategories: number;
        totalUsers: number;
    };
    recentActivity: any[];
}

export function DashboardContent({ stats }: DashboardContentProps) {
    const { t } = useLanguage();

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-white/10 p-6 rounded-xl shadow-lg">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white">{t.dashboard.welcome}</h1>
                    <p className="text-gray-400 mt-1">{t.dashboard.quickStart}</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title={t.listings.totalListings}
                    value={stats.totalListings}
                    description={`${stats.activeListings} ${t.listings.active}`}
                    trend="+12%"
                    color="primary"
                />
                <StatsCard
                    title={t.cities.title}
                    value={stats.totalCities}
                    description={t.dashboard.addCities}
                    trend="Sabit"
                    color="primary"
                />
                <StatsCard
                    title={t.categories.title}
                    value={stats.totalCategories}
                    description={t.categories.addNew}
                    trend="+2"
                    color="amber"
                />
                <StatsCard
                    title={t.home.vitrinBadge}
                    value={stats.featuredListings}
                    description={t.home.featuredProfiles}
                    trend="+5%"
                    color="primary"
                />
            </div>

            {/* Quick Access Grid */}
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Activity className="h-5 w-5 text-primary" />
                    Hızlı Erişim
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <QuickAccessCard
                        title="Yeni Profil Ekle"
                        description="Hızlıca yeni bir profil oluşturun"
                        icon={UserPlus}
                        href="/dashboard/profiles/models/new"
                        color="primary"
                    />
                    <QuickAccessCard
                        title="Onay Bekleyenler"
                        description="Yeni kayıtları inceleyin"
                        icon={Clock}
                        href="/dashboard/profiles/pending"
                        color="amber"
                    />
                    <QuickAccessCard
                        title="Destek Talepleri"
                        description="Kullanıcı mesajlarını yanıtlayın"
                        icon={LifeBuoy}
                        href="/dashboard/support"
                        color="blue"
                    />
                    <QuickAccessCard
                        title="Reklam Yönetimi"
                        description="Sponsorlu alanları yönetin"
                        icon={ImageIcon}
                        href="/dashboard/ads"
                        color="purple"
                    />
                    <QuickAccessCard
                        title="Vitrin & Özellikler"
                        description="Öne çıkanları düzenleyin"
                        icon={Star}
                        href="/dashboard/features"
                        color="amber"
                    />
                    <QuickAccessCard
                        title="Şehir Yönetimi"
                        description="Hizmet verilen bölgeler"
                        icon={MapPin}
                        href="/dashboard/cities"
                        color="green"
                    />
                    <QuickAccessCard
                        title="Kategori Yönetimi"
                        description="İlan kategorilerini düzenleyin"
                        icon={Layers}
                        href="/dashboard/categories"
                        color="blue"
                    />
                    <QuickAccessCard
                        title="Sitede Görüntüle"
                        description="Ana sayfaya hızlı geçiş"
                        icon={Globe}
                        href={process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000"}
                        external
                        color="primary"
                    />
                </div>
            </div>
        </div>
    );
}

function StatsCard({ title, value, description, trend }: any) {
    return (
        <Card className={`shadow-lg hover:shadow-primary/20 transition-all duration-300 border-white/10 bg-card overflow-hidden relative group`}>
            <div className={`absolute top-0 right-0 w-24 h-24 bg-primary/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500 opacity-20`} />

            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                <CardTitle className="text-sm font-medium text-gray-400 group-hover:text-primary transition-colors">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
                <div className="text-3xl font-black text-white">{value}</div>
                <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-gray-500">
                        {description}
                    </p>
                    {trend && (
                        <span className={`text-black font-bold text-[10px] bg-primary px-2 py-1 rounded-full`}>
                            {trend}
                        </span>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}

function QuickAccessCard({ title, description, icon: Icon, href, color, external }: any) {
    const CardWrapper = ({ children }: any) => external ? (
        <a href={href} target="_blank" rel="noopener noreferrer" className="block outline-none">
            {children}
        </a>
    ) : (
        <Link href={href} className="block outline-none">
            {children}
        </Link>
    );

    const colorClasses: Record<string, string> = {
        primary: "text-primary border-primary/20 hover:border-primary/50 bg-primary/5",
        amber: "text-amber-500 border-amber-500/20 hover:border-amber-500/50 bg-amber-500/5",
        blue: "text-blue-500 border-blue-500/20 hover:border-blue-500/50 bg-blue-500/5",
        purple: "text-purple-500 border-purple-500/20 hover:border-purple-500/50 bg-purple-500/5",
        green: "text-green-500 border-green-500/20 hover:border-green-500/50 bg-green-500/5",
    };

    const iconBgClasses: Record<string, string> = {
        primary: "bg-primary/10",
        amber: "bg-amber-500/10",
        blue: "bg-blue-500/10",
        purple: "bg-purple-500/10",
        green: "bg-green-500/10",
    };

    return (
        <CardWrapper>
            <Card className={cn(
                "h-full border-white/10 bg-card hover:bg-white/5 transition-all duration-300 group cursor-pointer overflow-hidden relative",
                colorClasses[color] || colorClasses.primary
            )}>
                <CardContent className="p-5 flex items-start gap-4">
                    <div className={cn(
                        "p-3 rounded-xl transition-transform group-hover:scale-110 duration-300",
                        iconBgClasses[color] || iconBgClasses.primary
                    )}>
                        <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-white text-base leading-tight group-hover:text-primary transition-colors">
                            {title}
                        </h3>
                        <p className="text-gray-400 text-xs mt-1 line-clamp-1">
                            {description}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </CardWrapper>
    );
}
