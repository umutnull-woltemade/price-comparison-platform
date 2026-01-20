# Product Service

Ürün kataloğu, fiyat karşılaştırma ve arama servisi.

## 🎯 Özellikler

### Product Management
- ✅ Ürün CRUD operasyonları
- ✅ Kategori yönetimi (hierarchical)
- ✅ Marka yönetimi
- ✅ Mağaza/Store yönetimi
- ✅ Fiyat geçmişi tracking

### Search & Discovery
- ✅ Elasticsearch full-text search
- ✅ Türkçe dil desteği (analyzer)
- ✅ Autocomplete/suggestions
- ✅ Faceted search (filters)
- ✅ Fuzzy search

### Price Tracking
- ✅ Otomatik fiyat geçmişi kaydı
- ✅ Cron jobs (her 6 saatte bir)
- ✅ Price history cleanup (90 gün)

### Analytics
- ✅ Product views tracking (MongoDB)
- ✅ Click tracking
- ✅ Search logs
- ✅ Metrics collection

## 🏗️ Teknoloji Stack

- **Runtime**: Node.js 20 + TypeScript
- **Framework**: Express.js
- **Databases**:
  - PostgreSQL 15 (Prisma) - Structured data
  - MongoDB 7 - Analytics & logs
  - Elasticsearch 8 - Search
- **Cache**: Redis 7
- **Image Processing**: Sharp
- **Cron**: node-cron
- **Logging**: Winston

## 📦 Database Schema

### PostgreSQL (Prisma)
- **Category**: Hierarchical categories
- **Brand**: Product brands
- **Store**: Retailers/merchants
- **Product**: Main product data
- **PriceHistory**: Historical pricing
- **Review**: Product reviews

### MongoDB Collections
- **product_views**: View analytics
- **product_clicks**: Click tracking
- **search_logs**: Search analytics
- **price_alerts**: User price alerts

### Elasticsearch Index
- **products**: Full-text search index with Turkish analyzer

## 🚀 Development

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

## 📚 API Endpoints

| Category | Endpoints |
|----------|-----------|
| Products | GET/POST/PUT/DELETE `/products` |
| Categories | GET/POST/PUT/DELETE `/categories` |
| Brands | GET/POST/PUT/DELETE `/brands` |
| Stores | GET/POST/PUT/DELETE `/stores` |
| Reviews | GET/POST `/reviews` |
| Search | GET `/search` with advanced filters |

## 🔧 Environment Variables

See `.env.example` for configuration.

## 📄 License

Proprietary - Price Comparison Platform
