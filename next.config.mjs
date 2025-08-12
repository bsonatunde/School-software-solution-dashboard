/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable optimizations for production
  output: 'standalone',
  
  // Optimize images
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  
  // Disable source maps in production for smaller builds
  productionBrowserSourceMaps: false,
  
  // Enable experimental features
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3001', '*.render.com']
    }
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization'
          }
        ]
      }
    ]
  }
};

export default nextConfig;
