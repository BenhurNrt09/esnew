'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, useToast } from '@repo/ui';
import { MessageSquare, CornerDownRight, Send, Star, AlertCircle, User, ShieldCheck, Heart } from 'lucide-react';

export default function CommentsPage() {
    const toast = useToast();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [userType, setUserType] = useState<string | null>(null);
    const [comments, setComments] = useState<any[]>([]);
    const [replyText, setReplyText] = useState<Record<string, string>>({});
    const [listingId, setListingId] = useState<string | null>(null);

    useEffect(() => { loadComments(); }, []);

    const loadComments = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const type = user.user_metadata?.user_type || 'member';
        setUserType(type);

        if (type === 'independent_model') {
            const { data: listing } = await supabase.from('listings').select('id').eq('user_id', user.id).single();
            if (listing) {
                setListingId(listing.id);
                const { data } = await supabase
                    .from('comments')
                    .select('*')
                    .eq('listing_id', listing.id)
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

    const getPhotoAccuracyLabel = (val: string) => {
        const labels: Record<string, string> = {
            'real': 'Gerçek',
            '10p': '%10 PS',
            '20p': '%20 PS',
            '30p': '%30 PS',
            '40p': '%40 PS',
            'ai': 'AI / Filtre'
        };
        return labels[val] || val;
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center font-bold text-gray-400 uppercase tracking-widest text-xs">Yükleniyor...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
                    {userType === 'member' ? 'Yorum Geçmişim' : 'Değerlendirmeler'}
                </h1>
                <p className="text-gray-500 font-medium">
                    {userType === 'member' ? 'Yaptığınız tüm yorumlar ve gelen yanıtlar.' : 'Modelleriniz/Sizin hakkınızdaki geri bildirimler.'}
                </p>
            </div>

            <div className="space-y-6">
                {comments.map((comment) => (
                    <Card key={comment.id} className="shadow-2xl shadow-primary/5 border-gray-100 rounded-[2rem] overflow-hidden bg-white">
                        <CardContent className="p-8 space-y-8">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        <User className="w-7 h-7" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 uppercase tracking-tighter text-lg">
                                            {userType === 'member' ? comment.listings?.title : comment.username}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-0.5 text-yellow-400">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={cn("w-3.5 h-3.5 fill-current", i < (comment.rating_stars || 5) ? "text-yellow-400" : "text-gray-150")} />
                                                ))}
                                            </div>
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                {comment.photo_accuracy && (
                                    <div className="bg-green-50 text-green-600 px-4 py-1.5 rounded-xl border border-green-100 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                        <ShieldCheck className="w-3 h-3" /> Fotoğraf: {getPhotoAccuracyLabel(comment.photo_accuracy)}
                                    </div>
                                )}
                            </div>

                            {/* Metrics Tags */}
                            {(comment.oral_condom || comment.anal_status !== undefined || comment.breast_natural) && (
                                <div className="flex flex-wrap gap-2">
                                    {comment.oral_condom && (
                                        <span className="text-[9px] font-black tracking-widest uppercase bg-primary/5 text-primary px-3 py-1.5 rounded-full border border-primary/10">
                                            Sakso: {comment.oral_condom === 'condom' ? 'Kondomlu' : 'Kondomsuz'}
                                        </span>
                                    )}
                                    {comment.breast_natural && (
                                        <span className="text-[9px] font-black tracking-widest uppercase bg-blue-50 text-blue-600 px-3 py-1.5 rounded-full border border-blue-100">
                                            Göğüs: {comment.breast_natural === 'natural' ? 'Doğal' : 'Silikon'}
                                        </span>
                                    )}
                                    {comment.anal_status !== undefined && (
                                        <span className={`text-[9px] font-black tracking-widest uppercase px-3 py-1.5 rounded-full border ${comment.anal_status ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                            Anal: {comment.anal_status ? 'Evet' : 'Hayır'}
                                        </span>
                                    )}
                                </div>
                            )}

                            <div className="relative">
                                <p className="text-gray-700 font-bold leading-relaxed bg-gray-50 p-6 rounded-[1.5rem] italic text-sm">
                                    "{comment.content}"
                                </p>
                            </div>

                            {/* Replies */}
                            <div className="space-y-4 pl-10 border-l-4 border-primary/10 relative">
                                {comment.replies.map((reply: any) => (
                                    <div key={reply.id} className="space-y-2 animate-in slide-in-from-left-2 duration-300">
                                        <div className="flex items-center gap-2">
                                            <CornerDownRight className="w-4 h-4 text-primary" />
                                            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Yanıt</span>
                                        </div>
                                        <p className="text-sm text-gray-600 font-bold bg-primary/5 p-5 rounded-2xl border border-primary/10">
                                            {reply.content}
                                        </p>
                                    </div>
                                ))}

                                {userType === 'independent_model' && (
                                    <div className="pt-4 flex gap-3">
                                        <Input
                                            placeholder="Cevabınızı yazın..."
                                            className="rounded-xl h-12 border-gray-200 bg-white font-bold"
                                            value={replyText[comment.id] || ''}
                                            onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                                        />
                                        <Button
                                            onClick={() => handleReply(comment.id)}
                                            className="rounded-xl h-12 px-8 bg-primary text-white font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
                                        >
                                            <Send className="w-4 h-4" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {comments.length === 0 && (
                    <div className="text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-gray-50">
                        <MessageSquare className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                        <h3 className="text-gray-400 font-black uppercase tracking-tighter text-xl">Henüz bir yorum yok</h3>
                        <p className="text-gray-300 font-bold">İlk yorumunuzu yapmak için profilleri gezin.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
