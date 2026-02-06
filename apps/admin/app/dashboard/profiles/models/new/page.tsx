import { createAdminClient } from '@repo/lib/server';
import { ModelForm } from './ModelForm';

export default async function NewModelPage() {
    const supabase = createAdminClient();

    const [categoriesRes, citiesRes] = await Promise.all([
        supabase.from('categories').select('id, name, parent_id').eq('is_active', true).order('name'),
        supabase.from('cities').select('id, name').order('name')
    ]);

    return (
        <div className="container mx-auto px-4 py-8 animate-in fade-in duration-500">
            <div className="mb-8">
                <h1 className="text-3xl font-black text-white tracking-tight uppercase">
                    <span className="text-primary">Yeni</span> Bireysel Model Ekle
                </h1>
                <p className="text-gray-400 mt-1 text-lg">
                    Sisteme yeni bir bağımsız model profili ekleyin.
                </p>
            </div>

            <ModelForm
                categories={categoriesRes.data || []}
                cities={citiesRes.data || []}
            />
        </div>
    );
}
