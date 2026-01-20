#!/bin/bash

# Setup script for User Service database

set -e

echo "🚀 Setting up User Service database..."

# Check if PostgreSQL is running
echo "📦 Checking PostgreSQL connection..."
if ! docker ps | grep -q price-platform-postgres; then
    echo "❌ PostgreSQL container is not running. Please start it with:"
    echo "   docker-compose up -d postgres"
    exit 1
fi

echo "✅ PostgreSQL is running"

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for PostgreSQL to be ready..."
sleep 5

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Create and run migrations
echo "🗃️  Running database migrations..."
npx prisma migrate dev --name init

echo "✅ Database setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. npm run dev          # Start the service"
echo "   2. npm test             # Run tests"
echo "   3. npx prisma studio    # Open Prisma Studio"
