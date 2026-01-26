import { requireAdmin } from '@repo/lib/server';
import { redirect } from 'next/navigation';
import { DashboardHeader } from '../components/DashboardHeader';
import { Sidebar } from '../components/Sidebar';

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    try {
        await requireAdmin();
    } catch {
        redirect('/login');
    }

    return (
        <div className="flex h-screen bg-muted/20 overflow-hidden">
            {/* Sidebar (Desktop) */}
            <Sidebar />

            {/* Main Wrapper */}
            <div className="flex-1 flex flex-col min-w-0">
                <DashboardHeader />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
