'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@repo/lib/i18n';
import { LayoutDashboard, MapPin, Layers, Users, Star, Image as ImageIcon, BarChart3, ChevronRight, AlertTriangle, LogOut, LifeBuoy } from 'lucide-react';
import { cn } from '@repo/ui';

export function Sidebar({ isServiceRoleKeyMissing }: { isServiceRoleKeyMissing?: boolean }) {
    const pathname = usePathname();
    const { t } = useLanguage();

    // User Fetching Logic
    const [userName, setUserName] = useState<string>('');
    const [loading, setLoading] = useState(true);

    const [isProfilesOpen, setIsProfilesOpen] = useState(pathname.includes('/dashboard/profiles'));

    const managementItems = [
        { href: '/dashboard', label: t.nav.dashboard, icon: LayoutDashboard },
        { href: '/dashboard/stats', label: 'İstatistikler', icon: BarChart3 },
        { href: '/dashboard/support', label: 'Destek Talepleri', icon: LifeBuoy },
    ];

    const contentItems = [
        { href: '/dashboard/categories', label: t.nav.categories, icon: Layers },
        { href: '/dashboard/cities', label: t.nav.cities, icon: MapPin },
        { href: '/dashboard/features', label: t.nav.features, icon: Star },
        { href: '/dashboard/ads', label: 'Reklamlar', icon: ImageIcon },
    ];

    const profileSubItems = [
        { href: '/dashboard/profiles/models/new', label: '+ Yeni Profil Ekle' },
        { href: '/dashboard/profiles/pending', label: 'Onay Bekleyenler' },
        { href: '/dashboard/profiles/active', label: 'Onaylanan Profiller' },
        { href: '/dashboard/profiles/featured', label: 'Vitrindeki Profiller' },
        { href: '/dashboard/profiles/models', label: 'Bireysel Modeller' },
        { href: '/dashboard/profiles/members', label: 'Üye Profilleri' },
        { href: '/dashboard/profiles/agencies', label: 'Ajans/Şirket Profilleri' },
    ];

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const { createClient } = await import('@repo/lib/supabase/client');
                const supabase = createClient();
                const { data: { user }, error: authError } = await supabase.auth.getUser();

                if (authError) throw authError;

                if (user) {
                    const meta = user.user_metadata || {};
                    let displayName = meta.original_username || meta.display_name || meta.username || user.email?.split('@')[0] || 'Admin';
                    setUserName(displayName.charAt(0).toUpperCase() + displayName.slice(1));
                }
            } catch (err) {
                console.error('Error fetching user:', err);
                setUserName('Admin');
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    const handleLogout = async () => {
        const { createClient } = await import('@repo/lib/supabase/client');
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    return (
        <aside className="w-64 bg-black border-r border-white/10 hidden md:flex flex-col h-full text-white shadow-xl z-20">
            <div className="h-16 flex items-center px-6 border-b border-white/10 bg-black">
                <Link href="/dashboard" className="text-lg font-black tracking-tighter flex items-center uppercase gap-0.5">
                    <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-[--gold-start] to-[--gold-end]">Velora</span>
                    <span className="text-white mx-1 font-bold">Escort</span>
                    <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-[--gold-start] to-[--gold-end]">World</span>
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
                                "flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-gold-gradient text-black shadow-lg border-none"
                                    : "text-gray-300 hover:bg-white/5 hover:text-primary hover:pl-5"
                            )}
                        >
                            <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-gray-400")} />
                            <span className="relative z-10">{item.label}</span>
                        </Link>
                    );
                })}

                {/* Profiles Dropdown */}
                <div className="space-y-1">
                    <button
                        onClick={() => setIsProfilesOpen(!isProfilesOpen)}
                        className={cn(
                            "w-full flex items-center justify-between px-4 py-3 text-sm font-bold rounded-lg transition-all duration-200 group",
                            pathname.includes('/dashboard/profiles') || pathname.includes('/dashboard/listings')
                                ? "text-primary"
                                : "text-gray-300 hover:bg-white/5 hover:text-primary"
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
                                        "block px-4 py-2 text-xs font-bold rounded-md transition-all",
                                        pathname === subItem.href
                                            ? "text-primary font-black bg-primary/10"
                                            : "text-gray-300 hover:text-primary hover:bg-white/5"
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
                                "flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-all duration-200 group relative overflow-hidden",
                                isActive
                                    ? "bg-gold-gradient text-black shadow-lg border-none"
                                    : "text-gray-300 hover:bg-white/5 hover:text-primary hover:pl-5"
                            )}
                        >
                            <Icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-primary" : "text-gray-400")} />
                            <span className="relative z-10">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Bar */}
            <div className="p-4 border-t border-white/10 bg-black/50">
                <div className="bg-white/5 rounded-xl p-3 border border-white/5 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center text-black font-black text-lg shadow-lg">
                            {userName.charAt(0) || 'A'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-white truncate">{loading ? '...' : userName}</p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <span className="text-[10px] text-gray-400 font-medium">Çevrimiçi</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                        {/* Language Switcher - Integrated manually to style properly */}
                        <LanguageSwitcherSidebar />

                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 hover:text-red-400 text-xs font-bold py-2 rounded-lg transition-colors border border-red-500/10"
                        >
                            <LogOut className="w-3.5 h-3.5" />
                            Çıkış
                        </button>
                    </div>
                </div>
            </div>
        </aside>
    );
}

// Inline Language Switcher for Sidebar due to specific styling needs
function LanguageSwitcherSidebar() {
    const { language, setLanguage } = useLanguage();
    return (
        <button
            onClick={() => setLanguage(language === 'tr' ? 'en' : 'tr')}
            className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white text-xs font-bold py-2 rounded-lg transition-colors border border-white/5"
        >
            {/* Using images for flags because Windows doesn't render flag emojis */}
            {language === 'tr' ? (
                <>
                    <img src="https://flagcdn.com/w20/tr.png" alt="TR" className="w-4 h-3 rounded-[2px]" />
                    <span>TR</span>
                </>
            ) : (
                <>
                    <img src="https://flagcdn.com/w20/gb.png" alt="EN" className="w-4 h-3 rounded-[2px]" />
                    <span>EN</span>
                </>
            )}
        </button>
    );
}
