import { createServerClient } from '@repo/lib';
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

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data || [];
}

export default async function CategoriesPage() {
    const categories = await getCategories();

    // Group by parent
    const mainCategories = categories.filter(c => !c.parent_id);
    const subCategories = categories.filter(c => c.parent_id);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Kategori Yönetimi</h1>
                    <p className="text-muted-foreground mt-1">
                        {mainCategories.length} ana kategori, {subCategories.length} alt kategori
                    </p>
                </div>
                <Button asChild>
                    <Link href="/dashboard/categories/new">
                        Yeni Kategori Ekle
                    </Link>
                </Button>
            </div>

            <div className="space-y-6">
                {mainCategories.map((mainCat) => {
                    const subs = subCategories.filter(s => s.parent_id === mainCat.id);

                    return (
                        <Card key={mainCat.id}>
                            <CardHeader className="bg-muted/50">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <CardTitle>{mainCat.name}</CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            Slug: {mainCat.slug} • Sıra: {mainCat.order}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/dashboard/categories/${mainCat.id}/edit`}>
                                                Düzenle
                                            </Link>
                                        </Button>
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/dashboard/categories/new?parent=${mainCat.id}`}>
                                                Alt Kategori Ekle
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>

                            {subs.length > 0 && (
                                <CardContent className="pt-6">
                                    <div className="space-y-2">
                                        {subs.map((sub) => (
                                            <div
                                                key={sub.id}
                                                className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                                            >
                                                <div>
                                                    <p className="font-medium">{sub.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        Slug: {sub.slug} • Sıra: {sub.order}
                                                    </p>
                                                </div>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/dashboard/categories/${sub.id}/edit`}>
                                                        Düzenle
                                                    </Link>
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            )}

                            {subs.length === 0 && (
                                <CardContent>
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Bu kategoride alt kategori yok
                                    </p>
                                </CardContent>
                            )}
                        </Card>
                    );
                })}

                {mainCategories.length === 0 && (
                    <Card>
                        <CardContent className="text-center py-12">
                            <p className="text-muted-foreground mb-4">
                                Henüz kategori eklenmemiş.
                            </p>
                            <Button asChild>
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
