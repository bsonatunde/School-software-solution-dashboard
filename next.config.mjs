/** @type {import('next').NextConfig} */
const nextConfig = {
  // Optimize images
  images: {
    domains: ['localhost'],
    unoptimized: true
  },
  
  // Disable source maps in production for smaller builds
  productionBrowserSourceMaps: false,
  
  // Enable strict mode for better module resolution
  swcMinify: true,
  
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

export default nextConfig;
