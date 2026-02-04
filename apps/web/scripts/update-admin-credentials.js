const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function main() {
    console.log('Starting admin credentials update...');

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

        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        envVars[key] = value;
    });

    const supabaseUrl = envVars['NEXT_PUBLIC_SUPABASE_URL'];
    const serviceRoleKey = envVars['SUPABASE_SERVICE_ROLE_KEY'];

    if (!supabaseUrl || !serviceRoleKey) {
        console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
        process.exit(1);
    }

    // 2. Initialize Supabase Admin
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    const NEW_EMAIL = 'admin@velora.com';
    const NEW_PASSWORD = 'admin.123!';
    const OLD_EMAIL = 'admin@esnew.com';

    console.log(`Target: ${NEW_EMAIL}`);

    // 3. Check if user exists (by new email)
    // We can't easily "find by email" without listing, but createUser will fail if exists, or simple list.

    // Try to find the OLD user first to rename/update
    // List users (limit 50, usually admin is early)
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
        console.error('Error listing users:', listError);
        process.exit(1);
    }

    const oldUser = users.find(u => u.email === OLD_EMAIL);
    const existingNewUser = users.find(u => u.email === NEW_EMAIL);

    let userId;

    if (existingNewUser) {
        console.log(`User ${NEW_EMAIL} already exists. Updating password...`);
        userId = existingNewUser.id;
        const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
            password: NEW_PASSWORD,
            user_metadata: { role: 'admin' }, // Ensure metadata role is admin
            email_confirm: true
        });
        if (updateError) throw updateError;
        console.log('Password updated.');

    } else if (oldUser) {
        console.log(`Found old admin ${OLD_EMAIL}. Updating to ${NEW_EMAIL}...`);
        userId = oldUser.id;
        const { error: updateError } = await supabase.auth.admin.updateUserById(userId, {
            email: NEW_EMAIL,
            password: NEW_PASSWORD,
            user_metadata: { role: 'admin' },
            email_confirm: true
        });
        if (updateError) throw updateError;
        console.log('Email and password updated.');
    } else {
        console.log('No existing admin user found. Creating new one...');
        const { data: { user }, error: createError } = await supabase.auth.admin.createUser({
            email: NEW_EMAIL,
            password: NEW_PASSWORD,
            email_confirm: true,
            user_metadata: { role: 'admin' }
        });
        if (createError) throw createError;
        userId = user.id;
        console.log(`Created new user: ${userId}`);
    }

    // 4. Ensure public.users table (and role column) is correct
    // upsert into public.users
    console.log(`Upserting public.users for ${userId}...`);
    const { error: dbError } = await supabase.from('users').upsert({
        id: userId,
        email: NEW_EMAIL,
        role: 'admin',
        updated_at: new Date().toISOString()
    }, { onConflict: 'id' });

    if (dbError) {
        console.error('Error updating public.users:', dbError);
        process.exit(1);
    }

    console.log('SUCCESS: Admin credentials updated.');
}

main().catch(e => {
    console.error('Unhandled error:', e);
    process.exit(1);
});
