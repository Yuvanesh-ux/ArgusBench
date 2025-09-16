#!/bin/bash
set -e

echo "🚀 Starting TaskFlow Development Environment"
echo "============================================"

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Please run this script from the app directory"
  exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo "❌ Error: .env file not found. Run ./scripts/dev-setup.sh first"
  exit 1
fi

# Start all Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 15

# Check database health
echo "🔍 Checking database health..."
until docker-compose exec -T postgres pg_isready -U taskflow_user -d taskflow_db; do
  echo "⏳ Waiting for database..."
  sleep 2
done

echo "✅ Database is ready"

# Check Redis health
echo "🔍 Checking Redis health..."
until docker-compose exec -T redis redis-cli ping > /dev/null; do
  echo "⏳ Waiting for Redis..."
  sleep 2
done

echo "✅ Redis is ready"

# Start the application
echo "🎬 Starting application..."
echo ""
echo "🌐 URLs:"
echo "  • Frontend: http://localhost:3000"
echo "  • Backend: http://localhost:5000"
echo "  • Backend Health: http://localhost:5000/health"
echo ""
echo "📊 To check service status:"
echo "  docker-compose ps"
echo ""
echo "📋 To view logs:"
echo "  docker-compose logs -f [service-name]"
echo ""
echo "⏹️ To stop services:"
echo "  docker-compose down"
echo ""

# Start the development servers
npm run dev