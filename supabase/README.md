# Supabase Database Kurulum Rehberi

## 📋 Kurulum Adımları

### 1. Supabase Dashboard'a Giriş Yapın
[https://ddxcewpzyvnagopzynfh.supabase.co](https://ddxcewpzyvnagopzynfh.supabase.co)

### 2. SQL Editor'ü Açın
Sol menüden **SQL Editor** seçeneğini tıklayın.

### 3. Migration Dosyalarını Sırayla Çalıştırın

#### Adım 1: Temel Veritabanı Şemasını Oluşturun
📄 Dosya: `001_initial_schema.sql`

- SQL Editor'de yeni bir query açın
- `001_initial_schema.sql` dosyasının içeriğini kopyalayın
- Query'ye yapıştırın
- **Run** butonuna tıklayın
- ✅ Başarılı mesajı aldığınızdan emin olun

**Bu dosya şunları oluşturur:**
- users (kullanıcılar)
- cities (şehirler)
- categories (kategoriler)
- tags (etiketler)
- features (özellikler)
- listings (ilanlar)
- listing_images (ilan görselleri)
- listing_features (ilan özellikleri)
- listing_tags (ilan etiketleri)
- seo_pages (SEO sayfaları)

---

#### Adım 2: Row Level Security (RLS) Politikalarını Ekleyin
📄 Dosya: `002_rls_policies.sql`

- Yeni bir query açın
- `002_rls_policies.sql` dosyasının içeriğini kopyalayın
- Query'ye yapıştırın
- **Run** butonuna tıklayın

**Bu dosya şunları yapar:**
- Tüm tablolarda RLS'yi aktif eder
- Public kullanıcılar sadece aktif içerikleri görebilir
- Admin kullanıcılar tüm verileri yönetebilir

---

#### Adım 3: Storage (Depolama) Ayarlarını Yapın
📄 Dosya: `003_storage_buckets.sql`

- Yeni bir query açın
- `003_storage_buckets.sql` dosyasının içeriğini kopyalayın
- Query'ye yapıştırın
- **Run** butonuna tıklayın

**Bu dosya şunları yapar:**
- `listing-images` storage bucket'ını oluşturur
- Görsel yükleme politikalarını ayarlar

---

#### Adım 4: Örnek Verileri Ekleyin (Opsiyonel)
📄 Dosya: `004_seed_data.sql`

- Yeni bir query açın
- `004_seed_data.sql` dosyasının içeriğini kopyalayın
- Query'ye yapıştırın
- **Run** butonuna tıklayın

**Bu dosya şunları ekler:**
- 8 Türkiye şehri (İstanbul, Ankara, İzmir, vb.)
- Ana kategoriler ve alt kategoriler
- Örnek etiketler
- Örnek özellikler

---

### 4. Service Role Key'i Alın

Admin panel için Service Role Key'e ihtiyacınız var:

1. Supabase Dashboard'da **Settings** > **API** sayfasına gidin
2. **Project API keys** bölümünde `service_role` key'ini bulun
3. Bu key'i kopyalayın
4. `.env` dosyasındaki `SUPABASE_SERVICE_ROLE_KEY` değerini güncelleyin

⚠️ **ÖNEMLİ:** Service role key'i kesinlikle gizli tutun! Asla public repository'ye push etmeyin!

---

### 5. İlk Admin Kullanıcınızı Oluşturun

#### Yöntem 1: Supabase Auth ile Kayıt

1. Supabase Dashboard'da **Authentication** > **Users** sayfasına gidin
2. **Add user** > **Create new user** tıklayın
3. Email ve şifre girin
4. Kullanıcı oluşturulduktan sonra, user ID'yi kopyalayın
5. SQL Editor'de şu komutu çalıştırın:

```sql
INSERT INTO users (id, email, role)
VALUES ('BURAYA-USER-ID', 'admin@example.com', 'admin')
ON CONFLICT (id) DO UPDATE SET role = 'admin';
```

#### Yöntem 2: Mevcut Kullanıcıyı Admin Yapma

Eğer zaten kayıtlı bir kullanıcınız varsa:

```sql
UPDATE users SET role = 'admin' WHERE email = 'sizin@email.com';
```

---

## ✅ Doğrulama

Kurulumun başarılı olduğunu doğrulamak için:

### 1. Tabloları Kontrol Edin
SQL Editor'de çalıştırın:
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

Şu tabloları görmelisiniz:
- users
- cities
- categories
- tags
- features
- listings
- listing_images
- listing_features
- listing_tags
- seo_pages

### 2. RLS'yi Kontrol Edin
```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';
```

Tüm tablolarda `rowsecurity = true` olmalı.

### 3. Örnek Verileri Kontrol Edin
```sql
SELECT COUNT(*) as sehir_sayisi FROM cities;
SELECT COUNT(*) as kategori_sayisi FROM categories;
```

---

## 🚨 Sorun Giderme

### Hata: "relation already exists"
- Bu migration daha önce çalıştırılmış demektir
- Eğer sıfırdan başlamak istiyorsanız, tabloları manuel olarak silin
- Ya da migration'ları atlayın

### Hata: "permission denied"
- Service role key'in doğru olduğundan emin olun
- RLS politikalarını kontrol edin

### Storage bucket oluşturulamıyor
- Dashboard'dan manuel oluşturun: **Storage** > **New bucket**
- Bucket adı: `listing-images`
- Public: ✅ (aktif)

---

## 📌 Sıradaki Adımlar

✅ Database kurulumu tamamlandı!

Şimdi yapabilecekleriniz:
1. `npm install` ile dependency'leri yükleyin
2. Admin paneli geliştirmeye başlayın
3. Web sitesi sayfalarını oluşturun

---

## 📞 Destek

Herhangi bir sorun yaşarsanız:
- Supabase dokümantasyonunu kontrol edin
- GitHub Issues'da sorun bildirin
