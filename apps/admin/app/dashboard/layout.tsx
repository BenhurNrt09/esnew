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
    } catch (err: any) {
        console.error('CRITICAL: Admin access denied in DashboardLayout:', err.message || err);
        // Special case: if it's a specific auth error, maybe log more
        if (err.status === 401 || err.message === 'Unauthorized') {
            console.error('Debug: User session invalid or expired');
        }
        redirect('/login');
    }

    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const isServiceRoleKeyMissing = !serviceRoleKey ||
        serviceRoleKey === 'your_service_role_key' ||
        serviceRoleKey.length < 50; // Supabase keys are long

    return (
        <div className="flex h-screen bg-muted/20 overflow-hidden">
            {/* Sidebar (Desktop) */}
            <Sidebar isServiceRoleKeyMissing={isServiceRoleKeyMissing} />

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
