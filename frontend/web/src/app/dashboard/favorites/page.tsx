'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Heart,
  Trash2,
  Bell,
  ExternalLink,
  TrendingDown,
  TrendingUp,
  Search,
  Filter,
  Grid,
  List,
  ShoppingBag
} from 'lucide-react'

// Mock favorite products data
const mockFavorites = [
  {
    id: '1',
    name: 'Apple iPhone 15 Pro Max 256GB',
    slug: 'apple-iphone-15-pro-max-256gb',
    image: '/products/iphone15.jpg',
    currentPrice: 64999,
    lowestPrice: 62999,
    highestPrice: 69999,
    priceChange: -3.5,
    store: 'Trendyol',
    category: 'Elektronik',
    addedAt: '2024-01-15T10:30:00Z',
    hasAlert: true,
    alertPrice: 60000,
  },
  {
    id: '2',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    slug: 'samsung-galaxy-s24-ultra-512gb',
    image: '/products/s24.jpg',
    currentPrice: 54999,
    lowestPrice: 52999,
    highestPrice: 59999,
    priceChange: 2.1,
    store: 'Hepsiburada',
    category: 'Elektronik',
    addedAt: '2024-01-10T14:20:00Z',
    hasAlert: false,
    alertPrice: null,
  },
  {
    id: '3',
    name: 'Sony WH-1000XM5 Kablosuz Kulaklık',
    slug: 'sony-wh-1000xm5-kablosuz-kulaklik',
    image: '/products/sony-headphones.jpg',
    currentPrice: 9499,
    lowestPrice: 8999,
    highestPrice: 11999,
    priceChange: -5.2,
    store: 'Amazon',
    category: 'Elektronik',
    addedAt: '2024-01-08T09:15:00Z',
    hasAlert: true,
    alertPrice: 8500,
  },
  {
    id: '4',
    name: 'Apple MacBook Air M3 256GB',
    slug: 'apple-macbook-air-m3-256gb',
    image: '/products/macbook.jpg',
    currentPrice: 44999,
    lowestPrice: 42999,
    highestPrice: 47999,
    priceChange: 0,
    store: 'MediaMarkt',
    category: 'Bilgisayar',
    addedAt: '2024-01-05T16:45:00Z',
    hasAlert: false,
    alertPrice: null,
  },
  {
    id: '5',
    name: 'Dyson V15 Detect Absolute',
    slug: 'dyson-v15-detect-absolute',
    image: '/products/dyson.jpg',
    currentPrice: 24999,
    lowestPrice: 22999,
    highestPrice: 27999,
    priceChange: -8.3,
    store: 'Teknosa',
    category: 'Ev Aletleri',
    addedAt: '2024-01-02T11:00:00Z',
    hasAlert: true,
    alertPrice: 22000,
  },
]

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(mockFavorites)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('addedAt')
  const [filterCategory, setFilterCategory] = useState('all')

  const categories = ['all', ...new Set(favorites.map(f => f.category))]

  const filteredFavorites = favorites
    .filter(fav => {
      const matchesSearch = fav.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = filterCategory === 'all' || fav.category === filterCategory
      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'priceAsc':
          return a.currentPrice - b.currentPrice
        case 'priceDesc':
          return b.currentPrice - a.currentPrice
        case 'priceChange':
          return a.priceChange - b.priceChange
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      }
    })

  const handleRemoveFavorite = (id: string) => {
    setFavorites(favorites.filter(f => f.id !== id))
  }

  const handleSetAlert = (id: string) => {
    // In real app, this would open a modal to set alert price
    alert('Fiyat alarmı ayarlama modalı açılacak')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Favorilerim</h1>
          <p className="text-gray-600">
            {favorites.length} ürün favorilerinizde
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <Heart className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Toplam Favori</p>
                <p className="text-xl font-bold text-gray-900">{favorites.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingDown className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Fiyatı Düşenler</p>
                <p className="text-xl font-bold text-gray-900">
                  {favorites.filter(f => f.priceChange < 0).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Bell className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aktif Alarmlar</p>
                <p className="text-xl font-bold text-gray-900">
                  {favorites.filter(f => f.hasAlert).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Toplam Değer</p>
                <p className="text-xl font-bold text-gray-900">
                  {formatPrice(favorites.reduce((sum, f) => sum + f.currentPrice, 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Favorilerde ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Tüm Kategoriler</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="addedAt">En Son Eklenen</option>
              <option value="priceAsc">Fiyat (Düşük → Yüksek)</option>
              <option value="priceDesc">Fiyat (Yüksek → Düşük)</option>
              <option value="priceChange">Fiyat Değişimi</option>
              <option value="name">İsim (A-Z)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-primary-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Favorites Grid/List */}
        {filteredFavorites.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || filterCategory !== 'all'
                ? 'Sonuç bulunamadı'
                : 'Henüz favori ürününüz yok'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterCategory !== 'all'
                ? 'Farklı filtreler deneyebilirsiniz'
                : 'Ürünleri favorilere ekleyerek fiyat takibi yapabilirsiniz'}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Ürünleri Keşfet
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFavorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Product Image */}
                <div className="relative aspect-square bg-gray-100">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <ShoppingBag className="w-16 h-16" />
                  </div>
                  {/* Price Change Badge */}
                  {favorite.priceChange !== 0 && (
                    <div
                      className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1
                        ${favorite.priceChange < 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                        }`}
                    >
                      {favorite.priceChange < 0 ? (
                        <TrendingDown className="w-3 h-3" />
                      ) : (
                        <TrendingUp className="w-3 h-3" />
                      )}
                      {Math.abs(favorite.priceChange)}%
                    </div>
                  )}
                  {/* Alert Badge */}
                  {favorite.hasAlert && (
                    <div className="absolute top-3 right-3 p-1.5 bg-yellow-100 rounded-full">
                      <Bell className="w-4 h-4 text-yellow-600" />
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <p className="text-xs text-gray-500 mb-1">{favorite.category}</p>
                  <Link href={`/products/${favorite.slug}`}>
                    <h3 className="font-semibold text-gray-900 hover:text-primary-600 line-clamp-2 mb-2">
                      {favorite.name}
                    </h3>
                  </Link>

                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-xl font-bold text-primary-600">
                      {formatPrice(favorite.currentPrice)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {favorite.store}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>En düşük: {formatPrice(favorite.lowestPrice)}</span>
                    <span>En yüksek: {formatPrice(favorite.highestPrice)}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/products/${favorite.slug}`}
                      className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Detay
                    </Link>
                    <button
                      onClick={() => handleSetAlert(favorite.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        favorite.hasAlert
                          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      title={favorite.hasAlert ? 'Alarm aktif' : 'Alarm kur'}
                    >
                      <Bell className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleRemoveFavorite(favorite.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Favorilerden kaldır"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFavorites.map((favorite) => (
              <div
                key={favorite.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex gap-4">
                  {/* Image */}
                  <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">{favorite.category}</p>
                        <Link href={`/products/${favorite.slug}`}>
                          <h3 className="font-semibold text-gray-900 hover:text-primary-600 mb-1">
                            {favorite.name}
                          </h3>
                        </Link>
                        <p className="text-sm text-gray-500">
                          {favorite.store} • Eklendi: {formatDate(favorite.addedAt)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xl font-bold text-primary-600">
                          {formatPrice(favorite.currentPrice)}
                        </p>
                        {favorite.priceChange !== 0 && (
                          <p
                            className={`text-sm flex items-center justify-end gap-1 ${
                              favorite.priceChange < 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                          >
                            {favorite.priceChange < 0 ? (
                              <TrendingDown className="w-4 h-4" />
                            ) : (
                              <TrendingUp className="w-4 h-4" />
                            )}
                            {Math.abs(favorite.priceChange)}%
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>En düşük: {formatPrice(favorite.lowestPrice)}</span>
                        <span>En yüksek: {formatPrice(favorite.highestPrice)}</span>
                        {favorite.hasAlert && (
                          <span className="flex items-center gap-1 text-yellow-600">
                            <Bell className="w-4 h-4" />
                            Alarm: {formatPrice(favorite.alertPrice!)}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link
                          href={`/products/${favorite.slug}`}
                          className="flex items-center gap-1 px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors text-sm"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Detay
                        </Link>
                        <button
                          onClick={() => handleSetAlert(favorite.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            favorite.hasAlert
                              ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Bell className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleRemoveFavorite(favorite.id)}
                          className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
