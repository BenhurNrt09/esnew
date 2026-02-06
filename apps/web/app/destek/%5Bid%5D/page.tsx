'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button } from '@repo/ui';
import { LifeBuoy, Send, MessageSquare, Clock, User, CheckCircle2, ChevronLeft, Loader2, Image as ImageIcon, Mic, Video } from 'lucide-react';
import { cn } from '@repo/ui/src/lib/utils';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function TicketDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const supabase = createClient();
    const [ticket, setTicket] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [user, setUser] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                loadTicketData(user.id);
                subscribeToMessages();
            } else {
                setLoading(false);
            }
        };
        checkUser();
    }, [id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const loadTicketData = async (userId: string) => {
        setLoading(true);
        // Load Ticket
        const { data: ticketData, error: ticketError } = await supabase
            .from('support_tickets')
            .select('*')
            .eq('id', id)
            .single();

        if (ticketError || (ticketData.user_id !== userId && !await isAdmin(userId))) {
            router.push('/destek');
            return;
        }
        setTicket(ticketData);

        // Load Messages
        const { data: msgData } = await supabase
            .from('support_messages')
            .select('*')
            .eq('ticket_id', id)
            .order('created_at', { ascending: true });

        if (msgData) setMessages(msgData);
        setLoading(false);
    };

    const isAdmin = async (userId: string) => {
        const { data } = await supabase.from('users').select('role').eq('id', userId).single();
        return data?.role === 'admin';
    };

    const subscribeToMessages = () => {
        const channel = supabase
            .channel(`ticket_${id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'support_messages',
                    filter: `ticket_id=eq.${id}`,
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new]);
                }
            )
            .subscribe();

        return () => supabase.removeChannel(channel);
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !user || sending) return;

        setSending(true);
        const { error } = await supabase
            .from('support_messages')
            .insert({
                ticket_id: id,
                sender_id: user.id,
                message: newMessage.trim(),
                is_admin: await isAdmin(user.id),
                type: 'text'
            });

        if (!error) {
            setNewMessage('');
        }
        setSending(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">Talep Yükleniyor...</span>
                </div>
            </div>
        );
    }

    if (!ticket) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] flex flex-col">
            {/* Header */}
            <header className="bg-white dark:bg-black border-b border-gray-100 dark:border-white/5 sticky top-0 z-50">
                <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/destek" className="p-3 hover:bg-gray-50 dark:hover:bg-white/5 rounded-2xl transition-colors">
                            <ChevronLeft className="w-6 h-6 text-gray-400" />
                        </Link>
                        <div>
                            <div className="flex items-center gap-3">
                                <h1 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">{ticket.subject}</h1>
                                <span className={cn(
                                    "text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border",
                                    ticket.status === 'open' ? "border-green-500/20 text-green-500 bg-green-500/5" : "border-gray-500/20 text-gray-500 bg-gray-500/5"
                                )}>
                                    #{ticket.id.slice(0, 8)}
                                </span>
                            </div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Son Güncelleme: {new Date(ticket.updated_at).toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-4">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Durum</span>
                            <span className="text-sm font-black text-gray-900 dark:text-white uppercase">{ticket.status === 'open' ? 'İşlem Bekliyor' : 'Kapatıldı'}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <main className="flex-1 max-w-5xl w-full mx-auto p-6 overflow-y-auto space-y-8 custom-scrollbar" ref={scrollRef}>
                <div className="space-y-8 pb-32">
                    {messages.map((msg, index) => {
                        const isMe = msg.sender_id === user.id;
                        const isSystem = msg.is_admin;

                        return (
                            <div key={msg.id} className={cn(
                                "flex flex-col max-w-[85%] sm:max-w-[70%]",
                                isMe ? "ml-auto items-end" : "mr-auto items-start"
                            )}>
                                <div className="flex items-center gap-2 mb-2 px-1">
                                    {!isMe && (
                                        <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", isSystem ? "bg-primary text-black" : "bg-gray-200 dark:bg-white/10")}>
                                            {isSystem ? <LifeBuoy className="w-3 h-3" /> : <User className="w-3 h-3 text-gray-400" />}
                                        </div>
                                    )}
                                    <span className="text-[10px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest">
                                        {isMe ? 'SİZ' : (isSystem ? 'VELORA DESTEK' : 'KULLANICI')}
                                    </span>
                                </div>

                                <div className={cn(
                                    "p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-xl",
                                    isMe
                                        ? "bg-gold-gradient text-black rounded-tr-none"
                                        : (isSystem ? "bg-primary text-black rounded-tl-none" : "bg-white dark:bg-black text-gray-900 dark:text-white rounded-tl-none border border-gray-100 dark:border-white/5")
                                )}>
                                    {msg.message}
                                    {msg.file_url && (
                                        <div className="mt-4 pt-4 border-t border-black/10">
                                            {msg.type === 'image' && <img src={msg.file_url} className="rounded-xl max-w-full" alt="Attachment" />}
                                            {msg.type === 'video' && <video controls src={msg.file_url} className="rounded-xl max-w-full" />}
                                            {msg.type === 'audio' && <audio controls src={msg.file_url} />}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[9px] font-black text-gray-400 dark:text-gray-600 uppercase tracking-widest mt-2 px-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {new Date(msg.created_at).toLocaleTimeString()}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </main>

            {/* Input Area */}
            {ticket.status === 'open' && (
                <div className="bg-white dark:bg-black border-t border-gray-100 dark:border-white/5 p-6 sticky bottom-0">
                    <div className="max-w-5xl mx-auto">
                        <form onSubmit={handleSendMessage} className="relative group">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Mesajınızı yazın..."
                                className="w-full bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-[2.5rem] p-6 pr-32 text-sm font-medium text-gray-900 dark:text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-300 dark:placeholder:text-gray-800 resize-none h-24"
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage(e);
                                    }
                                }}
                            />
                            <div className="absolute right-4 bottom-4 flex items-center gap-2">
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim() || sending}
                                    className="h-16 px-8 bg-gold-gradient text-black rounded-[2rem] flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    <span className="text-xs font-black uppercase tracking-widest">{sending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'GÖNDER'}</span>
                                    {!sending && <Send className="w-4 h-4" />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
