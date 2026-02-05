'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@repo/lib/i18n';
import { LayoutDashboard, MapPin, Layers, Users, Star, Image as ImageIcon, BarChart3, ChevronRight, AlertTriangle } from 'lucide-react';
import { cn } from '@repo/ui';

export function Sidebar({ isServiceRoleKeyMissing }: { isServiceRoleKeyMissing?: boolean }) {
    const pathname = usePathname();
    const { t } = useLanguage();

    const [isProfilesOpen, setIsProfilesOpen] = useState(pathname.includes('/dashboard/profiles'));

    const managementItems = [
        { href: '/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
        { href: '/dashboard/stats', label: 'İstatistikler', icon: BarChart3 },
    ];

    const contentItems = [
        { href: '/dashboard/categories', label: t.nav.categories, icon: Layers },
        { href: '/dashboard/cities', label: t.nav.cities, icon: MapPin },
        { href: '/dashboard/features', label: t.nav.features, icon: Star },
        { href: '/dashboard/ads', label: 'Reklamlar', icon: ImageIcon },
    ];

    const profileSubItems = [
        { href: '/dashboard/profiles/pending', label: 'Onay Bekleyenler' },
        { href: '/dashboard/profiles/active', label: 'Onaylanan Profiller' },
        { href: '/dashboard/profiles/featured', label: 'Vitrindeki Profiller' },
        { href: '/dashboard/profiles/models', label: 'Bireysel Modeller' },
        { href: '/dashboard/profiles/members', label: 'Üye Profilleri' },
        { href: '/dashboard/profiles/agencies', label: 'Ajans/Şirket Profilleri' },
    ];

    return (
        <aside className="w-64 bg-black border-r hidden md:flex flex-col h-full text-gray-100 shadow-xl z-20">
            <div className="h-16 flex items-center px-6 border-b border-gray-200 bg-white">
                <Link href="/dashboard" className="text-lg font-black tracking-tighter flex items-center uppercase gap-0.5">
                    <span className="text-primary">Velora</span>
                    <span className="text-black">Escort</span>
                    <span className="text-primary">World</span>
                </Link>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                <div className="px-2 mb-2 text-xs font-semibold text-primary/70 uppercase tracking-wider">
                    Yönetim
                </div>
                {managementItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-gold-gradient text-black shadow-lg border-none"
                                    : "text-gray-400 hover:bg-white/5 hover:text-primary hover:pl-5"
                            )}
                        >
                            <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-gray-500")} />
                            <span className="relative z-10">{item.label}</span>
                        </Link>
                    );
                })}

                {/* Profiles Dropdown */}
                <div className="space-y-1">
                    <button
                        onClick={() => setIsProfilesOpen(!isProfilesOpen)}
                        className={cn(
                            "w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group",
                            pathname.includes('/dashboard/profiles') || pathname.includes('/dashboard/listings')
                                ? "text-primary"
                                : "text-gray-400 hover:bg-white/5 hover:text-primary"
                        )}
                    >
                        <div className="flex items-center gap-3">
                            <Users className="h-5 w-5" />
                            <span>Profiller</span>
                        </div>
                        <ChevronRight className={cn("h-4 w-4 transition-transform duration-200", isProfilesOpen && "rotate-90")} />
                    </button>

                    {isProfilesOpen && (
                        <div className="pl-11 space-y-1 animate-in slide-in-from-top-2 duration-200">
                            {profileSubItems.map((subItem) => (
                                <Link
                                    key={subItem.href}
                                    href={subItem.href}
                                    className={cn(
                                        "block px-4 py-2 text-xs font-medium rounded-md transition-all",
                                        pathname === subItem.href
                                            ? "text-primary font-bold bg-primary/10"
                                            : "text-gray-500 hover:text-primary hover:bg-white/5"
                                    )}
                                >
                                    {subItem.label}
                                </Link>
                            ))}
                        </div>
                    )}
                </div>

                <div className="px-2 mt-6 mb-2 text-xs font-semibold text-primary/70 uppercase tracking-wider">
                    İçerik
                </div>
                {contentItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-gold-gradient text-black shadow-lg border-none"
                                    : "text-gray-400 hover:bg-white/5 hover:text-primary hover:pl-5"
                            )}
                        >
                            <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-gray-500")} />
                            <span className="relative z-10">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-white/5 bg-black/50 space-y-3">
                {isServiceRoleKeyMissing && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-3 animate-pulse">
                        <div className="flex items-center gap-2 mb-1 text-red-500">
                            <AlertTriangle className="h-4 w-4" />
                            <p className="text-[10px] font-black uppercase">Erişim Sorunu</p>
                        </div>
                        <p className="text-[9px] text-gray-400 font-bold leading-tight">
                            Service Role Key hatalı veya eksik. Admin verileri yüklenemiyor.
                        </p>
                    </div>
                )}

                <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <p className="text-xs text-primary/70 font-medium">Sistem Aktif</p>
                    </div>
                    <p className="font-mono text-[10px] text-gray-600">v1.2.0 • Gold Theme</p>
                </div>
            </div>
        </aside>
    );
}
