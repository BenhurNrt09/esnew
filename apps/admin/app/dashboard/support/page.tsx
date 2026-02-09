'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button } from '@repo/ui';
import { LifeBuoy, MessageSquare, Clock, User, CheckCircle2, ChevronRight, Search, Filter, Trash2, Loader2, AlertCircle, X, Send } from 'lucide-react';
import { cn } from '@repo/ui/src/lib/utils';

// ===== TICKET MODAL COMPONENT =====
function TicketModal({ ticket, onClose, onStatusChange }: { ticket: any; onClose: () => void; onStatusChange: (id: string, status: string) => void }) {
    const supabase = createClient();
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const init = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUser(user);
            loadMessages();
            const cleanup = subscribeToMessages();
            return cleanup;
        };
        init();
    }, [ticket.id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const loadMessages = async () => {
        setLoading(true);
        const { data } = await supabase
            .from('support_messages')
            .select('*')
            .eq('ticket_id', ticket.id)
            .order('created_at', { ascending: true });

        if (data) setMessages(data);
        setLoading(false);
    };

    const subscribeToMessages = () => {
        const channel = supabase
            .channel(`admin_modal_ticket_${ticket.id}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'support_messages',
                    filter: `ticket_id=eq.${ticket.id}`,
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
                ticket_id: ticket.id,
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
                .eq('id', ticket.id);

            setNewMessage('');
            onStatusChange(ticket.id, 'pending');
        }
        setSending(false);
    };

    const handleUpdateStatus = async (newStatus: string) => {
        const { error } = await supabase
            .from('support_tickets')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', ticket.id);

        if (!error) {
            onStatusChange(ticket.id, newStatus);
        }
    };

    return (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={onClose} />
            <div className="relative w-full max-w-4xl h-[85vh] bg-zinc-950 border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">

                {/* Modal Header */}
                <header className="p-6 border-b border-white/5 bg-black/40 shrink-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center",
                                ticket.status === 'open' ? "bg-green-500/10 text-green-500" :
                                    ticket.status === 'pending' ? "bg-orange-500/10 text-orange-500" : "bg-gray-500/20 text-gray-500"
                            )}>
                                <MessageSquare className="w-6 h-6" />
                            </div>
                            <div>
                                <div className="flex items-center gap-3">
                                    <h2 className="text-xl font-black text-white uppercase tracking-tighter">{ticket.subject}</h2>
                                    <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-lg text-[9px] font-black text-gray-500">#{ticket.id.slice(0, 8)}</span>
                                </div>
                                <div className="flex items-center gap-3 mt-1">
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-1">
                                        <User className="w-3 h-3" /> {ticket.user?.email || 'İsimsiz'}
                                    </span>
                                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-1">
                                        <Clock className="w-3 h-3" /> {new Date(ticket.created_at).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handleUpdateStatus('open')}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border",
                                    ticket.status === 'open' ? "bg-green-500 text-white border-transparent" : "bg-white/5 text-gray-500 border-white/10 hover:border-green-500/50"
                                )}
                            >
                                Açık
                            </button>
                            <button
                                onClick={() => handleUpdateStatus('closed')}
                                className={cn(
                                    "px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all border",
                                    ticket.status === 'closed' ? "bg-red-500 text-white border-transparent" : "bg-white/5 text-gray-500 border-white/10 hover:border-red-500/50"
                                )}
                            >
                                Kapat
                            </button>
                            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors ml-4">
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Messages Area */}
                <main className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar" ref={scrollRef}>
                    {loading ? (
                        <div className="flex items-center justify-center h-full">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-600">
                            <MessageSquare className="w-12 h-12 opacity-20 mb-4" />
                            <p className="text-xs font-black uppercase tracking-widest">Henüz mesaj yok</p>
                        </div>
                    ) : (
                        <div className="space-y-6 max-w-3xl mx-auto">
                            {messages.map((msg) => {
                                const isAdmin = msg.is_admin;
                                return (
                                    <div key={msg.id} className={cn(
                                        "flex flex-col max-w-[80%]",
                                        isAdmin ? "ml-auto items-end" : "mr-auto items-start"
                                    )}>
                                        <div className="flex items-center gap-2 mb-1.5 px-1 text-[9px] font-black text-gray-600 uppercase tracking-widest">
                                            <span className={cn(isAdmin ? "text-primary" : "text-gray-400")}>
                                                {isAdmin ? 'DESTEK EKİBİ' : (ticket.user?.email || 'KULLANICI')}
                                            </span>
                                        </div>
                                        <div className={cn(
                                            "p-5 rounded-[1.5rem] text-sm font-medium leading-relaxed shadow-xl",
                                            isAdmin
                                                ? "bg-primary text-black rounded-tr-sm"
                                                : "bg-black/60 text-white rounded-tl-sm border border-white/5"
                                        )}>
                                            {msg.message}
                                        </div>
                                        <span className="text-[9px] font-black text-gray-700 uppercase tracking-widest mt-1.5 px-1 flex items-center gap-1">
                                            <Clock className="w-2.5 h-2.5" /> {new Date(msg.created_at).toLocaleTimeString()}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </main>

                {/* Input Area */}
                {ticket.status !== 'closed' && (
                    <div className="p-6 border-t border-white/5 bg-black/40 shrink-0">
                        <form onSubmit={handleSendMessage} className="relative max-w-3xl mx-auto">
                            <textarea
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Kullanıcıya yanıt yazın..."
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pr-28 text-sm font-medium text-white outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-gray-700 resize-none h-20"
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
                                className="absolute right-3 bottom-3 h-14 px-6 bg-gold-gradient text-black rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                            >
                                <span className="text-[10px] font-black uppercase tracking-widest">{sending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Gönder'}</span>
                                {!sending && <Send className="w-4 h-4" />}
                            </button>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
}

// ===== MAIN PAGE COMPONENT =====
export default function AdminSupportPage() {
    const supabase = createClient();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [selectedTicket, setSelectedTicket] = useState<any>(null);

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        setLoading(true);
        // 1. Fetch tickets first (without join to avoid 400 error on auth.users)
        const { data: ticketsData, error: ticketsError } = await supabase
            .from('support_tickets')
            .select('*')
            .order('created_at', { ascending: false });

        if (ticketsError) {
            console.error('Error loading tickets:', ticketsError);
            setLoading(false);
            return;
        }

        if (ticketsData && ticketsData.length > 0) {
            const userIds = Array.from(new Set(ticketsData.map(t => t.user_id)));

            // 2. Fetch user details from all possible tables
            const [membersRes, modelsRes, agenciesRes] = await Promise.all([
                supabase.from('members').select('id, email').in('id', userIds),
                supabase.from('independent_models').select('id, email').in('id', userIds),
                supabase.from('agencies').select('id, email').in('id', userIds)
            ]);

            const allUsers = [
                ...(membersRes.data || []),
                ...(modelsRes.data || []),
                ...(agenciesRes.data || [])
            ];

            // 3. Merge data
            const combinedTickets = ticketsData.map(ticket => ({
                ...ticket,
                user: allUsers.find(u => u.id === ticket.user_id) || { email: 'Bilinmeyen Kullanıcı' }
            }));

            setTickets(combinedTickets);
        } else {
            setTickets([]);
        }
        setLoading(false);
    };

    const handleDeleteTicket = async (id: string) => {
        if (!confirm('Bu destek talebini silmek istediğinize emin misiniz?')) return;

        const { error } = await supabase
            .from('support_tickets')
            .delete()
            .eq('id', id);

        if (!error) {
            setTickets(prev => prev.filter(t => t.id !== id));
        }
    };

    const handleStatusChange = (id: string, newStatus: string) => {
        setTickets(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
        if (selectedTicket?.id === id) {
            setSelectedTicket((prev: any) => ({ ...prev, status: newStatus }));
        }
    };

    const filteredTickets = tickets.filter(t => {
        const matchesSearch = t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.user?.email?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">Talepler Yükleniyor...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black/40 p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <div className="space-y-2">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gold-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <LifeBuoy className="w-6 h-6 text-black" />
                        </div>
                        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Destek Yönetimi</h1>
                    </div>
                    <p className="text-gray-500 font-medium ml-16">Kullanıcı taleplerini yanıtlayın ve yönetin.</p>
                </div>
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        placeholder="Talep veya kullanıcı ara..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-black/40 border border-white/10 rounded-[1.5rem] pl-12 pr-6 py-4 text-sm font-medium text-white outline-none focus:ring-4 focus:ring-primary/10 transition-all placeholder:text-gray-700"
                    />
                </div>
                <div className="flex gap-2">
                    {['all', 'open', 'pending', 'closed'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={cn(
                                "px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border",
                                statusFilter === status
                                    ? "bg-gold-gradient text-black border-transparent shadow-lg shadow-primary/20"
                                    : "bg-black/40 text-gray-500 border-white/5 hover:border-white/20"
                            )}
                        >
                            {status === 'all' ? 'Tümü' : status === 'open' ? 'Açık' : status === 'pending' ? 'Cevaplandı' : 'Kapatıldı'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ticket List */}
            <div className="space-y-4">
                {filteredTickets.length === 0 ? (
                    <div className="bg-black/40 rounded-[2.5rem] border border-dashed border-white/10 p-20 text-center space-y-4">
                        <AlertCircle className="w-16 h-16 text-primary mx-auto opacity-20" />
                        <p className="text-sm font-bold text-gray-600 uppercase tracking-widest">Herhangi bir destek talebi bulunamadı.</p>
                    </div>
                ) : (
                    filteredTickets.map(ticket => (
                        <div key={ticket.id} className="group relative bg-black/40 hover:bg-black/60 border border-white/5 hover:border-primary/30 rounded-[2rem] p-6 transition-all duration-300 shadow-xl overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] group-hover:bg-primary/10 transition-colors pointer-events-none" />

                            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className={cn(
                                        "w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl",
                                        ticket.status === 'open' ? "bg-green-500/10 text-green-500" :
                                            ticket.status === 'pending' ? "bg-orange-500/10 text-orange-500" : "bg-gray-500/20 text-gray-500"
                                    )}>
                                        <MessageSquare className="w-7 h-7" />
                                    </div>
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-black text-white uppercase tracking-tight">{ticket.subject}</h3>
                                            <span className="px-2 py-0.5 rounded-lg border border-white/10 bg-white/5 text-[9px] font-black text-gray-500 uppercase tracking-widest">#{ticket.id.slice(0, 8)}</span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-widest">
                                                <User className="w-3.5 h-3.5" /> {ticket.user?.email || 'İsimsiz Kullanıcı'}
                                            </div>
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                                                <Clock className="w-3.5 h-3.5" /> {new Date(ticket.created_at).toLocaleString()}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={() => setSelectedTicket(ticket)}
                                        className="w-full md:w-auto h-12 px-8 bg-white/5 hover:bg-primary hover:text-black border border-white/10 hover:border-transparent rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                                    >
                                        Yanıtla
                                    </Button>
                                    <button
                                        onClick={() => handleDeleteTicket(ticket.id)}
                                        className="p-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all shadow-lg hover:shadow-red-500/20"
                                        title="Talebi Sil"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal */}
            {selectedTicket && (
                <TicketModal
                    ticket={selectedTicket}
                    onClose={() => setSelectedTicket(null)}
                    onStatusChange={handleStatusChange}
                />
            )}
        </div>
    );
}
