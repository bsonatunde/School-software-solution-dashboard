const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize images
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  
  // Disable source maps in production for smaller builds
  productionBrowserSourceMaps: false,
  
  // Experimental features for better module resolution
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3001', '*.render.com']
    },
    optimizePackageImports: ['lucide-react']
  },
  
  // Webpack configuration for better module resolution
  webpack: (config, { isServer }) => {
    // Fix for module resolution issues in production
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
    };
    
    // Ensure proper alias resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.join(__dirname, 'src'),
    };
    
    return config;
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

module.exports = nextConfig;
