'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button } from '@repo/ui';
import { LifeBuoy, MessageSquare, Clock, User, CheckCircle2, ChevronRight, Search, Filter, Trash2, Loader2, AlertCircle } from 'lucide-react';
import { cn } from '@repo/ui/src/lib/utils';
import Link from 'next/link';

export default function AdminSupportPage() {
    const supabase = createClient();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadTickets();
    }, []);

    const loadTickets = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('support_tickets')
            .select(`
                *,
                user:user_id (id, email)
            `)
            .order('created_at', { ascending: false });

        if (data) setTickets(data);
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
                            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[60px] group-hover:bg-primary/10 transition-colors" />

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
                                    <Link href={`/dashboard/support/${ticket.id}`} className="flex-1 md:flex-none">
                                        <Button className="w-full md:w-auto h-12 px-8 bg-white/5 hover:bg-primary hover:text-black border border-white/10 hover:border-transparent rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                                            Yanıtla
                                        </Button>
                                    </Link>
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
        </div>
    );
}
