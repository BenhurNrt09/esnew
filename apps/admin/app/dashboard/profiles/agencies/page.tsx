import { createAdminClient } from '@repo/lib/server';
import { Building2, ChevronRight, User } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import Link from 'next/link';

export const revalidate = 0;

async function getAgencies() {
    const supabase = createAdminClient();

    // Fetch agencies
    const { data: agencies, error } = await supabase
        .from('agencies')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Agencies error:', error);
        return [];
    }

    if (!agencies || agencies.length === 0) return [];

    // Fetch listing counts for these agencies
    const agencyIds = agencies.map(a => a.id);
    const { data: counts, error: countError } = await supabase
        .from('listings')
        .select('user_id')
        .in('user_id', agencyIds);

    if (countError) {
        console.error('Counts error:', countError);
    }

    // Attach counts to agencies
    return agencies.map(agency => ({
        ...agency,
        listings: [{
            count: counts?.filter(c => c.user_id === agency.id).length || 0
        }]
    }));
}

export default async function AgenciesPage() {
    const agencies = await getAgencies();

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                    <Building2 className="h-8 w-8 text-primary" /> Ajans & Şirket Profilleri
                </h1>
                <p className="text-gray-300 mt-1 text-lg font-medium">
                    Sistemde kayıtlı <span className="font-black text-primary">{agencies.length}</span> ajans/şirket bulunuyor.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {agencies.map((agency) => (
                    <Card key={agency.id} className="hover:shadow-lg transition-all border-white/10 rounded-3xl overflow-hidden group bg-white/5 backdrop-blur-sm">
                        <CardHeader className="bg-black/40 p-6 border-b border-white/5">
                            <CardTitle className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-black/60 rounded-2xl flex items-center justify-center text-primary font-bold shadow-sm border border-white/10 group-hover:rotate-6 transition-transform">
                                    <Building2 className="h-7 w-7" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-lg font-black text-white leading-tight uppercase">{agency.company_name || agency.username}</p>
                                    <p className="text-xs text-primary font-black tracking-widest uppercase opacity-60">Ajans Hesabı</p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest opacity-80">Kayıtlar</p>
                                    <p className="text-2xl font-black text-white mt-1">{agency.listings?.[0]?.count || 0}</p>
                                </div>
                                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/20">
                                    <p className="text-[10px] font-black text-primary/60 uppercase tracking-widest">Yetkili</p>
                                    <p className="text-sm font-bold text-gray-300 mt-2 truncate">{agency.username}</p>
                                </div>
                            </div>

                            <Link
                                href={`/dashboard/profiles/agencies/${agency.id}`}
                                className="flex items-center justify-between w-full h-12 px-6 rounded-xl bg-white/5 border border-white/10 text-sm font-black text-white hover:bg-gold-gradient hover:text-black hover:border-transparent transition-all group/btn shadow-lg"
                            >
                                <span>Profilleri Yönet</span>
                                <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
