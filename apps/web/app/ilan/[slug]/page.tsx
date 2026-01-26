export const revalidate = 3600;

import { createServerClient } from '@repo/lib/server';
import type { Listing, City, Category } from '@repo/types';
import { Button, Card, CardContent } from '@repo/ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDate, formatPrice } from '@repo/lib';
import { MapPin, Calendar, Tag, Share2, Heart, MessageCircle } from 'lucide-react';

async function getListing(slug: string) {
    const supabase = createServerClient();

    const { data, error } = await supabase
        .from('listings')
        .select('*, city:cities(*), category:categories(*)')
        .eq('slug', slug)
        .single();

    if (error || !data) return null;
    return data as (Listing & { city: City; category: Category });
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
    const listing = await getListing(params.slug);
    if (!listing) return {};

    return {
        title: listing.seo_title || listing.title,
        description: listing.seo_description || listing.description,
    };
}

export default async function ListingDetailPage({ params }: { params: { slug: string } }) {
    const listing = await getListing(params.slug);

    if (!listing) {
        notFound();
    }

    return (
        <div className="bg-muted/10 min-h-screen pb-20">
            {/* Breadcrumb - Basic implementation */}
            <div className="bg-background border-b">
                <div className="container mx-auto px-4 py-3 text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-primary">Ana Sayfa</Link>
                    <span className="mx-2">/</span>
                    <Link href={`/kategori/${listing.category?.slug}`} className="hover:text-primary">{listing.category?.name}</Link>
                    <span className="mx-2">/</span>
                    <span className="text-foreground">{listing.title}</span>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Image Placeholder */}
                        <div className="aspect-video bg-muted rounded-xl flex items-center justify-center overflow-hidden relative group">
                            <div className="text-muted-foreground flex flex-col items-center">
                                <span className="text-6xl mb-4">🖼️</span>
                                <p>Görsel Yüklenmedi</p>
                            </div>
                            {listing.is_featured && (
                                <span className="absolute top-4 left-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
                                    ⭐ Öne Çıkan
                                </span>
                            )}
                        </div>

                        {/* Title & Price Mobile */}
                        <div className="lg:hidden bg-background p-6 rounded-xl shadow-sm border">
                            <h1 className="text-2xl font-bold mb-2">{listing.title}</h1>
                            <div className="text-3xl font-bold text-primary mb-4">
                                {listing.price ? formatPrice(listing.price) : 'Fiyat Belirtilmedi'}
                            </div>
                            <div className="flex flex-col gap-3">
                                <Button size="lg" className="w-full">
                                    <MessageCircle className="mr-2 h-4 w-4" /> Satıcıya Mesaj Gönder
                                </Button>
                            </div>
                        </div>

                        {/* Description Card */}
                        <Card className="shadow-sm border-none">
                            <CardContent className="p-8">
                                <h2 className="text-xl font-semibold mb-4 pb-2 border-b">İlan Detayları</h2>
                                <div className="prose max-w-none text-muted-foreground whitespace-pre-wrap leading-relaxed">
                                    {listing.description || 'Açıklama bulunmuyor.'}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Attributes Card */}
                        <Card className="shadow-sm border-none">
                            <CardContent className="p-8">
                                <h3 className="text-lg font-semibold mb-4">Özellikler</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-8">
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider">İlan No</span>
                                        <span className="font-medium text-foreground">#{listing.id.slice(0, 8)}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider">İlan Tarihi</span>
                                        <span className="font-medium text-foreground">{formatDate(listing.created_at)}</span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Kategori</span>
                                        <Link href={`/kategori/${listing.category?.slug}`} className="font-medium text-primary hover:underline">
                                            {listing.category?.name}
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">

                        {/* Price & Action Card (Desktop) */}
                        <Card className="hidden lg:block shadow-md border-primary/10 sticky top-24">
                            <CardContent className="p-6 space-y-6">
                                <div>
                                    <h1 className="text-2xl font-bold leading-tight mb-2">{listing.title}</h1>
                                    <div className="text-sm text-muted-foreground flex items-center gap-1 mb-6">
                                        <MapPin className="h-4 w-4" />
                                        {listing.city?.name}
                                    </div>
                                    <div className="text-4xl font-bold text-primary tracking-tight">
                                        {listing.price ? formatPrice(listing.price) : 'Fiyat Yok'}
                                    </div>
                                </div>

                                <div className="grid gap-3">
                                    <Button size="lg" className="w-full font-semibold text-lg h-12">
                                        <MessageCircle className="mr-2 h-5 w-5" /> Mesaj Gönder
                                    </Button>
                                    <div className="flex gap-3">
                                        <Button variant="outline" className="flex-1">
                                            <Heart className="mr-2 h-4 w-4" /> Kaydet
                                        </Button>
                                        <Button variant="outline" className="flex-1">
                                            <Share2 className="mr-2 h-4 w-4" /> Paylaş
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-muted/50 rounded-lg p-4 text-sm text-center text-muted-foreground">
                                    Güvenli alışveriş ipuçları için tıklayın
                                </div>
                            </CardContent>
                        </Card>

                        {/* Seller Profile Placeholder */}
                        <Card className="shadow-sm">
                            <CardContent className="p-6 flex items-center gap-4">
                                <div className="w-14 h-14 bg-primary/20 rounded-full flex items-center justify-center text-xl font-bold text-primary">
                                    A
                                </div>
                                <div>
                                    <p className="font-semibold text-lg">Admin Satıcı</p>
                                    <p className="text-sm text-muted-foreground">Üyelik Tarihi: Ocak 2024</p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location Placeholder */}
                        <Card className="shadow-sm overflow-hidden">
                            <div className="h-48 bg-muted flex items-center justify-center text-muted-foreground">
                                <MapPin className="h-8 w-8 mb-2 opacity-50" />
                                <span className="sr-only">Harita Yükleniyor</span>
                            </div>
                            <CardContent className="p-4 bg-background">
                                <p className="font-medium flex items-center gap-2">
                                    <MapPin className="h-4 w-4 text-primary" /> {listing.city?.name} Merkez
                                </p>
                            </CardContent>
                        </Card>

                    </div>
                </div>
            </div>
        </div>
    );
}
