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

                return { ...comment, replies: replies || [], username: member?.username || 'Anonim' };
            }));
            setComments(enriched);
        }
        setLoading(false);
    };

    if (loading) return <div className="py-12 text-center text-gray-400 font-bold uppercase tracking-widest text-xs animate-pulse">Değerlendirmeler Hazırlanıyor...</div>;

    if (comments.length === 0) return (
        <div className="py-24 text-center bg-white rounded-[3rem] border-4 border-dashed border-gray-100 mt-12">
            <MessageCircle className="w-16 h-16 text-gray-100 mx-auto mb-6" />
            <p className="text-gray-400 font-black uppercase tracking-[0.2em] text-sm">Henüz bir deneyim paylaşılmamış.</p>
        </div>
    );

    const DetailRow = ({ label, value }: { label: string, value: string | null }) => {
        if (!value) return null;
        return (
            <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors px-2 rounded-lg">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{label}:</span>
                <span className="text-[11px] font-black text-gray-900 uppercase tracking-tighter">{value}</span>
            </div>
        );
    };

    const RatingBadge = ({ label, value, icon: Icon }: any) => (
        <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
            <Icon className="w-3.5 h-3.5 text-primary" />
            <div className="flex flex-col">
                <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{label}</span>
                <span className="text-[11px] font-black text-gray-950">%{value}0</span>
            </div>
        </div>
    );

    return (
        <div className="space-y-12 mt-20">
            <div className="flex items-center justify-between px-6">
                <h3 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Üye Deneyimleri <span className="text-primary/30">({comments.length})</span></h3>
            </div>

            <div className="grid gap-12">
                {comments.map((comment) => (
                    <Card key={comment.id} className="relative shadow-2xl shadow-gray-200/50 border-gray-100 rounded-[3rem] overflow-hidden bg-white hover:border-primary/20 transition-all duration-500 group">
                        {/* Status Header */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-blue-500"></div>

                        <CardContent className="p-10">
                            {/* Member Info Bar */}
                            <div className="flex flex-wrap items-center justify-between gap-6 mb-10 border-b border-gray-50 pb-8">
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-[1.5rem] bg-gray-900 flex items-center justify-center text-white shadow-xl group-hover:rotate-6 transition-transform">
                                        <User className="w-8 h-8" />
                                    </div>
                                    <div className="space-y-1">
                                        <Link href={`/uye/${comment.username}`} className="text-xl font-black text-gray-900 uppercase tracking-tighter hover:text-primary transition-colors block">
                                            {comment.username}
                                        </Link>
                                        <div className="flex items-center gap-3">
                                            <div className="flex gap-0.5 text-yellow-500">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3.5 h-3.5 ${i < (comment.rating_stars || 5) ? 'fill-current' : 'text-gray-150'}`} />
                                                ))}
                                            </div>
                                            <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">YAYIN: {new Date(comment.created_at).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    {comment.photo_accuracy && (
                                        <div className="bg-green-50 text-green-600 px-5 py-2.5 rounded-2xl border border-green-100/50 text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 shadow-sm">
                                            <ShieldCheck className="w-4 h-4" /> FOTOĞRAF: {comment.photo_accuracy.toUpperCase()}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="grid lg:grid-cols-12 gap-12">
                                {/* Left Column: Detailed Service Matrix */}
                                <div className="lg:col-span-4 bg-gray-50/50 rounded-[2rem] p-6 border border-gray-100 space-y-1">
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
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-900 p-6 rounded-[2rem] text-white shadow-xl shadow-gray-900/10">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">TARİH</p>
                                            <p className="text-[11px] font-black">{comment.meeting_date || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">SÜRE</p>
                                            <p className="text-[11px] font-black">{comment.meeting_duration || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest">ŞEHİR</p>
                                            <p className="text-[11px] font-black">{comment.meeting_city || 'N/A'}</p>
                                        </div>
                                        <div className="flex items-center justify-end">
                                            <div className="bg-primary/20 text-primary px-3 py-1.5 rounded-xl border border-primary/20 text-[10px] font-black uppercase">
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
                                    <div className="bg-gray-50/30 p-8 rounded-[2rem] border border-gray-100 relative">
                                        <MessageCircle className="absolute -top-4 -right-4 w-12 h-12 text-gray-100/50" />
                                        <p className="text-gray-600 font-bold leading-relaxed text-sm italic relative z-10">
                                            "{comment.content}"
                                        </p>
                                    </div>

                                    {/* Replies */}
                                    {comment.replies.length > 0 && (
                                        <div className="space-y-6 pt-4">
                                            {comment.replies.map((reply: any) => (
                                                <div key={reply.id} className="relative ml-10 p-6 bg-primary/5 border border-primary/10 rounded-3xl">
                                                    <div className="absolute -left-6 top-8 w-6 h-px bg-primary/20"></div>
                                                    <div className="flex items-center gap-3 mb-3">
                                                        <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg">
                                                            <CornerDownRight className="w-4 h-4" />
                                                        </div>
                                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Model Yanıtı</span>
                                                    </div>
                                                    <p className="text-sm text-gray-600 font-bold leading-relaxed">
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
                ))}
            </div>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
