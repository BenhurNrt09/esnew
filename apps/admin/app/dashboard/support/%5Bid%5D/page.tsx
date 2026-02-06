'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button } from '@repo/ui';
import { LifeBuoy, Send, MessageSquare, Clock, User, CheckCircle2, ChevronLeft, Loader2, Image as ImageIcon, Mic, Video, Trash2, XCircle } from 'lucide-react';
import { cn } from '@repo/ui/src/lib/utils';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function AdminTicketDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const supabase = createClient();
    const [ticket, setTicket] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);
            if (user) {
                loadTicketData();
                subscribeToMessages();
            }
        };
        checkUser();
    }, [id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const loadTicketData = async () => {
        setLoading(true);
        // Load Ticket with User Info
        const { data: ticketData, error: ticketError } = await supabase
            .from('support_tickets')
            .select(`
                *,
                user:user_id (id, email)
            `)
            .eq('id', id)
            .single();

        if (ticketError) {
            router.push('/dashboard/support');
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

    const subscribeToMessages = () => {
        const channel = supabase
            .channel(`admin_ticket_${id}`)
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
        if (!newMessage.trim() || !currentUser || sending) return;

        setSending(true);
        const { error } = await supabase
            .from('support_messages')
            .insert({
                ticket_id: id,
                sender_id: currentUser.id,
                message: newMessage.trim(),
                is_admin: true,
                type: 'text'
            });

        if (!error) {
            // Update ticket status to 'pending' (answered)
            await supabase
                .from('support_tickets')
                .update({ status: 'pending', updated_at: new Date().toISOString() })
                .eq('id', id);

            setNewMessage('');
            setTicket((prev: any) => ({ ...prev, status: 'pending' }));
        }
        setSending(false);
    };

    const handleUpdateStatus = async (newStatus: string) => {
        const { error } = await supabase
            .from('support_tickets')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', id);

        if (!error) {
            setTicket((prev: any) => ({ ...prev, status: newStatus }));
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
            </div>
        );
    }

    if (!ticket) return null;

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)] bg-black/40 border border-white/5 rounded-[2.5rem] overflow-hidden shadow-2xl animate-in fade-in duration-700">
            {/* Header */}
            <header className="p-8 border-b border-white/5 bg-black/20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <Link href="/dashboard/support" className="p-3 hover:bg-white/5 rounded-2xl transition-colors text-gray-400">
                            <ChevronLeft className="w-6 h-6" />
                        </Link>
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-black text-white uppercase tracking-tighter">{ticket.subject}</h1>
                                <span className="px-3 py-1 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-gray-500 uppercase tracking-widest">#{ticket.id.slice(0, 8)}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                                    <User className="w-3.5 h-3.5" /> {ticket.user?.email}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleUpdateStatus('open')}
                            className={cn(
                                "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                ticket.status === 'open' ? "bg-green-500 text-white border-transparent" : "bg-white/5 text-gray-500 border-white/10 hover:border-white/20"
                            )}
                        >
                            AÇIK
                        </button>
                        <button
                            onClick={() => handleUpdateStatus('closed')}
                            className={cn(
                                "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                ticket.status === 'closed' ? "bg-red-500 text-white border-transparent" : "bg-white/5 text-gray-500 border-white/10 hover:border-white/20"
                            )}
                        >
                            KAPAT
                        </button>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <main className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar relative" ref={scrollRef}>
                <div className="space-y-8 max-w-4xl mx-auto">
                    {messages.map((msg) => {
                        const isMe = msg.is_admin;
                        return (
                            <div key={msg.id} className={cn(
                                "flex flex-col max-w-[85%]",
                                isMe ? "ml-auto items-end" : "mr-auto items-start"
                            )}>
                                <div className="flex items-center gap-2 mb-2 px-1 text-[10px] font-black text-gray-600 uppercase tracking-widest">
                                    <span className={cn(isMe ? "text-primary" : "text-gray-400")}>
                                        {isMe ? 'SİZ (ADMİN)' : (ticket.user?.email || 'KULLANICI')}
                                    </span>
                                </div>
                                <div className={cn(
                                    "p-6 rounded-[2rem] text-sm font-medium leading-relaxed shadow-2xl",
                                    isMe
                                        ? "bg-primary text-black rounded-tr-none shadow-primary/10"
                                        : "bg-black/60 text-white rounded-tl-none border border-white/5"
                                )}>
                                    {msg.message}
                                    {msg.file_url && (
                                        <div className="mt-4 pt-4 border-t border-white/5">
                                            {msg.type === 'image' && <img src={msg.file_url} className="rounded-xl max-w-full" alt="Attachment" />}
                                            {msg.type === 'video' && <video controls src={msg.file_url} className="rounded-xl max-w-full" />}
                                            {msg.type === 'audio' && <audio controls src={msg.file_url} />}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest mt-2 px-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {new Date(msg.created_at).toLocaleString()}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </main>

            {/* Input Area */}
            {ticket.status !== 'closed' && (
                <div className="p-8 border-t border-white/5 bg-black/20">
                    <form onSubmit={handleSendMessage} className="relative max-w-4xl mx-auto group">
                        <textarea
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Kullanıcıya yanıt yazın..."
                            className="w-full bg-black/40 border border-white/10 rounded-[2.5rem] p-6 pr-40 text-sm font-medium text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-700 resize-none h-28"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage(e);
                                }
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!newMessage.trim() || sending}
                            className="absolute right-4 bottom-4 h-20 px-10 bg-gold-gradient text-black rounded-[2rem] flex items-center gap-3 shadow-2xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                        >
                            <span className="text-xs font-black uppercase tracking-widest">{sending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'YANITLA'}</span>
                            {!sending && <Send className="w-4 h-4" />}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
