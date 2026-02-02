export type Language = 'tr' | 'en';

export interface Translations {
    // Common
    common: {
        loading: string;
        error: string;
        save: string;
        cancel: string;
        delete: string;
        edit: string;
        view: string;
        search: string;
        filter: string;
        sort: string;
        noResults: string;
    };

    // Navigation
    nav: {
        home: string;
        cities: string;
        categories: string;
        listings: string;
        features: string;
        dashboard: string;
        logout: string;
    };

    // Auth
    auth: {
        login: string;
        register: string;
        email: string;
        password: string;
        loginButton: string;
        loggingIn: string;
        logout: string;
        adminOnly: string;
        noPermission: string;
    };

    // Cities
    cities: {
        title: string;
        addNew: string;
        edit: string;
        cityName: string;
        slug: string;
        active: string;
        inactive: string;
        seoTitle: string;
        seoDescription: string;
        viewOnSite: string;
    };

    // Categories
    categories: {
        title: string;
        addNew: string;
        addSubCategory: string;
        mainCategory: string;
        subCategory: string;
        categoryName: string;
        order: string;
    };

    // Listings
    listings: {
        title: string;
        addNew: string;
        listingTitle: string;
        description: string;
        price: string;
        city: string;
        category: string;
        active: string;
        featured: string;
        totalListings: string;
        activeListings: string;
    };

    // Dashboard
    dashboard: {
        welcome: string;
        totalCities: string;
        totalCategories: string;
        quickStart: string;
        addCities: string;
        addCategories: string;
        addFirstListing: string;
        viewOnWebsite: string;
    };

    // Web Profile
    profile: {
        createTitle: string;
        createSubtitle: string;
        personalInfo: string;
        attributes: string;
        name: string;
        phone: string;
        hairColor: string;
        bodyType: string;
        age: string;
        ethnicity: string;
        city: string;
        price: string;
        photos: string;
        submit: string;
        success: string;
    };

    // Web Home
    home: {
        badge: string;
        heroTitle: string;
        heroTitleHighlight: string;
        heroSubtitle: string;
        popularCities: string;
        searchPlaceholder: string;
        browseCategories: string;
        sponsorAd: string;
        featuredProfiles: string;
        featuredProfilesSub: string;
        latestProfiles: string;
        latestProfilesSub: string;
        viewAll: string;
        viewAllProfiles: string;
        vitrinBadge: string;
        startingFrom: string;
        negotiable: string;
        quickSearch: string;
        noFeatured: string;
        noLatest: string;
    };
}

export const translations: Record<Language, Translations> = {
    tr: {
        common: {
            loading: 'Yükleniyor...',
            error: 'Hata',
            save: 'Kaydet',
            cancel: 'İptal',
            delete: 'Sil',
            edit: 'Düzenle',
            view: 'Görüntüle',
            search: 'Ara',
            filter: 'Filtrele',
            sort: 'Sırala',
            noResults: 'Sonuç bulunamadı',
        },
        nav: {
            home: 'Ana Sayfa',
            cities: 'Şehirler',
            categories: 'Kategoriler',
            listings: 'Profiller',
            features: 'Vitrin & Özellikler',
            dashboard: 'Dashboard',
            logout: 'Çıkış Yap',
        },
        auth: {
            login: 'Giriş Yap',
            register: 'Kayıt Ol',
            email: 'E-posta',
            password: 'Şifre',
            loginButton: 'Giriş Yap',
            loggingIn: 'Giriş yapılıyor...',
            logout: 'Çıkış Yap',
            adminOnly: 'Admin Girişi',
            noPermission: 'Yetkiniz yok. Sadece admin kullanıcılar giriş yapabilir.',
        },
        cities: {
            title: 'Şehir Yönetimi',
            addNew: 'Yeni Şehir Ekle',
            edit: 'Şehir Düzenle',
            cityName: 'Şehir Adı',
            slug: 'Slug (URL)',
            active: 'Aktif',
            inactive: 'Pasif',
            seoTitle: 'SEO Başlık',
            seoDescription: 'SEO Açıklama',
            viewOnSite: 'Görüntüle',
        },
        categories: {
            title: 'Kategori Yönetimi',
            addNew: 'Yeni Kategori Ekle',
            addSubCategory: 'Alt Kategori Ekle',
            mainCategory: 'Ana Kategori',
            subCategory: 'Alt Kategori',
            categoryName: 'Kategori Adı',
            order: 'Sıra',
        },
        listings: {
            title: 'Profil Yönetimi',
            addNew: 'Yeni Profil Ekle',
            listingTitle: 'Profil Adı',
            description: 'Açıklama',
            price: 'Fiyat',
            city: 'Şehir',
            category: 'Kategori',
            active: 'Aktif',
            featured: 'Öne Çıkan',
            totalListings: 'Toplam Profil',
            activeListings: 'Aktif Profil',
        },
        dashboard: {
            welcome: 'ValoraEscort Admin Panel\'e hoş geldiniz',
            totalCities: 'Toplam Şehir',
            totalCategories: 'Toplam Kategori',
            quickStart: 'Hızlı Başlangıç',
            addCities: 'Şehir ekleyin (Şehirler sayfasından)',
            addCategories: 'Kategori ve alt kategoriler oluşturun',
            addFirstListing: 'İlk ilanınızı ekleyin',
            viewOnWebsite: 'Web sitesinde görüntüleyin (localhost:3000)',
        },
        profile: {
            createTitle: 'Profil Oluştur',
            createSubtitle: 'Binlerce kullanıcıya ulaşmak için profilinizi oluşturun.',
            personalInfo: 'Kişisel Bilgiler',
            attributes: 'Fiziksel Özellikler',
            name: 'Adınız / Başlığınız',
            phone: 'Telefon Numarası',
            hairColor: 'Saç Rengi',
            bodyType: 'Vücut Tipi',
            age: 'Yaş',
            ethnicity: 'Köken / Irk',
            city: 'Şehir',
            price: 'Saatlik Ücret (Opsiyonel)',
            photos: 'Fotoğraflar',
            submit: 'Profili Oluştur',
            success: 'Profiliniz başarıyla oluşturuldu!',
        },
        home: {
            badge: '✨ Türkiye\'nin En Seçkin Profil Platformu',
            heroTitle: 'Hayalindeki Profili',
            heroTitleHighlight: 'Keşfetmeye Başla',
            heroSubtitle: '81 ilde, aradığınız özelliklere sahip doğrulanmış profillerle güvenle iletişim kurun.',
            popularCities: 'Popüler Şehirler:',
            searchPlaceholder: 'Şehir ara (Örn: İstanbul, İzmir...)',
            browseCategories: 'KATEGORİLERE GÖRE GÖZ AT',
            sponsorAd: 'SPONSOR REKLAM',
            featuredProfiles: 'Öne Çıkan Profiller',
            featuredProfilesSub: 'Editörlerimizin seçtiği en popüler profiller',
            latestProfiles: 'Yeni Eklenenler',
            latestProfilesSub: 'Platforma katılan en yeni üyeler',
            viewAll: 'Tümünü Gör',
            viewAllProfiles: 'Tüm Profillere Göz At',
            vitrinBadge: 'Vitrin',
            startingFrom: 'Başlangıç',
            negotiable: 'Görüşülür',
            quickSearch: 'Hızlı Arama',
            noFeatured: 'Henüz vitrin ilanı bulunmuyor.',
            noLatest: 'Henüz başka ilan bulunmuyor.',
        },
    }, en: {
        common: {
            loading: 'Loading...',
            error: 'Error',
            save: 'Save',
            cancel: 'Cancel',
            delete: 'Delete',
            edit: 'Edit',
            view: 'View',
            search: 'Search',
            filter: 'Filter',
            sort: 'Sort',
            noResults: 'No results found',
        },
        nav: {
            home: 'Home',
            cities: 'Cities',
            categories: 'Categories',
            listings: 'Profiles',
            features: 'Showcase & Features',
            dashboard: 'Dashboard',
            logout: 'Logout',
        },
        auth: {
            login: 'Login',
            register: 'Register',
            email: 'Email',
            password: 'Password',
            loginButton: 'Login',
            loggingIn: 'Logging in...',
            logout: 'Logout',
            adminOnly: 'Admin Login',
            noPermission: 'Access denied. Admin users only.',
        },
        cities: {
            title: 'City Management',
            addNew: 'Add New City',
            edit: 'Edit City',
            cityName: 'City Name',
            slug: 'Slug (URL)',
            active: 'Active',
            inactive: 'Inactive',
            seoTitle: 'SEO Title',
            seoDescription: 'SEO Description',
            viewOnSite: 'View',
        },
        categories: {
            title: 'Category Management',
            addNew: 'Add New Category',
            addSubCategory: 'Add Subcategory',
            mainCategory: 'Main Category',
            subCategory: 'Subcategory',
            categoryName: 'Category Name',
            order: 'Order',
        },
        listings: {
            title: 'Profile Management',
            addNew: 'Add New Profile',
            listingTitle: 'Profile Name',
            description: 'Description',
            price: 'Price',
            city: 'City',
            category: 'Category',
            active: 'Active',
            featured: 'Featured',
            totalListings: 'Total Profiles',
            activeListings: 'Active Profiles',
        },
        dashboard: {
            welcome: 'Welcome to ValoraEscort Admin Panel',
            totalCities: 'Total Cities',
            totalCategories: 'Total Categories',
            quickStart: 'Quick Start',
            addCities: 'Add cities (from Cities page)',
            addCategories: 'Create categories and subcategories',
            addFirstListing: 'Add your first listing',
            viewOnWebsite: 'View on website (localhost:3000)',
        },
        profile: {
            createTitle: 'Create Profile',
            createSubtitle: 'Create your profile to reach thousands of users.',
            personalInfo: 'Personal Information',
            attributes: 'Physical Attributes',
            name: 'Your Name / Title',
            phone: 'Phone Number',
            hairColor: 'Hair Color',
            bodyType: 'Body Type',
            age: 'Age',
            ethnicity: 'Ethnicity',
            city: 'City',
            price: 'Hourly Rate (Optional)',
            photos: 'Photos',
            submit: 'Create Profile',
            success: 'Profile created successfully!',
        },
        home: {
            badge: '✨ Turkey\'s Most Exclusive Profile Platform',
            heroTitle: 'Discover Your',
            heroTitleHighlight: 'Dream Profile',
            heroSubtitle: 'Communicate safely with verified profiles that have the features you are looking for in 81 cities.',
            popularCities: 'Popular Cities:',
            searchPlaceholder: 'Search city (e.g. Istanbul, Izmir...)',
            browseCategories: 'BROWSE BY CATEGORIES',
            sponsorAd: 'SPONSOR AD',
            featuredProfiles: 'Featured Profiles',
            featuredProfilesSub: 'The most popular profiles selected by our editors',
            latestProfiles: 'New Additions',
            latestProfilesSub: 'The newest members joining the platform',
            viewAll: 'View All',
            viewAllProfiles: 'Browse All Profiles',
            vitrinBadge: 'Featured',
            startingFrom: 'Starting from',
            negotiable: 'Negotiable',
            quickSearch: 'Quick Search',
            noFeatured: 'No featured listings yet.',
            noLatest: 'No more listings yet.',
        },
    },
};
