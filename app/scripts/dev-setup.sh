#!/bin/bash
set -e

echo "🚀 TaskFlow Development Setup"
echo "=============================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Please run this script from the app directory"
  exit 1
fi

# Check if .env file exists
if [ ! -f ".env" ]; then
  echo "📋 Creating .env file from template..."
  cp .env.example .env
  echo "✅ .env file created"
else
  echo "✅ .env file already exists"
fi

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p backend/uploads backend/logs
echo "✅ Directories created"

# Check if Docker is running
echo "🐳 Checking Docker..."
if ! docker info > /dev/null 2>&1; then
  echo "❌ Error: Docker is not running. Please start Docker and try again."
  exit 1
fi

echo "✅ Docker is running"

# Start database services
echo "🗄️ Starting database services..."
docker-compose up -d postgres redis

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Check if database is ready
until docker-compose exec -T postgres pg_isready -U taskflow_user -d taskflow_db; do
  echo "⏳ Waiting for database..."
  sleep 2
done

echo "✅ Database is ready"

# Build backend
echo "🔨 Building backend..."
cd backend
npm run build
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the development environment:"
echo "  1. Start all services: docker-compose up -d"
echo "  2. Run backend: npm run dev:backend"
echo "  3. Run frontend: npm run dev:frontend"
echo "  4. Or run both: npm run dev"
echo ""
echo "URLs:"
echo "  • Frontend: http://localhost:3000"
echo "  • Backend: http://localhost:5000"
echo "  • Database: localhost:5432"
echo "  • Redis: localhost:6379"
echo ""
echo "Default login credentials:"
echo "  • Email: admin@taskflow.com"
echo "  • Password: password123"