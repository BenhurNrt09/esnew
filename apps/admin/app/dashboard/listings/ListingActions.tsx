'use client';

import { useState } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { Star, Power, Edit, Eye } from 'lucide-react';
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

    return (
        <div className="flex items-center justify-end gap-1">
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleFeatured}
                disabled={loading}
                title={isFeatured ? "Öne çıkarmayı kaldır" : "Öne çıkar"}
                className={isFeatured ? "text-amber-500 hover:text-amber-600 bg-amber-50" : "text-gray-400 hover:text-amber-500"}
            >
                <Star className={`h-4 w-4 ${isFeatured ? 'fill-current' : ''}`} />
            </Button>

            <Button
                variant="ghost"
                size="icon"
                onClick={toggleStatus}
                disabled={loading}
                title={isActive ? "Yayından kaldır" : "Yayınla"}
                className={isActive ? "text-green-600 hover:text-green-700 bg-green-50" : "text-gray-400 hover:text-green-600"}
            >
                <Power className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="icon" asChild title="Düzenle">
                <Link href={`/dashboard/listings/${id}/edit`}>
                    <Edit className="h-4 w-4 text-blue-600" />
                </Link>
            </Button>

            <Button variant="ghost" size="icon" asChild title="Sitede Gör">
                <a href={`http://localhost:3000/ilan/${slug}`} target="_blank" rel="noopener noreferrer">
                    <Eye className="h-4 w-4 text-gray-500" />
                </a>
            </Button>
        </div>
    );
}
