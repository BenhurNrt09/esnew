import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './components/Providers';
import { Header } from './components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: {
        template: '%s | ValoraEscort',
        default: 'ValoraEscort - İlan ve Profil Platformu',
    },
    description: 'Türkiye\'nin en kapsamlı ilan ve profil platformu',
    keywords: ['ilan', 'profil', 'hizmet', 'kategori', 'şehir'],
    authors: [{ name: 'ValoraEscort' }],
    creator: 'ValoraEscort',
    publisher: 'ValoraEscort',
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export const viewport = {
    width: 'device-width',
    initialScale: 1,
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr" className="overflow-x-hidden max-w-full">
            <body className={`${inter.className} overflow-x-hidden max-w-full w-full`}>
                <Providers>
                    <Header />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
