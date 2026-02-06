'use client';

import { useState } from 'react';
import { Button } from '@repo/ui';
import { Trash2 } from 'lucide-react';
import { deleteProfile } from './actions';
import { useRouter } from 'next/navigation';

interface ProfileActionsProps {
    id: string;
    table: 'members' | 'independent_models' | 'agencies';
    username: string;
}

export function ProfileActions({ id, table, username }: ProfileActionsProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
        if (!confirm(`"${username}" kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.`)) return;

        setLoading(true);
        try {
            const res = await deleteProfile(id, table);
            if (res.success) {
                // router.refresh() handles the UI update since we revalidated path in action
                router.refresh();
            } else {
                alert('Silme işlemi başarısız: ' + res.error);
            }
        } catch (error) {
            alert('Bir hata oluştu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex gap-2">
            <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                disabled={loading}
                className="h-9 w-9 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 border border-red-500/20 transition-all shadow-lg shadow-red-500/5"
                title="Kullanıcıyı Sil"
            >
                <Trash2 className="h-4 w-4" />
            </Button>
        </div>
    );
}
