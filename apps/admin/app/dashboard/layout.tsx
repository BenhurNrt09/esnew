import { requireAdmin } from '@repo/lib';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@repo/ui';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        const user = await requireAdmin();
    } catch {
        redirect('/login');
    }

    return (
        <div className="min-h-screen bg-muted/20">
            {/* Header */}
            <header className="bg-card border-b sticky top-0 z-10">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/dashboard" className="text-xl font-bold">
                            ESNew Admin
                        </Link>
                        <nav className="hidden md:flex items-center gap-6">
                            <Link
                                href="/dashboard"
                                className="text-sm hover:text-primary transition-colors"
                            >
                                Dashboard
                            </Link>
                            <Link
                                href="/dashboard/cities"
                                className="text-sm hover:text-primary transition-colors"
                            >
                                Şehirler
                            </Link>
                            <Link
                                href="/dashboard/categories"
                                className="text-sm hover:text-primary transition-colors"
                            >
                                Kategoriler
                            </Link>
                            <Link
                                href="/dashboard/listings"
                                className="text-sm hover:text-primary transition-colors"
                            >
                                İlanlar
                            </Link>
                            <Link
                                href="/dashboard/features"
                                className="text-sm hover:text-primary transition-colors"
                            >
                                Özellikler
                            </Link>
                        </nav>
                    </div>
                    <div className="flex items-center gap-4">
                        <form action="/api/logout" method="POST">
                            <Button variant="ghost" size="sm" type="submit">
                                Çıkış Yap
                            </Button>
                        </form>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main>{children}</main>
        </div>
    );
}
