import { createAdminClient } from '@repo/lib/server';
import { Button, Card, CardContent } from '@repo/ui';
import { MessageSquare, CheckCircle, XCircle, User, Star, Clock } from 'lucide-react';
import { revalidatePath } from 'next/cache';

export const revalidate = 0;

async function getPendingComments() {
    const supabase = createAdminClient();
    const { data, error } = await supabase
        .from('comments')
        .select('*, listings(title)')
        .eq('is_approved', false)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching comments:', error);
        return [];
    }
    return data || [];
}

async function approveComment(id: string) {
    'use server';
    const supabase = createAdminClient();
    await supabase.from('comments').update({ is_approved: true }).eq('id', id);
    revalidatePath('/dashboard/comments');
}

async function deleteComment(id: string) {
    'use server';
    const supabase = createAdminClient();
    await supabase.from('comments').delete().eq('id', id);
    revalidatePath('/dashboard/comments');
}

export default async function CommentsModerationPage() {
    const comments = await getPendingComments();

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <MessageSquare className="h-8 w-8 text-primary" /> Yorum Moderasyonu
                </h1>
                <p className="text-muted-foreground mt-1 text-lg">
                    Onay bekleyen <span className="font-bold text-primary">{comments.length}</span> yorum bulunuyor.
                </p>
            </div>

            {comments.length === 0 ? (
                <Card className="bg-muted/20 border-dashed border-2">
                    <CardContent className="py-20 text-center">
                        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4 opacity-50" />
                        <p className="text-xl font-medium text-muted-foreground">Şu an onay bekleyen yorum bulunmuyor.</p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-6">
                    {comments.map((comment: any) => (
                        <Card key={comment.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                            <CardContent className="p-6">
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{comment.author_name || 'Anonim'}</p>
                                                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                                                        <Clock className="h-3 w-3" /> {new Date(comment.created_at).toLocaleString('tr-TR')}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`h-4 w-4 ${i < (comment.rating_stars || 0) ? 'fill-primary text-primary' : 'text-gray-200'}`} />
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">İLAN / PROFİL</p>
                                            <p className="font-bold">{comment.listings?.title || 'Bilinmeyen İlan'}</p>
                                        </div>

                                        <div className="bg-muted/30 p-4 rounded-xl italic text-gray-700">
                                            "{comment.content}"
                                        </div>
                                    </div>

                                    <div className="flex md:flex-col gap-3 justify-center">
                                        <form action={approveComment.bind(null, comment.id)}>
                                            <Button type="submit" className="w-full gap-2 bg-green-600 hover:bg-green-700 text-white font-bold">
                                                <CheckCircle className="h-4 w-4" /> Onayla
                                            </Button>
                                        </form>
                                        <form action={deleteComment.bind(null, comment.id)}>
                                            <Button type="submit" variant="destructive" className="w-full gap-2 font-bold">
                                                <XCircle className="h-4 w-4" /> Sil
                                            </Button>
                                        </form>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
