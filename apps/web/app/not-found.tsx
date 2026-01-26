export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-muted/20">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-muted-foreground mb-4">404</h1>
                <h2 className="text-2xl font-semibold mb-4">Sayfa Bulunamadı</h2>
                <p className="text-muted-foreground mb-8">
                    Aradığınız sayfa mevcut değil veya kaldırılmış.
                </p>
                <a
                    href="/"
                    className="inline-flex items-center justify-center rounded-md bg-primary text-primary-foreground px-6 py-3 hover:bg-primary/90 transition-colors"
                >
                    Ana Sayfaya Dön
                </a>
            </div>
        </div>
    );
}
