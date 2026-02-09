
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from both apps/web and root if possible
dotenv.config({ path: path.resolve(process.cwd(), 'apps/web/.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log('--- Diagnosing Listings and Agencies ---');

    // 1. Total listings
    const { data: allListings, count: totalCount } = await supabase
        .from('listings')
        .select('id, title, user_id, is_active', { count: 'exact' });

    console.log(`Total Listings: ${totalCount}`);

    // 2. Agencies
    const { data: agencies } = await supabase
        .from('agencies')
        .select('id, username, company_name');

    console.log(`Total Agencies: ${agencies?.length || 0}`);

    // 3. Match listings to agencies
    if (allListings && agencies) {
        const agencyIds = new Set(agencies.map(a => a.id));
        const agencyListings = allListings.filter(l => agencyIds.has(l.user_id));
        console.log(`Listings owned by Agencies: ${agencyListings.length}`);
        agencyListings.forEach(l => {
            const agency = agencies.find(a => a.id === l.user_id);
            console.log(` - [${l.id}] ${l.title} (Owner: ${agency?.company_name || agency?.username}, Active: ${l.is_active})`);
        });
    }

    // 4. Independent Models
    const { data: models } = await supabase
        .from('independent_models')
        .select('id, username');

    if (allListings && models) {
        const modelIds = new Set(models.map(m => m.id));
        const modelListings = allListings.filter(l => modelIds.has(l.user_id));
        console.log(`Listings owned by Models: ${modelListings.length}`);
    }

    // 5. Listings with NO known user type
    if (allListings && agencies && models) {
        const knownIds = new Set([...agencies.map(a => a.id), ...models.map(m => m.id)]);
        const unknownListings = allListings.filter(l => !knownIds.has(l.user_id));
        console.log(`Listings with unknown/other owner: ${unknownListings.length}`);
        unknownListings.forEach(l => console.log(` - [${l.id}] ${l.title} (UserID: ${l.user_id})`));
    }

    // 6. Check users table for admins
    const { data: admins } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'admin');

    console.log(`Admins in public.users: ${admins?.length || 0}`);
    admins?.forEach(a => console.log(` - [${a.id}] ${a.email}`));
}

diagnose();
