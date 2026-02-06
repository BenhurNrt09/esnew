'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardContent, Button } from '@repo/ui';
import { Bell, CheckCircle2, Clock, MessageSquare, User, Sparkles, Trash2 } from 'lucide-react';

export default function NotificationsPage() {
    const supabase = createClient();
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();

        // Subscribe to real-time notifications
        const channel = supabase
            .channel('realtime_notifications')
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'notifications'
            }, (payload) => {
                setNotifications(prev => [payload.new, ...prev]);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const loadNotifications = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data } = await supabase
            .from('notifications')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (data) setNotifications(data);
        setLoading(false);
    };

    const markAsRead = async (id: string) => {
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('id', id);

        if (!error) {
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
        }
    };

    const markAllAsRead = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        const { error } = await supabase
            .from('notifications')
            .update({ is_read: true })
            .eq('user_id', user?.id)
            .eq('is_read', false);

        if (!error) {
            setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        }
    };

    const deleteNotification = async (id: string) => {
        const { error } = await supabase
            .from('notifications')
            .delete()
            .eq('id', id);

        if (!error) {
            setNotifications(prev => prev.filter(n => n.id !== id));
        }
    };

    if (loading) return <div>Yükleniyor...</div>;

    const getIcon = (type: string) => {
        switch (type) {
            case 'view': return <User className="w-5 h-5 text-blue-500" />;
            case 'message': return <MessageSquare className="w-5 h-5 text-green-500" />;
            case 'comment': return <Sparkles className="w-5 h-5 text-purple-500" />;
            case 'story': return <Clock className="w-5 h-5 text-orange-500" />;
            default: return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Bildirimler</h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Hesabınızla ilgili anlık gelişmeleri takip edin.</p>
                </div>
                {notifications.some(n => !n.is_read) && (
                    <Button
                        onClick={markAllAsRead}
                        className="bg-primary text-white font-bold rounded-xl"
                    >
                        TÜMÜNÜ OKUNDU İŞARETLE
                    </Button>
                )}
            </div>

            <Card className="shadow-2xl shadow-gray-200/50 dark:shadow-none border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden bg-white dark:bg-[#0a0a0a]">
                <CardContent className="p-0">
                    <div className="divide-y divide-gray-50 dark:divide-white/5">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={`p-6 flex items-start justify-between hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors ${!n.is_read ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                            >
                                <div className="flex gap-4">
                                    <div className="mt-1 p-3 rounded-xl bg-white dark:bg-white/5 shadow-sm shrink-0 border border-gray-100 dark:border-white/5">
                                        {getIcon(n.type)}
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tighter text-sm">{n.title}</h3>
                                            {!n.is_read && <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{n.message}</p>
                                        <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest flex items-center gap-1.5">
                                            <Clock className="w-3 h-3" /> {new Date(n.created_at).toLocaleString('tr-TR')}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!n.is_read && (
                                        <button
                                            onClick={() => markAsRead(n.id)}
                                            className="p-2 text-gray-400 hover:text-primary transition-colors"
                                            title="Okundu İşaretle"
                                        >
                                            <CheckCircle2 className="w-5 h-5" />
                                        </button>
                                    )}
                                    <button
                                        onClick={() => deleteNotification(n.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Sil"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {notifications.length === 0 && (
                            <div className="py-20 text-center text-gray-400 font-bold">
                                <Bell className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p>Henüz bildiriminiz bulunmuyor.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
