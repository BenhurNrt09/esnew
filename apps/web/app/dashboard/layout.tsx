'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, User, DollarSign, MessageSquare,
    Settings, Camera, LogOut, ChevronRight,
    Bell, Star, BarChart3, Menu, X
} from 'lucide-react';
import { cn } from '@repo/ui/src/lib/utils';
import { useAuth } from '../components/AuthProvider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading: authLoading } = useAuth();
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [layoutReady, setLayoutReady] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const failsafe = setTimeout(() => {
            if (!layoutReady) {
                console.warn('DashboardLayout failsafe triggered');
                setLayoutReady(true);
            }
        }, 5000);

        if (!authLoading) {
            if (!user) {
                router.push('/login');
            } else {
                setLayoutReady(true);
            }
        }

        return () => clearTimeout(failsafe);
    }, [user, authLoading]);

    useEffect(() => {
        if (!user) return;

        let isMounted = true;
        let channel: any = null;

        const loadNotifications = async () => {
            try {
                const { count } = await supabase
                    .from('notifications')
                    .select('*', { count: 'exact', head: true })
                    .eq('user_id', user.id)
                    .eq('is_read', false);

                if (isMounted) setUnreadCount(count || 0);

                // Real-time subscription
                channel = supabase
                    .channel(`dashboard_notifications_${user.id}`)
                    .on('postgres_changes', {
                        event: '*',
                        schema: 'public',
                        table: 'notifications',
                        filter: `user_id=eq.${user.id}`
                    }, () => {
                        supabase
                            .from('notifications')
                            .select('*', { count: 'exact', head: true })
                            .eq('user_id', user.id)
                            .eq('is_read', false)
                            .then(({ count }) => {
                                if (isMounted) setUnreadCount(count || 0);
                            });
                    })
                    .subscribe();
            } catch (err) {
                console.error('Error loading notifications:', err);
            }
        };

        loadNotifications();

        return () => {
            isMounted = false;
            if (channel) supabase.removeChannel(channel);
        };
    }, [user]);

    const userType = (user as any)?.userType || 'member';
    const isAdmin = (user as any)?.isAdmin === true;

    const allMenuItems = [
        { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['member', 'independent_model', 'agency'] },
        { name: 'Profilim', href: '/dashboard/profile', icon: User, roles: ['member', 'independent_model', 'agency'] },
        { name: 'Favoriler', href: '/dashboard/favorites', icon: Star, roles: ['member'] },
        { name: 'Medya & Hikayeler', href: '/dashboard/media', icon: Camera, roles: ['independent_model', 'agency'] },
        { name: 'Fiyatlandırma', href: '/dashboard/pricing', icon: DollarSign, roles: ['independent_model', 'agency'] },
        { name: 'Yorumlar', href: '/dashboard/comments', icon: MessageSquare, roles: ['member', 'independent_model', 'agency'] },
        { name: 'İstatistikler', href: '/dashboard/stats', icon: BarChart3, roles: ['independent_model', 'agency'] },
        { name: 'Bildirimler', href: '/dashboard/notifications', icon: Bell, roles: ['member', 'independent_model', 'agency'] },
        { name: 'Ayarlar', href: '/dashboard/settings', icon: Settings, roles: ['member', 'independent_model', 'agency'] },
    ];

    const menuItems = allMenuItems.filter(item =>
        isAdmin || (userType && item.roles.includes(userType as string))
    );

    if (!layoutReady) return <div className="min-h-screen flex items-center justify-center font-black text-gray-400 uppercase tracking-widest text-xs animate-pulse">Yükleniyor...</div>;

    if (!user) return null; // Avoid rendering content if redirecting

    const roleLabels = {
        member: 'Üye',
        independent_model: 'Bağımsız Model',
        agency: 'Ajans'
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex w-80 bg-white border-r border-gray-100 flex-col sticky top-0 h-screen transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
                <div className="p-10">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform shadow-lg shadow-primary/20">
                            <LayoutDashboard className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-black uppercase tracking-tighter">Panel</span>
                    </Link>
                </div>

                <nav className="flex-1 px-6 space-y-2 mt-4">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between px-6 py-4 rounded-2xl transition-all duration-300 group",
                                    isActive
                                        ? "bg-primary text-white shadow-xl shadow-primary/30 -translate-y-0.5"
                                        : "text-gray-400 hover:bg-gray-50 hover:text-gray-900"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <Icon className={cn("w-5 h-5", isActive ? "text-white" : "group-hover:text-primary transition-colors")} />
                                    <span className="font-bold text-sm tracking-tight uppercase">{item.name}</span>
                                </div>
                                {item.name === 'Bildirimler' && unreadCount > 0 && (
                                    <span className={cn(
                                        "w-5 h-5 rounded-lg flex items-center justify-center text-[10px] font-black",
                                        isActive ? "bg-white text-primary" : "bg-primary text-white"
                                    )}>
                                        {unreadCount}
                                    </span>
                                )}
                                {isActive && <ChevronRight className="w-4 h-4" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-8 border-t border-gray-50">
                    <div className="bg-gray-50 rounded-3xl p-6 flex items-center gap-4 group cursor-pointer hover:bg-white hover:shadow-xl transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                            <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black uppercase tracking-widest text-xs">
                                {user.displayName?.[0] || user.email?.[0] || 'U'}
                            </div>
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-black text-gray-900 truncate tracking-tight text-sm uppercase">{user.displayName || 'Kullanıcı'}</p>
                            <p className="text-[10px] font-black text-primary uppercase tracking-widest opacity-60">
                                {user.isAdmin ? 'Yönetici' : (roleLabels[userType as keyof typeof roleLabels] || 'Üye')}
                            </p>
                        </div>
                        <button
                            onClick={() => supabase.auth.signOut()}
                            className="w-10 h-10 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center text-gray-300"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Menu Overlay */}
            <div className={cn(
                "lg:hidden fixed inset-0 z-[60] bg-gray-900/60 backdrop-blur-sm transition-opacity duration-300",
                isMobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            )} onClick={() => setIsMobileMenuOpen(false)} />

            {/* Mobile Menu Drawer */}
            <aside className={cn(
                "lg:hidden fixed inset-y-0 left-0 z-[70] w-80 bg-white shadow-2xl transition-transform duration-500 ease-out flex flex-col",
                isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="p-8 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                            <LayoutDashboard className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-black uppercase tracking-tighter">Panel</span>
                    </Link>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-gray-50 rounded-xl">
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={cn(
                                    "flex items-center gap-4 px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px]",
                                    isActive ? "bg-primary text-white" : "text-gray-400"
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                {/* Header Mobile */}
                <header className="lg:hidden h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-50">
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-3 bg-gray-50 rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <Link href="/dashboard" className="text-xl font-black uppercase tracking-tighter">Panel</Link>
                    <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary font-black uppercase tracking-widest text-xs">
                        {user.displayName?.[0] || user.email?.[0] || 'U'}
                    </div>
                </header>

                <div className="flex-1 p-6 lg:p-12 overflow-y-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
