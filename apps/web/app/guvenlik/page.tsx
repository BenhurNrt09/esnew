import { ShieldAlert, ShieldCheck, Eye, Lock } from 'lucide-react';

export default function SecurityPage() {
    const safetyTips = [
        {
            icon: ShieldCheck,
            title: "Doğrulanmış Profiller",
            description: "Güvenliğiniz için her zaman profilinde 'Doğrulanmış' ibaresi bulunan modelleri tercih etmenizi öneririz."
        },
        {
            icon: Eye,
            title: "Dikkatli Olun",
            description: "İlk buluşmalarda halka açık yerlerde görüşmeye özen gösterin ve yakınlarınıza bilgi verin."
        },
        {
            icon: Lock,
            title: "Ödeme Güvenliği",
            description: "Platform dışı şüpheli ödeme taleplerine karşı dikkatli olun. Ön ödeme yapmaktan kaçının."
        },
        {
            icon: ShieldAlert,
            title: "Şüpheli Durumları Bildirin",
            description: "Herhangi bir şüpheli profil veya davranışla karşılaştığınızda lütfen 'Bildir' butonunu kullanın."
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-[#0A0A0A] py-20 transition-colors">
            <div className="container mx-auto px-6 max-w-4xl">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-500/10 rounded-full text-green-500 text-xs font-black uppercase tracking-widest mb-6">
                        <ShieldCheck className="w-4 h-4" /> Güvenlik Merkezi
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white uppercase tracking-tighter mb-6">
                        Güvenlik <span className="text-primary italic">Rehberi</span>
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 font-medium max-w-lg mx-auto">
                        Topluluğumuzun güvenliği bizim bir numaralı önceliğimizdir. İşte dikkat etmeniz gerekenler:
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-20">
                    {safetyTips.map((tip, i) => (
                        <div key={i} className="p-8 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-3xl group hover:border-primary/50 transition-all">
                            <tip.icon className="w-10 h-10 text-primary mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wide mb-4">{tip.title}</h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed font-medium text-sm">
                                {tip.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="bg-red-500/5 border border-red-500/10 p-10 rounded-[2.5rem] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-10">
                        <ShieldAlert className="w-32 h-32 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black text-red-500 uppercase tracking-tight mb-6">Önemli Hatırlatma</h2>
                    <p className="text-gray-500 dark:text-gray-400 font-bold leading-relaxed uppercase text-xs tracking-wider max-w-2xl">
                        VELORAESCORTWORLD, kullanıcılara sadece reklam alanı sunmaktadır. Gerçekleşen ikili görüşmelerden, anlaşılan hizmetlerden veya doğabilecek olumsuzluklardan platformumuz sorumlu değildir. Lütfen kendi güvenliğiniz için tedbirli davranın.
                    </p>
                </div>
            </div>
        </div>
    );
}
