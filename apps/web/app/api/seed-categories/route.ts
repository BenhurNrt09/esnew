import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Simple slugify for server-side usage without dependencies
function simpleSlugify(text: string) {
    const trMap: Record<string, string> = {
        'ğ': 'g', 'Ğ': 'G',
        'ü': 'u', 'Ü': 'U',
        'ş': 's', 'Ş': 'S',
        'ı': 'i', 'İ': 'I',
        'ö': 'o', 'Ö': 'O',
        'ç': 'c', 'Ç': 'C'
    };
    return text
        .split('')
        .map(char => trMap[char] || char)
        .join('')
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/-+/g, '-'); // Remove duplicate -
}

export async function GET() {
    try {
        // Service Role Key ile Admin Yetkisi (RLS Bypass)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const categories = [
            {
                name: 'Saç Rengi',
                slug: 'sac-rengi',
                subs: ['Sarı', 'Esmer', 'Kumral', 'Kızıl', 'Siyah', 'Boyalı / Renkli']
            },
            {
                name: 'Göz Rengi',
                slug: 'goz-rengi',
                subs: ['Mavi', 'Yeşil', 'Kahverengi', 'Ela', 'Siyah']
            },
            {
                name: 'Vücut Tipi',
                slug: 'vucut-tipi',
                subs: ['Zayıf', 'Fit / Sportif', 'Balık Etli', 'Dolgun', 'Büyük Beden']
            },
            {
                name: 'Uyruk / Köken',
                slug: 'uyruk',
                subs: ['Türk', 'Rus', 'Ukrayna', 'Azerbaycan', 'Latin', 'Avrupa', 'Asya', 'Afro', 'Arap']
            },
            {
                name: 'Hizmetler',
                slug: 'hizmetler',
                subs: ['Eskort', 'Masaj', 'Dans / Show', 'Partner']
            }
        ];

        let log = [];

        for (const cat of categories) {
            let parentId: string | null = null;

            // 1. Ana Kategori Kontrolü
            const { data: existing } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', cat.slug)
                .single();

            if (existing) {
                parentId = existing.id;
                // Update name
                await supabase.from('categories').update({ name: cat.name, is_active: true }).eq('id', parentId);
                log.push(`Updated Parent: ${cat.name}`);
            } else {
                // Insert new
                const { data: created, error } = await supabase
                    .from('categories')
                    .insert({ name: cat.name, slug: cat.slug, is_active: true })
                    .select('id')
                    .single();

                if (created) {
                    parentId = created.id;
                    log.push(`Created Parent: ${cat.name}`);
                }
                if (error) {
                    console.error('Create Error:', error);
                    log.push(`Error creating ${cat.name}: ${error.message}`);
                }
            }

            // 2. Alt Kategoriler
            if (parentId) {
                for (const subName of cat.subs) {
                    const subSlug = simpleSlugify(subName);

                    // Upsert Subcategory
                    // Not: Slug çakışması varsa güncelle, yoksa ekle.
                    const { error: subError } = await supabase
                        .from('categories')
                        .upsert({
                            name: subName,
                            slug: subSlug,
                            parent_id: parentId,
                            is_active: true
                        }, { onConflict: 'slug' });

                    if (subError) console.error(`Sub Error (${subName}):`, subError);
                }
                log.push(`Processed ${cat.subs.length} subcategories for ${cat.name}`);
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Kategori veri tabanı kurulumu tamamlandı.',
            logs: log
        });

    } catch (err: any) {
        return NextResponse.json({
            success: false,
            error: err.message
        }, { status: 500 });
    }
}
