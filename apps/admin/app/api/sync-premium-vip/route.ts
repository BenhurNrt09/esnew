import { createClient as createServerClient } from '@repo/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        const supabase = createServerClient();

        // Call the database function to sync premium and vip status
        const { error } = await supabase.rpc('sync_premium_vip_status');

        if (error) throw error;

        return NextResponse.json({ success: true, message: 'Premium and VIP status synced successfully' });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
