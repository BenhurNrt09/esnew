import { createClient as createServerClient } from '@repo/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = createServerClient();

        // Get all featured listings with listing details
        const { data, error } = await supabase
            .from('featured_listings')
            .select(`
                *,
                listing:listings(
                    id,
                    title,
                    slug,
                    phone,
                    is_active,
                    created_at,
                    city:cities(name),
                    category:categories(name)
                )
            `)
            .order('featured_until', { ascending: true });

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const supabase = createServerClient();
        const body = await request.json();
        const { listing_id, hours } = body;

        if (!listing_id || !hours) {
            return NextResponse.json(
                { error: 'listing_id and hours are required' },
                { status: 400 }
            );
        }

        // Calculate featured_until timestamp
        const featured_until = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        // Insert or update featured listing
        const { data, error } = await supabase
            .from('featured_listings')
            .upsert({
                listing_id,
                featured_until,
                created_by: user?.id,
            })
            .select()
            .single();

        if (error) throw error;

        // Update is_featured flag on the listing
        await supabase
            .from('listings')
            .update({ is_featured: true })
            .eq('id', listing_id);

        return NextResponse.json({ data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const supabase = createServerClient();
        const { searchParams } = new URL(request.url);
        const listing_id = searchParams.get('listing_id');

        if (!listing_id) {
            return NextResponse.json(
                { error: 'listing_id is required' },
                { status: 400 }
            );
        }

        // Delete featured listing
        const { error } = await supabase
            .from('featured_listings')
            .delete()
            .eq('listing_id', listing_id);

        if (error) throw error;

        // Update is_featured flag on the listing
        await supabase
            .from('listings')
            .update({ is_featured: false })
            .eq('id', listing_id);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(request: Request) {
    try {
        const supabase = createServerClient();
        const body = await request.json();
        const { listing_id, additional_hours } = body;

        if (!listing_id || !additional_hours) {
            return NextResponse.json(
                { error: 'listing_id and additional_hours are required' },
                { status: 400 }
            );
        }

        // Get current featured listing
        const { data: current, error: fetchError } = await supabase
            .from('featured_listings')
            .select('featured_until')
            .eq('listing_id', listing_id)
            .single();

        if (fetchError) throw fetchError;

        // Calculate new featured_until (extend from current time or existing time, whichever is later)
        const now = new Date();
        const currentUntil = new Date(current.featured_until);
        const baseTime = currentUntil > now ? currentUntil : now;
        const new_featured_until = new Date(baseTime.getTime() + additional_hours * 60 * 60 * 1000).toISOString();

        // Update featured listing
        const { data, error } = await supabase
            .from('featured_listings')
            .update({ featured_until: new_featured_until })
            .eq('listing_id', listing_id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
