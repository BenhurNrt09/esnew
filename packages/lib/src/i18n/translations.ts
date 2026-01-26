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
        heroTitle: string;
        heroSubtitle: string;
        searchPlaceholder: string;
        featuredProfiles: string;
        viewAll: string;
        quickSearch: string;
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
            welcome: 'ESNew Admin Panel\'e hoş geldiniz',
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
            heroTitle: 'En Seçkin Profilleri Keşfedin',
            heroSubtitle: '81 ilde aradığınız özelliklere sahip profilleri güvenle bulun.',
            searchPlaceholder: 'Profilleri Ara',
            featuredProfiles: 'Vitrin Profilleri',
            viewAll: 'Tümünü Gör',
            quickSearch: 'Hızlı Arama',
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
            welcome: 'Welcome to ESNew Admin Panel',
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
            heroTitle: 'Discover Exclusive Profiles',
            heroSubtitle: 'Find profiles with the features you are looking for in 81 cities.',
            searchPlaceholder: 'Search Profiles',
            featuredProfiles: 'Featured Profiles',
            viewAll: 'View All',
            quickSearch: 'Quick Search',
        },
    },
};
