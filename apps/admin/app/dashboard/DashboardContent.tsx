'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';
import { Activity, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';
import { useLanguage } from '@repo/lib/i18n';

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

export function DashboardContent({ stats, recentActivity }: DashboardContentProps) {
    const { t } = useLanguage();

    return (
        <div className="container mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-500">
            {/* Welcome Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-card border border-white/10 p-6 rounded-xl shadow-lg">
                <div>
                    <h1 className="text-3xl font-black tracking-tight text-white">{t.dashboard.welcome}</h1>
                    <p className="text-gray-400 mt-1">{t.dashboard.quickStart}</p>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary font-medium">
                    {/* Badge removed */}
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
                    color="amber" // Keep amber/primary as gold 
                />
                <StatsCard
                    title={t.home.vitrinBadge}
                    value={stats.featuredListings}
                    description={t.home.featuredProfiles}
                    trend="+5%"
                    color="primary"
                />
            </div>

            {/* Main Content Area - Full Width Activity */}
            <Card className="shadow-lg border-white/10 bg-card hover:border-primary/30 transition-all">
                <CardHeader className="border-b border-white/5 bg-white/5">
                    <CardTitle className="flex items-center gap-2 text-white">
                        <Activity className="h-5 w-5 text-primary" />
                        {t.dashboard.welcome}
                    </CardTitle>
                    <CardDescription className="text-gray-400">
                        {t.dashboard.addFirstListing}
                    </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-0">
                        {recentActivity.length > 0 ? recentActivity.map((activity, i) => (
                            <div key={i} className="flex gap-4 p-4 hover:bg-white/5 rounded-lg transition-colors border-b border-white/5 last:border-0 last:pb-0">
                                <div className="mt-1">
                                    <FileText className="h-4 w-4 text-primary" />
                                </div>
                                <div>
                                    <p className="text-gray-200 font-medium text-sm">
                                        Yeni Eklendi: <span className="font-bold text-white">{activity.title}</span>
                                    </p>
                                    <div className="flex items-center gap-3 mt-1">
                                        <p className="text-xs text-gray-500">
                                            {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true, locale: tr })}
                                        </p>
                                        {activity.is_active ? (
                                            <span className="text-[10px] bg-green-900/30 text-green-400 px-1.5 py-0.5 rounded-full border border-green-900/50">{t.listings.active}</span>
                                        ) : (
                                            <span className="text-[10px] bg-gray-800 text-gray-400 px-1.5 py-0.5 rounded-full border border-gray-700">{t.cities.inactive}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-8 text-gray-600 italic">
                                {t.common.noResults}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatsCard({ title, value, description, trend, color }: any) {
    return (
        <Card className={`shadow-lg hover:shadow-primary/20 transition-all duration-300 border-white/10 bg-card overflow-hidden relative group`}>
            {/* Decorative BG Blob */}
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
    )
}
