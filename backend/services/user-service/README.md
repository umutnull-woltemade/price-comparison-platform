# User Service

Kullanıcı kimlik doğrulama, yetkilendirme ve profil yönetimi servisi.

## 🎯 Özellikler

### Authentication
- ✅ Email/Password ile kayıt
- ✅ Email doğrulama
- ✅ Login (JWT token)
- ✅ Token yenileme (Refresh token)
- ✅ Şifre sıfırlama
- ✅ Logout
- 🚧 OAuth2 (Google, Apple) - Planlandı

### User Management
- ✅ Profil görüntüleme ve güncelleme
- ✅ Avatar yükleme
- ✅ Şifre değiştirme
- ✅ Kullanıcı tercihleri
- ✅ Adres yönetimi
- ✅ Hesap deaktivasyonu/silme

### Features
- ✅ Cashback hesap yönetimi
- ✅ Favori ürünler
- ✅ Fiyat alarmları
- ✅ Session yönetimi
- ✅ Account lockout (5 başarısız denemeden sonra 15 dk)

## 🏗️ Teknoloji Stack

- **Runtime**: Node.js 20+
- **Framework**: Express.js + TypeScript
- **Database**: PostgreSQL 15 (Prisma ORM)
- **Cache**: Redis 7
- **Authentication**: JWT (jsonwebtoken)
- **Password**: bcrypt
- **Validation**: express-validator
- **Email**: Nodemailer
- **Logging**: Winston

## 📦 Installation

```bash
# Install dependencies
npm install

# Setup database (creates tables and runs migrations)
./scripts/setup-db.sh

# Or manually:
npx prisma generate
npx prisma migrate dev --name init
```

## 🚀 Development

```bash
# Start in development mode (with hot reload)
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run tests
npm test

# Open Prisma Studio (database GUI)
npx prisma studio
```

## 🔧 Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
# Server
NODE_ENV=development
PORT=3001

# Database
DATABASE_URL=postgresql://priceuser:pricepass@localhost:5432/price_platform

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@priceplatform.com
EMAIL_VERIFY_URL=http://localhost:3000/verify-email
PASSWORD_RESET_URL=http://localhost:3000/reset-password

# Logging
LOG_LEVEL=info
```

## 📚 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/register` | Yeni kullanıcı kaydı | ❌ |
| POST | `/auth/login` | Giriş yap | ❌ |
| POST | `/auth/refresh` | Token yenile | ❌ |
| POST | `/auth/logout` | Çıkış yap | ✅ |
| POST | `/auth/forgot-password` | Şifre sıfırlama talebi | ❌ |
| POST | `/auth/reset-password` | Şifreyi sıfırla | ❌ |
| POST | `/auth/verify-email` | Email doğrula | ❌ |
| POST | `/auth/resend-verification` | Doğrulama emaili tekrar gönder | ❌ |

### User Profile

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/profile` | Profil bilgisi | ✅ |
| PUT | `/users/profile` | Profil güncelle | ✅ |
| PUT | `/users/avatar` | Avatar güncelle | ✅ |
| PUT | `/users/change-password` | Şifre değiştir | ✅ |
| DELETE | `/users/deactivate` | Hesabı deaktive et | ✅ |
| DELETE | `/users/account` | Hesabı sil | ✅ |

### User Preferences

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/preferences` | Tercihleri getir | ✅ |
| PUT | `/users/preferences` | Tercihleri güncelle | ✅ |

### Addresses

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/addresses` | Adresleri listele | ✅ |
| POST | `/users/addresses` | Adres ekle | ✅ |
| PUT | `/users/addresses/:addressId` | Adres güncelle | ✅ |
| DELETE | `/users/addresses/:addressId` | Adres sil | ✅ |

### Cashback

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/cashback` | Cashback hesabı | ✅ |

### Favorites

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/favorites` | Favori ürünler | ✅ |
| POST | `/users/favorites` | Favorilere ekle | ✅ |
| DELETE | `/users/favorites/:productId` | Favorilerden çıkar | ✅ |

### Price Alerts

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/users/price-alerts` | Fiyat alarmları | ✅ |
| POST | `/users/price-alerts` | Alarm oluştur | ✅ |
| DELETE | `/users/price-alerts/:alertId` | Alarm sil | ✅ |

## 📋 Example Requests

### Register

```bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123"
  }'
```

### Get Profile

```bash
curl http://localhost:3001/users/profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🗄️ Database Schema

### User
- Temel kullanıcı bilgileri
- Email ve şifre
- Role (USER, ADMIN, MODERATOR)
- OAuth hesapları
- Session yönetimi
- Account lockout

### UserPreference
- Dil ve para birimi
- Bildirim tercihleri
- Favori kategoriler ve mağazalar

### Address
- Kullanıcı adresleri
- Varsayılan adres

### CashbackAccount
- Cashback bakiyesi
- İşlem geçmişi
- Para çekme talepleri

### Favorite & PriceAlert
- Favori ürünler
- Fiyat takip alarmları

## 🔐 Security

- **Password Hashing**: bcrypt (10 rounds)
- **JWT Tokens**: Access (7d) + Refresh (30d)
- **Account Lockout**: 5 başarısız giriş → 15 dk kilitleme
- **Email Verification**: 24 saat geçerli token
- **Password Reset**: 1 saat geçerli token
- **Session Management**: Database'de token saklama
- **Input Validation**: express-validator
- **Rate Limiting**: API Gateway'de

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run specific test file
npm test -- auth.test.ts
```

## 📝 Logging

Winston logger kullanılıyor:

```typescript
import { logger } from './utils/logger';

logger.info('User logged in', { userId, email });
logger.warn('Invalid login attempt', { email });
logger.error('Database error', { error });
```

**Log Levels**: error, warn, info, debug

## 🐳 Docker

```bash
# Build image
docker build -t price-platform-user-service .

# Run container
docker run -p 3001:3001 \
  -e DATABASE_URL=postgresql://... \
  price-platform-user-service

# Or use docker-compose
docker-compose up user-service
```

## 🔄 Database Migrations

```bash
# Create new migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# View migration status
npx prisma migrate status
```

## 🛠️ Troubleshooting

### Port already in use
```bash
lsof -i :3001
kill -9 <PID>
```

### Database connection error
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check DATABASE_URL in .env
echo $DATABASE_URL
```

### Prisma Client not generated
```bash
npx prisma generate
```

## 📚 Dependencies

### Main
- express
- @prisma/client
- bcrypt
- jsonwebtoken
- express-validator
- nodemailer
- redis
- winston
- nanoid

### Dev
- typescript
- @types/*
- ts-node-dev
- prisma
- jest

## 🚧 TODO

- [ ] OAuth2 Google integration
- [ ] OAuth2 Apple integration
- [ ] Two-factor authentication (2FA)
- [ ] Phone number verification (SMS)
- [ ] Advanced password policies
- [ ] User activity logging
- [ ] GDPR data export
- [ ] Automated tests
- [ ] API documentation (Swagger)

## 📄 License

Proprietary - Price Comparison Platform
