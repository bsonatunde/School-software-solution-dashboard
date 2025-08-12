#!/usr/bin/env bash
# Render deployment script for Pacey School Solution

echo "🚀 Starting Render deployment for Pacey School Solution..."

# Set Node.js environment
export NODE_ENV=production

# Install dependencies
echo "📦 Installing dependencies..."
npm ci

# Run build
echo "🔨 Building Next.js application..."
npm run build

echo "✅ Build completed successfully!"

# Print deployment info
echo "📊 Deployment Summary:"
echo "- Node.js version: $(node --version)"
echo "- NPM version: $(npm --version)"
echo "- Environment: $NODE_ENV"
echo "- Build output: .next/"
echo ""
echo "🌟 Pacey School Solution is ready for production!"
