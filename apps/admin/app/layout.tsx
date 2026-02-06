import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './components/Providers';
import { AdminRealtimeListener } from './components/AdminRealtimeListener';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Admin Panel | VeloraEscortWorld',
    description: 'VeloraEscortWorld Admin Panel',
    robots: {
        index: false,
        follow: false,
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr">
            <body className={inter.className}>
                <Providers>
                    <AdminRealtimeListener />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
