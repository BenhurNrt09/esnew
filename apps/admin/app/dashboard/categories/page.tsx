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
                    <h1 className="text-3xl font-black text-gray-900">Kategori Yönetimi</h1>
                    <p className="text-muted-foreground mt-1">
                        {mainCategories.length} ana kategori, {subCategories.length} alt kategori
                    </p>
                </div>
                <Button asChild className="bg-amber-600 hover:bg-amber-700 text-white rounded-lg shadow-amber-200">
                    <Link href="/dashboard/categories/new">
                        Yeni Kategori Ekle
                    </Link>
                </Button>
            </div>

            <div className="space-y-6">
                {mainCategories.map((mainCat) => {
                    const subs = subCategories.filter(s => s.parent_id === mainCat.id);
                    return (
                        <Card key={mainCat.id} className="border-amber-100 shadow-sm">
                            <CardHeader className="bg-amber-50/50 border-b border-amber-50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle className="text-amber-900">{mainCat.name}</CardTitle>
                                        <p className="text-sm text-amber-400 mt-1">
                                            Slug: {mainCat.slug} • Sıra: {mainCat.order}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" asChild className="text-amber-600 hover:text-amber-700 hover:bg-amber-50">
                                            <Link href={`/dashboard/categories/${mainCat.id}/edit`}>
                                                Düzenle
                                            </Link>
                                        </Button>
                                        <Button variant="outline" size="sm" asChild className="text-amber-600 border-amber-200 hover:bg-amber-50">
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
                                                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-amber-200 hover:bg-amber-50/30 transition-all bg-white"
                                            >
                                                <div>
                                                    <p className="font-medium text-gray-800">{sub.name}</p>
                                                    <p className="text-xs text-gray-400">
                                                        /{sub.slug}
                                                    </p>
                                                </div>
                                                <Button variant="ghost" size="sm" asChild className="h-8 w-8 p-0 text-gray-400 hover:text-amber-600">
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
                                    <p className="text-sm text-gray-400 text-center py-4 italic">
                                        Bu kategoride alt kategori yok
                                    </p>
                                </CardContent>
                            )}
                        </Card>
                    );
                })}

                {mainCategories.length === 0 && (
                    <Card className="border-dashed border-2 border-gray-200">
                        <CardContent className="text-center py-12">
                            <p className="text-gray-500 mb-4">
                                Henüz kategori eklenmemiş.
                            </p>
                            <Button asChild className="bg-amber-600 hover:bg-amber-700">
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
