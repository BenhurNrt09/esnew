import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './components/Providers';
import { Header } from './components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: {
        template: '%s | ESNew',
        default: 'ESNew - İlan ve Profil Platformu',
    },
    description: 'Türkiye\'nin en kapsamlı ilan ve profil platformu',
    keywords: ['ilan', 'profil', 'hizmet', 'kategori', 'şehir'],
    authors: [{ name: 'ESNew' }],
    creator: 'ESNew',
    publisher: 'ESNew',
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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="tr">
            <body className={inter.className}>
                <Providers>
                    <Header />
                    {children}
                </Providers>
            </body>
        </html>
    );
}
