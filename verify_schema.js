const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkSchema() {
    console.log('Checking listings table columns...');
    const { data, error } = await supabase
        .from('listings')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching listings:', error);
        return;
    }

    if (data && data.length > 0) {
        const columns = Object.keys(data[0]);
        console.log('Available columns:', columns);
        const hasPremium = columns.includes('is_premium');
        const hasVip = columns.includes('is_vip');
        console.log(`Has is_premium: ${hasPremium}`);
        console.log(`Has is_vip: ${hasVip}`);
    } else {
        console.log('No listings found to check columns.');
    }
}

checkSchema();
