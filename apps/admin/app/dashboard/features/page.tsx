import { createServerClient } from '@repo/lib/server';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';

export const revalidate = 0;

export default async function FeaturesPage() {
    const supabase = createServerClient();
    const { data: categories } = await supabase.from('categories').select('*').order('name');

    const parents = categories?.filter(c => !c.parent_id) || [];

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-red-950">Özellik Seçenekleri</h1>
                <p className="text-muted-foreground mt-2">
                    Bu sayfada, ilan oluştururken kullanılan özelliklerin (Kategorilerin) listesini görebilirsiniz.
                    Yeni özellik eklemek için <a href="/dashboard/categories" className="text-red-600 underline font-medium">Kategoriler</a> sayfasını kullanın.
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {parents.map(parent => {
                    const subs = categories?.filter(c => c.parent_id === parent.id) || [];

                    // Alt özelliği olmayanları gösterme (sadece grup değilse)
                    // Veya hepsini göster.

                    return (
                        <Card key={parent.id} className="overflow-hidden border-red-100 shadow-sm hover:shadow-md transition-shadow">
                            <CardHeader className="bg-gradient-to-r from-red-50 to-white border-b border-red-100 py-3">
                                <CardTitle className="text-base text-red-800 flex items-center justify-between">
                                    {parent.name}
                                    <span className="text-xs font-normal text-red-400 bg-white px-2 py-0.5 rounded-full border border-red-100">
                                        {subs.length} seçenek
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 max-h-[300px] overflow-y-auto">
                                {subs.length > 0 ? (
                                    <ul className="space-y-2">
                                        {subs.map(sub => (
                                            <li key={sub.id} className="flex items-center gap-2 text-sm text-gray-600 group cursor-default">
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-200 group-hover:bg-red-500 transition-colors" />
                                                {sub.name}
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-xs text-gray-400 italic">Alt seçenek bulunmuyor.</p>
                                )}
                            </CardContent>
                        </Card>
                    )
                })}
            </div>
        </div>
    )
}
