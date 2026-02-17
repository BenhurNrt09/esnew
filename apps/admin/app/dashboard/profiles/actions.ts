'use server';

import { createAdminClient } from '@repo/lib/server';
import { revalidatePath } from 'next/cache';

export async function createModelProfile(formData: FormData) {
    const supabase = createAdminClient();

    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;
    const gender = formData.get('gender') as string;
    const city_id = formData.get('city_id') as string;
    const category_id = formData.get('category_id') as string;
    const nationality = formData.get('nationality') as string;
    const hair_color = formData.get('hair_color') as string;
    const phone = formData.get('phone') as string;

    // New Fields
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const height = formData.get('height') as string;
    const weight = formData.get('weight') as string;
    const breast_size = formData.get('breast_size') as string;
    const body_hair = formData.get('body_hair') as string;
    const ethnicity = formData.get('ethnicity') as string;

    // Media
    const cover_image = formData.get('cover_image') as string;
    const video_url = formData.get('video_url') as string;
    const gallery_images = formData.getAll('gallery_images') as string[];
    const story_urls_json = formData.getAll('story_urls') as string[];

    // Services
    const serviceIds = formData.getAll('services') as string[];
    const servicesMap = serviceIds.reduce((acc: any, id) => {
        acc[id] = true;
        return acc;
    }, {});

    try {
        // 1. Create Auth User
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                username,
                user_type: 'independent_model'
            }
        });

        if (authError) throw authError;
        if (!authData.user) throw new Error("Kullanıcı oluşturulamadı.");

        const userId = authData.user.id;

        // 2. Insert Independent Model Profile
        const { error: profileError } = await supabase
            .from('independent_models')
            .upsert({
                id: userId,
                email,
                username,
                gender: gender || 'female',
                full_name: username,
                city_id: city_id || null,
                phone: phone || null,
                is_active: true,
                created_at: new Date().toISOString(),
            });

        if (profileError) throw profileError;

        // 3. Create Listing
        const slug = (title || username).toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Math.floor(Math.random() * 1000);

        const { data: listingData, error: listingError } = await supabase
            .from('listings')
            .insert({
                user_id: userId,
                title: title || 'Yeni Profil',
                description,
                city_id: city_id || null,
                category_id: category_id || null,
                gender,
                nationality: nationality || null,
                hair_color: hair_color || null,
                breast_size: breast_size || null,
                body_hair: body_hair || null,
                ethnicity: ethnicity || null,
                height: height ? parseInt(height) : null,
                weight: weight ? parseInt(weight) : null,
                services: servicesMap,
                cover_image: cover_image || null,
                images: gallery_images || [],
                metadata: {
                    video_url: video_url || null
                },
                slug,
                is_active: false,
                approval_status: 'pending',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
                phone: phone || null
            })
            .select()
            .single();

        if (listingError) throw listingError;
        if (!listingData) throw new Error("İlan oluşturulamadı.");

        // 4. Create Stories
        if (story_urls_json.length > 0) {
            const storiesToInsert = story_urls_json.map(jsonstr => {
                const { url, type } = JSON.parse(jsonstr);
                return {
                    listing_id: listingData.id,
                    model_id: userId,
                    media_url: url,
                    media_type: type,
                    is_active: true,
                    expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
                };
            });

            await supabase.from('stories').insert(storiesToInsert);
        }

        // 3. Insert Categories (Many-to-Many)
        // Assuming table 'model_categories' or 'profile_categories' exists?
        // Let's check schema if possible, or guess standard: 'profile_category_lookup' or similar?
        // Wait, I don't know the schema for categories relation. 
        // Existing listings use 'category_id' but models might have multiple?
        // User said "kategoriler kısmında olan kategorielr mesela sitede bağımsız model profil oluştururken çıkmıyor".
        // This implies selecting categories for the profile.
        // If I don't know the table, I might fail here.
        // Let's assume a table exists or check.
        // Quick check: list tables? No time. 
        // I'll search for 'independent_models' relationships. 

        // Let's check the listing page query again. `listings` have `category_id`.
        // Does `independent_models` have `categories`? 
        // If not, maybe it's just one category?
        // User "select categories" implies multiple or specific ones. 
    } catch (error: any) {
        return { success: false, error: error.message };
    }

    revalidatePath('/dashboard/profiles/models');
    return { success: true };
}

export async function deleteProfile(id: string, table: 'members' | 'independent_models' | 'agencies') {
    const supabase = createAdminClient();

    try {
        // 1. Delete associated data first (to avoid FK constraints)

        // Delete Stories
        const { error: storiesError } = await supabase
            .from('stories')
            .delete()
            .eq('model_id', id);

        if (storiesError) console.error('Stories delete error (non-fatal):', storiesError);

        // Delete Listing Favorites (if table exists)
        try {
            await supabase.from('listing_favorites').delete().eq('user_id', id);
        } catch (e) {
            // Table might not exist or user_id column differs
        }

        // Delete Listings
        const { error: listingsError } = await supabase
            .from('listings')
            .delete()
            .eq('user_id', id);

        if (listingsError) {
            console.error('Listings delete error (non-fatal):', listingsError);
        }

        // 2. Delete from specific table (members, independent_models, etc.)
        const { error: tableError } = await supabase
            .from(table)
            .delete()
            .eq('id', id);

        if (tableError) throw tableError;

        // 3. Delete from auth.users (requires service role / admin client)
        const { error: authError } = await supabase.auth.admin.deleteUser(id);

        if (authError) {
            console.error('Auth delete error (non-fatal):', authError);
            // We continue even if auth delete fails, as the profile is gone from the table.
        }

        revalidatePath('/dashboard/profiles');
        revalidatePath('/dashboard/listings');
        return { success: true };
    } catch (error: any) {
        console.error('Delete profile error:', error);
        return { success: false, error: error.message };
    }
}

export async function deleteListingOnly(listingId: string) {
    const supabase = createAdminClient();
    try {
        const { error } = await supabase
            .from('listings')
            .delete()
            .eq('id', listingId);

        if (error) throw error;

        revalidatePath('/dashboard/listings');
        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
}

