'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@repo/lib/i18n';
import { LayoutDashboard, MapPin, Layers, Users, Star, Image as ImageIcon, BarChart3 } from 'lucide-react';
import { cn } from '@repo/ui';

export function Sidebar() {
    const pathname = usePathname();
    const { t } = useLanguage();

    const menuItems = [
        { href: '/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
        { href: '/dashboard/listings', label: t.nav.listings, icon: Users },
        { href: '/dashboard/stats', label: 'İstatistikler', icon: BarChart3 },
        { href: '/dashboard/categories', label: t.nav.categories, icon: Layers },
        { href: '/dashboard/cities', label: t.nav.cities, icon: MapPin },
        { href: '/dashboard/features', label: t.nav.features, icon: Star },
        { href: '/dashboard/ads', label: 'Reklamlar', icon: ImageIcon },
    ];

    return (
        <aside className="w-64 bg-card border-r hidden md:flex flex-col h-full bg-red-950 text-red-100 shadow-xl z-20">
            <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-white">
                <Link href="/dashboard" className="text-lg font-black tracking-tighter flex items-center uppercase gap-0.5">
                    <span className="text-red-600">Velora</span>
                    <span className="text-black">Escort</span>
                    <span className="text-red-600">World</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                <div className="px-2 mb-2 text-xs font-semibold text-red-300 uppercase tracking-wider">
                    Yönetim
                </div>
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-gradient-to-r from-red-800 to-red-900 text-white shadow-md border border-red-700/50"
                                    : "text-red-100/70 hover:bg-red-900/40 hover:text-white hover:pl-5"
                            )}
                        >
                            <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-red-200" : "text-red-400")} />
                            <span className="relative z-10">{item.label}</span>

                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-l-md" />
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-red-900/30 bg-red-950/50">
                <div className="bg-red-900/30 rounded-lg p-3 border border-red-900/50">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-xs text-red-200 font-medium">Sistem Aktif</p>
                    </div>
                    <p className="font-mono text-[10px] text-red-300/60">v1.2.0 • Red Theme</p>
                </div>
            </div>
        </aside>
    );
}
