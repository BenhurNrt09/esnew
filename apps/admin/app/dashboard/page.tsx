import { requireAdmin } from '@repo/lib';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@repo/ui';

export default async function DashboardPage() {
    try {
        await requireAdmin();
    } catch {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-muted/20 p-8">
            <div className="max-w-7xl mx-auto">
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
                            <CardTitle className="text-3xl">-</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardDescription>Aktif İlan</CardDescription>
                            <CardTitle className="text-3xl">-</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardDescription>Toplam Şehir</CardDescription>
                            <CardTitle className="text-3xl">-</CardTitle>
                        </CardHeader>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardDescription>Toplam Kategori</CardDescription>
                            <CardTitle className="text-3xl">-</CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Başlangıç Adımları</CardTitle>
                        <CardDescription>
                            Platformu kullanmaya başlamak için aşağıdaki adımları takip edin
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal list-inside space-y-2">
                            <li>Supabase veritabanı migration'larını çalıştırın</li>
                            <li>Şehir ve kategori verilerini ekleyin</li>
                            <li>İlk ilanınızı oluşturun</li>
                            <li>Web sitesinde görüntüleyin</li>
                        </ol>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
