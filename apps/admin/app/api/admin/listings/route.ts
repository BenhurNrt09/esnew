import { createClient as createServerClient } from '@repo/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const supabase = createServerClient();

        const { data, error } = await supabase
            .from('listings')
            .select('id, title, slug, phone, price, created_at, is_featured, is_premium, is_vip')
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return NextResponse.json({ data });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
