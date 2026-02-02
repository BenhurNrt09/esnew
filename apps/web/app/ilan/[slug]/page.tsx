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
            {/* HER0 */}
            <div className="relative h-[450px] md:h-[650px] w-full bg-red-950 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600 via-red-950 to-black/90"></div>
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                {/* Floating Badges */}
                <div className="absolute top-8 right-8 z-30 flex flex-wrap gap-3 justify-end max-w-xs">
                    {(listing.badges || ['VIP', 'BAĞIMSIZ', 'YENİ']).map((badge) => (
                        <span key={badge} className={`${badgeColors[badge.toUpperCase()] || 'bg-white/20 text-white'} px-6 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-2xl border border-white/10 backdrop-blur-sm animate-in fade-in slide-in-from-right-4 duration-500`}>
                            {badge}
                        </span>
                    ))}
                </div>

                <div className="absolute top-0 left-0 p-8 z-20">
                    <Button variant="ghost" className="text-white hover:bg-white/10 rounded-full h-12 px-6 backdrop-blur-md border border-white/5" asChild>
                        <Link href="/">
                            <ArrowLeft className="mr-2 h-4 w-4" /> Tüm İlanlar
                        </Link>
                    </Button>
                </div>

                <div className="absolute bottom-0 left-0 w-full p-8 md:p-20 z-20">
                    <div className="container mx-auto">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
                            <div className="space-y-6">
                                <div className="flex flex-wrap items-center gap-4">
                                    <span className="bg-white/10 backdrop-blur-md text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/20">
                                        {listing.category?.name}
                                    </span>
                                    <span className="bg-red-500/90 backdrop-blur-md text-white px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2.5 shadow-xl shadow-red-900/20 border border-red-400/30">
                                        <ShieldCheck className="w-4 h-4" /> Kimlik Doğrulanmış
                                    </span>
                                </div>
                                <h1 className="text-6xl md:text-9xl font-black text-white tracking-tighter leading-none drop-shadow-2xl">
                                    {listing.title}
                                </h1>
                                <div className="flex items-center gap-6 text-white/50 text-sm font-bold uppercase tracking-widest">
                                    <span className="flex items-center gap-3">
                                        <MapPin className="h-5 w-5 text-red-500" /> {listing.city?.name}
                                    </span>
                                    <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
                                    <span className="flex items-center gap-3">
                                        <Calendar className="h-5 w-5 text-red-500" /> {new Date(listing.created_at).toLocaleDateString('tr-TR')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <Button
                                    size="lg"
                                    className="bg-green-600 hover:bg-green-700 text-white gap-4 rounded-[2.5rem] h-20 px-12 shadow-2xl shadow-green-900/40 text-xl font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 group"
                                    asChild
                                >
                                    <a href={`https://wa.me/${listing.phone?.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer">
                                        <MessageCircle className="h-7 w-7 group-hover:rotate-12 transition-transform" /> WHATSAPP MESAJ
                                    </a>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 -mt-16 relative z-30">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Main Content Area */}
                    <div className="lg:col-span-8 space-y-12">

                        {/* Gallery */}
                        <div className="bg-white p-6 rounded-[3.5rem] shadow-2xl shadow-gray-200/50 border border-gray-100">
                            <ProfileGallery images={allImages} />
                        </div>

                        {/* About */}
                        <div className="bg-white rounded-[3.5rem] p-12 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-12 opacity-5">
                                <User className="w-40 h-40 text-red-600" />
                            </div>
                            <h2 className="text-4xl font-black text-gray-900 mb-10 flex items-center gap-5 uppercase tracking-tighter relative z-10">
                                <User className="h-10 w-10 text-red-600" /> PROFİL ÖZETİ
                            </h2>
                            <p className="text-gray-600 text-xl font-medium leading-[2.2] whitespace-pre-line relative z-10 antialiased">
                                {listing.description}
                            </p>
                        </div>

                        {/* ADVANCED REVIEW SYSTEM */}
                        <div id="reviews" className="space-y-12">
                            <AdvancedReviewForm listingId={listing.id} />
                            <PublicProfileComments listingId={listing.id} />
                        </div>
                    </div>

                    {/* Sidebar Area */}
                    <div className="lg:col-span-4 space-y-10">

                        {/* 1. ÖZELLİKLER TABLE */}
                        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                                <Sparkles className="w-32 h-32 text-red-600" />
                            </div>
                            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-4 uppercase tracking-tighter">
                                <Info className="h-7 w-7 text-red-600" /> ÖZELLİKLER
                            </h3>
                            <div className="space-y-4">
                                {features.map((f, i) => (
                                    <div key={i} className="flex justify-between items-center py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-3 rounded-2xl transition-all group/item">
                                        <div className="flex items-center gap-4">
                                            <span className="p-2.5 bg-gray-50 rounded-xl text-gray-400 group-hover/item:text-red-500 group-hover/item:bg-red-50 transition-colors">{f.icon}</span>
                                            <span className="text-gray-400 font-black text-[11px] uppercase tracking-widest">{f.label}</span>
                                        </div>
                                        <span className="text-gray-950 font-black text-sm tracking-tight">{f.value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 2. FİYATLANDIRMA TABLE */}
                        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-red-900/5 border border-red-50 relative overflow-hidden">
                            <h3 className="text-2xl font-black text-red-600 mb-8 flex items-center gap-4 uppercase tracking-tighter">
                                <DollarSign className="h-7 w-7" /> FİYATLANDIRMA
                            </h3>
                            <div className="space-y-4">
                                {listing.pricing && listing.pricing.length > 0 ? (
                                    listing.pricing.map((p, i) => (
                                        <div key={i} className="group relative flex justify-between items-center bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100 hover:border-red-200 hover:bg-red-50/10 transition-all">
                                            <div>
                                                <p className="text-[10px] font-black text-red-600 uppercase tracking-widest mb-1">{p.duration}</p>
                                                <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold uppercase tracking-widest">
                                                    <MapPin className="w-3 h-3" /> {p.location || 'Her Yer'}
                                                </div>
                                            </div>
                                            <div className="text-2xl font-black text-gray-950 tracking-tighter">
                                                {currencySymbols[p.currency || 'TRY']} {p.price}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-400 font-black uppercase tracking-widest text-[10px]">Fiyat Belirtilmemiş</div>
                                )}
                            </div>
                        </div>

                        {/* 3. İZİNLER / NELER VAR TABLE (Massive List) */}
                        <div className="bg-white rounded-[3rem] p-10 shadow-2xl shadow-gray-200/50 border border-gray-100">
                            <h3 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-4 uppercase tracking-tighter">
                                <ListChecks className="h-7 w-7 text-red-600" /> NELER VAR?
                            </h3>
                            <div className="grid grid-cols-1 gap-2.5">
                                {services.length > 0 ? (
                                    services.map((s, i) => (
                                        <div key={i} className="flex items-center gap-4 bg-green-50/50 p-4 rounded-2xl border border-green-100/50 hover:scale-[1.02] transition-transform cursor-default">
                                            <div className="w-6 h-6 rounded-lg bg-green-500 flex items-center justify-center text-white shadow-lg shadow-green-500/20">
                                                <CheckCircle2 className="w-4 h-4" />
                                            </div>
                                            <span className="text-[11px] font-black text-green-950 tracking-widest uppercase">{s.label}</span>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 text-center bg-gray-50/50 rounded-[2rem] border-2 border-dashed border-gray-200 text-gray-400 font-black uppercase tracking-widest text-[10px]">Hizmet Belirtilmemiş</div>
                                )}
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="bg-gray-950 rounded-[2.5rem] p-10 text-white shadow-2xl shadow-black/20 relative overflow-hidden group">
                            <div className="absolute bottom-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ShieldCheck className="w-32 h-32" />
                            </div>
                            <div className="relative z-10 space-y-4">
                                <p className="text-red-500 font-black uppercase tracking-[0.2em] text-xs flex items-center gap-3">
                                    <AlertCircle className="w-5 h-5" /> GÜVENLİK PROTOKOLÜ
                                </p>
                                <p className="text-gray-400 text-xs font-bold leading-relaxed">
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
