'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Bell,
  BellOff,
  BellRing,
  Trash2,
  Edit2,
  Plus,
  TrendingDown,
  TrendingUp,
  Check,
  X,
  Search,
  Filter,
  ShoppingBag,
  Clock,
  AlertTriangle
} from 'lucide-react'

// Mock price alerts data
const mockAlerts = [
  {
    id: '1',
    productId: 'prod-1',
    productName: 'Apple iPhone 15 Pro Max 256GB',
    productSlug: 'apple-iphone-15-pro-max-256gb',
    productImage: '/products/iphone15.jpg',
    currentPrice: 64999,
    targetPrice: 60000,
    initialPrice: 69999,
    priceChange: -7.1,
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
    notifiedAt: null,
    store: 'Trendyol',
    category: 'Elektronik',
  },
  {
    id: '2',
    productId: 'prod-2',
    productName: 'Sony WH-1000XM5 Kablosuz Kulaklık',
    productSlug: 'sony-wh-1000xm5-kablosuz-kulaklik',
    productImage: '/products/sony-headphones.jpg',
    currentPrice: 8999,
    targetPrice: 8500,
    initialPrice: 11999,
    priceChange: -25.0,
    status: 'triggered',
    createdAt: '2024-01-08T09:15:00Z',
    notifiedAt: '2024-01-18T14:30:00Z',
    store: 'Amazon',
    category: 'Elektronik',
  },
  {
    id: '3',
    productId: 'prod-3',
    productName: 'Samsung Galaxy S24 Ultra 512GB',
    productSlug: 'samsung-galaxy-s24-ultra-512gb',
    productImage: '/products/s24.jpg',
    currentPrice: 54999,
    targetPrice: 50000,
    initialPrice: 54999,
    priceChange: 0,
    status: 'active',
    createdAt: '2024-01-10T14:20:00Z',
    notifiedAt: null,
    store: 'Hepsiburada',
    category: 'Elektronik',
  },
  {
    id: '4',
    productId: 'prod-4',
    productName: 'Dyson V15 Detect Absolute',
    productSlug: 'dyson-v15-detect-absolute',
    productImage: '/products/dyson.jpg',
    currentPrice: 24999,
    targetPrice: 22000,
    initialPrice: 27999,
    priceChange: -10.7,
    status: 'active',
    createdAt: '2024-01-02T11:00:00Z',
    notifiedAt: null,
    store: 'Teknosa',
    category: 'Ev Aletleri',
  },
  {
    id: '5',
    productId: 'prod-5',
    productName: 'Apple MacBook Air M3 256GB',
    productSlug: 'apple-macbook-air-m3-256gb',
    productImage: '/products/macbook.jpg',
    currentPrice: 44999,
    targetPrice: 40000,
    initialPrice: 47999,
    priceChange: -6.3,
    status: 'paused',
    createdAt: '2024-01-05T16:45:00Z',
    notifiedAt: null,
    store: 'MediaMarkt',
    category: 'Bilgisayar',
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

const formatRelativeTime = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

  if (diffInDays === 0) return 'Bugün'
  if (diffInDays === 1) return 'Dün'
  if (diffInDays < 7) return `${diffInDays} gün önce`
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} hafta önce`
  return formatDate(dateString)
}

const getStatusInfo = (status: string) => {
  switch (status) {
    case 'active':
      return { label: 'Aktif', color: 'bg-green-100 text-green-700', icon: Bell }
    case 'triggered':
      return { label: 'Tetiklendi', color: 'bg-blue-100 text-blue-700', icon: BellRing }
    case 'paused':
      return { label: 'Duraklatıldı', color: 'bg-gray-100 text-gray-700', icon: BellOff }
    default:
      return { label: 'Bilinmiyor', color: 'bg-gray-100 text-gray-700', icon: Bell }
  }
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState(mockAlerts)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [editingAlert, setEditingAlert] = useState<string | null>(null)
  const [editPrice, setEditPrice] = useState('')

  const filteredAlerts = alerts
    .filter(alert => {
      const matchesSearch = alert.productName.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = filterStatus === 'all' || alert.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Triggered first, then active, then paused
      const statusOrder = { triggered: 0, active: 1, paused: 2 }
      return (statusOrder[a.status as keyof typeof statusOrder] || 3) -
             (statusOrder[b.status as keyof typeof statusOrder] || 3)
    })

  const handleDeleteAlert = (id: string) => {
    setAlerts(alerts.filter(a => a.id !== id))
  }

  const handleTogglePause = (id: string) => {
    setAlerts(alerts.map(a => {
      if (a.id === id) {
        return {
          ...a,
          status: a.status === 'paused' ? 'active' : 'paused'
        }
      }
      return a
    }))
  }

  const handleEditPrice = (id: string, currentTarget: number) => {
    setEditingAlert(id)
    setEditPrice(currentTarget.toString())
  }

  const handleSavePrice = (id: string) => {
    const newPrice = parseInt(editPrice)
    if (!isNaN(newPrice) && newPrice > 0) {
      setAlerts(alerts.map(a => {
        if (a.id === id) {
          return { ...a, targetPrice: newPrice }
        }
        return a
      }))
    }
    setEditingAlert(null)
    setEditPrice('')
  }

  const handleCancelEdit = () => {
    setEditingAlert(null)
    setEditPrice('')
  }

  const activeCount = alerts.filter(a => a.status === 'active').length
  const triggeredCount = alerts.filter(a => a.status === 'triggered').length
  const pausedCount = alerts.filter(a => a.status === 'paused').length

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Fiyat Alarmları</h1>
            <p className="text-gray-600">
              Hedef fiyata ulaşan ürünlerden haberdar olun
            </p>
          </div>
          <Link
            href="/products"
            className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Yeni Alarm Ekle
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Toplam Alarm</p>
                <p className="text-xl font-bold text-gray-900">{alerts.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Bell className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aktif</p>
                <p className="text-xl font-bold text-gray-900">{activeCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BellRing className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Tetiklendi</p>
                <p className="text-xl font-bold text-gray-900">{triggeredCount}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <BellOff className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Duraklatıldı</p>
                <p className="text-xl font-bold text-gray-900">{pausedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Triggered Alert Banner */}
        {triggeredCount > 0 && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <BellRing className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900">
                  {triggeredCount} ürün hedef fiyatına ulaştı!
                </h3>
                <p className="text-sm text-blue-700">
                  Tetiklenen alarmları kontrol edin ve fırsatı kaçırmayın.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Filters and Search */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Alarmlarda ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="active">Aktif</option>
                <option value="triggered">Tetiklendi</option>
                <option value="paused">Duraklatıldı</option>
              </select>
            </div>
          </div>
        </div>

        {/* Alerts List */}
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-100 text-center">
            <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery || filterStatus !== 'all'
                ? 'Sonuç bulunamadı'
                : 'Henüz fiyat alarmınız yok'}
            </h3>
            <p className="text-gray-600 mb-6">
              {searchQuery || filterStatus !== 'all'
                ? 'Farklı filtreler deneyebilirsiniz'
                : 'Ürün sayfalarından hedef fiyat belirleyerek alarm kurabilirsiniz'}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              İlk Alarmınızı Kurun
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAlerts.map((alert) => {
              const statusInfo = getStatusInfo(alert.status)
              const StatusIcon = statusInfo.icon
              const progressToTarget = ((alert.initialPrice - alert.currentPrice) / (alert.initialPrice - alert.targetPrice)) * 100
              const isTriggered = alert.currentPrice <= alert.targetPrice

              return (
                <div
                  key={alert.id}
                  className={`bg-white rounded-xl shadow-sm border overflow-hidden transition-shadow hover:shadow-md ${
                    alert.status === 'triggered' ? 'border-blue-200' : 'border-gray-100'
                  }`}
                >
                  <div className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ShoppingBag className="w-8 h-8 text-gray-400" />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                <StatusIcon className="w-3 h-3" />
                                {statusInfo.label}
                              </span>
                              <span className="text-xs text-gray-500">
                                {alert.category}
                              </span>
                            </div>
                            <Link href={`/products/${alert.productSlug}`}>
                              <h3 className="font-semibold text-gray-900 hover:text-primary-600">
                                {alert.productName}
                              </h3>
                            </Link>
                            <p className="text-sm text-gray-500">
                              {alert.store} • Oluşturuldu: {formatRelativeTime(alert.createdAt)}
                            </p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleTogglePause(alert.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                alert.status === 'paused'
                                  ? 'bg-green-100 text-green-600 hover:bg-green-200'
                                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                              }`}
                              title={alert.status === 'paused' ? 'Aktifleştir' : 'Duraklat'}
                            >
                              {alert.status === 'paused' ? (
                                <Bell className="w-4 h-4" />
                              ) : (
                                <BellOff className="w-4 h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => handleDeleteAlert(alert.id)}
                              className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                              title="Alarmı sil"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Price Info */}
                        <div className="flex items-center gap-6 mb-3">
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Mevcut Fiyat</p>
                            <p className="text-lg font-bold text-gray-900">
                              {formatPrice(alert.currentPrice)}
                            </p>
                          </div>
                          <div className="text-gray-300">→</div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Hedef Fiyat</p>
                            {editingAlert === alert.id ? (
                              <div className="flex items-center gap-2">
                                <input
                                  type="number"
                                  value={editPrice}
                                  onChange={(e) => setEditPrice(e.target.value)}
                                  className="w-24 px-2 py-1 border border-gray-200 rounded text-sm"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSavePrice(alert.id)}
                                  className="p-1 bg-green-100 text-green-600 rounded hover:bg-green-200"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="p-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <p className={`text-lg font-bold ${isTriggered ? 'text-green-600' : 'text-primary-600'}`}>
                                  {formatPrice(alert.targetPrice)}
                                </p>
                                <button
                                  onClick={() => handleEditPrice(alert.id, alert.targetPrice)}
                                  className="p-1 text-gray-400 hover:text-gray-600"
                                >
                                  <Edit2 className="w-4 h-4" />
                                </button>
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-gray-500 mb-0.5">Fark</p>
                            <p className={`text-lg font-bold ${
                              alert.currentPrice <= alert.targetPrice ? 'text-green-600' : 'text-gray-600'
                            }`}>
                              {formatPrice(alert.currentPrice - alert.targetPrice)}
                            </p>
                          </div>
                          {alert.priceChange !== 0 && (
                            <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-sm ${
                              alert.priceChange < 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                              {alert.priceChange < 0 ? (
                                <TrendingDown className="w-4 h-4" />
                              ) : (
                                <TrendingUp className="w-4 h-4" />
                              )}
                              {Math.abs(alert.priceChange)}%
                            </div>
                          )}
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-2">
                          <div className="flex justify-between text-xs text-gray-500 mb-1">
                            <span>Başlangıç: {formatPrice(alert.initialPrice)}</span>
                            <span>Hedefe ilerleme: {Math.min(100, Math.max(0, progressToTarget)).toFixed(0)}%</span>
                          </div>
                          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all ${
                                isTriggered ? 'bg-green-500' : 'bg-primary-500'
                              }`}
                              style={{ width: `${Math.min(100, Math.max(0, progressToTarget))}%` }}
                            />
                          </div>
                        </div>

                        {/* Triggered notification */}
                        {alert.status === 'triggered' && alert.notifiedAt && (
                          <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                            <Clock className="w-4 h-4" />
                            <span>
                              Bildirim gönderildi: {formatDate(alert.notifiedAt)}
                            </span>
                            <Link
                              href={`/products/${alert.productSlug}`}
                              className="ml-auto font-medium hover:underline"
                            >
                              Ürüne Git →
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-yellow-900 mb-1">Fiyat Alarmları Nasıl Çalışır?</h4>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Hedef fiyat belirlediğiniz ürünler günde 4 kez kontrol edilir</li>
                <li>• Fiyat hedefe ulaştığında e-posta ve uygulama bildirimi alırsınız</li>
                <li>• Alarmları istediğiniz zaman duraklatabilir veya silebilirsiniz</li>
                <li>• Maksimum 20 aktif alarm tanımlayabilirsiniz</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
