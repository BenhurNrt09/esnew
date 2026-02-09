'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    BarChart3, TrendingUp, Users, Eye,
    Calendar, ArrowUpRight, ArrowDownRight,
    Search, Download, MousePointer2
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@repo/ui';
import { cn } from '@repo/ui/src/lib/utils';
import { createClient } from '@repo/lib/supabase/client';
import { useAuth } from '../../components/AuthProvider';

export default function StatsPage() {
    const supabase = createClient();
    const { user, loading: authLoading } = useAuth();
    const searchParams = useSearchParams();
    const urlListingId = searchParams.get('listingId');
    const [loading, setLoading] = useState(true);
    const [statsData, setStatsData] = useState<any[]>([]);
    const [listing, setListing] = useState<any>(null);
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        if (!user) return;

        const loadStats = async () => {
            // 1. Get the model's listing
            let query = supabase
                .from('listings')
                .select('id, rating_average, review_count');

            if (urlListingId) {
                query = query.eq('id', urlListingId);
            } else {
                query = query.eq('user_id', user.id);
            }

            const { data: listingData } = await query.limit(1).maybeSingle();

            if (listingData) {
                setListing(listingData);

                // 2. Get last 60 days of stats to calculate trends
                const sixtyDaysAgo = new Date();
                sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

                const { data: stats } = await supabase
                    .from('listing_stats')
                    .select('*')
                    .eq('listing_id', listingData.id)
                    .gte('date', sixtyDaysAgo.toISOString().split('T')[0])
                    .order('date', { ascending: true });

                if (stats) setStatsData(stats);
            }
            setLoading(false);
        };

        loadStats();

        // 3. Set up Realtime Subscription
        const channel = supabase
            .channel('realtime-stats')
            .on(
                'postgres_changes',
                { event: '*', schema: 'public', table: 'listing_stats' },
                () => loadStats()
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [user]);

    // Calculate aggregated stats
    const processedStats = useMemo(() => {
        const today = new Date().toISOString().split('T')[0];
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

        const period1 = statsData.filter(s => s.date >= thirtyDaysAgoStr);
        const period2 = statsData.filter(s => s.date < thirtyDaysAgoStr);

        const currentViews = period1.reduce((sum, s) => sum + (s.view_count || 0), 0);
        const currentContacts = period1.reduce((sum, s) => sum + (s.contact_count || 0), 0);
        const prevViews = period2.reduce((sum, s) => sum + (s.view_count || 0), 0);
        const prevContacts = period2.reduce((sum, s) => sum + (s.contact_count || 0), 0);

        const calcChange = (curr: number, prev: number) => {
            if (prev === 0) return curr > 0 ? '+100%' : '0%';
            const change = ((curr - prev) / prev) * 100;
            return (change >= 0 ? '+' : '') + change.toFixed(0) + '%';
        };

        const chartDays = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            const dateStr = d.toISOString().split('T')[0];
            const dayName = chartDays[(d.getDay() + 6) % 7];
            const dayData = statsData.find(s => s.date === dateStr);
            return {
                label: dayName,
                value: (dayData?.view_count || 0)
            };
        });

        // Determine max value for chart scaling
        const maxVal = Math.max(...last7Days.map(d => d.value), 10);

        return {
            total: [
                { label: 'Toplam Görüntülenme', value: currentViews.toLocaleString(), change: calcChange(currentViews, prevViews), trend: currentViews >= prevViews ? 'up' : 'down', icon: Eye },
                { label: 'İletişim Tıklamaları', value: currentContacts.toLocaleString(), change: calcChange(currentContacts, prevContacts), trend: currentContacts >= prevContacts ? 'up' : 'down', icon: MousePointer2 },
                { label: 'Ortalama Puan', value: (listing?.rating_average || 0).toFixed(1), change: 'Canlı', trend: 'up', icon: Star },
                { label: 'Toplam Yorum', value: (listing?.review_count || 0), change: 'Son 30 Gün', trend: 'up', icon: MessageSquare },
            ],
            chart: last7Days.map(d => ({ ...d, percent: (d.value / maxVal) * 100 }))
        };
    }, [statsData, listing]);

    const handleDownloadReport = () => {
        if (!statsData || statsData.length === 0) {
            setShowWarning(true);
            return;
        }

        // Add UTF-8 BOM for Excel compatibility
        const BOM = '\uFEFF';
        const headers = ["Tarih", "Görüntülenme", "İletişim Tıklaması"];
        const rows = statsData.map(s => [
            s.date,
            s.view_count || 0,
            s.contact_count || 0
        ]);

        const csvContent = BOM + [
            headers.join(";"), // Use semicolon for better Turkish Excel compatibility
            ...rows.map(e => e.join(";"))
        ].join("\n");

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `performans_raporu_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (loading) return (
        <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">İstatistik <span className="text-gold-gradient">Analizi</span></h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium italic mt-1">Profil performansınızı ve ziyaretçi davranışlarını takip edin</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={handleDownloadReport}
                        className="bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-900 dark:text-white rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 dark:hover:bg-white/10"
                    >
                        <Download className="w-4 h-4 mr-2" />
                        Rapor İndir
                    </Button>
                    <div className="h-12 bg-gold-gradient p-[1px] rounded-xl">
                        <Button className="w-full h-full bg-white dark:bg-black hover:bg-gray-50 dark:hover:bg-black/80 text-gray-900 dark:text-white font-bold uppercase tracking-widest text-[10px] rounded-[11px] px-6">
                            Son 30 Gün
                        </Button>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {processedStats.total.map((stat, idx) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={idx} className="bg-white dark:bg-[#0a0a0a] border-gray-100 dark:border-white/5 rounded-[2.5rem] overflow-hidden group hover:border-primary/30 transition-all duration-500 shadow-2xl shadow-gray-200/50 dark:shadow-primary/5">
                            <CardContent className="p-8">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-14 h-14 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center group-hover:bg-primary/20 group-hover:rotate-12 transition-all duration-500 border border-gray-100 dark:border-white/5">
                                        <Icon className="w-6 h-6 text-primary" />
                                    </div>
                                    <div className={cn(
                                        "flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter",
                                        stat.trend === 'up' ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                    )}>
                                        {stat.trend === 'up' ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        {stat.change}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] italic">{stat.label}</p>
                                    <p className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</p>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="lg:col-span-2 bg-white dark:bg-[#0a0a0a] border-gray-100 dark:border-white/5 rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50 dark:shadow-none overflow-hidden relative group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[120px] rounded-full pointer-events-none group-hover:bg-primary/20 transition-all duration-1000"></div>
                    <CardHeader className="p-0 mb-10 flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Haftalık <span className="text-gold-gradient">Görünürlük</span></CardTitle>
                            <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Günlük ziyaretçi trafiği analizi</p>
                        </div>
                        <Calendar className="text-primary w-6 h-6" />
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="h-[300px] w-full flex items-end justify-between gap-4 mt-10">
                            {processedStats.chart.map((item, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-4 group/bar">
                                    <div className="relative w-full flex justify-center items-end h-full">
                                        <div
                                            className="w-full sm:w-16 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl group-hover/bar:bg-gold-gradient group-hover/bar:border-none transition-all duration-500 relative overflow-hidden"
                                            style={{ height: `${item.percent}%` }}
                                        >
                                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                                        </div>
                                        <div className="absolute -top-8 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/bar:translate-y-0 text-gray-900 dark:text-white font-black text-xs">
                                            {item.value}
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white dark:bg-[#0a0a0a] border-gray-100 dark:border-white/5 rounded-[2.5rem] p-10 shadow-2xl shadow-gray-200/50 dark:shadow-none relative overflow-hidden">
                    <CardHeader className="p-0 mb-8">
                        <CardTitle className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Cihaz <span className="text-gold-gradient">Kaynağı</span></CardTitle>
                        <p className="text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Ziyaretçi erişim cihazları</p>
                    </CardHeader>
                    <CardContent className="p-0 space-y-8">
                        {[
                            { label: 'Mobil Cihazlar', value: 72, color: 'bg-primary' },
                            { label: 'Masaüstü', value: 24, color: 'bg-white/20' },
                            { label: 'Diğer', value: 4, color: 'bg-white/5' }
                        ].map((device, idx) => (
                            <div key={idx} className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-widest">{device.label}</span>
                                    <span className="text-xs font-black text-primary">%{device.value}</span>
                                </div>
                                <div className="h-3 w-full bg-gray-50 dark:bg-white/5 rounded-full overflow-hidden border border-gray-100 dark:border-white/5">
                                    <div
                                        className={cn("h-full rounded-full transition-all duration-1000", device.color)}
                                        style={{ width: `${device.value}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}

                        <div className="pt-8 border-t border-gray-100 dark:border-white/5">
                            <div className="bg-gray-50 dark:bg-white/5 p-6 rounded-3xl border border-gray-100 dark:border-white/5 flex items-center justify-between group hover:bg-gray-100 dark:hover:bg-white/10 transition-all cursor-pointer">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-1">En Popüler Şehir</p>
                                    <p className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter">İstanbul</p>
                                </div>
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <ArrowUpRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Empty Stat Warning Modal */}
            {showWarning && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
                    onClick={() => setShowWarning(false)}
                >
                    <div
                        className="bg-white dark:bg-[#0a0a0a] border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-10 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden group"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5">
                            <BarChart3 className="w-32 h-32 text-primary" />
                        </div>

                        <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                            <div className="w-20 h-20 bg-primary/10 rounded-[1.5rem] flex items-center justify-center border border-primary/20 text-primary">
                                <Search className="w-10 h-10" />
                            </div>

                            <div className="space-y-3">
                                <h3 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">VERİ BULUNAMADI</h3>
                                <p className="text-gray-500 dark:text-gray-400 font-bold text-sm leading-relaxed italic">
                                    İndirilecek performans verisi bulunamadı. Profiliniz henüz yeni olabilir veya bu dönemde henüz trafik almamış olabilirsiniz.
                                </p>
                            </div>

                            <Button
                                onClick={() => setShowWarning(false)}
                                className="w-full h-14 bg-gold-gradient text-black font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                            >
                                ANLADIM
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Star(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>;
}

function MessageSquare(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>;
}
