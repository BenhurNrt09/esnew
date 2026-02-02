'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardContent, Button, Input, useToast } from '@repo/ui';
import { MessageSquare, CornerDownRight, Send, Star, AlertCircle } from 'lucide-react';

export default function CommentsPage() {
    const toast = useToast();
    const supabase = createClient();
    const [loading, setLoading] = useState(true);
    const [comments, setComments] = useState<any[]>([]);
    const [replyText, setReplyText] = useState<Record<string, string>>({});
    const [listingId, setListingId] = useState<string | null>(null);

    useEffect(() => {
        loadComments();
    }, []);

    const loadComments = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Get listing
        const { data: listing } = await supabase
            .from('listings')
            .select('id')
            .eq('user_id', user.id)
            .single();

        if (listing) {
            setListingId(listing.id);
            const { data } = await supabase
                .from('comments')
                .select('*')
                .eq('listing_id', listing.id)
                .is('parent_id', null)
                .order('created_at', { ascending: false });

            if (data) {
                // Fetch replies for each comment
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
        if (!text || !listingId) return;

        try {
            const { data: { user } } = await supabase.auth.getUser();
            const { error } = await supabase.from('comments').insert({
                listing_id: listingId,
                user_id: user?.id,
                content: text,
                parent_id: commentId,
                is_approved: true // Replies from models are auto-approved
            });

            if (error) throw error;

            toast.success('Cevabınız gönderildi.');
            setReplyText({ ...replyText, [commentId]: '' });
            loadComments();
        } catch (err: any) {
            toast.error('Hata: ' + err.message);
        }
    };

    if (loading) return <div>Yükleniyor...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div>
                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Yorumlar & Değerlendirmeler</h1>
                <p className="text-gray-500 font-medium">Müşterilerinizden gelen geri bildirimleri yönetin ve yanıtlayın.</p>
            </div>

            <div className="space-y-6">
                {comments.map((comment) => (
                    <Card key={comment.id} className="shadow-sm border-gray-100 rounded-3xl overflow-hidden">
                        <CardContent className="p-8 space-y-6">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                        <Star className="w-6 h-6 fill-current" />
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 uppercase tracking-tighter">Anonim Kullanıcı</h4>
                                        <div className="flex items-center gap-1 text-yellow-400">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={cn("w-3 h-3 fill-current", i < (comment.rating || 5) ? "text-yellow-400" : "text-gray-200")} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-[10px] font-bold text-gray-400 uppercase">
                                    {new Date(comment.created_at).toLocaleDateString()}
                                </span>
                            </div>

                            <p className="text-gray-700 font-medium leading-relaxed bg-gray-50 p-4 rounded-2xl italic">
                                "{comment.content}"
                            </p>

                            {/* Replies */}
                            <div className="space-y-4 pl-8 border-l-2 border-primary/10">
                                {comment.replies.map((reply: any) => (
                                    <div key={reply.id} className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <CornerDownRight className="w-4 h-4 text-primary" />
                                            <span className="text-xs font-black text-primary uppercase tracking-widest">Sizin Cevabınız</span>
                                        </div>
                                        <p className="text-sm text-gray-600 font-medium bg-primary/5 p-4 rounded-2xl">
                                            {reply.content}
                                        </p>
                                    </div>
                                ))}

                                {/* Reply Input */}
                                <div className="pt-2 flex gap-3">
                                    <Input
                                        placeholder="Cevabınızı yazın..."
                                        className="rounded-xl h-11 border-gray-200"
                                        value={replyText[comment.id] || ''}
                                        onChange={(e) => setReplyText({ ...replyText, [comment.id]: e.target.value })}
                                    />
                                    <Button
                                        onClick={() => handleReply(comment.id)}
                                        className="rounded-xl h-11 px-6 bg-primary text-white"
                                    >
                                        <Send className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {comments.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
                        <MessageSquare className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Henüz yorum yapılmamış.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}
