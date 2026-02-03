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

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [user, setUser] = useState<any>(null);
    const [userType, setUserType] = useState<'member' | 'independent_model' | 'agency' | null>(null);
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                router.push('/login');
                return;
            }

            const type = user.user_metadata?.user_type || 'member';
            setUserType(type);

            let displayName = user.email?.split('@')[0];

            if (type === 'independent_model') {
                const { data: profile } = await supabase
                    .from('independent_models')
                    .select('username, display_name')
                    .eq('id', user.id)
                    .single();

                const { data: listing } = await supabase
                    .from('listings')
                    .select('title')
                    .eq('user_id', user.id)
                    .single();

                displayName = listing?.title || profile?.display_name || profile?.username || displayName;
            } else if (type === 'member') {
                const { data: profile } = await supabase
                    .from('members')
                    .select('username, first_name, last_name')
                    .eq('id', user.id)
                    .single();

                if (profile) {
                    displayName = profile.first_name && profile.last_name
                        ? `${profile.first_name} ${profile.last_name}`
                        : profile.username || displayName;
                }
            }

            setUser({ ...user, displayName });

            // Initial unread count
            const { count } = await supabase
                .from('notifications')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
                .eq('is_read', false);

            setUnreadCount(count || 0);

            // Real-time subscription
            const channel = supabase
                .channel(`dashboard_notifications_${user.id}`)
                .on('postgres_changes', {
                    event: '*',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${user.id}`
                }, () => {
                    // Refetch count on any change
                    supabase
                        .from('notifications')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id)
                        .eq('is_read', false)
                        .then(({ count }) => setUnreadCount(count || 0));
                })
                .subscribe();

            setLoading(false);

            return () => {
                supabase.removeChannel(channel);
            };
        };
        checkUser();
    }, []);

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

    const menuItems = allMenuItems.filter(item => userType && item.roles.includes(userType));

    if (loading) return <div className="min-h-screen flex items-center justify-center">Yükleniyor...</div>;

    const roleLabels = {
        member: 'Üye',
        independent_model: 'Bağımsız Model',
        agency: 'Ajans'
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Mobile Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-[998] lg:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed lg:sticky top-0 h-screen w-72 bg-white border-r border-gray-100 flex flex-col z-[999] transform transition-transform duration-300 lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                {/* Close button for mobile */}
                <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="lg:hidden absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <X className="w-5 h-5 text-gray-500" />
                </button>

                <div className="p-8">
                    <Link href="/" className="text-2xl font-black text-primary tracking-tighter uppercase">
                        VALORA<span className="text-gray-900">ESCORT</span>
                    </Link>
                </div>

                <nav className="flex-1 px-4 space-y-1">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center justify-between px-4 py-3 rounded-xl transition-all group",
                                    isActive
                                        ? "bg-primary text-white shadow-lg shadow-primary/20"
                                        : "text-gray-500 hover:bg-gray-50 hover:text-primary"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <item.icon className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400 group-hover:text-primary")} />
                                    <span className="font-bold text-sm tracking-tight">{item.name}</span>
                                </div>
                                {item.href === '/dashboard/notifications' && unreadCount > 0 && (
                                    <span className="bg-white text-primary text-[10px] font-black px-1.5 py-0.5 rounded-full ring-2 ring-primary">
                                        {unreadCount}
                                    </span>
                                )}
                                {isActive && <ChevronRight className="w-4 h-4" />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={() => supabase.auth.signOut().then(() => router.push('/'))}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-bold text-sm"
                    >
                        <LogOut className="w-5 h-5" />
                        Çıkış Yap
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <header className="h-16 lg:h-20 bg-white border-b border-gray-100 px-4 lg:px-8 flex items-center justify-between">
                    {/* Mobile Hamburger */}
                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6 text-gray-700" />
                    </button>

                    <h2 className="text-base lg:text-xl font-black text-gray-900 uppercase tracking-tighter">
                        {menuItems.find(i => i.href === pathname)?.name || 'Panel'}
                    </h2>

                    <div className="flex items-center gap-6">
                        <Link href="/dashboard/notifications" className="relative p-2 text-gray-400 hover:text-primary transition-colors">
                            <Bell className="w-6 h-6" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-primary text-white text-[10px] font-black flex items-center justify-center rounded-full ring-2 ring-white">
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                        <div className="flex flex-col items-end">
                            <span className="text-sm font-black text-gray-900">{user.displayName}</span>
                            <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{roleLabels[userType as keyof typeof roleLabels]}</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold">
                            {user.displayName[0].toUpperCase()}
                        </div>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
