/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    SKIP_DB_VALIDATION: process.env.NODE_ENV === 'production' ? 'true' : 'false'
  }
}

module.exports = nextConfig