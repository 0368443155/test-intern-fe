/** @type {import('next').NextConfig} */
const nextConfig = {
  // Thêm cấu hình images tại đây
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;