import { createClient } from './client';

export interface ValidationResult {
    valid: boolean;
    error?: string;
}

/**
 * Validates username format
 * - Must be 3-20 characters
 * - Only alphanumeric characters, underscores, and hyphens
 */
export function validateUsername(username: string): ValidationResult {
    if (!username || username.length < 3) {
        return { valid: false, error: 'Kullanıcı adı en az 3 karakter olmalıdır' };
    }

    if (username.length > 20) {
        return { valid: false, error: 'Kullanıcı adı en fazla 20 karakter olabilir' };
    }

    const usernameRegex = /^[a-zA-Z0-9_-]+$/;
    if (!usernameRegex.test(username)) {
        return { valid: false, error: 'Kullanıcı adı sadece harf, rakam, alt çizgi ve tire içerebilir' };
    }

    return { valid: true };
}

/**
 * Validates email format
 */
export function validateEmail(email: string): ValidationResult {
    if (!email) {
        return { valid: false, error: 'E-posta adresi gereklidir' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { valid: false, error: 'Geçerli bir e-posta adresi giriniz' };
    }

    return { valid: true };
}

/**
 * Validates password strength
 */
export function validatePassword(password: string): ValidationResult {
    if (!password || password.length < 8) {
        return { valid: false, error: 'Şifre en az 8 karakter olmalıdır' };
    }

    if (password.length > 72) {
        return { valid: false, error: 'Şifre en fazla 72 karakter olabilir' };
    }

    // Check for at least one number
    if (!/\d/.test(password)) {
        return { valid: false, error: 'Şifre en az bir rakam içermelidir' };
    }

    // Check for at least one letter
    if (!/[a-zA-Z]/.test(password)) {
        return { valid: false, error: 'Şifre en az bir harf içermelidir' };
    }

    return { valid: true };
}

/**
 * Checks if passwords match
 */
export function validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
    if (password !== confirmPassword) {
        return { valid: false, error: 'Şifreler eşleşmiyor' };
    }

    return { valid: true };
}

/**
 * Checks if username is available across all user types
 */
export async function checkUsernameAvailability(username: string): Promise<ValidationResult> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc('is_username_available', {
            p_username: username
        });

        if (error) {
            console.error('Error checking username:', error);
            return { valid: false, error: 'Kullanıcı adı kontrolü başarısız oldu' };
        }

        if (!data) {
            return { valid: false, error: 'Bu kullanıcı adı zaten kullanılıyor' };
        }

        return { valid: true };
    } catch (err) {
        console.error('Exception checking username:', err);
        return { valid: false, error: 'Kullanıcı adı kontrolü başarısız oldu' };
    }
}

/**
 * Checks if email is available across all user types
 */
export async function checkEmailAvailability(email: string): Promise<ValidationResult> {
    try {
        const supabase = createClient();
        const { data, error } = await supabase.rpc('is_email_available', {
            p_email: email
        });

        if (error) {
            console.error('Error checking email:', error);
            return { valid: false, error: 'E-posta kontrolü başarısız oldu' };
        }

        if (!data) {
            return { valid: false, error: 'Bu e-posta adresi zaten kullanılıyor' };
        }

        return { valid: true };
    } catch (err) {
        console.error('Exception checking email:', err);
        return { valid: false, error: 'E-posta kontrolü başarısız oldu' };
    }
}

/**
 * Determines if input is email or username
 */
export function isEmail(input: string): boolean {
    return input.includes('@');
}

/**
 * Remember me functionality - sets/gets from localStorage
 */
export const rememberMe = {
    save: (email: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('rememberedEmail', email);
        }
    },

    get: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('rememberedEmail');
        }
        return null;
    },

    clear: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('rememberedEmail');
        }
    }
};
