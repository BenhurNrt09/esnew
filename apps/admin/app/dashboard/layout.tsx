import { requireAdmin } from '@repo/lib/server';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '../components/DashboardHeader';

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
            <DashboardHeader />
            <main>{children}</main>
        </div>
    );
}
