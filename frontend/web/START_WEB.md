# Web Frontend Başlatma Kılavuzu

## Hızlı Başlangıç

### 1. Bağımlılıkları Yükle

```bash
cd frontend/web
npm install --legacy-peer-deps
```

**Not:** İlk kurulumda 2-3 dakika sürebilir. `--legacy-peer-deps` bayrağı React 19 uyumluluk sorunlarını çözer.

### 2. Environment Dosyasını Ayarla

```bash
cp .env.local.example .env.local
```

`.env.local` dosyasını düzenleyin:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 3. Development Server'ı Başlat

```bash
npm run dev
```

Web uygulaması http://localhost:3000 adresinde çalışacaktır.

## Alternatif Port

Farklı bir portta çalıştırmak için:

```bash
PORT=3001 npm run dev
```

## Özellikler

### ✅ Geliştirilen Sayfalar

- **/** - Ana sayfa (Hero, Search, Stats, Featured Products, Categories, How It Works)
- **/products** - Ürün listesi (filtreleme, sıralama, pagination)
- **/products/[slug]** - Ürün detay (fiyat geçmişi, mağaza karşılaştırma)
- **/login** - Giriş yap
- **/register** - Kayıt ol
- **/dashboard** - Kullanıcı paneli
- **/dashboard/cashback** - Cashback işlemleri
- **/dashboard/favorites** - Favori ürünler
- **/dashboard/alerts** - Fiyat alarmları

### 🎨 Bileşenler

**Layout:**
- Navbar - Responsive navigasyon
- Footer - Site haritası

**Home:**
- Hero - Büyük başlık ve CTA
- SearchBar - Akıllı arama
- Stats - Animasyonlu sayaçlar
- FeaturedProducts - Öne çıkan ürünler
- PopularCategories - Kategori kartları
- HowItWorks - Nasıl çalışır rehberi

**Product:**
- ProductCard - Ürün kartı
- ProductGrid - Ürün ızgarası
- PriceHistory - Fiyat grafiği

### 🔧 Teknoloji Stack

- **Framework:** Next.js 15 (App Router)
- **UI:** React 19
- **Styling:** TailwindCSS 3
- **State:** Zustand 4
- **Data Fetching:** TanStack Query 5
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts 2
- **Icons:** Lucide React
- **HTTP:** Axios

## Production Build

```bash
npm run build
npm start
```

## Type Checking

```bash
npm run type-check
```

## Linting

```bash
npm run lint
```

## Sorun Giderme

### Port Zaten Kullanılıyor

```bash
lsof -ti:3000 | xargs kill -9
```

### Node Modules Sorunu

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Cache Temizleme

```bash
rm -rf .next
npm run dev
```

## API Bağlantısı

Frontend, varsayılan olarak `http://localhost:3000` adresindeki API Gateway'e bağlanır.

Backend servislerini başlatmak için:

```bash
# Ana dizinden
docker-compose up -d  # Veritabanları
npm run dev:gateway   # API Gateway
npm run dev:user      # User Service
npm run dev:product   # Product Service
npm run dev:cashback  # Cashback Service
```

## Geliştirme Notları

### Auto-refresh

Next.js Fast Refresh özelliği sayesinde kod değişiklikleri anında yansır.

### API Mock Data

Backend servisleri çalışmıyorsa, sayfalar yüklenir ancak veri gösterilmez. Mock data için:

1. API servislerini başlatın
2. Veya `src/lib/api.ts` içinde mock interceptor ekleyin

### Responsive Test

- Desktop: Normal tarayıcı
- Tablet: DevTools > 768px
- Mobile: DevTools > 375px

## Sonraki Adımlar

1. ✅ Ana sayfa - Tamamlandı
2. ✅ Ürün listesi ve detay - Tamamlandı
3. ✅ Auth sayfaları - Tamamlandı
4. ✅ Dashboard - Tamamlandı
5. ⏳ Arama sayfası - Bekliyor
6. ⏳ Kategori sayfaları - Bekliyor
7. ⏳ Profil sayfası - Bekliyor
8. ⏳ Responsive optimizasyonlar - Bekliyor

## Destek

Sorun yaşarsanız:
1. Console loglarını kontrol edin (F12)
2. Network sekmesinde API isteklerini inceleyin
3. Backend servislerinin çalıştığından emin olun
4. `.env.local` dosyasının doğru olduğunu kontrol edin
