import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load env from apps/web
dotenv.config({ path: path.resolve(process.cwd(), 'apps/web/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log('--- DIAGNOSING LISTINGS ---');

    const { data: listings, error } = await supabase
        .from('listings')
        .select('id, title, is_active, is_featured, created_at, city_id, category_id')
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error('Error fetching listings:', error);
        return;
    }

    console.log(`Found ${listings.length} recent listings:`);
    listings.forEach(l => {
        console.log(`[${l.is_active ? 'ACTIVE' : 'INACTIVE'}] [${l.is_featured ? 'FEATURED' : 'NORMAL'}] ${l.title} (ID: ${l.id}) Created: ${l.created_at}`);
    });

    const { count: inactiveCount } = await supabase.from('listings').select('*', { count: 'exact', head: true }).eq('is_active', false);
    console.log(`\nTotal Inactive Listings: ${inactiveCount}`);

    const { count: activeCount } = await supabase.from('listings').select('*', { count: 'exact', head: true }).eq('is_active', true);
    console.log(`Total Active Listings: ${activeCount}`);
}

diagnose();
