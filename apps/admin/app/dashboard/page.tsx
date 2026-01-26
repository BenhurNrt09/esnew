import { requireAdmin, createServerClient } from '@repo/lib';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';

export const revalidate = 0;

async function getStats() {
    const supabase = createServerClient();

    const [listingsRes, citiesRes, categoriesRes] = await Promise.all([
        supabase.from('listings').select('id, is_active'),
        supabase.from('cities').select('id'),
        supabase.from('categories').select('id'),
    ]);

    const totalListings = listingsRes.data?.length || 0;
    const activeListings = listingsRes.data?.filter(l => l.is_active).length || 0;
    const totalCities = citiesRes.data?.length || 0;
    const totalCategories = categoriesRes.data?.length || 0;

    return {
        totalListings,
        activeListings,
        totalCities,
        totalCategories,
    };
}

export default async function DashboardPage() {
    try {
        await requireAdmin();
    } catch {
        redirect('/login');
    }

    const stats = await getStats();

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold">Dashboard</h1>
                <p className="text-muted-foreground mt-2">
                    ESNew Admin Panel'e hoş geldiniz
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card>
                    <CardHeader>
                        <CardDescription>Toplam İlan</CardDescription>
                        <CardTitle className="text-3xl">{stats.totalListings}</CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardDescription>Aktif İlan</CardDescription>
                        <CardTitle className="text-3xl">{stats.activeListings}</CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardDescription>Toplam Şehir</CardDescription>
                        <CardTitle className="text-3xl">{stats.totalCities}</CardTitle>
                    </CardHeader>
                </Card>

                <Card>
                    <CardHeader>
                        <CardDescription>Toplam Kategori</CardDescription>
                        <CardTitle className="text-3xl">{stats.totalCategories}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Hızlı Başlangıç</CardTitle>
                    <CardDescription>
                        Platformu kullanmaya başlamak için aşağıdaki adımları takip edin
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ol className="list-decimal list-inside space-y-3">
                        <li className={stats.totalCities > 0 ? 'line-through text-muted-foreground' : ''}>
                            Şehir ekleyin (Şehirler sayfasından)
                        </li>
                        <li className={stats.totalCategories > 0 ? 'line-through text-muted-foreground' : ''}>
                            Kategori ve alt kategoriler oluşturun
                        </li>
                        <li className={stats.totalListings > 0 ? 'line-through text-muted-foreground' : ''}>
                            İlk ilanınızı ekleyin
                        </li>
                        <li>Web sitesinde görüntüleyin (localhost:3000)</li>
                    </ol>
                </CardContent>
            </Card>
        </div>
    );
}
