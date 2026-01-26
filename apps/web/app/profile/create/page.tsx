'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@repo/lib/supabase/client';
import { Button, Input, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@repo/ui';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@repo/lib/i18n';
import type { Category, City } from '@repo/types';

// Helper to sort categories by type
const groupCategories = (categories: Category[]) => {
    return {
        hairColor: categories.filter(c => c.parent_id && categories.find(p => p.id === c.parent_id)?.slug === 'sac-rengi'),
        bodyType: categories.filter(c => c.parent_id && categories.find(p => p.id === c.parent_id)?.slug === 'vucut-tipi'),
        ethnicity: categories.filter(c => c.parent_id && categories.find(p => p.id === c.parent_id)?.slug === 'irk'),
        age: categories.filter(c => c.parent_id && categories.find(p => p.id === c.parent_id)?.slug === 'yas-grubu'),
    };
};

export default function CreateProfilePage() {
    const router = useRouter();
    const { t } = useLanguage();
    const [loading, setLoading] = useState(false);
    const [cities, setCities] = useState<City[]>([]);
    const [categories, setCategories] = useState<any>({});
    const supabase = createClient();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        city_id: '',
        age_id: '',
        hair_id: '',
        body_id: '',
        ethnicity_id: '',
        price: '',
        description: '',
    });

    useEffect(() => {
        const loadData = async () => {
            const [citiesRes, catsRes] = await Promise.all([
                supabase.from('cities').select('*').order('name'),
                supabase.from('categories').select('*').eq('is_active', true)
            ]);

            if (citiesRes.data) setCities(citiesRes.data);
            if (catsRes.data) setCategories(groupCategories(catsRes.data));
        };
        loadData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) throw new Error('Oturum bulunamadı');

            // Find categories
            // Note: In a real app we'd need a better way to handle multiple categories per listing
            // For now, we will pick one as the main category_id (e.g. Ethnicity) 
            // and store others in a JSONB column or separate table if schema supported it.
            // Since schema is simple, let's just use ethnicity as main category for now.
            const mainCategoryId = formData.ethnicity_id || formData.hair_id;

            // Create Profile (Listing)
            const { error } = await supabase.from('listings').insert({
                user_id: user.id,
                title: formData.title,
                slug: `${formData.title.toLowerCase().replace(/ /g, '-')}-${Math.floor(Math.random() * 1000)}`,
                city_id: formData.city_id,
                category_id: mainCategoryId, // Simple schema limitation
                price: formData.price ? parseFloat(formData.price) : null,
                description: `Yaş Grubu: ${getCatName(formData.age_id)}\nSaç: ${getCatName(formData.hair_id)}\nVücut: ${getCatName(formData.body_id)}\n\n${formData.description}`,
                is_active: false, // Wait for admin approval
            });

            if (error) throw error;

            alert('Profiliniz oluşturuldu! Onay sürecinden sonra yayına alınacaktır.');
            router.push('/dashboard'); // User dashboard (not admin)

        } catch (err: any) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getCatName = (id: string) => {
        // Helper to find name from any category group
        const all = [...(categories.hairColor || []), ...(categories.bodyType || []), ...(categories.age || []), ...(categories.ethnicity || [])];
        return all.find(c => c.id === id)?.name || '';
    }

    return (
        <div className="min-h-screen py-10 bg-muted/20 px-4">
            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl text-primary">{t.profile.createTitle}</CardTitle>
                        <CardDescription>{t.profile.createSubtitle}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Personal Info */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg border-b pb-2">{t.profile.personalInfo}</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t.profile.name}</label>
                                        <Input
                                            placeholder="Örn: Aslı Model"
                                            required
                                            value={formData.title}
                                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t.profile.city}</label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                                            required
                                            value={formData.city_id}
                                            onChange={e => setFormData({ ...formData, city_id: e.target.value })}
                                        >
                                            <option value="">Seçiniz</option>
                                            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t.profile.price}</label>
                                        <Input
                                            type="number"
                                            placeholder="0.00"
                                            value={formData.price}
                                            onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Physical Attributes */}
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg border-b pb-2">{t.profile.attributes}</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t.profile.age}</label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                                            required
                                            value={formData.age_id}
                                            onChange={e => setFormData({ ...formData, age_id: e.target.value })}
                                        >
                                            <option value="">Seçiniz</option>
                                            {categories.age?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t.profile.hairColor}</label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                                            required
                                            value={formData.hair_id}
                                            onChange={e => setFormData({ ...formData, hair_id: e.target.value })}
                                        >
                                            <option value="">Seçiniz</option>
                                            {categories.hairColor?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t.profile.bodyType}</label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                                            required
                                            value={formData.body_id}
                                            onChange={e => setFormData({ ...formData, body_id: e.target.value })}
                                        >
                                            <option value="">Seçiniz</option>
                                            {categories.bodyType?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">{t.profile.ethnicity}</label>
                                        <select
                                            className="w-full h-10 px-3 rounded-md border bg-background text-sm"
                                            required
                                            value={formData.ethnicity_id}
                                            onChange={e => setFormData({ ...formData, ethnicity_id: e.target.value })}
                                        >
                                            <option value="">Seçiniz</option>
                                            {categories.ethnicity?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Hakkımda</label>
                                <textarea
                                    className="w-full min-h-[100px] p-3 rounded-md border bg-background text-sm"
                                    placeholder="Kendinizi tanıtın (Örn: Hangi saatler uygunsunuz, nelerden hoşlanırsınız...)"
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <Button type="submit" size="lg" className="w-full" disabled={loading}>
                                {loading ? 'Oluşturuluyor...' : t.profile.submit}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
