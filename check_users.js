
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
const path = require('path');

// Load env from apps/admin/.env
dotenv.config({ path: path.resolve(__dirname, 'apps/admin/.env') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { count: authCount } = await supabase.auth.admin.listUsers();
    const { count: memberCount } = await supabase.from('members').select('*', { count: 'exact', head: true });
    const { count: agencyCount } = await supabase.from('agencies').select('*', { count: 'exact', head: true });
    const { count: modelCount } = await supabase.from('independent_models').select('*', { count: 'exact', head: true });

    console.log('--- User Counts ---');
    console.log('Total Auth Users:', authCount);
    console.log('Members table:', memberCount);
    console.log('Agencies table:', agencyCount);
    console.log('Models table:', modelCount);

    const { data: users } = await supabase.auth.admin.listUsers();
    console.log('\n--- Auth User Types (metadata) ---');
    users.users.forEach(u => {
        console.log(`Email: ${u.email}, Type: ${u.user_metadata?.user_type}`);
    });
}

check();
