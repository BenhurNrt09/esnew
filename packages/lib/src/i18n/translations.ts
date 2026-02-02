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
        selectOption: string;
        yes: string;
        no: string;
        back: string;
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
        login: string;
        register: string;
        myProfile: string;
        settings: string;
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
        username: string;
        confirmPassword: string;
        forgotPassword: string;
        resetPassword: string;
        newPassword: string;
        createAccount: string;
        alreadyHaveAccount: string;
        dontHaveAccount: string;
        passwordRequirements: string;
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
        management: string;
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
        management: string;
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
        management: string;
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
        adminPanel: string;
        members: string;
        models: string;
        agencies: string;
    };

    // Profile
    profile: {
        createTitle: string;
        createSubtitle: string;
        personalInfo: string;
        attributes: string;
        name: string;
        phone: string;
        countryCode: string;
        hairColor: string;
        bodyType: string;
        age: string;
        ethnicity: string;
        city: string;
        price: string;
        photos: string;
        submit: string;
        success: string;
        settings: string;
        profileUpdateSuccess: string;
        profileUpdateError: string;
        username: string;
        firstName: string;
        lastName: string;
        verifyEmail: string;
        memberRegistration: string;
        modelRegistration: string;
        agencyRegistration: string;
        registerAsRegularMember: string;
        registerAsIndependentModel: string;
        registerAsAgency: string;
        alreadyHaveAccount: string;
        signIn: string;
    };

    // Home
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

    // Legal
    legal: {
        termsOfService: string;
        privacyPolicy: string;
        generalTerms: string;
        lastUpdated: string;
        section1: string;
        section2: string;
        section3: string;
        section4: string;
        section5: string;
        section6: string;
        section7: string;
        section8: string;
        section9: string;
        section10: string;
        serviceDefinition: string;
        accountCreation: string;
        provideAccurateInfo: string;
        accountSecurity: string;
        oneAccountPerUser: string;
        userResponsibilities: string;
        obeyLaws: string;
        shareHonestInfo: string;
        respectOthers: string;
        respectIntellectualProperty: string;
        dontAbuseService: string;
        prohibitedBehaviors: string;
        noFalseContent: string;
        noSpam: string;
        noHarassment: string;
        noSecurityThreats: string;
        noIllegalActivity: string;
        contentOwnership: string;
        accountTermination: string;
        disclaimer: string;
        termsChanges: string;
        feesPayments: string;
        contact: string;
    };

    // Member Profile
    memberProfile: {
        evaluation: string;
        averageSatisfaction: string;
        commentHistory: string;
        noCommentsFound: string;
        thisUserHasNotLeft: string;
        registration: string;
        photoAccuracy: string;
        real: string;
        aiOrFilter: string;
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
            selectOption: 'Bir seçenek seçin...',
            yes: 'Evet',
            no: 'Hayır',
            back: 'Geri',
        },
        nav: {
            home: 'Ana Sayfa',
            cities: 'Şehirler',
            categories: 'Kategoriler',
            listings: 'Profiller',
            features: 'Vitrin & Özellikler',
            dashboard: 'Dashboard',
            logout: 'Çıkış Yap',
            login: 'Giriş Yap',
            register: 'Kayıt Ol',
            myProfile: 'Profilim',
            settings: 'Ayarlar',
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
            username: 'Kullanıcı Adı',
            confirmPassword: 'Şifreyi Onayla',
            forgotPassword: 'Şifreni mi Unuttun?',
            resetPassword: 'Şifreyi Sıfırla',
            newPassword: 'Yeni Şifre',
            createAccount: 'Hesap Oluştur',
            alreadyHaveAccount: 'Zaten bir hesabınız var mı?',
            dontHaveAccount: 'Hesabınız yok mu?',
            passwordRequirements: 'Şifre en az 8 karakter olmalı',
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
            management: 'Şehir Yönetimi',
        },
        categories: {
            title: 'Kategori Yönetimi',
            addNew: 'Yeni Kategori Ekle',
            addSubCategory: 'Alt Kategori Ekle',
            mainCategory: 'Ana Kategori',
            subCategory: 'Alt Kategori',
            categoryName: 'Kategori Adı',
            order: 'Sıra',
            management: 'Kategori Yönetimi',
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
            management: 'Profil Yönetimi',
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
            adminPanel: 'Admin Paneli',
            members: 'Üyeler',
            models: 'Modeller',
            agencies: 'Ajanslar',
        },
        profile: {
            createTitle: 'Profil Oluştur',
            createSubtitle: 'Binlerce kullanıcıya ulaşmak için profilinizi oluşturun.',
            personalInfo: 'Kişisel Bilgiler',
            attributes: 'Fiziksel Özellikler',
            name: 'Adınız / Başlığınız',
            phone: 'Telefon Numarası',
            countryCode: 'Ülke Kodu',
            hairColor: 'Saç Rengi',
            bodyType: 'Vücut Tipi',
            age: 'Yaş',
            ethnicity: 'Köken / Irk',
            city: 'Şehir',
            price: 'Saatlik Ücret (Opsiyonel)',
            photos: 'Fotoğraflar',
            submit: 'Profili Oluştur',
            success: 'Profiliniz başarıyla oluşturuldu!',
            settings: 'Profil Ayarları',
            profileUpdateSuccess: 'Profil başarıyla güncellendi!',
            profileUpdateError: 'Profil güncellenirken hata oluştu',
            username: 'Kullanıcı Adı',
            firstName: 'Adı',
            lastName: 'Soyadı',
            verifyEmail: 'E-postayı Doğrula',
            memberRegistration: 'Üye Kaydı',
            modelRegistration: 'Model Kaydı',
            agencyRegistration: 'Ajans Kaydı',
            registerAsRegularMember: 'Normal üye olarak hemen kayıt olun',
            registerAsIndependentModel: 'Bağımsız model olarak profilinizi oluşturun',
            registerAsAgency: 'Ajans/Şirket olarak toplu ilan yönetin',
            alreadyHaveAccount: 'Zaten bir hesabınız var mı?',
            signIn: 'Giriş Yapın',
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
        legal: {
            termsOfService: 'Hizmet Şartları',
            privacyPolicy: 'Gizlilik Politikası',
            generalTerms: 'Genel Hizmet Şartları',
            lastUpdated: 'Son güncelleme:',
            section1: '1. Hizmet Tanımı',
            section2: '2. Hesap Oluşturma',
            section3: '3. Kullanıcı Sorumlulukları',
            section4: '4. Yasak Davranışlar',
            section5: '5. İçerik Sahipliği',
            section6: '6. Hesap Askıya Alma ve Sonlandırma',
            section7: '7. Sorumluluk Reddi',
            section8: '8. Değişiklikler',
            section9: '9. Ücretler ve Ödemeler',
            section10: '10. İletişim',
            serviceDefinition: 'Platformumuz, üyeler, bağımsız modeller ve ajanslar/şirketler için bir buluşma ve tanıtım platformudur. Hizmetlerimizi kullanarak bu şartları kabul etmiş olursunuz.',
            accountCreation: '18 yaşından büyük olmanız gerekmektedir',
            provideAccurateInfo: 'Doğru ve güncel bilgiler sağlamalısınız',
            accountSecurity: 'Hesap güvenliğinden siz sorumlusunuz',
            oneAccountPerUser: 'Her kullanıcı yalnızca bir hesap oluşturabilir',
            userResponsibilities: 'Kullanıcılar aşağıdaki kurallara uymayı kabul eder:',
            obeyLaws: 'Yasalara ve yönetmeliklere uygun davranmak',
            shareHonestInfo: 'Doğru ve yanıltıcı olmayan bilgiler paylaşmak',
            respectOthers: 'Diğer kullanıcılara saygılı davranmak',
            respectIntellectualProperty: 'Telif haklarına ve fikri mülkiyet haklarına saygı göstermek',
            dontAbuseService: 'Platformu kötüye kullanmamak',
            prohibitedBehaviors: 'Aşağıdaki davranışlar kesinlikle yasaktır:',
            noFalseContent: 'Sahte veya yanıltıcı içerik paylaşmak',
            noSpam: 'Spam veya istenmeyen mesajlar göndermek',
            noHarassment: 'Başkalarını taciz etmek veya tehdit etmek',
            noSecurityThreats: 'Platformun güvenliğini tehlikeye atmak',
            noIllegalActivity: 'Yasadışı faaliyetlerde bulunmak',
            contentOwnership: 'Platformda paylaştığınız içeriklerin telif hakları size aittir. Ancak, içeriğinizi platformumuzda göstermek için bize sınırlı bir lisans vermiş olursunuz.',
            accountTermination: 'Şartları ihlal eden hesapları uyarı vermeden askıya alabilir veya sonlandırabiliriz. Kullanıcılar istedikleri zaman hesaplarını kapatabilirler.',
            disclaimer: 'Platform "olduğu gibi" sağlanmaktadır. Kullanıcılar arasındaki etkileşimlerden, içeriklerden veya hizmet kesintilerinden sorumlu değiliz.',
            termsChanges: 'Bu şartlar zaman zaman güncellenebilir. Önemli değişiklikler yapıldığında kullanıcılar bilgilendirilecektir.',
            feesPayments: 'Bazı hizmetler ücretli olabilir. Ücretler ve ödeme koşulları ilgili sayfalarda belirtilecektir.',
            contact: 'Hizmet şartlarımız hakkında sorularınız varsa, lütfen bizimle iletişime geçin.',
        },
        memberProfile: {
            evaluation: 'Değerlendirme',
            averageSatisfaction: 'Ort. Memnuniyet',
            commentHistory: 'Yorum Geçmişi',
            noCommentsFound: 'Yorum bulunamadı',
            thisUserHasNotLeft: 'Bu üye henüz hiçbir modele yorum bırakmamış.',
            registration: 'Kayıt:',
            photoAccuracy: 'Fotoğraf:',
            real: 'Gerçek',
            aiOrFilter: 'AI / Filtre',
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
            selectOption: 'Select an option...',
            yes: 'Yes',
            no: 'No',
            back: 'Back',
        },
        nav: {
            home: 'Home',
            cities: 'Cities',
            categories: 'Categories',
            listings: 'Profiles',
            features: 'Showcase & Features',
            dashboard: 'Dashboard',
            logout: 'Logout',
            login: 'Login',
            register: 'Register',
            myProfile: 'My Profile',
            settings: 'Settings',
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
            username: 'Username',
            confirmPassword: 'Confirm Password',
            forgotPassword: 'Forgot Password?',
            resetPassword: 'Reset Password',
            newPassword: 'New Password',
            createAccount: 'Create Account',
            alreadyHaveAccount: 'Already have an account?',
            dontHaveAccount: 'Don\'t have an account?',
            passwordRequirements: 'Password must be at least 8 characters',
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
            management: 'City Management',
        },
        categories: {
            title: 'Category Management',
            addNew: 'Add New Category',
            addSubCategory: 'Add Subcategory',
            mainCategory: 'Main Category',
            subCategory: 'Subcategory',
            categoryName: 'Category Name',
            order: 'Order',
            management: 'Category Management',
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
            management: 'Profile Management',
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
            adminPanel: 'Admin Panel',
            members: 'Members',
            models: 'Models',
            agencies: 'Agencies',
        },
        profile: {
            createTitle: 'Create Profile',
            createSubtitle: 'Create your profile to reach thousands of users.',
            personalInfo: 'Personal Information',
            attributes: 'Physical Attributes',
            name: 'Your Name / Title',
            phone: 'Phone Number',
            countryCode: 'Country Code',
            hairColor: 'Hair Color',
            bodyType: 'Body Type',
            age: 'Age',
            ethnicity: 'Ethnicity',
            city: 'City',
            price: 'Hourly Rate (Optional)',
            photos: 'Photos',
            submit: 'Create Profile',
            success: 'Profile created successfully!',
            settings: 'Profile Settings',
            profileUpdateSuccess: 'Profile updated successfully!',
            profileUpdateError: 'Error updating profile',
            username: 'Username',
            firstName: 'First Name',
            lastName: 'Last Name',
            verifyEmail: 'Verify Email',
            memberRegistration: 'Member Registration',
            modelRegistration: 'Model Registration',
            agencyRegistration: 'Agency Registration',
            registerAsRegularMember: 'Register as a regular member right now',
            registerAsIndependentModel: 'Create your profile as an independent model',
            registerAsAgency: 'Manage multiple listings as an agency/company',
            alreadyHaveAccount: 'Already have an account?',
            signIn: 'Sign In',
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
        legal: {
            termsOfService: 'Terms of Service',
            privacyPolicy: 'Privacy Policy',
            generalTerms: 'General Terms of Service',
            lastUpdated: 'Last updated:',
            section1: '1. Service Definition',
            section2: '2. Account Creation',
            section3: '3. User Responsibilities',
            section4: '4. Prohibited Behaviors',
            section5: '5. Content Ownership',
            section6: '6. Account Suspension and Termination',
            section7: '7. Disclaimer',
            section8: '8. Changes',
            section9: '9. Fees and Payments',
            section10: '10. Contact',
            serviceDefinition: 'Our platform is a meeting and introduction platform for members, independent models, and agencies/companies. By using our services, you accept these terms.',
            accountCreation: 'You must be over 18 years old',
            provideAccurateInfo: 'You must provide accurate and current information',
            accountSecurity: 'You are responsible for account security',
            oneAccountPerUser: 'Each user can only create one account',
            userResponsibilities: 'Users agree to follow the following rules:',
            obeyLaws: 'Comply with laws and regulations',
            shareHonestInfo: 'Share accurate and not misleading information',
            respectOthers: 'Treat other users with respect',
            respectIntellectualProperty: 'Respect copyright and intellectual property rights',
            dontAbuseService: 'Do not abuse the platform',
            prohibitedBehaviors: 'The following behaviors are strictly prohibited:',
            noFalseContent: 'Sharing false or misleading content',
            noSpam: 'Sending spam or unwanted messages',
            noHarassment: 'Harassing or threatening others',
            noSecurityThreats: 'Endangering platform security',
            noIllegalActivity: 'Engaging in illegal activities',
            contentOwnership: 'You own the copyright to the content you share on the platform. However, by sharing content on our platform, you grant us a limited license to display your content.',
            accountTermination: 'We may suspend or terminate accounts that violate these terms without warning. Users can close their accounts at any time.',
            disclaimer: 'The platform is provided "as is". We are not responsible for interactions between users, content, or service interruptions.',
            termsChanges: 'These terms may be updated from time to time. Users will be notified of significant changes.',
            feesPayments: 'Some services may be charged. Fees and payment terms will be specified on the relevant pages.',
            contact: 'If you have questions about our terms of service, please contact us.',
        },
        memberProfile: {
            evaluation: 'Evaluation',
            averageSatisfaction: 'Average Satisfaction',
            commentHistory: 'Comment History',
            noCommentsFound: 'No comments found',
            thisUserHasNotLeft: 'This member has not left any comments on any profile yet.',
            registration: 'Registration:',
            photoAccuracy: 'Photo Accuracy:',
            real: 'Real',
            aiOrFilter: 'AI / Filter',
        },
    },
};
