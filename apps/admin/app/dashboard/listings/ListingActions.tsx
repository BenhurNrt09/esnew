'use client';

import { useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { Star, Power, Edit, Eye, Trash2 } from 'lucide-react';
import { deleteListingOnly } from '../profiles/actions';
import Link from 'next/link';

interface ListingActionsProps {
    id: string;
    slug: string;
    isActive: boolean;
    isFeatured: boolean;
}

export function ListingActions({ id, slug, isActive, isFeatured }: ListingActionsProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const supabase = createClient();

    const toggleStatus = async () => {
        setLoading(true);
        try {
            await supabase.from('listings').update({ is_active: !isActive }).eq('id', id);
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    const toggleFeatured = async () => {
        setLoading(true);
        try {
            await supabase.from('listings').update({ is_featured: !isFeatured }).eq('id', id);
            router.refresh();
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Bu ilanı silmek istediğinize emin misiniz?')) return;
        setLoading(true);
        try {
            const res = await deleteListingOnly(id);
            if (res.success) {
                router.refresh();
            } else {
                alert('Silme hatası: ' + res.error);
            }
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="flex items-center justify-end gap-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleFeatured}
                disabled={loading}
                title={isFeatured ? "Öne çıkarmayı kaldır" : "Öne çıkar"}
                className={`h-9 w-9 rounded-xl transition-all ${isFeatured
                    ? "text-primary bg-primary/20 border border-primary/30 shadow-lg shadow-primary/10"
                    : "text-gray-500 hover:text-primary hover:bg-white/5 border border-transparent"}`}
            >
                <Star className={`h-4.5 w-4.5 ${isFeatured ? 'fill-current' : ''}`} />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={toggleStatus}
                disabled={loading}
                title={isActive ? "Yayından kaldır" : "Yayınla"}
                className={`h-9 w-9 rounded-xl transition-all ${isActive
                    ? "text-green-400 bg-green-500/10 border border-green-500/20 shadow-lg shadow-green-500/5"
                    : "text-gray-500 hover:text-green-500 hover:bg-white/5 border border-transparent"}`}
            >
                <Power className="h-4.5 w-4.5" />
            </Button>

            <Button variant="ghost" size="icon" asChild title="Düzenle" className="h-9 w-9 rounded-xl text-gray-400 hover:text-primary hover:bg-white/5 border border-transparent">
                <Link href={`/dashboard/listings/${id}/edit`}>
                    <Edit className="h-4.5 w-4.5" />
                </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild title="Sitede Gör" className="h-9 w-9 rounded-xl text-gray-400 hover:text-primary hover:bg-white/5 border border-transparent">
                <a
                    href={`${process.env.NEXT_PUBLIC_WEB_URL || 'http://localhost:3000'}/ilan/${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <Eye className="h-4.5 w-4.5" />
                </a>
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={loading}
                title="İlanı Sil"
                className="h-9 w-9 rounded-xl text-gray-500 hover:text-red-500 hover:bg-red-500/10 border border-transparent transition-all"
            >
                <Trash2 className="h-4.5 w-4.5" />
            </Button>
        </div>
    );
}
