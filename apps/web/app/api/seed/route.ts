import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseKey);

export async function GET() {
    try {
        console.log('Seeding data started...');

        // 1. Kategoriler
        const categories = [
            { name: 'Saç Rengi', slug: 'sac-rengi', order: 1 },
            { name: 'Vücut Tipi', slug: 'vucut-tipi', order: 2 },
            { name: 'Göz Rengi', slug: 'goz-rengi', order: 3 },
            { name: 'Yaş Grubu', slug: 'yas-grubu', order: 4 },
            { name: 'Hizmetler', slug: 'hizmetler', order: 5 },
        ];

        let createdCats: any[] = [];

        for (const cat of categories) {
            const { data: existing } = await supabase.from('categories').select('id, slug').eq('slug', cat.slug).single();
            if (existing) {
                createdCats.push(existing);
                continue;
            }
            // Auth gerekebilir, RLS kapalıysa geçer. Değilse aşağıda auth yapınca buraya geri dönmeli.
            // Genelde public tablolar insert'e kapalıdır.
            // O yüzden önce GİRİŞ YAPALIM.
        }

        // --- AUTHENTICATION ---
        let userId;
        let session;

        const { data: signInData } = await supabase.auth.signInWithPassword({
            email: 'demo@esnew.com',
            password: 'password123'
        });

        if (signInData.session) {
            userId = signInData.user.id;
            session = signInData.session;
        } else {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email: 'demo@esnew.com',
                password: 'password123',
                options: { data: { role: 'admin' } }
            });

            if (signUpData.session) {
                userId = signUpData.user?.id;
                session = signUpData.session;
            } else if (signUpError) {
                throw new Error(`SignUp Eror: ${signUpError.message}`);
            }
        }

        if (!session) {
            // Kullanıcı var ama session yok (confirm gerek) veya hata.
            throw new Error('Authentication failed. No session obtained.');
        }

        // Set Session
        await supabase.auth.setSession({
            access_token: session.access_token,
            refresh_token: session.refresh_token!,
        });

        // Artık yetkiliyiz. Kategorileri ekleyebiliriz (Admin role kontrolü varsa işe yarar).
        // Eğer kategori tablosu sadece admin insert ise ve bu user admin değilse hata alırız.
        // Ama local seed için genelde RLS esnektir veya demo user admin yapılır.

        for (const cat of categories) {
            // Tekrar kontrol (yukarıdaki array boş kalmıştı)
            const { data: existing } = await supabase.from('categories').select('id, slug').eq('slug', cat.slug).single();
            if (existing) {
                if (!createdCats.find(c => c.slug === existing.slug)) createdCats.push(existing);
                continue;
            }
            const { data, error } = await supabase.from('categories').insert(cat).select().single();
            if (data) createdCats.push(data);
            if (error) console.error('Cat Insert Error:', error.message);
        }

        // 2. Alt Kategoriler
        if (createdCats.length > 0) {
            const hairCat = createdCats.find(c => c.slug === 'sac-rengi');
            if (hairCat) {
                const subs = ['Sarı', 'Kumral', 'Siyah', 'Kızıl', 'Kahverengi'];
                for (const sub of subs) {
                    await supabase.from('categories').insert({
                        name: sub,
                        slug: `sac-${sub.toLowerCase()}`,
                        parent_id: hairCat.id
                    }).select();
                }
            }
        }

        // 3. Şehirler
        const cities = [
            { name: 'İstanbul', slug: 'istanbul' },
            { name: 'Ankara', slug: 'ankara' },
            { name: 'İzmir', slug: 'izmir' },
            { name: 'Antalya', slug: 'antalya' },
            { name: 'Bursa', slug: 'bursa' },
        ];

        let createdCities: any[] = [];
        for (const city of cities) {
            const { data: existing } = await supabase.from('cities').select('id, slug').eq('slug', city.slug).single();
            if (existing) {
                createdCities.push(existing);
                continue;
            }
            const { data } = await supabase.from('cities').insert(city).select().single();
            if (data) createdCities.push(data);
        }

        // 5. Listings
        const titles = ['Elif Model', 'Ayşe', 'Zeynep', 'Melis', 'Selin', 'Gizem', 'Ece', 'Nazlı'];
        const serviceCat = createdCats.find(c => c.slug === 'hizmetler') || createdCats[0];
        const ist = createdCities.find(c => c.slug === 'istanbul') || createdCities[0];

        let createdListings = 0;
        if (serviceCat && ist && userId) {
            for (let i = 0; i < titles.length; i++) {
                const title = titles[i];
                const slug = `${title.toLowerCase().replace(/ /g, '-')}-${Date.now()}-${i}`;

                const { error } = await supabase.from('listings').insert({
                    user_id: userId,
                    title: title + ' ' + (i + 1),
                    slug: slug,
                    description: 'Profesyonel çekimler ve etkinlikler için uygunum. Detaylı bilgi için profilimi inceleyin.',
                    price: 1500 + (i * 100),
                    city_id: ist.id,
                    category_id: serviceCat.id,
                    is_active: true,
                    is_featured: i < 4,
                });

                if (!error) createdListings++;
                else console.error('Listing Error:', error.message);
            }
        }

        return NextResponse.json({ success: true, message: `Data seeded. Listings: ${createdListings}` });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
