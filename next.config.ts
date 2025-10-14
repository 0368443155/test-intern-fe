/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        // Dùng wildcard (**) để cho phép bất kỳ hostname HTTPS nào
        hostname: '**', 
        port: '',
        pathname: '/**',
      }
    ],
  },
};

module.exports = nextConfig;