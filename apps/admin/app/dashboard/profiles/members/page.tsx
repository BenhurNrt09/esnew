import { createAdminClient } from '@repo/lib/server';
import { User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';

export const revalidate = 0;

async function getMembers() {
    const supabase = createAdminClient();
    const { data: members, error } = await supabase
        .from('members')
        .select('*')
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
                <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <User className="h-8 w-8 text-primary" /> Üye Profilleri
                </h1>
                <p className="text-muted-foreground mt-1 text-lg">
                    Sistemde kayıtlı <span className="font-bold text-primary">{members.length}</span> bireysel üye bulunuyor.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {members.map((member) => (
                    <Card key={member.id} className="hover:shadow-lg transition-all border-gray-100 rounded-3xl overflow-hidden group">
                        <CardHeader className="bg-gray-50/50 p-6">
                            <CardTitle className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary font-bold shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                    {member.username?.[0]?.toUpperCase() || 'U'}
                                </div>
                                <div>
                                    <p className="text-lg font-black text-gray-900 leading-none">{member.username}</p>
                                    <p className="text-xs text-gray-400 font-mono mt-1">{member.email}</p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Kayıt Tarihi</span>
                                    <span className="font-medium text-gray-700">{new Date(member.created_at).toLocaleDateString('tr-TR')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Ad Soyad</span>
                                    <span className="font-medium text-gray-700">{member.first_name} {member.last_name}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
