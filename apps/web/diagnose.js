
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ddxcewpzyvnagopzynfh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkeGNld3B6eXZuYWdvcHp5bmZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQxMDE0NiwiZXhwIjoyMDg0OTg2MTQ2fQ.XDLDGiacios36JIqVo2xfGkOLRnW3GlY4bAS3ulZkxI';

const supabase = createClient(supabaseUrl, supabaseKey);

async function diagnose() {
    console.log('--- Diagnosing Listings and Agencies ---');

    try {
        // 1. Total listings
        const { data: allListings, count: totalCount, error: lError } = await supabase
            .from('listings')
            .select('id, title, user_id, is_active', { count: 'exact' });

        if (lError) throw lError;
        console.log(`Total Listings: ${totalCount}`);

        // 2. Agencies
        const { data: agencies, error: aError } = await supabase
            .from('agencies')
            .select('id, username, company_name');

        if (aError) throw aError;
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
        const { data: models, error: mError } = await supabase
            .from('independent_models')
            .select('id, username');

        if (mError) throw mError;
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
        const { data: admins, error: uError } = await supabase
            .from('users')
            .select('*')
            .eq('role', 'admin');

        if (uError) throw uError;
        console.log(`Admins in public.users: ${admins?.length || 0}`);
        admins?.forEach(a => console.log(` - [${a.id}] ${a.email}`));

    } catch (err) {
        console.error('Diagnosis failed:', err.message);
    }
}

diagnose();
