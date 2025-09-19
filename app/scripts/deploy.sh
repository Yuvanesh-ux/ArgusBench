#!/bin/bash
set -e

echo "🚀 Deploying TaskFlow to Production"
echo "==================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Please run this script from the app directory"
  exit 1
fi

# Check if production environment file exists
if [ ! -f ".env.production" ]; then
  echo "❌ Error: .env.production file not found"
  echo "Please create it based on .env.production template"
  exit 1
fi

# Run tests before deploying
echo "🧪 Running tests before deployment..."
./scripts/test.sh

# Build for production
echo "🔨 Building for production..."
./scripts/build.sh

# Build Docker images
echo "🐳 Building Docker images..."
docker-compose -f docker-compose.prod.yml build

# Stop existing production containers
echo "⏹️ Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down || true

# Start production environment
echo "🚀 Starting production environment..."
cp .env.production .env.prod
docker-compose -f docker-compose.prod.yml --env-file .env.prod up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Health check
echo "🔍 Performing health check..."
if curl -f http://localhost:5000/health > /dev/null 2>&1; then
  echo "✅ Backend is healthy"
else
  echo "❌ Backend health check failed"
  exit 1
fi

if curl -f http://localhost:3000 > /dev/null 2>&1; then
  echo "✅ Frontend is healthy"
else
  echo "❌ Frontend health check failed"
  exit 1
fi

echo ""
echo "🎉 Deployment successful!"
echo ""
echo "Production URLs:"
echo "  • Frontend: http://localhost:3000"
echo "  • Backend: http://localhost:5000"
echo ""
echo "To monitor logs:"
echo "  docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "To stop production:"
echo "  docker-compose -f docker-compose.prod.yml down"