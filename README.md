# 🛒 Price Comparison & Cashback Platform

Modern fiyat karşılaştırma ve cashback platformu - Türkiye'nin ilk AI destekli akıllı alışveriş asistanı.

## 🎯 Proje Özeti

Bu platform, kullanıcıların en iyi fiyatları bulmalarına, otomatik kuponlar almasına ve alışverişlerinden cashback kazanmasına olanak tanır.

### Ana Özellikler

- 💰 **Cashback & Loyalty**: Alışverişlerden %2-10 geri ödeme
- 🤖 **AI Fiyat Tahmini**: Makine öğrenmesi ile fiyat düşüşü tahminleri
- 🔍 **Akıllı Karşılaştırma**: Gerçek zamanlı fiyat takibi
- 🎟️ **Otomatik Kupon**: Browser extension ile otomatik kupon uygulama
- 📱 **Cross-Platform**: Web, iOS, Android, Browser Extension
- 🎮 **Gamification**: Seviyeler, rozetler, ödüller

## 🏗️ Mimari

```
price-comparison-platform/
├── backend/
│   ├── services/
│   │   ├── api-gateway/          # API Gateway (Node.js + Express)
│   │   ├── user-service/          # User Management & Auth
│   │   ├── product-service/       # Product Catalog & Search
│   │   ├── cashback-service/      # Cashback & Affiliate
│   │   ├── scraping-service/      # Price Scraping (Python)
│   │   ├── ml-service/            # AI/ML Models (Python)
│   │   ├── notification-service/  # Push, Email, SMS
│   │   └── analytics-service/     # Analytics & Tracking
│   └── shared/                    # Shared libraries
├── frontend/
│   └── web/                       # Next.js 15 + React 19
├── mobile/
│   ├── ios/                       # Swift + SwiftUI
│   └── android/                   # Kotlin + Jetpack Compose
├── browser-extension/             # Manifest V3 Extension
└── infrastructure/
    ├── docker/                    # Docker configs
    ├── kubernetes/                # K8s manifests
    └── terraform/                 # IaC

```

## 🚀 Teknoloji Stack

### Backend
- **API Gateway**: Node.js 20, Express, TypeScript
- **Microservices**: Node.js, Python (FastAPI, Scrapy)
- **Databases**: PostgreSQL, Redis, MongoDB, Elasticsearch
- **Message Queue**: Bull, Redis
- **Auth**: JWT, OAuth2

### Frontend
- **Web**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **iOS**: Swift 6, SwiftUI, Combine
- **Android**: Kotlin, Jetpack Compose, Coroutines
- **Extension**: Manifest V3, React, TypeScript

### AI/ML
- **Frameworks**: TensorFlow, PyTorch, scikit-learn
- **Models**: LSTM (price prediction), Collaborative Filtering (recommendations)

### Infrastructure
- **Cloud**: AWS (EKS, EC2, S3, RDS, ElastiCache)
- **Containers**: Docker, Kubernetes
- **CI/CD**: GitHub Actions
- **IaC**: Terraform

## 🛠️ Development Setup

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Quick Start

```bash
# Clone repository
git clone <repo-url>
cd price-comparison-platform

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env

# Start infrastructure (PostgreSQL, Redis, etc.)
docker-compose up -d

# Run database migrations
npm run db:migrate

# Start all services in development
npm run dev

# Or start individual services
npm run dev:gateway
npm run dev:user
npm run dev:product
```

## 📦 Microservices

### API Gateway (Port 3000)
- Request routing & load balancing
- Authentication & authorization
- Rate limiting
- API versioning

### User Service (Port 3001)
- User registration & login
- Profile management
- OAuth2 social login
- Email verification

### Product Service (Port 3002)
- Product catalog
- Search & filtering (Elasticsearch)
- Price history tracking
- Favorites & watchlist

### Cashback Service (Port 3003)
- Affiliate link generation
- Cashback calculation
- Commission tracking
- Payout processing

### Scraping Service (Port 3004)
- E-commerce site scraping (Scrapy + Playwright)
- Price monitoring
- Product availability tracking
- Scheduled jobs

### ML Service (Port 3005)
- Price prediction (LSTM models)
- Product recommendations
- User personalization
- Anomaly detection

### Notification Service (Port 3006)
- Push notifications (Firebase, APNs)
- Email (SendGrid)
- SMS (Twilio)
- In-app notifications

### Analytics Service (Port 3007)
- User behavior tracking
- Event logging
- Dashboard metrics
- A/B testing

## 🗄️ Database Schema

### PostgreSQL Tables
- `users` - User accounts & profiles
- `products` - Product catalog
- `price_history` - Historical price data
- `cashback_transactions` - Cashback records
- `affiliates` - Affiliate partnerships
- `orders` - User orders
- `payouts` - Cashback payouts

### Redis Keys
- `session:{userId}` - User sessions
- `cache:product:{id}` - Product cache
- `cache:price:{id}` - Price cache
- `rate_limit:{ip}` - Rate limiting

### MongoDB Collections
- `products_metadata` - Flexible product data
- `user_activities` - Activity logs
- `notifications` - Notification history

## 🧪 Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run e2e tests
npm run test:e2e

# Test coverage
npm run test:coverage
```

## 📊 Monitoring

- **Metrics**: Prometheus + Grafana
- **Logs**: ELK Stack (Elasticsearch, Logstash, Kibana)
- **Tracing**: AWS X-Ray
- **Alerts**: CloudWatch Alarms

## 🚢 Deployment

### Development
```bash
npm run deploy:dev
```

### Staging
```bash
npm run deploy:staging
```

### Production
```bash
npm run deploy:prod
```

## 📝 API Documentation

API documentation available at:
- Development: http://localhost:3000/api/docs
- Staging: https://api-staging.example.com/docs
- Production: https://api.example.com/docs

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is proprietary and confidential.

## 👥 Team

- **Backend Team**: 2 developers
- **Frontend Team**: 2 developers
- **Mobile Team**: 2 developers (iOS + Android)
- **DevOps**: 1 engineer
- **ML Engineer**: 1 engineer
- **UI/UX Designer**: 1 designer

## 📞 Contact

For questions and support, please contact the development team.

---

**Built with ❤️ in Turkey**
