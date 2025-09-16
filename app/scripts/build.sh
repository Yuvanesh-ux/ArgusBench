#!/bin/bash
set -e

echo "🔨 Building TaskFlow for Production"
echo "=================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Please run this script from the app directory"
  exit 1
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf backend/dist
rm -rf frontend/dist

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build backend
echo "🔨 Building backend..."
cd backend
npm run build
cd ..

# Build frontend
echo "🔨 Building frontend..."
cd frontend
npm run build
cd ..

echo ""
echo "✅ Build complete!"
echo ""
echo "Build artifacts:"
echo "  • Backend: backend/dist/"
echo "  • Frontend: frontend/dist/"
echo ""
echo "To start production server:"
echo "  cd backend && npm start"
echo ""
echo "To build Docker images:"
echo "  docker-compose -f docker-compose.prod.yml build"