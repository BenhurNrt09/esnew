'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Card, CardContent } from '@repo/ui';
import { Star, ShieldCheck, User, MessageCircle, Clock, CornerDownRight, Calendar, MapPin, Zap, Smile } from 'lucide-react';
import Link from 'next/link';

interface PublicProfileCommentsProps {
    listingId: string;
}

export function PublicProfileComments({ listingId }: PublicProfileCommentsProps) {
    const supabase = createClient();
    const [comments, setComments] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadComments();
    }, [listingId]);

    const loadComments = async () => {
        const { data, error } = await supabase
            .from('comments')
            .select('*')
            .eq('listing_id', listingId)
            .is('parent_id', null)
            .eq('is_approved', true)
            .order('created_at', { ascending: false });

        if (data) {
            const enriched = await Promise.all(data.map(async (comment) => {
                const { data: replies } = await supabase
                    .from('comments')
                    .select('*')
                    .eq('parent_id', comment.id)
                    .order('created_at', { ascending: true });

                const { data: member } = await supabase
                    .from('members')
                    .select('username')
                    .eq('id', comment.user_id)
                    .single();

                return { ...comment, replies: replies || [], username: comment.author_name || member?.username || 'Anonim' };
            }));
            setComments(enriched);
        }
        setLoading(false);
    };

    if (loading) return <div className="py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Değerlendirmeler Hazırlanıyor...</div>;

    if (comments.length === 0) return (
        <div className="py-24 text-center bg-white dark:bg-[#0A0A0A] rounded-[3rem] border-4 border-dashed border-gray-100 dark:border-white/5 mt-12 group">
            <MessageCircle className="w-16 h-16 text-gray-200 dark:text-white/5 mx-auto mb-6 group-hover:text-primary/20 transition-colors duration-500" />
            <p className="text-gray-400 dark:text-gray-600 font-black uppercase tracking-[0.2em] text-sm">Henüz bir deneyim paylaşılmamış.</p>
        </div>
    );

    const DetailRow = ({ label, value }: { label: string, value: string | null }) => {
        if (!value) return null;
        return (
            <div className="grid grid-cols-2 items-start py-3 border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-100 dark:hover:bg-white/5 transition-colors px-4">
                <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{label}</span>
                <span className="text-[10px] font-black text-gray-900 dark:text-white uppercase tracking-tighter text-right break-words">{value}</span>
            </div>
        );
    };

    const RatingBadge = ({ label, value, icon: Icon }: any) => (
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-black/40 p-4 rounded-2xl border border-gray-100 dark:border-white/5 shadow-inner group/badge hover:border-primary/20 transition-all">
            <Icon className="w-4 h-4 text-primary group-hover/badge:scale-110 transition-transform" />
            <div className="flex flex-col">
                <span className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">{label}</span>
                <span className="text-[12px] font-black text-gray-900 dark:text-white">%{value}0</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-16 mt-24">
            <div className="flex items-center justify-between px-2">
                <h3 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">İNCELERKEN SORDUK <span className="text-primary/20">({comments.length})</span></h3>
            </div>

            <div className="grid gap-16">
                {comments.map((comment) => {
                    // Check if the comment has detailed service ratings
                    const hasDetails = comment.kissing || comment.oral_condom || comment.come_in_mouth || comment.sex_level || comment.anal_status || comment.breast_natural === 'natural' || comment.multiple_sessions || comment.ejaculation;

                    if (!hasDetails) {
                        return (
                            <Card key={comment.id} className="relative shadow-xl border-gray-100 dark:border-white/10 rounded-[2.5rem] overflow-hidden bg-white dark:bg-[#0A0A0A] hover:border-primary/30 transition-all duration-500 group">
                                <CardContent className="p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start">
                                    {/* User Info (Left) */}
                                    <div className="shrink-0 flex flex-col items-center gap-4 text-center md:w-48 bg-gray-50 dark:bg-white/5 p-6 rounded-[2rem] border border-gray-100 dark:border-white/5">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-900 dark:bg-black border border-gray-800 dark:border-white/10 flex items-center justify-center text-primary shadow-lg group-hover:bg-primary group-hover:text-black transition-all">
                                            <User className="w-8 h-8" />
                                        </div>
                                        <div>
                                            <Link href={`/uye/${comment.username}`} className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tighter hover:text-primary transition-colors block underline decoration-primary/30 decoration-2 underline-offset-4">
                                                {comment.username}
                                            </Link>
                                            <div className="text-[9px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </div>
                                        </div>
                                        <div className="flex gap-1 text-primary">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < (comment.rating_stars || 5) ? 'fill-current' : 'text-gray-200 dark:text-white/10'}`} />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Content & Ratings (Right) */}
                                    <div className="flex-1 space-y-6 w-full pt-4">
                                        {/* Review Text */}
                                        <div className="bg-gray-50 dark:bg-white/5 p-8 rounded-[2rem] border border-gray-100 dark:border-white/5 relative">
                                            <MessageCircle className="absolute top-4 right-6 w-8 h-8 text-gray-200 dark:text-white/5" />
                                            <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed text-sm italic relative z-10">
                                                "{comment.content}"
                                            </p>
                                        </div>

                                        {/* Replies */}
                                        {comment.replies.length > 0 && (
                                            <div className="space-y-6 pt-2">
                                                {comment.replies.map((reply: any) => (
                                                    <div key={reply.id} className="relative ml-8 p-6 bg-primary/5 border border-primary/10 rounded-[1.5rem]">
                                                        <div className="flex items-center gap-3 mb-2">
                                                            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-black shadow-sm">
                                                                <CornerDownRight className="w-4 h-4" />
                                                            </div>
                                                            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Model Yanıtı</span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                                                            {reply.content}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    }

                    // Original Full Layout for Detailed Reviews
                    return (
                        <Card key={comment.id} className="relative shadow-2xl border-gray-100 dark:border-white/10 rounded-[3.5rem] overflow-hidden bg-white dark:bg-[#0A0A0A] hover:border-primary/30 transition-all duration-700 group">
                            {/* Status Header */}
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gold-gradient opacity-80"></div>

                            <CardContent className="p-6 md:p-12">
                                {/* Member Info Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-6 mb-12 border-b border-white/5 pb-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-3xl bg-gray-900 dark:bg-black border border-gray-800 dark:border-white/10 flex items-center justify-center text-primary shadow-2xl group-hover:rotate-6 group-hover:bg-primary group-hover:text-black transition-all duration-500">
                                            <User className="w-10 h-10" />
                                        </div>
                                        <div className="space-y-2">
                                            <Link href={`/uye/${comment.username}`} className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tighter hover:text-primary transition-colors block">
                                                {comment.username}
                                            </Link>
                                            <div className="flex items-center gap-4">
                                                <div className="flex gap-1 text-primary">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < (comment.rating_stars || 5) ? 'fill-current' : 'text-gray-200 dark:text-white/10'}`} />
                                                    ))}
                                                </div>
                                                <span className="w-1.5 h-1.5 bg-gray-100 dark:bg-white/10 rounded-full"></span>
                                                <span className="text-[11px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em]">YAYIN: {new Date(comment.created_at).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {comment.photo_accuracy && (
                                            <div className="bg-primary/10 text-primary px-6 py-3 rounded-2xl border border-primary/20 text-[11px] font-black uppercase tracking-widest flex items-center gap-3 shadow-xl">
                                                <ShieldCheck className="w-5 h-5" /> FOTOĞRAF: {comment.photo_accuracy.toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="grid lg:grid-cols-12 gap-12">
                                    {/* Left Column: Detailed Service Matrix */}
                                    <div className="lg:col-span-4 bg-gray-50 dark:bg-white/5 rounded-[2.5rem] p-6 border border-gray-100 dark:border-white/5 shadow-inner h-fit">
                                        <DetailRow label="Öpüşme" value={comment.kissing} />
                                        <DetailRow label="Oral Seks" value={comment.oral_condom} />
                                        <DetailRow label="Ağıza Gelme" value={comment.come_in_mouth} />
                                        <DetailRow label="Seks" value={comment.sex_level} />
                                        <DetailRow label="Anal" value={comment.anal_status ? 'Evet' : 'Hayır'} />
                                        <DetailRow label="Göğüs" value={comment.breast_natural === 'natural' ? 'Doğal' : 'Silikon'} />
                                        <DetailRow label="Tek Sefer" value={comment.multiple_sessions} />
                                        <DetailRow label="Boşaltma" value={comment.ejaculation} />
                                    </div>

                                    {/* Right Column: Content & Context */}
                                    <div className="lg:col-span-8 space-y-8">
                                        {/* Context Bar */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-gray-950 dark:bg-black p-8 rounded-[2.5rem] border border-gray-800 dark:border-white/5 shadow-2xl">
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">TARİH</p>
                                                <p className="text-[12px] font-black text-white">{comment.meeting_date || 'N/A'}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">SÜRE</p>
                                                <p className="text-[12px] font-black text-white">{comment.meeting_duration || 'N/A'}</p>
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest">ŞEHİR</p>
                                                <p className="text-[12px] font-black text-white">{comment.meeting_city || 'N/A'}</p>
                                            </div>
                                            <div className="flex items-center justify-end">
                                                <div className="bg-primary/20 text-primary px-4 py-2 rounded-xl border border-primary/20 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/10">
                                                    ONAYLI
                                                </div>
                                            </div>
                                        </div>

                                        {/* Ratings Grid */}
                                        <div className="grid grid-cols-3 gap-4">
                                            <RatingBadge label="GÖRÜNTÜ" value={comment.rating_appearance} icon={Smile} />
                                            <RatingBadge label="SERVİS" value={comment.rating_service} icon={Zap} />
                                            <RatingBadge label="İLETİŞİM" value={comment.rating_communication} icon={MessageCircle} />
                                        </div>

                                        {/* Review Text */}
                                        <div className="bg-gray-50 dark:bg-white/5 p-10 rounded-[3rem] border border-gray-100 dark:border-white/5 relative group/text hover:border-primary/10 transition-all duration-500">
                                            <MessageCircle className="absolute -top-6 -right-6 w-16 h-16 text-gray-200 dark:text-white/5 group-hover/text:text-primary/10 transition-colors" />
                                            <p className="text-gray-600 dark:text-gray-400 font-medium leading-loose text-base italic relative z-10">
                                                "{comment.content}"
                                            </p>
                                        </div>

                                        {/* Replies */}
                                        {comment.replies.length > 0 && (
                                            <div className="space-y-10 pt-4">
                                                {comment.replies.map((reply: any) => (
                                                    <div key={reply.id} className="relative ml-12 p-8 bg-primary/5 border border-primary/10 rounded-[2.5rem] shadow-xl shadow-primary/5">
                                                        <div className="absolute -left-8 top-12 w-8 h-px bg-primary/20"></div>
                                                        <div className="flex items-center gap-4 mb-4">
                                                            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-black shadow-lg">
                                                                <CornerDownRight className="w-5 h-5" />
                                                            </div>
                                                            <span className="text-[11px] font-black text-primary uppercase tracking-[0.3em]">Model Yanıtı</span>
                                                        </div>
                                                        <p className="text-base text-gray-600 dark:text-gray-300 font-medium leading-loose">
                                                            {reply.content}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
