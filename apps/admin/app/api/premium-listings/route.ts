import { createClient as createServerClient } from '@repo/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('premium_listings')
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
            .order('premium_until', { ascending: true });

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

        const premium_until = new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();
        const { data: { user } } = await supabase.auth.getUser();

        const { data, error } = await supabase
            .from('premium_listings')
            .upsert({
                listing_id,
                premium_until,
                created_by: user?.id,
            })
            .select()
            .single();

        if (error) throw error;

        await supabase
            .from('listings')
            .update({ is_premium: true })
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

        const { error } = await supabase
            .from('premium_listings')
            .delete()
            .eq('listing_id', listing_id);

        if (error) throw error;

        await supabase
            .from('listings')
            .update({ is_premium: false })
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

        const { data: current, error: fetchError } = await supabase
            .from('premium_listings')
            .select('premium_until')
            .eq('listing_id', listing_id)
            .single();

        if (fetchError) throw fetchError;

        const now = new Date();
        const currentUntil = new Date(current.premium_until);
        const baseTime = currentUntil > now ? currentUntil : now;
        const new_premium_until = new Date(baseTime.getTime() + additional_hours * 60 * 60 * 1000).toISOString();

        const { data, error } = await supabase
            .from('premium_listings')
            .update({ premium_until: new_premium_until })
            .eq('listing_id', listing_id)
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
