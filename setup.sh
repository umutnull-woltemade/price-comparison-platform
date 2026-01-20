#!/bin/bash

set -e

echo "🚀 Price Comparison Platform - Setup Script"
echo "==========================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check requirements
echo "📋 Checking requirements..."

if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js 20+${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found${NC}"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found. Please install Docker${NC}"
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ docker-compose not found${NC}"
    exit 1
fi

echo -e "${GREEN}✅ All requirements met${NC}"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""

# Setup environment files
echo "⚙️  Setting up environment files..."

services=("api-gateway" "user-service" "product-service" "cashback-service")

for service in "${services[@]}"; do
    if [ ! -f "backend/services/$service/.env" ]; then
        cp "backend/services/$service/.env.example" "backend/services/$service/.env"
        echo -e "${GREEN}✅ Created .env for $service${NC}"
    else
        echo -e "${YELLOW}⚠️  .env already exists for $service${NC}"
    fi
done

echo ""

# Start Docker containers
echo "🐳 Starting Docker containers..."
docker-compose up -d postgres redis mongodb elasticsearch

echo ""
echo "⏳ Waiting for databases to be ready..."
sleep 15

# Check database health
echo "🔍 Checking database connections..."

if docker-compose ps postgres | grep -q "Up"; then
    echo -e "${GREEN}✅ PostgreSQL is running${NC}"
else
    echo -e "${RED}❌ PostgreSQL failed to start${NC}"
    exit 1
fi

if docker-compose ps redis | grep -q "Up"; then
    echo -e "${GREEN}✅ Redis is running${NC}"
else
    echo -e "${RED}❌ Redis failed to start${NC}"
    exit 1
fi

if docker-compose ps mongodb | grep -q "Up"; then
    echo -e "${GREEN}✅ MongoDB is running${NC}"
else
    echo -e "${RED}❌ MongoDB failed to start${NC}"
    exit 1
fi

if docker-compose ps elasticsearch | grep -q "Up"; then
    echo -e "${GREEN}✅ Elasticsearch is running${NC}"
else
    echo -e "${RED}❌ Elasticsearch failed to start${NC}"
    exit 1
fi

echo ""

# Setup databases
echo "🗄️  Setting up databases..."

# User Service
echo "Setting up User Service database..."
cd backend/services/user-service
npm install --silent
npx prisma generate
npx prisma migrate deploy || echo "Migration skipped (will be created on first run)"
cd ../../..

# Product Service
echo "Setting up Product Service database..."
cd backend/services/product-service
npm install --silent
npx prisma generate
npx prisma migrate deploy || echo "Migration skipped (will be created on first run)"
cd ../../..

# Cashback Service
echo "Setting up Cashback Service database..."
cd backend/services/cashback-service
npm install --silent
npx prisma generate
npx prisma migrate deploy || echo "Migration skipped (will be created on first run)"
cd ../../..

echo ""
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo ""
echo "🎯 Next steps:"
echo ""
echo "1. Start all services:"
echo "   npm run dev"
echo ""
echo "2. Or start services individually:"
echo "   npm run dev:gateway    # API Gateway (port 3000)"
echo "   npm run dev:user       # User Service (port 3001)"
echo "   npm run dev:product    # Product Service (port 3002)"
echo "   npm run dev:cashback   # Cashback Service (port 3003)"
echo ""
echo "3. Access API:"
echo "   http://localhost:3000/health"
echo "   http://localhost:3000/api/v1/docs"
echo ""
echo "4. View logs:"
echo "   docker-compose logs -f"
echo ""
echo "5. Stop services:"
echo "   docker-compose down"
echo ""
echo "📚 For more information, see GETTING_STARTED.md"
echo ""
