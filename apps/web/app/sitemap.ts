import { createServerClient } from '@repo/lib/server';
import type { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = createServerClient();
    const baseUrl = 'https://veloraescortworld.com';

    // Homepage & Static Pages
    const routes: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/sss`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/gizlilik`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/kosullar`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.4,
        },
        {
            url: `${baseUrl}/guvenlik`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${baseUrl}/iletisim`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        },
    ];

    // Cities
    const { data: cities } = await supabase
        .from('cities')
        .select('slug, updated_at')
        .eq('is_active', true);

    if (cities) {
        cities.forEach((city) => {
            routes.push({
                url: `${baseUrl}/sehir/${city.slug}`,
                lastModified: new Date(city.updated_at),
                changeFrequency: 'weekly',
                priority: 0.8,
            });
        });
    }

    // Categories
    const { data: categories } = await supabase
        .from('categories')
        .select('slug, updated_at');

    if (categories) {
        categories.forEach((category) => {
            routes.push({
                url: `${baseUrl}/kategori/${category.slug}`,
                lastModified: new Date(category.updated_at),
                changeFrequency: 'weekly',
                priority: 0.8,
            });
        });
    }

    // Listings
    const { data: listings } = await supabase
        .from('listings')
        .select('slug, updated_at')
        .eq('is_active', true);

    if (listings) {
        listings.forEach((listing) => {
            routes.push({
                url: `${baseUrl}/ilan/${listing.slug}`,
                lastModified: new Date(listing.updated_at),
                changeFrequency: 'monthly',
                priority: 0.6,
            });
        });
    }

    return routes;
}
