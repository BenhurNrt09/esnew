/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@repo/ui', '@repo/lib', '@repo/types'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'ddxcewpzyvnagopzynfh.supabase.co',
                pathname: '/storage/v1/object/public/**',
            },
        ],
    },
};

module.exports = nextConfig;
