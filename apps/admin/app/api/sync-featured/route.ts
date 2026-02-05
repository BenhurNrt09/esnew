import { createClient as createServerClient } from '@repo/lib/supabase/server';
import { NextResponse } from 'next/server';

// Sync featured status for all listings
export async function POST() {
    try {
        const supabase = createServerClient();

        // Call the database function to sync featured status
        const { error } = await supabase.rpc('sync_featured_status');

        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Featured status synced successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
