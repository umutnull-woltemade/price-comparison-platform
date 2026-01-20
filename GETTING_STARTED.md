# 🚀 Getting Started

Hoş geldiniz! Bu rehber, Price Comparison Platform'u local development ortamınızda çalıştırmanız için gerekli tüm adımları içerir.

## 📋 Gereksinimler

Başlamadan önce sisteminizde şunların kurulu olduğundan emin olun:

- **Node.js** 20+ ([Download](https://nodejs.org/))
- **npm** 10+ (Node.js ile birlikte gelir)
- **Docker** & **Docker Compose** ([Download](https://www.docker.com/products/docker-desktop))
- **Git** ([Download](https://git-scm.com/))

### İsteğe Bağlı

- **Python** 3.11+ (Scraping ve ML servisleri için)
- **PostgreSQL** 15+ (Docker kullanmıyorsanız)
- **Redis** 7+ (Docker kullanmıyorsanız)

## 🎬 Hızlı Başlangıç

### 1. Projeyi Klonlayın

```bash
git clone <repository-url>
cd price-comparison-platform
```

### 2. Bağımlılıkları Yükleyin

```bash
# Root ve tüm workspace'ler için dependencies yükle
npm install
```

### 3. Environment Variables Ayarlayın

```bash
# API Gateway için
cp backend/services/api-gateway/.env.example backend/services/api-gateway/.env

# Gerekirse değerleri düzenleyin
nano backend/services/api-gateway/.env
```

### 4. Docker Container'ları Başlatın

```bash
# PostgreSQL, Redis, MongoDB, Elasticsearch'ü başlat
docker-compose up -d postgres redis mongodb elasticsearch

# Container'ların hazır olmasını bekleyin (30 saniye kadar)
sleep 30

# Container durumlarını kontrol edin
docker-compose ps
```

### 5. API Gateway'i Başlatın

```bash
# Development modunda başlat (hot-reload aktif)
npm run dev:gateway
```

API Gateway şu adreste çalışmaya başlayacak: **http://localhost:3000**

### 6. Servisleri Test Edin

```bash
# Health check
curl http://localhost:3000/health

# API docs
curl http://localhost:3000/api/v1/docs
```

## 🏃 Tüm Servisleri Çalıştırma

### Development Mode (Önerilen)

Her servisi ayrı terminal penceresinde çalıştırın:

```bash
# Terminal 1 - API Gateway
npm run dev:gateway

# Terminal 2 - User Service
npm run dev:user

# Terminal 3 - Product Service
npm run dev:product

# Terminal 4 - Cashback Service
npm run dev:cashback
```

**VEYA** tek komutla tüm servisleri başlatın:

```bash
npm run dev
```

## 📁 Proje Yapısı

```
price-comparison-platform/
├── backend/
│   ├── services/
│   │   ├── api-gateway/          # ✅ Hazır
│   │   ├── user-service/          # ✅ Hazır
│   │   ├── product-service/       # 🚧 Sonraki adım
│   │   ├── cashback-service/      # 🚧 Sonraki adım
│   │   ├── scraping-service/      # ⏳ Gelecek
│   │   ├── ml-service/            # ⏳ Gelecek
│   │   ├── notification-service/  # ⏳ Gelecek
│   │   └── analytics-service/     # ⏳ Gelecek
│   └── shared/                    # Ortak kütüphaneler
├── frontend/
│   └── web/                       # ⏳ Gelecek
├── mobile/
│   ├── ios/                       # ⏳ Gelecek
│   └── android/                   # ⏳ Gelecek
├── browser-extension/             # ⏳ Gelecek
└── infrastructure/
    ├── docker/                    # ✅ Hazır
    ├── kubernetes/                # ⏳ Gelecek
    └── terraform/                 # ⏳ Gelecek
```

## 🔧 Kullanışlı Komutlar

### Development

```bash
# Tüm servisleri başlat
npm run dev

# Sadece API Gateway
npm run dev:gateway

# Sadece User Service
npm run dev:user

# Hot-reload ile çalışır, kod değişikliklerinde otomatik yeniden başlar
```

### Testing

```bash
# Tüm testleri çalıştır
npm test

# Unit tests
npm run test:unit

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage raporu
npm run test:coverage
```

### Database

```bash
# Migrations çalıştır
npm run db:migrate

# Seed data ekle
npm run db:seed

# Database'i sıfırla
npm run db:reset
```

### Docker

```bash
# Tüm servisleri başlat
docker-compose up -d

# Sadece infrastructure (DB, cache, etc.)
docker-compose up -d postgres redis mongodb elasticsearch

# Logları izle
docker-compose logs -f

# Servisleri durdur
docker-compose down

# Tüm verileri sil
docker-compose down -v
```

### Linting & Formatting

```bash
# Lint kontrol et
npm run lint

# Lint hatalarını düzelt
npm run lint:fix

# Prettier ile formatla
npm run format
```

## 🌐 API Endpoints

API Gateway tüm istekleri uygun servislere yönlendirir.

### Base URL
```
http://localhost:3000/api/v1
```

### Servis Endpoint'leri

| Service | Base Path | Port | Status |
|---------|-----------|------|--------|
| API Gateway | `/api/v1` | 3000 | ✅ Hazır |
| User Service | `/api/v1/auth`, `/api/v1/users` | 3001 | ✅ Hazır |
| Product Service | `/api/v1/products` | 3002 | 🚧 Dev |
| Cashback Service | `/api/v1/cashback` | 3003 | 🚧 Dev |
| Notification Service | `/api/v1/notifications` | 3006 | ⏳ Planlı |
| Analytics Service | `/api/v1/analytics` | 3007 | ⏳ Planlı |

### Örnek API Çağrıları

```bash
# Health check
curl http://localhost:3000/health

# API documentation
curl http://localhost:3000/api/v1/docs

# User registration (service hazır olduğunda)
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

# Get products (authentication required)
curl http://localhost:3000/api/v1/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🐛 Troubleshooting

### Port zaten kullanılıyor

```bash
# Hangi process kullanıyor kontrol et
lsof -i :3000

# Process'i öldür
kill -9 <PID>
```

### Docker container'lar başlamıyor

```bash
# Container'ları durdur ve temizle
docker-compose down -v

# Yeniden başlat
docker-compose up -d

# Logları kontrol et
docker-compose logs
```

### PostgreSQL bağlantı hatası

```bash
# PostgreSQL container'ın çalıştığını kontrol et
docker-compose ps postgres

# PostgreSQL loglarını incele
docker-compose logs postgres

# Container içine gir ve test et
docker-compose exec postgres psql -U priceuser -d price_platform
```

### Dependencies yüklenemiyor

```bash
# node_modules'ü sil ve yeniden yükle
rm -rf node_modules package-lock.json
npm install

# Cache'i temizle
npm cache clean --force
npm install
```

## 📚 Sonraki Adımlar

1. ✅ **API Gateway** - Tamamlandı!
2. ✅ **User Service** - Tamamlandı!
3. 🚧 **Product Service** - Sonraki adım
4. 🚧 **Cashback Service** - Sonraki sprint
5. ⏳ **Web Frontend** - Gelecek
6. ⏳ **Mobile Apps** - Gelecek
7. ⏳ **Browser Extension** - Gelecek

## 🤝 Yardım

Sorun yaşarsanız:

1. [Issues](https://github.com/your-repo/issues) sayfasını kontrol edin
2. Yeni issue açın
3. Team Slack kanalına yazın
4. Documentation'ı inceleyin

## 📖 Daha Fazla Bilgi

- [Architecture Documentation](./docs/ARCHITECTURE.md)
- [API Documentation](./docs/API.md)
- [Database Schema](./docs/DATABASE.md)
- [Deployment Guide](./docs/DEPLOYMENT.md)

---

**Happy Coding! 🚀**
