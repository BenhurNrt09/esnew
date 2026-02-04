const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function main() {
    console.log('Starting cleanup of spam profiles...');

    // 1. Read .env from root
    const envPath = path.resolve(__dirname, '../../../.env');
    console.log(`Reading .env from: ${envPath}`);

    if (!fs.existsSync(envPath)) {
        console.error('.env file not found!');
        process.exit(1);
    }

    const envContent = fs.readFileSync(envPath, 'utf8');
    const envVars = {};

    envContent.split(/\r?\n/).forEach(line => {
        line = line.trim();
        if (!line || line.startsWith('#')) return;
        const idx = line.indexOf('=');
        if (idx === -1) return;
        const key = line.substring(0, idx).trim();
        let value = line.substring(idx + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        envVars[key] = value;
    });

    const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
    const serviceRoleKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

    if (!supabaseUrl || !serviceRoleKey) {
        console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
        process.exit(1);
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    const SPAM_EMAIL = 'demo@esnew.com';

    // 1. Find the user
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    if (listError) {
        console.error('Error listing users:', listError);
        process.exit(1);
    }

    const spamUser = users.find(u => u.email === SPAM_EMAIL);

    if (!spamUser) {
        console.log(`User ${SPAM_EMAIL} not found. Nothing to clean.`);
    } else {
        const userId = spamUser.id;
        console.log(`Found spam user: ${userId} (${SPAM_EMAIL})`);

        // 2. Delete from listings explicitly (in case of no cascade)
        console.log('Deleting listings...');
        const { error: listingsError } = await supabase.from('listings').delete().eq('user_id', userId);
        if (listingsError) console.error('Error deleting listings:', listingsError.message);
        else console.log('Listings deleted (if any).');

        // 3. Delete from members/agencies/models explicitly
        console.log('Deleting profile records...');
        await supabase.from('members').delete().eq('id', userId);
        await supabase.from('independent_models').delete().eq('id', userId);
        await supabase.from('agencies').delete().eq('id', userId);

        // 4. Delete the User
        console.log('Deleting auth user...');
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
        if (deleteError) {
            console.error('Error deleting user:', deleteError.message);
        } else {
            console.log('Successfully deleted spam user.');
        }
    }

    // Also check for any other listings with default titles if user ID was different?
    // The seed script always used that email/user. So this should be enough.

    console.log('Cleanup complete.');
}

main().catch(e => console.error(e));
