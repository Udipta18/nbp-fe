/** @type {import('next').NextConfig} */
const nextConfig = {
    // Disable automatic scroll restoration - we'll handle it manually
    experimental: {
        scrollRestoration: false,
    },
};

module.exports = nextConfig;
