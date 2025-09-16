#!/bin/bash
set -e

echo "🧪 Running TaskFlow Tests"
echo "========================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: Please run this script from the app directory"
  exit 1
fi

# Ensure services are running for integration tests
echo "🐳 Starting test services..."
docker-compose up -d postgres redis

# Wait for services
echo "⏳ Waiting for services..."
sleep 10

# Run backend tests
echo "🔬 Running backend tests..."
cd backend
npm run test
echo "✅ Backend tests passed"
cd ..

# Run frontend tests
echo "🔬 Running frontend tests..."
cd frontend
npm run test
echo "✅ Frontend tests passed"
cd ..

# Run linting
echo "🔍 Running linting..."
npm run lint
echo "✅ Linting passed"

# Run type checking
echo "📝 Running type checking..."
npm run type-check
echo "✅ Type checking passed"

echo ""
echo "🎉 All tests passed!"
echo ""
echo "Test coverage reports:"
echo "  • Backend: backend/coverage/"
echo "  • Frontend: frontend/coverage/"