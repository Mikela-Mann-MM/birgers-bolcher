/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
  // Prevent API routes from being analyzed during build
  pageExtensions: ['tsx', 'ts', 'jsx', 'js'],
  poweredByHeader: false,
  // Don't try to optimize API routes
  swcMinify: true,
}

module.exports = nextConfig