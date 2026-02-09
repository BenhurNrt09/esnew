'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, useToast } from '@repo/ui';
import { MessageSquare, CornerDownRight, Send, Star, AlertCircle, User, ShieldCheck, Heart, X, Clock, Award, Zap } from 'lucide-react';

export default function CommentsPage() {
    const toast = useToast();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [userType, setUserType] = useState<string | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [replyText, setReplyText] = useState<Record<string, string>>({});
    const [selectedComment, setSelectedComment] = useState<any>(null);
    const [listingId, setListingId] = useState<string | null>(null);

    useEffect(() => { loadComments(); }, []);

    const loadComments = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const type = user.user_metadata?.user_type || 'member';
        setUserType(type);

        if (type === 'independent_model' || type === 'agency' || type === 'agency_owner') {
            // Fetch all listings for this owner to get aggregate comments
            const { data: userListings } = await supabase.from('listings').select('id, title').eq('user_id', user.id);
            const listingIds = userListings?.map(l => l.id) || [];

            if (listingIds.length > 0) {
                const { data } = await supabase
                    .from('comments')
                    .select('*, listings(title, slug)')
                    .in('listing_id', listingIds)
                    .is('parent_id', null)
                    .order('created_at', { ascending: false });

                if (data) {
                    const enriched = await Promise.all(data.map(async (comment) => {
                        const { data: replies } = await supabase
                            .from('comments')
                            .select('*')
                            .eq('parent_id', comment.id)
                            .order('created_at', { ascending: true });

                        // Get member name
                        const { data: member } = await supabase
                            .from('members')
                            .select('username')
                            .eq('id', comment.user_id)
                            .single();

                        return { ...comment, replies: replies || [], username: member?.username || 'Anonim' };
                    }));
                    setComments(enriched);
                }
            }
        } else {
            // Member view: My reviews
            const { data } = await supabase
                .from('comments')
                .select('*, listings(title, slug)')
                .eq('user_id', user.id)
                .is('parent_id', null)
                .order('created_at', { ascending: false });

            if (data) {
                const enriched = await Promise.all(data.map(async (comment) => {
                    const { data: replies } = await supabase
                        .from('comments')
                        .select('*')
                        .eq('parent_id', comment.id)
                        .order('created_at', { ascending: true });
                    return { ...comment, replies: replies || [] };
                }));
                setComments(enriched);
            }
        }
        setLoading(false);
    };

    const handleReply = async (commentId: string) => {
        const text = replyText[commentId];
        if (!text) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { error } = await supabase.from('comments').insert({
                listing_id: listingId || comments.find(c => c.id === commentId)?.listing_id,
                user_id: user?.id,
                content: text,
                parent_id: commentId,
                is_approved: true
            });

            if (error) throw error;
            toast.success('Cevabınız gönderildi.');
            setReplyText({ ...replyText, [commentId]: '' });
            loadComments();
        } catch (err: any) {
            toast.error('Hata: ' + err.message);
        }
    };

    const getPhotoAccuracyLabel = (val: string | number) => {
        const labels: Record<string, string> = {
            'real': 'Gerçek',
            '10p': '%10 PS',
            '20p': '%20 PS',
            '30p': '%30 PS',
            '40p': '%40 PS',
            'ai': 'AI / Filtre'
        };
        return labels[val.toString()] || val.toString();
    };

    const isDetailed = (comment: any) => {
        // High-bar detection: Only trigger premium if specific sexual/service metrics are filled.
        // Duration, City, and Rating are standard. Oral, Anal, Ejaculation, etc. are Premium.
        return !!(
            (comment.oral_condom && comment.oral_condom !== 'none') ||
            comment.anal_status === true ||
            (comment.breast_natural && comment.breast_natural !== 'natural' && comment.breast_natural !== 'doğal') ||
            comment.multiple_sessions === 'yes' ||
            comment.ejaculation ||
            comment.come_in_mouth
        );
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-400 uppercase tracking-widest text-xs">Yükleniyor...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">
                        {userType === 'member' ? 'Yorum Geçmişim' : 'Değerlendirmeler'}
                    </h1>
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">
                        {userType === 'member' ? 'Yaptığınız tüm yorumlar ve gelen yanıtlar.' : 'Modelleriniz/Sizin hakkınızdaki geri bildirimler.'}
                    </p>
                </div>
                <div className="p-3 bg-primary/10 rounded-2xl">
                    <MessageSquare className="w-6 h-6 text-primary" />
                </div>
            </div>

            <div className="grid gap-6">
                {comments.map((comment) => {
                    // Standardized List View (Simplified/Normal Style for Density)
                    return (
                        <div
                            key={comment.id}
                            onClick={() => setSelectedComment(comment)}
                            className="bg-white dark:bg-white/5 p-8 rounded-[3rem] border border-transparent hover:border-primary/20 hover:bg-gray-50/50 dark:hover:bg-white/[0.07] transition-all cursor-pointer group shadow-sm hover:shadow-xl relative overflow-hidden"
                        >
                            <div className="flex items-center gap-10">
                                {/* Profile Area */}
                                <div className="w-32 flex flex-col items-center shrink-0 border-r border-gray-100 dark:border-white/5 pr-8">
                                    <div className="w-16 h-16 rounded-2xl bg-[#0f172a] flex items-center justify-center text-primary shadow-lg border border-primary/10">
                                        <User className="w-8 h-8" />
                                    </div>
                                    <div className="mt-4 text-center">
                                        <h2 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tighter truncate w-full">
                                            {comment.listings?.title || 'Model'}
                                        </h2>
                                        <p className="text-[9px] font-black text-gray-400 tracking-widest uppercase italic mt-1">
                                            {new Date(comment.created_at).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-0.5 mt-2 text-yellow-400">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={cn("w-3 h-3 fill-current", i < (comment.rating_stars || 5) ? "fill-current" : "text-gray-100 dark:text-gray-800")} />
                                        ))}
                                    </div>
                                </div>

                                {/* Message Content Area */}
                                <div className="flex-1 min-w-0 relative">
                                    <div className="bg-gray-50/50 dark:bg-black/20 p-6 rounded-2xl border border-gray-100 dark:border-white/5 relative">
                                        <div className="absolute top-4 right-4 text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] italic">
                                            Mesaj
                                        </div>
                                        <p className="text-gray-700 dark:text-gray-300 font-bold italic leading-relaxed truncate">
                                            "{comment.content}"
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-4">
                                            {isDetailed(comment) && (
                                                <div className="flex items-center gap-1.5 py-1.5 px-3 bg-amber-500/10 border border-amber-500/20 rounded-full">
                                                    <Award className="w-3 h-3 text-amber-500" />
                                                    <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Premium Detaylı</span>
                                                </div>
                                            )}
                                            {comment.replies.length > 0 && (
                                                <div className="flex items-center gap-1.5 py-1.5 px-4 bg-primary/10 border border-primary/20 rounded-full">
                                                    <MessageSquare className="w-3 h-3 text-primary" />
                                                    <span className="text-[9px] font-black text-primary uppercase tracking-widest leading-none">
                                                        {comment.replies.length} YANIT
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="group-hover:translate-x-1 transition-transform">
                                            <CornerDownRight className="w-5 h-5 text-primary/40" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {comments.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-[#0a0a0a] rounded-[2rem] border-2 border-dashed border-gray-100 dark:border-white/5">
                        <MessageSquare className="w-12 h-12 text-gray-100 dark:text-gray-900 mx-auto mb-4" />
                        <h3 className="text-gray-400 font-black uppercase tracking-tighter text-lg">Yorum bulunamadı</h3>
                    </div>
                )}
            </div>

            {/* Detail Popup/Modal */}
            {selectedComment && (() => {
                const detailed = isDetailed(selectedComment);

                return (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                        <div
                            className={cn(
                                "relative w-full bg-white dark:bg-[#0a0a0a] rounded-[3rem] shadow-2xl border border-white/10 overflow-hidden animate-in zoom-in-95 duration-300",
                                detailed ? "max-w-4xl" : "max-w-2xl"
                            )}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setSelectedComment(null)}
                                className="absolute top-6 right-6 p-3 rounded-full bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors z-20 group"
                            >
                                <X className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                            </button>

                            <div className="flex flex-col lg:flex-row min-h-[500px]">
                                {/* LEFT SIDEBAR: PROFILE CONTEXT (Universal) */}
                                <div className="w-full lg:w-72 bg-[#0f172a] p-10 flex flex-col items-center gap-8 border-b lg:border-b-0 lg:border-r border-white/5 relative overflow-hidden shrink-0">
                                    <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />

                                    {/* Profile Image/Icon */}
                                    <div className="w-24 h-24 rounded-[2rem] bg-white/5 flex items-center justify-center text-primary border border-primary/20 shadow-2xl relative group">
                                        <User className="w-12 h-12 group-hover:scale-110 transition-transform" />
                                        {detailed && (
                                            <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white border-4 border-[#0f172a] shadow-lg">
                                                <Award className="w-5 h-5" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Title & Info */}
                                    <div className="text-center space-y-4 w-full">
                                        <div className="space-y-1">
                                            <h3 className="text-xl font-black text-white uppercase tracking-tighter truncate leading-none">
                                                {selectedComment.listings?.title || 'Model'}
                                            </h3>
                                            <div className="h-[2px] w-12 bg-primary/40 mx-auto rounded-full" />
                                        </div>

                                        <div className="space-y-3 pt-2">
                                            <div className="flex items-center justify-center gap-1 text-yellow-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={cn("w-4 h-4 fill-current", i < (selectedComment.rating_stars || 5) ? "fill-current" : "text-gray-800")} />
                                                ))}
                                            </div>
                                            <div className="inline-flex px-3 py-1 bg-white/5 rounded-lg border border-white/10">
                                                <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase italic">
                                                    {new Date(selectedComment.meeting_date || selectedComment.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {detailed && (
                                        <div className="mt-auto w-full space-y-3 pt-8 border-t border-white/5">
                                            <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">ŞEHİR</span>
                                                <span className="text-[10px] font-black text-white uppercase">{selectedComment.meeting_city || 'İZMİR'}</span>
                                            </div>
                                            <div className="flex justify-between items-center bg-white/5 p-3 rounded-xl border border-white/5">
                                                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest">SÜRE</span>
                                                <span className="text-[10px] font-black text-white uppercase">{selectedComment.meeting_duration || '1 SAAT'}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* RIGHT CONTENT: BASIC MESSAGE OR PREMIUM DETAILS */}
                                <div className="flex-1 flex flex-col bg-white dark:bg-[#0a0a0a]">
                                    <div className="p-8 lg:p-12 flex-1 space-y-10 overflow-y-auto custom-scrollbar max-h-[70vh]">

                                        {detailed ? (
                                            /* PREMIUM VIEW: DETAILED GRID FIRST */
                                            <div className="space-y-10">
                                                <div className="grid lg:grid-cols-2 gap-8">
                                                    {/* Service Table */}
                                                    <div className="bg-gray-50 dark:bg-white/[0.02] rounded-[2.5rem] p-8 border border-gray-100 dark:border-white/5 shadow-inner">
                                                        <h4 className="text-[9px] font-black text-primary uppercase tracking-[0.3em] mb-6 border-b border-primary/10 pb-3">Hizmet Analizi</h4>
                                                        <div className="space-y-4">
                                                            {[
                                                                { label: 'ORAL SEKS', value: selectedComment.oral_condom === 'condom' ? 'KONDOM' : 'TEN TENE' },
                                                                { label: 'AĞIZA GELME', value: selectedComment.come_in_mouth === 'swallow' ? 'YUTMA' : 'YÜZE/VÜCUDA' },
                                                                { label: 'ANAL', value: selectedComment.anal_status ? 'EVET' : 'HAYIR' },
                                                                { label: 'GÖĞÜS', value: selectedComment.breast_natural === 'natural' || selectedComment.breast_natural === 'doğal' ? 'DOĞAL' : 'SİLİKON' },
                                                                { label: 'TEK SEFER', value: selectedComment.multiple_sessions === 'yes' ? 'BİRDEN FAZLA' : 'TEK SEFER' },
                                                                { label: 'BOŞALTMA', value: selectedComment.ejaculation === 'mouth' ? 'AĞIZ' : 'VÜCUT' },
                                                            ].filter(f => f.value && f.value !== 'undefined').map((field, idx) => (
                                                                <div key={idx} className="flex items-center justify-between border-b border-black/[0.03] dark:border-white/[0.03] pb-3 last:border-0 last:pb-0">
                                                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-wider">{field.label}</span>
                                                                    <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase italic">{field.value}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    {/* Ratings */}
                                                    <div className="grid grid-cols-1 gap-4">
                                                        {[
                                                            { label: 'GÖRÜNTÜ %100', val: (selectedComment.rating_appearance || 10) * 10, icon: User, color: 'text-amber-500' },
                                                            { label: 'SERVİS %100', val: (selectedComment.rating_service || 10) * 10, icon: Zap, color: 'text-yellow-500' },
                                                            { label: 'İLETİŞİM %100', val: (selectedComment.rating_communication || 10) * 10, icon: MessageSquare, color: 'text-primary' },
                                                        ].map((r, i) => (
                                                            <div key={i} className="bg-gray-50 dark:bg-white/[0.02] rounded-2xl p-5 border border-gray-100 dark:border-white/5 flex items-center justify-between">
                                                                <div className="flex items-center gap-4">
                                                                    <div className={cn("p-2 rounded-lg bg-white dark:bg-black/40", r.color)}>
                                                                        <r.icon className="w-5 h-5" />
                                                                    </div>
                                                                    <span className="text-[10px] font-black text-gray-500 tracking-widest uppercase">{r.label}</span>
                                                                </div>
                                                                <div className="bg-gray-200 dark:bg-white/10 w-24 h-1.5 rounded-full overflow-hidden">
                                                                    <div className="bg-primary h-full rounded-full" style={{ width: `${r.val}%` }} />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        ) : null}

                                        {/* MESSAGE BUBBLE (Shared Component, always in center/right flow) */}
                                        <div className="relative group">
                                            <div className="bg-gray-50 dark:bg-white/[0.03] p-10 rounded-[3.5rem] border border-gray-100 dark:border-white/5 relative shadow-inner flex flex-col items-center justify-center min-h-[160px]">
                                                <MessageSquare className="w-16 h-16 text-primary/5 absolute top-10 right-14 group-hover:rotate-12 transition-transform" />
                                                <p className={cn(
                                                    "text-center font-bold italic leading-relaxed px-6 relative z-10",
                                                    selectedComment.content.length > 80 ? "text-xl text-gray-700 dark:text-gray-300" : "text-3xl text-gray-900 dark:text-white"
                                                )}>
                                                    "{selectedComment.content}"
                                                </p>
                                            </div>
                                        </div>

                                        {/* REPLIES (Unified) */}
                                        {selectedComment.replies.length > 0 && (
                                            <div className="space-y-4">
                                                <h5 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.4em] ml-10">MODELDEN YANIT</h5>
                                                {selectedComment.replies.map((reply: any) => (
                                                    <div key={reply.id} className="bg-primary/5 p-6 rounded-[2.5rem] border border-primary/10 ml-10 relative flex items-center gap-5">
                                                        <div className="absolute -left-10 w-10 h-[2px] bg-primary/20" />
                                                        <CornerDownRight className="w-5 h-5 text-primary/30 shrink-0" />
                                                        <p className="text-base text-gray-600 dark:text-gray-400 font-bold italic">{reply.content}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>

                                    {/* REPLY INPUT (Model only) */}
                                    {userType === 'independent_model' && (
                                        <div className="p-8 border-t border-gray-100 dark:border-white/5 bg-gray-50/50 dark:bg-black/20">
                                            <div className="flex gap-4">
                                                <Input
                                                    placeholder="Yanıtınızı buraya yazın..."
                                                    className="h-14 rounded-2xl border-gray-100 dark:border-white/5 font-bold text-base px-6 shadow-inner bg-white dark:bg-black/40"
                                                    value={replyText[selectedComment.id] || ''}
                                                    onChange={(e) => setReplyText({ ...replyText, [selectedComment.id]: e.target.value })}
                                                />
                                                <Button
                                                    onClick={() => handleReply(selectedComment.id)}
                                                    className="w-14 h-14 rounded-2xl bg-primary text-white shadow-lg shadow-primary/20 hover:scale-105 transition-all shrink-0"
                                                >
                                                    <Send className="w-5 h-5" />
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
