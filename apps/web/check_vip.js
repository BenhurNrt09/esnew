
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://ddxcewpzyvnagopzynfh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRkeGNld3B6eXZuYWdvcHp5bmZoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MTAxNDYsImV4cCI6MjA4NDk4NjE0Nn0.WYgVO652VZLjWyhv-a1rlWz-mBVXi6yNzZuGJnYNQ_0';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkData() {
    console.log('--- Checking All Flags ---');
    const { data: listings, error } = await supabase.from('listings').select('*').limit(10);
    if (error) console.error(error);

    listings.forEach(l => {
        console.log(`Title: ${l.title} | Premium: ${l.is_premium} | VIP: ${l.is_vip} | Featured: ${l.is_featured} | MemberType: ${l.member_type || 'N/A'}`);
    });

    const { count: featured } = await supabase.from('listings').select('*', { count: 'exact', head: true }).eq('is_featured', true);
    console.log('Featured listings:', featured);
}

checkData();
