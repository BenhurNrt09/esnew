import { createServerClient } from '@repo/lib/server';
import type { Listing, City, Category } from '@repo/types';
import { Button } from '@repo/ui';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
    MapPin, Calendar, Share2, Phone, CheckCircle2,
    User, Info, ArrowLeft, MessageCircle, Star,
    ShieldCheck, Zap, Sparkles, DollarSign, ListChecks,
    Heart, Globe, Smile, Languages, Shield
} from 'lucide-react';
import { formatPrice } from '@repo/lib';
import { ProfileGallery } from '../../components/ProfileGallery';
import { AdvancedReviewForm } from '../../components/AdvancedReviewForm';
import { PublicProfileComments } from '../../components/PublicProfileComments';

export const revalidate = 0;

interface ExtendedListing extends Listing {
    city?: City;
    category?: Category;
    images?: string[];
    cover_image?: string;
    phone?: string;
    metadata: any;
    pricing?: any[];
    gender?: string;
    orientation?: string;
    ethnicity?: string;
    nationality?: string;
    tattoos?: boolean;
    badges?: string[];
}

async function getListing(slug: string): Promise<ExtendedListing | null> {
    const supabase = createServerClient();
    const { data: listing, error } = await supabase
        .from('listings')
        .select('*, city:cities(*), category:categories(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

    if (error || !listing) return null;

    const { data: pricing } = await supabase
        .from('model_pricing')
        .select('*')
        .eq('listing_id', listing.id)
        .order('price', { ascending: true });

    return { ...listing, pricing: pricing || [] };
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const listing = await getListing(params.slug);
    if (!listing) return { title: 'Profil Bulunamadı' };
    return {
        title: listing.title,
        description: listing.description,
    };
}

export default async function ListingPage({ params }: { params: { slug: string } }) {
    const listing = await getListing(params.slug);
    if (!listing) notFound();

    const gallery = listing.images || [];
    const allImages = listing.cover_image ? [listing.cover_image, ...gallery] : gallery;
    const meta = listing.metadata || {};

    const features = [
        { label: 'Cinsiyet', value: listing.gender || 'Kadın', icon: <User className="w-4 h-4" /> },
        { label: 'Yaş', value: meta.age || '-', icon: <Calendar className="w-4 h-4" /> },
        { label: 'Boy', value: meta.height ? `${meta.height} cm` : '-', icon: <ArrowLeft className="w-4 h-4 rotate-90" /> },
        { label: 'Kilo', value: meta.weight ? `${meta.weight} kg` : '-', icon: <Zap className="w-4 h-4" /> },
        { label: 'Göğüs', value: meta.breast_size || '-', icon: <Heart className="w-4 h-4" /> },
        { label: 'Etnik Köken', value: listing.ethnicity || 'Avrupalı', icon: <Globe className="w-4 h-4" /> },
        { label: 'Yönelim', value: listing.orientation || 'Hetero', icon: <Smile className="w-4 h-4" /> },
        { label: 'Uyruk', value: listing.nationality || '-', icon: <Shield className="w-4 h-4" /> },
        { label: 'Dövme', value: listing.tattoos ? 'Evet' : 'Hayır', icon: <Sparkles className="w-4 h-4" /> },
        { label: 'Vücut Kılı', value: meta.body_hair === 'shaved' ? 'Pürüzsüz' : (meta.body_hair === 'trimmed' ? 'Bakımlı' : 'Doğal'), icon: <Sparkles className="w-4 h-4" /> },
        { label: 'Sigara', value: meta.smoking ? 'Evet' : 'Hayır', icon: <Info className="w-4 h-4" /> },
        { label: 'Alkol', value: meta.alcohol ? 'Evet' : 'Hayır', icon: <Info className="w-4 h-4" /> },
    ];

    const services = Object.entries(meta.services || {})
        .filter(([_, active]) => active)
        .map(([id]) => ({
            id,
            label: id.toUpperCase(),
            allowed: true
        }));

    const currencySymbols: Record<string, string> = { 'TRY': '₺', 'USD': '$', 'EUR': '€' };

    const badgeColors: Record<string, string> = {
        'VIP': 'bg-amber-500 text-white',
        'YENİ': 'bg-green-500 text-white',
        'PREMIUM': 'bg-blue-600 text-white',
        'BAĞIMSIZ': 'bg-purple-600 text-white',
        'VİDEOLU': 'bg-pink-500 text-white',
        'PORNO YILDIZI': 'bg-red-600 text-white'
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* COMPACT HERO */}
            <div className="relative h-[200px] sm:h-[250px] w-full bg-red-950 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-950 to-black/90"></div>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                {/* Floating Badges */}
                <div className="absolute top-3 right-3 z-30 flex flex-wrap gap-1.5 justify-end max-w-xs">
                    {(listing.badges || ['VIP', 'BAĞIMSIZ', 'YENİ']).map((badge) => (
                        <span key={badge} className={`${badgeColors[badge.toUpperCase()] || 'bg-white/20 text-white'} px-3 py-1 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-wider shadow-lg border border-white/10 backdrop-blur-sm`}>
                            {badge}
                        </span>
                    ))}
                </div>

                <div className="absolute top-0 left-0 p-3 sm:p-4 z-20">
                    <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full h-9 px-4 backdrop-blur-md border border-white/5 text-xs" asChild>
                        <Link href="/">
                            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" /> Tüm İlanlar
                        </Link>
                    </Button>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-4 sm:p-6 z-20">
                    <div className="container mx-auto">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center gap-2">
                                    <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider border border-white/20">
                                        {listing.category?.name}
                                    </span>
                                    <span className="bg-red-500/90 backdrop-blur-md text-white px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-red-900/20 border border-red-400/30">
                                        <ShieldCheck className="w-3 h-3" /> Kimlik Doğrulanmış
                                    </span>
                                </div>
                                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tighter leading-none drop-shadow-2xl">
                                    {listing.title}
                                </h1>
                                <div className="flex items-center gap-3 text-white/50 text-xs font-bold uppercase tracking-wide">
                                    <span className="flex items-center gap-1.5">
                                        <MapPin className="h-3.5 w-3.5 text-red-500" /> {listing.city?.name}
                                    </span>
                                    <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                                    <span className="flex items-center gap-1.5">
                                        <Calendar className="h-3.5 w-3.5 text-red-500" /> {new Date(listing.created_at).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white gap-2 rounded-full h-10 sm:h-11 px-4 sm:px-6 shadow-xl shadow-green-900/40 text-xs sm:text-sm font-black uppercase tracking-wide transition-all hover:scale-105 active:scale-95 group"
                                    asChild
                                >
                                    <a href={`https://wa.me/${listing.phone?.replace(/\\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="h-4 w-4 group-hover:rotate-12 transition-transform" /> WHATSAPP
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-6">

                        {/* Cover Photo + Profile Summary Layout */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            {/* Cover Photo */}
                            <div className="md:col-span-4">
                                <div className="bg-white p-3 rounded-2xl shadow-lg border border-gray-100 sticky top-4">
                                    <div className="aspect-[3/4] rounded-xl overflow-hidden">
                                        <img
                                            src={listing.cover_image || allImages[0]}
                                            alt={listing.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Profile Summary */}
                            <div className="md:col-span-8">
                                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-5">
                                        <User className="w-24 h-24 text-red-600" />
                                    </div>
                                    <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 flex items-center gap-3 uppercase tracking-tighter relative z-10">
                                        <User className="h-6 w-6 text-red-600" /> PROFİL ÖZETİ
                                    </h2>
                                    <p className="text-gray-700 text-sm sm:text-base font-medium leading-relaxed whitespace-pre-line relative z-10">
                                        {listing.description}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Gallery */}
                        <ProfileGallery images={allImages} />

                        {/* ADVANCED REVIEW SYSTEM */}
                        <div id="reviews" className="space-y-6">
                            <PublicProfileComments listingId={listing.id} />
                            <AdvancedReviewForm listingId={listing.id} />
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-4">

                        {/* 1. ÖZELLİKLER TABLE */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 relative overflow-hidden">
                            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-tighter">
                                <Info className="h-5 w-5 text-red-600" /> ÖZELLİKLER
                            </h3>
                            <div className="space-y-2">
                                {features.map((f, i) => (
                                    <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 rounded-lg transition-all">
                                        <div className="flex items-center gap-2">
                                            <span className="p-1.5 bg-gray-50 rounded-lg text-gray-400">{f.icon}</span>
                                            <span className="text-gray-400 font-bold text-[10px] uppercase tracking-wide">{f.label}</span>
                                        </div>
                                        <span className="text-gray-950 font-black text-xs">{f.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. FİYATLANDIRMA TABLE */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-red-50">
                            <h3 className="text-lg font-black text-red-600 mb-4 flex items-center gap-2 uppercase tracking-tighter">
                                <DollarSign className="h-5 w-5" /> FİYATLANDIRMA
                            </h3>
                            <div className="space-y-2">
                                {listing.pricing && listing.pricing.length > 0 ? (
                                    listing.pricing.map((p, i) => (
                                        <div key={i} className="flex justify-between items-center bg-gray-50/50 p-4 rounded-xl border border-gray-100 hover:border-red-200 transition-all">
                                            <div>
                                                <p className="text-[9px] font-black text-red-600 uppercase tracking-wide mb-0.5">{p.duration}</p>
                                                <div className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold uppercase">
                                                    <MapPin className="w-2.5 h-2.5" /> {p.location || 'Her Yer'}
                                                </div>
                                            </div>
                                            <div className="text-lg font-black text-gray-950">
                                                {currencySymbols[p.currency || 'TRY']} {p.price}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-bold uppercase text-[9px]">Fiyat Belirtilmemiş</div>
                                )}
                            </div>
                        </div>

                        {/* 3. İZİNLER / NELER VAR TABLE */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
                            <h3 className="text-lg font-black text-gray-900 mb-4 flex items-center gap-2 uppercase tracking-tighter">
                                <ListChecks className="h-5 w-5 text-red-600" /> NELER VAR?
                            </h3>
                            <div className="grid grid-cols-1 gap-1.5">
                                {services.length > 0 ? (
                                    services.map((s, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-green-50/50 p-2 rounded-lg border border-green-100/50 hover:scale-[1.01] transition-transform">
                                            <div className="w-4 h-4 rounded-md bg-green-500 flex items-center justify-center text-white shadow-sm">
                                                <CheckCircle2 className="w-3 h-3" />
                                            </div>
                                            <span className="text-[10px] font-black text-green-950 tracking-wide uppercase">{s.label}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-8 text-center bg-gray-50/50 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 font-bold uppercase text-[9px]">Hizmet Belirtilmemiş</div>
                                )}
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="bg-gray-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
                            <div className="relative z-10 space-y-3">
                                <p className="text-red-500 font-black uppercase tracking-wider text-[10px] flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> GÜVENLİK PROTOKOLÜ
                                </p>
                                <p className="text-gray-400 text-[10px] font-bold leading-relaxed">
                                    ValoraEscort sadece dijital bir rehberdir. Modellerle yapacağınız görüşmelerde kişisel güvenliğiniz için onaylı profilleri tercih ediniz.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

function AlertCircle(props: any) {
    return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>;
}
