'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input } from '@repo/ui';
import { LifeBuoy, Send, MessageSquare, Clock, AlertCircle, CheckCircle2, ChevronRight, Plus, Loader2 } from 'lucide-react';
import { cn } from '@repo/ui/src/lib/utils';
import Link from 'next/link';

export default function SupportPage() {
    const supabase = createClient();
    const [tickets, setTickets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setUser(user);
            if (user) {
                loadTickets(user.id);
            } else {
                setLoading(false);
            }
        };
        checkUser();
    }, []);

    const loadTickets = async (userId: string) => {
        setLoading(true);
        const { data, error } = await supabase
            .from('support_tickets')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (data) setTickets(data);
        setLoading(false);
    };

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!subject.trim() || !message.trim() || !user || submitting) return;

        setSubmitting(true);
        try {
            const { data: ticket, error: ticketError } = await supabase
                .from('support_tickets')
                .insert({
                    user_id: user.id,
                    subject: subject.trim(),
                    status: 'open',
                    priority: 'medium'
                })
                .select()
                .single();

            if (ticketError) throw ticketError;

            const { error: messageError } = await supabase
                .from('support_messages')
                .insert({
                    ticket_id: ticket.id,
                    sender_id: user.id,
                    message: message.trim(),
                    is_admin: false
                });

            if (messageError) throw messageError;

            setSubject('');
            setMessage('');
            setShowCreateForm(false);
            loadTickets(user.id);
        } catch (error) {
            console.error('Error creating ticket:', error);
            alert('Destek talebi oluşturulurken bir hata oluştu.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A]">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                    <span className="text-xs font-black uppercase tracking-widest text-gray-500">Yükleniyor...</span>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A] px-6">
                <div className="max-w-md w-full bg-white dark:bg-black border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-12 text-center shadow-2xl space-y-8">
                    <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary border border-primary/20">
                        <AlertCircle className="w-12 h-12" />
                    </div>
                    <div className="space-y-3">
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Giriş Yapmalısınız</h1>
                        <p className="text-gray-500 font-medium">Destek talebi oluşturmak ve geçmiş taleplerinizi görmek için lütfen giriş yapın.</p>
                    </div>
                    <Link href="/login" className="block">
                        <Button className="w-full h-16 bg-gold-gradient text-black font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform">
                            Giriş Yap
                        </Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#050505] py-12 px-4 md:px-8">
            <div className="max-w-5xl mx-auto space-y-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gold-gradient rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                                <LifeBuoy className="w-6 h-6 text-black" />
                            </div>
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Destek Merkezi</h1>
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium ml-15">Tüm destek taleplerinizi buradan yönetebilirsiniz.</p>
                    </div>
                    <button
                        onClick={() => setShowCreateForm(true)}
                        className="bg-gold-gradient text-black font-black px-8 py-4 rounded-2xl flex items-center gap-3 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all uppercase tracking-widest text-xs"
                    >
                        <Plus className="w-5 h-5" /> Yeni Talep Oluştur
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Ticket List */}
                    <div className="lg:col-span-2 space-y-4">
                        <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-600 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" /> Aktif Talepleriniz
                        </h2>

                        {tickets.length === 0 ? (
                            <div className="bg-white dark:bg-black rounded-[2rem] p-16 text-center border border-gray-100 dark:border-white/5 space-y-4">
                                <MessageSquare className="w-16 h-16 text-primary mx-auto opacity-20" />
                                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Henüz bir destek talebiniz bulunmuyor.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {tickets.map(ticket => (
                                    <Link key={ticket.id} href={`/destek/${ticket.id}`} className="block group">
                                        <div className="bg-white dark:bg-black border border-gray-100 dark:border-white/5 rounded-3xl p-6 shadow-xl transition-all hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className={cn(
                                                    "w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg",
                                                    ticket.status === 'open' ? "bg-green-500/10 text-green-500" :
                                                        ticket.status === 'pending' ? "bg-orange-500/10 text-orange-500" : "bg-gray-500/10 text-gray-500"
                                                )}>
                                                    {ticket.status === 'open' ? <Clock className="w-6 h-6" /> :
                                                        ticket.status === 'pending' ? <MessageSquare className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                                                </div>
                                                <div className="space-y-1">
                                                    <h3 className="font-black text-gray-900 dark:text-white uppercase tracking-tight group-hover:text-primary transition-colors">{ticket.subject}</h3>
                                                    <div className="flex items-center gap-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {new Date(ticket.created_at).toLocaleDateString()}</span>
                                                        <span className={cn(
                                                            "px-2 py-0.5 rounded-full border",
                                                            ticket.priority === 'high' ? "border-red-500/20 text-red-500 bg-red-500/5" :
                                                                "border-primary/20 text-primary bg-primary/5"
                                                        )}>{ticket.priority}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <span className={cn(
                                                    "text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl border",
                                                    ticket.status === 'open' ? "border-green-500/20 text-green-500 bg-green-500/5" :
                                                        ticket.status === 'pending' ? "border-orange-500/20 text-orange-500 bg-orange-500/5" : "border-gray-500/20 text-gray-500 bg-gray-500/5"
                                                )}>
                                                    {ticket.status === 'open' ? 'Açık' : ticket.status === 'pending' ? 'Cevaplandı' : 'Kapatıldı'}
                                                </span>
                                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:translate-x-1 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Quick Support Info */}
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-black border border-gray-100 dark:border-white/5 rounded-[2rem] p-8 shadow-xl space-y-6">
                            <h2 className="text-xs font-black uppercase tracking-[0.2em] text-gray-900 dark:text-white">Bilgilendirme</h2>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <Clock className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Cevap Süresi</h4>
                                        <p className="text-xs text-gray-500 italic mt-1">Talepleriniz genellikle 2 saat içerisinde yanıtlanır.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-10 h-10 shrink-0 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                                        <Plus className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">Net Olun</h4>
                                        <p className="text-xs text-gray-500 italic mt-1">Hızlı çözüm için sorununuzu detaylı ve net şekilde açıklayın.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Ticket Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 z-[10000] flex items-center justify-center px-4">
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={() => !submitting && setShowCreateForm(false)} />
                    <div className="relative w-full max-w-2xl bg-white dark:bg-[#0A0A0A] border border-gray-100 dark:border-white/5 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => !submitting && setShowCreateForm(false)}
                            className="absolute top-6 right-6 p-3 hover:bg-gray-100 dark:hover:bg-white/5 rounded-2xl transition-colors text-gray-400"
                        >
                            <X className="w-6 h-6" />
                        </button>

                        <div className="space-y-8">
                            <div className="space-y-2">
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">Yeni Destek Talebi</h3>
                                <p className="text-gray-500 font-medium">Lütfen sorununuzu özetleyen bir başlık ve detaylı bir açıklama girin.</p>
                            </div>

                            <form onSubmit={handleCreateTicket} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] ml-2">Konu Başlığı</label>
                                    <Input
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="Örn: Ödeme sorunu, Profil düzenleme vb."
                                        className="h-16 px-6 bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 rounded-2xl font-bold transition-all focus:ring-4 focus:ring-primary/10"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-gray-500 tracking-[0.2em] ml-2">Mesajınız</label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Yaşadığınız sorunu detaylıca anlatın..."
                                        className="w-full h-40 px-6 py-4 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl font-bold text-gray-900 dark:text-white transition-all focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none placeholder:text-gray-400"
                                    />
                                </div>
                                <Button
                                    className="w-full h-16 bg-gold-gradient text-black font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                                    disabled={submitting || !subject.trim() || !message.trim()}
                                >
                                    {submitting ? <Loader2 className="w-6 h-6 animate-spin" /> : "Talebi Gönder"}
                                </Button>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function X({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    )
}
