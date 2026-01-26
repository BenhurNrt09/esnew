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
            listings: 'İlanlar',
            features: 'Özellikler',
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
            title: 'İlan Yönetimi',
            addNew: 'Yeni İlan Ekle',
            listingTitle: 'İlan Başlığı',
            description: 'Açıklama',
            price: 'Fiyat',
            city: 'Şehir',
            category: 'Kategori',
            active: 'Aktif',
            featured: 'Öne Çıkan',
            totalListings: 'Toplam İlan',
            activeListings: 'Aktif İlan',
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
    },
    en: {
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
            listings: 'Listings',
            features: 'Features',
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
            title: 'Listing Management',
            addNew: 'Add New Listing',
            listingTitle: 'Listing Title',
            description: 'Description',
            price: 'Price',
            city: 'City',
            category: 'Category',
            active: 'Active',
            featured: 'Featured',
            totalListings: 'Total Listings',
            activeListings: 'Active Listings',
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
    },
};
