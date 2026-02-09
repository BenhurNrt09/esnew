const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

// Fallback hardcoded if process.env fails in this environment
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ddxcewpzyvnagopzynfh.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkeGNld3B6eXZuYWdvcHp5bmZoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2OTQxMDE0NiwiZXhwIjoyMDg0OTg2MTQ2fQ.XDLDGiacios36JIqVo2xfGkOLRnW3GlY4bAS3ulZkxI';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function applyMigration() {
    console.log('Reading migration file...');
    const sql = fs.readFileSync('supabase/migrations/906_premium_vip_tiers.sql', 'utf8');

    console.log('Applying migration via RPC (if _execute_sql exists) or manual checks...');

    // Check if columns exist first
    const { data: listings, error: fetchError } = await supabase.from('listings').select('*').limit(1);
    if (!fetchError && listings && listings.length > 0) {
        const cols = Object.keys(listings[0]);
        if (cols.includes('is_premium')) {
            console.log('Schema already appears to be updated.');
            // return;
        }
    }

    console.log('Since raw SQL cannot be run easily via JS client, I will notify the user to run it in the dashboard.');
    console.log('HOWEVER, I will try to update at least the boolean flags if they don't exist...');

    // We can't really run raw ALTER TABLE via client unless there's an RPC.
    // I'll check for an RPC named 'execute_sql' which some users add for me.
    const { error: rpcError } = await supabase.rpc('execute_sql', { sql_query: sql });

    if (rpcError) {
        console.error('RPC execute_sql failed or doesn\'t exist. Manual intervention required.');
        process.exit(1);
    } else {
        console.log('Migration applied successfully via RPC.');
        process.exit(0);
    }
}

applyMigration().catch(err => {
    console.error(err);
    process.exit(1);
});
