'use client';

import {
    BarChart3, TrendingUp, Users, Eye,
    Calendar, ArrowUpRight, ArrowDownRight,
    Search, Download
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@repo/ui';
import { cn } from '@repo/ui/src/lib/utils';

export default function StatsPage() {
    // Mock data for the demonstration
    const stats = [
        { label: 'Toplam Görüntülenme', value: '12.450', change: '+12%', trend: 'up', icon: Eye },
        { label: 'Profil Etkileşimi', value: '842', change: '+5%', trend: 'up', icon: TrendingUp },
        { label: 'Benzersiz Ziyaretçi', value: '3.120', change: '-2%', trend: 'down', icon: Users },
        { label: 'Arama Görünürlüğü', value: '%64', change: '+18%', trend: 'up', icon: Search },
    ];

    const chartData = [
        { label: 'Pzt', value: 40 },
        { label: 'Sal', value: 65 },
        { label: 'Çar', value: 45 },
        { label: 'Per', value: 90 },
        { label: 'Cum', value: 85 },
        { label: 'Cmt', value: 110 },
        { label: 'Paz', value: 95 },
    ];

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">İstatistik <span className="text-gold-gradient">Analizi</span></h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium italic mt-1">Profil performansınızı ve ziyaretçi davranışlarını takip edin</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="bg-white dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-900 dark:text-white rounded-xl h-12 px-6 font-bold uppercase tracking-widest text-[10px] hover:bg-gray-50 dark:hover:bg-white/10">
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
                {stats.map((stat, idx) => {
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
                {/* Main Performance Chart */}
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
                            {chartData.map((item, idx) => (
                                <div key={idx} className="flex-1 flex flex-col items-center gap-4 group/bar">
                                    <div className="relative w-full flex justify-center items-end h-full">
                                        <div
                                            className="w-full sm:w-16 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5 rounded-2xl group-hover/bar:bg-gold-gradient group-hover/bar:border-none transition-all duration-500 relative overflow-hidden"
                                            style={{ height: `${item.value}%` }}
                                        >
                                            <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                                        </div>
                                        <div className="absolute -top-8 opacity-0 group-hover/bar:opacity-100 transition-all duration-300 transform translate-y-2 group-hover/bar:translate-y-0 text-gray-900 dark:text-white font-black text-xs">
                                            {item.value}k
                                        </div>
                                    </div>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{item.label}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Visitor Demographics / Device Source */}
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
                                    <span className="text-xs font-black text-white uppercase tracking-widest">{device.label}</span>
                                    <span className="text-xs font-black text-primary">%{device.value}</span>
                                </div>
                                <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
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
        </div>
    );
}
