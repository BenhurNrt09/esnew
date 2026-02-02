import { createServerClient } from '@repo/lib/server';
import { notFound } from 'next/navigation';
import { Card, CardContent } from '@repo/ui';
import { User, MessageSquare, Star, ShieldCheck, Clock, Shield, Heart } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { username: string } }) {
    return { title: `${params.username} - Üye Profili` };
}

async function getMemberData(username: string) {
    const supabase = createServerClient();
    const { data: member } = await supabase
        .from('members')
        .select('*')
        .eq('username', username)
        .single();

    if (!member) return null;

    const { data: comments } = await supabase
        .from('comments')
        .select('*, listings(title, slug)')
        .eq('user_id', member.id)
        .is('parent_id', null)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

    return { member, comments: comments || [] };
}

export default async function MemberProfilePage({ params }: { params: { username: string } }) {
    const data = await getMemberData(params.username);
    if (!data) notFound();

    const { member, comments } = data;

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

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-12">
            <div className="container mx-auto px-4 max-w-5xl">

                {/* Member Header Card */}
                <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 flex flex-col md:flex-row items-center gap-10 mb-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <User className="w-64 h-64 text-primary" />
                    </div>

                    <div className="w-40 h-40 rounded-[2.5rem] bg-primary/5 flex items-center justify-center text-primary relative z-10 border-4 border-white shadow-xl">
                        <User className="w-20 h-20" />
                    </div>

                    <div className="space-y-4 text-center md:text-left relative z-10">
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                            <h1 className="text-4xl font-black text-gray-900 uppercase tracking-tighter">
                                {member.first_name || member.username} {member.last_name || ''}
                            </h1>
                            <span className="bg-primary/10 text-primary px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/20">
                                Doğrulanmış Üye
                            </span>
                        </div>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs flex items-center justify-center md:justify-start gap-2">
                            @{member.username} <span className="w-1.5 h-1.5 bg-gray-200 rounded-full"></span> Kayıt: {new Date(member.created_at).toLocaleDateString()}
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-8 pt-2">
                            <div className="text-center md:text-left">
                                <p className="text-2xl font-black text-gray-900">{comments.length}</p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b-2 border-primary/20 pb-1">Değerlendirme</p>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-2xl font-black text-gray-900">
                                    {comments.length > 0 ? (comments.reduce((acc, c) => acc + (c.rating_stars || 5), 0) / comments.length).toFixed(1) : '5.0'}
                                </p>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest border-b-2 border-primary/20 pb-1">Ort. Memnuniyet</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter px-4 flex items-center gap-3">
                        <MessageSquare className="w-7 h-7 text-primary" /> Yorum Geçmişi
                    </h3>

                    <div className="grid gap-8">
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <Card key={comment.id} className="shadow-2xl shadow-gray-200/30 border-gray-100 rounded-[2.5rem] overflow-hidden bg-white hover:shadow-primary/5 transition-all duration-500 border-l-[12px] border-l-gray-900 hover:border-l-primary group">
                                    <CardContent className="p-8 space-y-8">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <Link href={`/ilan/${comment.listings?.slug}`} className="text-xl font-black text-gray-900 uppercase tracking-tighter hover:text-primary transition-colors block mb-2">
                                                    {comment.listings?.title}
                                                </Link>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center text-yellow-400">
                                                        {[...Array(5)].map((_, i) => (
                                                            <Star key={i} className={`w-4 h-4 ${i < (comment.rating_stars || 5) ? 'fill-current' : 'text-gray-150'}`} />
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
                                                        {new Date(comment.created_at).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </div>

                                            {comment.photo_accuracy && (
                                                <div className="bg-green-50 text-green-600 px-4 py-2 rounded-2xl border border-green-100/50 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                                                    <ShieldCheck className="w-4 h-4" /> Fotoğraf: {getPhotoAccuracyLabel(comment.photo_accuracy)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Metrics Tags */}
                                        <div className="flex flex-wrap gap-2">
                                            {comment.oral_condom && (
                                                <span className="text-[9px] font-black tracking-widest uppercase bg-primary/5 text-primary px-4 py-2 rounded-xl border border-primary/10">
                                                    Sakso: {comment.oral_condom === 'condom' ? 'Kondomlu' : 'Kondomsuz'}
                                                </span>
                                            )}
                                            {comment.breast_natural && (
                                                <span className="text-[9px] font-black tracking-widest uppercase bg-blue-50 text-blue-600 px-4 py-2 rounded-xl border border-blue-100">
                                                    Göğüs: {comment.breast_natural === 'natural' ? 'Doğal' : 'Silikon'}
                                                </span>
                                            )}
                                            {comment.anal_status !== null && (
                                                <span className={`text-[9px] font-black tracking-widest uppercase px-4 py-2 rounded-xl border ${comment.anal_status ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-gray-50 text-gray-400 border-gray-100'}`}>
                                                    Anal: {comment.anal_status ? 'Evet' : 'Hayır'}
                                                </span>
                                            )}
                                        </div>

                                        <p className="text-gray-600 font-bold leading-relaxed bg-gray-50/50 p-6 rounded-[1.5rem] border border-gray-100/50 italic text-sm">
                                            "{comment.content}"
                                        </p>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <div className="py-24 text-center bg-white rounded-[3rem] border-4 border-dashed border-gray-100">
                                <MessageSquare className="w-16 h-16 text-gray-100 mx-auto mb-6" />
                                <h3 className="text-gray-400 font-black uppercase tracking-tighter text-xl">Yorum bulunamadı</h3>
                                <p className="text-gray-300 font-bold uppercase tracking-widest text-xs">Bu üye henüz hiçbir modele yorum bırakmamış.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function cn(...classes: any[]) {
    return classes.filter(Boolean).join(' ');
}
