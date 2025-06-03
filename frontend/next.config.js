// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Or whatever other configurations you have
  images: {
    remotePatterns: [
      {
        protocol: 'http', // Or 'https' if your Django server uses HTTPS in production
        hostname: '127.0.0.1',
        port: '8000', // Important: specify the port
        pathname: '/media/**', // Allows any path under /media/
      },
      // You can add other allowed hostnames here if needed for production
      // For example, if your backend is deployed to 'api.yourdomain.com':
      // {
      //   protocol: 'https',
      //   hostname: 'api.yourdomain.com',
      //   port: '', // Default port for https (443)
      //   pathname: '/media/**',
      // },
    ],
    // domains: ['127.0.0.1'], // This is the older way, remotePatterns is preferred
  },
};

module.exports = nextConfig;