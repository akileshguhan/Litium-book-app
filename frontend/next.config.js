/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'books.google.com',
        pathname: '/books/content/**',
      },
      {
        protocol: 'http', // The new one
        hostname: 'books.google.com',
        pathname: '/books/publisher/content/**',
      },
    ],
  },
};

module.exports = nextConfig;