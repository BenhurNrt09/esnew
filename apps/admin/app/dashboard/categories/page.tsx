import { createServerClient } from '@repo/lib/server';
import type { Category } from '@repo/types';
import { Card, CardContent, CardHeader, CardTitle, Button } from '@repo/ui';
import Link from 'next/link';

export const revalidate = 0;

async function getCategories(): Promise<Category[]> {
    const supabase = createServerClient();
    const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('order');

    if (error) return [];
    return data || [];
}

export default async function CategoriesPage() {
    const categories = await getCategories();
    const mainCategories = categories.filter(c => !c.parent_id);
    const subCategories = categories.filter(c => c.parent_id);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tighter">
                        <span className="text-primary">Kategori</span> Yönetimi
                    </h1>
                    <p className="text-gray-300 mt-1 font-medium">
                        {mainCategories.length} ana kategori, {subCategories.length} alt kategori
                    </p>
                </div>
                <Button asChild className="bg-gold-gradient text-black font-bold hover:opacity-90 rounded-lg shadow-lg shadow-primary/20">
                    <Link href="/dashboard/categories/new">
                        Yeni Kategori Ekle
                    </Link>
                </Button>
            </div>

            <div className="space-y-6">
                {mainCategories.map((mainCat) => {
                    const subs = subCategories.filter(s => s.parent_id === mainCat.id);
                    return (
                        <Card key={mainCat.id} className="bg-white/5 border-white/10 shadow-lg backdrop-blur-sm">
                            <CardHeader className="bg-black/40 border-b border-white/5">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-primary font-black text-xl uppercase tracking-wider">{mainCat.name}</CardTitle>
                                        <p className="text-xs text-gray-400 mt-1 font-mono font-bold">
                                            Slug: {mainCat.slug} • Sıra: {mainCat.order}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" asChild className="text-primary hover:text-white hover:bg-primary/20 font-bold">
                                            <Link href={`/dashboard/categories/${mainCat.id}/edit`}>
                                                Düzenle
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild className="text-white border-white/20 hover:bg-white/10 font-bold">
                                            <Link href={`/dashboard/categories/new?parent=${mainCat.id}`}>
                                                Alt Kategori Ekle
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            {subs.length > 0 && (
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {subs.map((sub) => (
                                            <div
                                                key={sub.id}
                                                className="flex items-center justify-between p-3 rounded-lg border border-white/5 hover:border-primary/30 hover:bg-white/5 transition-all bg-black/20 group"
                                            >
                                                <div>
                                                    <p className="font-bold text-white group-hover:text-primary transition-colors">{sub.name}</p>
                                                    <p className="text-[10px] text-primary/60 font-black uppercase tracking-widest mt-0.5">
                                                        /{sub.slug}
                                                    </p>
                                                </div>
                                                <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 text-gray-500 hover:text-primary hover:bg-transparent">
                                                    <Link href={`/dashboard/categories/${sub.id}/edit`}>
                                                        ✏️
                                                    </Link>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            )}

                            {subs.length === 0 && (
                                <CardContent>
                                    <p className="text-sm text-gray-400 text-center py-6 italic font-medium">
                                        Bu kategoride alt kategori bulunmuyor.
                                    </p>
                                </CardContent>
                            )}
                        </Card>
                    );
                })}

                {mainCategories.length === 0 && (
                    <Card className="bg-white/5 border-dashed border-2 border-white/10">
                        <CardContent className="text-center py-12">
                            <p className="text-gray-500 mb-4">
                                Henüz kategori eklenmemiş.
                            </p>
                            <Button asChild className="bg-gold-gradient text-black font-bold">
                                <Link href="/dashboard/categories/new">
                                    İlk Kategoriyi Ekle
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
