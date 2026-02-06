import { createAdminClient } from '@repo/lib/server';
import { User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { ProfileActions } from '../ProfileActions';

export const revalidate = 0;

async function getMembers() {
    const supabase = createAdminClient();
    const { data: members, error } = await supabase
        .from('members')
        .select('*')
        .eq('user_type', 'member')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Members error:', error);
        return [];
    }
    return members || [];
}

export default async function MembersPage() {
    const members = await getMembers();

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <User className="h-8 w-8 text-primary" /> Üye Profilleri
                </h1>
                <p className="text-gray-300 mt-1 text-lg font-medium">
                    Sistemde kayıtlı <span className="font-black text-primary">{members.length}</span> bireysel üye bulunuyor.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                    <Card key={member.id} className="hover:shadow-lg hover:shadow-primary/10 transition-all border-white/10 rounded-3xl overflow-hidden group bg-white/5 backdrop-blur-sm">
                        <CardHeader className="bg-black/40 p-6 border-b border-white/5">
                            <CardTitle className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-black/60 rounded-2xl flex items-center justify-center text-primary font-bold shadow-sm border border-white/10 group-hover:scale-110 transition-transform">
                                    {member.username?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="text-lg font-black text-white leading-none">{member.username}</p>
                                    <p className="text-xs text-primary/80 font-mono mt-1 font-bold italic tracking-tight uppercase">{member.email}</p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest opacity-80">Kayıt Tarihi</span>
                                    <span className="font-bold text-gray-200">{new Date(member.created_at).toLocaleDateString('tr-TR')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-black uppercase text-[10px] tracking-widest opacity-80">Ad Soyad</span>
                                    <span className="font-black text-white">{member.first_name} {member.last_name}</span>
                                </div>
                                <div className="pt-2 flex justify-end">
                                    <ProfileActions id={member.id} table="members" username={member.username} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
