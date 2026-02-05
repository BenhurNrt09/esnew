
import { createAdminClient } from '@repo/lib/server';
import { User, Image as ImageIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';

export const revalidate = 0;

async function getModels() {
    const supabase = createAdminClient();
    const { data: models, error } = await supabase
        .from('independent_models')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Models error:', error);
        return [];
    }
    return models || [];
}

export default async function ModelsPage() {
    const models = await getModels();

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                    <User className="h-8 w-8 text-primary" /> Bireysel Modeller
                </h1>
                <p className="text-muted-foreground mt-1 text-lg">
                    Sistemde kayıtlı <span className="font-bold text-primary">{models.length}</span> bağımsız model bulunuyor.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {models.map((model) => (
                    <Card key={model.id} className="hover:shadow-lg transition-all border-gray-100 rounded-3xl overflow-hidden group">
                        <CardHeader className="bg-gray-50/50 p-6">
                            <CardTitle className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary font-bold shadow-sm border border-gray-100 group-hover:scale-110 transition-transform">
                                    {model.username?.[0]?.toUpperCase() || 'M'}
                                </div>
                                <div>
                                    <p className="text-lg font-black text-gray-900 leading-none">{model.username}</p>
                                    <p className="text-xs text-primary font-black tracking-widest uppercase opacity-60">{model.gender}</p>
                                </div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6">
                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Kayıt Tarihi</span>
                                    <span className="font-medium text-gray-700">{new Date(model.created_at).toLocaleDateString('tr-TR')}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-bold uppercase text-[10px] tracking-widest">Email</span>
                                    <span className="font-medium text-gray-700">{model.email}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {models.length === 0 && (
                    <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <User className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-lg font-bold text-gray-900">Model Bulunamadı</h3>
                        <p className="text-gray-400">Sistemde henüz kayıtlı bağımsız model bulunmuyor.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
