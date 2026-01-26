// Database Entity Types

export interface User {
    id: string;
    email: string;
    role: 'admin' | 'user';
    created_at: string;
    updated_at: string;
}

export interface City {
    id: string;
    name: string;
    slug: string;
    is_active: boolean;
    seo_title?: string;
    seo_description?: string;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: string;
    name: string;
    slug: string;
    parent_id?: string;
    order: number;
    seo_title?: string;
    seo_description?: string;
    created_at: string;
    updated_at: string;
}

export interface Listing {
    id: string;
    title: string;
    slug: string;
    description: string;
    city_id: string;
    category_id: string;
    price?: number;
    is_featured: boolean;
    is_active: boolean;
    metadata: Record<string, any>;
    created_at: string;
    updated_at: string;
}

export interface ListingImage {
    id: string;
    listing_id: string;
    image_url: string;
    order: number;
    created_at: string;
}

export interface Feature {
    id: string;
    name: string;
    slug: string;
    category_id?: string;
    input_type: 'text' | 'number' | 'boolean' | 'select';
    options?: string[];
    created_at: string;
}

export interface ListingFeature {
    id: string;
    listing_id: string;
    feature_id: string;
    value: string;
    created_at: string;
}

export interface Tag {
    id: string;
    name: string;
    slug: string;
    created_at: string;
}

export interface ListingTag {
    listing_id: string;
    tag_id: string;
    created_at: string;
}

export interface SeoPage {
    id: string;
    page_type: 'homepage' | 'city' | 'category' | 'listing';
    reference_id?: string;
    meta_title: string;
    meta_description: string;
    canonical_url?: string;
    structured_data?: Record<string, any>;
    created_at: string;
    updated_at: string;
}

// Extended Types with Relations

export interface ListingWithRelations extends Listing {
    city: City;
    category: Category;
    images: ListingImage[];
    features: (ListingFeature & { feature: Feature })[];
    tags: (ListingTag & { tag: Tag })[];
}

export interface CategoryWithChildren extends Category {
    children?: Category[];
    parent?: Category;
}

// DTOs and Filter Types

export interface ListingFilter {
    cityId?: string;
    categoryId?: string;
    minPrice?: number;
    maxPrice?: number;
    tags?: string[];
    features?: Record<string, string>;
    isFeatured?: boolean;
    isActive?: boolean;
    search?: string;
}

export interface ListingSortOption {
    field: 'created_at' | 'price' | 'title';
    direction: 'asc' | 'desc';
}

export interface PaginationParams {
    page: number;
    pageSize: number;
}

export interface PaginatedResult<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

// Form Data Types

export interface CreateListingDto {
    title: string;
    slug: string;
    description: string;
    city_id: string;
    category_id: string;
    price?: number;
    is_featured: boolean;
    is_active: boolean;
    metadata?: Record<string, any>;
    tags?: string[];
    features?: Record<string, string>;
}

export interface UpdateListingDto extends Partial<CreateListingDto> {
    id: string;
}

export interface CreateCityDto {
    name: string;
    slug: string;
    is_active: boolean;
    seo_title?: string;
    seo_description?: string;
}

export interface UpdateCityDto extends Partial<CreateCityDto> {
    id: string;
}

export interface CreateCategoryDto {
    name: string;
    slug: string;
    parent_id?: string;
    order: number;
    seo_title?: string;
    seo_description?: string;
}

export interface UpdateCategoryDto extends Partial<CreateCategoryDto> {
    id: string;
}

// API Response Types

export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface ApiError {
    code: string;
    message: string;
    details?: any;
}
