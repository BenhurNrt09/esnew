# ESNew Platform - Hızlı Başlangıç Rehberi 🚀

Bu rehber, projeyi sıfırdan çalıştırmanız için gerekli tüm adımları içerir.

## 📋 Önkoşullar

- Node.js 18+ ve npm 9+
- Supabase hesabı (ücretsiz tier yeterli)
- Git

## 🔧 1. Dependency Kurulumu

Proje klasöründe:

```bash
npm install
```

Bu komut tüm workspace'lerdeki (apps/web, apps/admin, packages/*) dependency'leri kurar.

## 🗄️ 2. Supabase Database Kurulumu

### Adım 1: Supabase Dashboard'a Giriş

Projeniz: https://ddxcewpzyvnagopzynfh.supabase.co

### Adım 2: SQL Editor'de Migration'ları Çalıştırın

**SIRAYLA** aşağıdaki dosyaları SQL Editor'de çalıştırın:

1. **`supabase/migrations/001_initial_schema.sql`**
   - Tüm veritabanı tablolarını oluşturur
   - İndeksleri ekler
   - Trigger'ları ayarlar

2. **`supabase/migrations/002_rls_policies.sql`**
   - Row Level Security politikalarını aktif eder
   - Admin ve public erişim kurallarını ayarlar

3. **`supabase/migrations/003_storage_buckets.sql`**
   - `listing-images` storage bucket'ını oluşturur
   - Görsel yükleme politikalarını ayarlar

4. **`supabase/migrations/004_seed_data.sql`** (Opsiyonel)
   - Örnek şehir, kategori, tag ve feature verilerini ekler
   - Geliştirme için faydalıdır

### Adım 3: Service Role Key'i Alın

1. Supabase Dashboard → **Settings** → **API**
2. **Project API keys** bölümünde `service_role` key'ini kopyalayın
3. `.env` dosyasını açın ve şu satırı güncelleyin:

```env
SUPABASE_SERVICE_ROLE_KEY=buraya_service_role_key_yapistir
```

⚠️ **UYARI:** Service role key'i kesinlikle gizli tutun!

### Adım 4: İlk Admin Kullanıcınızı Oluşturun

#### Yöntem 1: Supabase Auth Dashboard

1. Supabase Dashboard → **Authentication** → **Users**
2. **Add user** → **Create new user** butonuna tıklayın
3. Email ve şifre girin (örnek: `admin@example.com`)
4. Kullanıcı oluştuktan sonra, user ID'yi kopyalayın
5. SQL Editor'de şu komutu çalıştırın:

```sql
INSERT INTO users (id, email, role)
VALUES ('KOPYALADIGINIZ-USER-ID', 'admin@example.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

#### Yöntem 2: Email ile Rol Güncelleme

Eğer kullanıcı zaten varsa:

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

## 🎬 3. Uygulamaları Başlatın

### Her İki Uygulamayı Birlikte Çalıştırın

```bash
npm run dev
```

Bu komut şunları başlatır:
- **Web App:** http://localhost:3000
- **Admin Panel:** http://localhost:3001

### Sadece Bir Uygulamayı Çalıştırın

```bash
# Sadece web sitesi
npm run dev:web

# Sadece admin panel
npm run dev:admin
```

## 🔐 4. Admin Panel'e Giriş Yapın

1. Tarayıcıda http://localhost:3001 adresine gidin
2. Oluşturduğunuz admin kullanıcı bilgileriyle giriş yapın
3. Dashboard'a yönlendirileceksiniz

## 🌐 5. Web Sitesini Kontrol Edin

1. http://localhost:3000 adresine gidin
2. Anasayfada şehirleri görmelisiniz (seed data çalıştırdıysanız)
3. Henüz ilan olmadığı için liste boş olacak

## 📝 6. İlk İlanınızı Oluşturun

> ⚠️ İlan oluşturma özelliği henüz geliştirilmedi. Sonraki adımlarda eklenecek.

Şu an için manuel olarak SQL ile ekleyebilirsiniz:

```sql
INSERT INTO listings (title, slug, description, city_id, category_id, is_active)
VALUES (
  'Test İlan',
  'test-ilan',
  'Bu bir test ilandır',
  (SELECT id FROM cities WHERE slug = 'istanbul'),
  (SELECT id FROM categories WHERE slug = 'temizlik'),
  true
);
```

## ✅ Doğrulama Checklist

- [ ] `npm install` başarıyla tamamlandı
- [ ] Tüm migration'lar çalıştırıldı
- [ ] Service role key .env dosyasına eklendi
- [ ] Admin kullanıcı oluşturuldu
- [ ] Her iki uygulama da çalışıyor (3000 ve 3001 portları)
- [ ] Admin panel'e giriş yapılabildi
- [ ] Web sitesinde şehirler görünüyor

## 🚨 Sorun Giderme

### "Module not found" Hatası

```bash
# Node modules'ları temizle ve tekrar kur
npm run clean
npm install
```

### Admin Panel'e Giriş Yapamıyorum

1. User'ın `users` tablosunda olduğundan emin olun:
```sql
SELECT * FROM users WHERE email = 'admin@example.com';
```

2. Role'ün `admin` olduğunu kontrol edin:
```sql
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';
```

### Port Zaten Kullanılıyor

Port'ları değiştirmek için:
- Web: `apps/web/package.json` → `"dev": "next dev -p 3002"`
- Admin: `apps/admin/package.json` → `"dev": "next dev -p 3003"`

### Supabase Bağlantı Hatası

`.env` dosyasındaki URL ve key'leri kontrol edin:
```env
NEXT_PUBLIC_SUPABASE_URL=https://ddxcewpzyvnagopzynfh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_bInPJOjmVMA6hiVoJP7VRg_6nRSlj6O
```

## 📚 Sıradaki Adımlar

1. ✅ Admin panel'de şehir yönetimi ekranını geliştir
2. ✅ Admin panel'de kategori yönetimi ekranını geliştir
3. ✅ Admin panel'de ilan oluşturma formunu geliştir
4. ✅ Web sitesinde şehir sayfasını geliştir
5. ✅ Web sitesinde kategori sayfasını geliştir
6. ✅ Web sitesinde ilan detay sayfasını geliştir
7. ✅ Filtreleme sistemini implement et
8. ✅ SEO optimizasyonlarını tamamla

## 🎯 Hedef Mimari

```
esnew/
├── apps/
│   ├── web/          # Public website (Port 3000)
│   └── admin/        # Admin panel (Port 3001)
├── packages/
│   ├── ui/           # Shared components
│   ├── lib/          # Supabase clients
│   └── types/        # TypeScript types
└── supabase/
    └── migrations/   # Database schema
```

## 💡 İpuçları

- Geliştirme sırasında her iki uygulamayı da çalışır durumda tut
- Admin panel'de yaptığınız değişiklikler web sitesinde anında görünür
- Her değişiklikten sonra tarayıcıyı yenileyin (Hot reload aktif)
- TypeScript hatalarını VS Code'da kontrol edin

---

**Başarılar! 🎉**

Sorularınız için GitHub Issues kullanabilirsiniz.
