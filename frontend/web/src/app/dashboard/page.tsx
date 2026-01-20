'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { Wallet, TrendingUp, Heart, Bell, ShoppingBag, Gift } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { useAuthStore } from '@/store/auth';

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: cashbackData } = useQuery({
    queryKey: ['cashback-summary'],
    queryFn: () => api.cashback.getSummary(user?.id || ''),
    enabled: !!user?.id,
  });

  const { data: favoritesData } = useQuery({
    queryKey: ['favorites'],
    queryFn: () => api.user.getFavorites({ page: 1, limit: 5 }),
    enabled: !!user?.id,
  });

  const { data: alertsData } = useQuery({
    queryKey: ['price-alerts'],
    queryFn: () => api.user.getAlerts({ page: 1, limit: 5 }),
    enabled: !!user?.id,
  });

  const summary = cashbackData?.data?.summary || {};
  const favorites = favoritesData?.data?.favorites || [];
  const alerts = alertsData?.data?.alerts || [];

  const stats = [
    {
      icon: <Wallet className="w-6 h-6" />,
      label: 'Kullanılabilir Bakiye',
      value: formatPrice(summary.availableBalance || 0),
      color: 'from-green-500 to-green-600',
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      label: 'Toplam Kazanç',
      value: formatPrice(summary.totalEarned || 0),
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: <Gift className="w-6 h-6" />,
      label: 'Bekleyen Cashback',
      value: formatPrice(summary.totalPending || 0),
      color: 'from-purple-500 to-purple-600',
    },
    {
      icon: <ShoppingBag className="w-6 h-6" />,
      label: 'Toplam Alışveriş',
      value: summary.totalTransactions || 0,
      color: 'from-pink-500 to-pink-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Hoş Geldin, {user?.firstName}!
          </h1>
          <p className="text-gray-600 mt-2">
            Hesabın ve kazançların hakkında özet bilgilere buradan ulaşabilirsin.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-sm">
              <div className={`inline-flex p-3 rounded-lg bg-gradient-to-br ${stat.color} text-white mb-4`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Cashback */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Son Cashback İşlemleri</h2>
                <Link href="/dashboard/cashback" className="text-sm text-primary-600 hover:text-primary-700">
                  Tümünü Gör
                </Link>
              </div>
            </div>
            <div className="p-6">
              {summary.recentTransactions?.length > 0 ? (
                <div className="space-y-4">
                  {summary.recentTransactions.map((transaction: any) => (
                    <div key={transaction.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div>
                        <div className="font-medium text-gray-900">{transaction.description}</div>
                        <div className="text-sm text-gray-500">{new Date(transaction.createdAt).toLocaleDateString('tr-TR')}</div>
                      </div>
                      <div className={`font-semibold ${transaction.status === 'APPROVED' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {formatPrice(transaction.amount)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Henüz cashback işleminiz yok
                </div>
              )}
            </div>
          </div>

          {/* Favorites */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Heart className="w-5 h-5 mr-2" />
                  Favorilerim
                </h2>
                <Link href="/dashboard/favorites" className="text-sm text-primary-600 hover:text-primary-700">
                  Tümünü Gör
                </Link>
              </div>
            </div>
            <div className="p-6">
              {favorites.length > 0 ? (
                <div className="space-y-4">
                  {favorites.map((favorite: any) => (
                    <Link
                      key={favorite.id}
                      href={`/products/${favorite.product.slug}`}
                      className="flex items-center space-x-4 py-3 border-b last:border-b-0 hover:bg-gray-50 transition-colors"
                    >
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 truncate">{favorite.product.title}</div>
                        <div className="text-sm text-gray-500">{favorite.product.brand.name}</div>
                      </div>
                      <div className="font-semibold text-primary-600">
                        {formatPrice(favorite.product.currentPrice)}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Henüz favori ürününüz yok
                </div>
              )}
            </div>
          </div>

          {/* Price Alerts */}
          <div className="bg-white rounded-lg shadow-sm lg:col-span-2">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Bell className="w-5 h-5 mr-2" />
                  Fiyat Alarmları
                </h2>
                <Link href="/dashboard/alerts" className="text-sm text-primary-600 hover:text-primary-700">
                  Tümünü Gör
                </Link>
              </div>
            </div>
            <div className="p-6">
              {alerts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {alerts.map((alert: any) => (
                    <div key={alert.id} className="border border-gray-200 rounded-lg p-4 hover:border-primary-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="font-medium text-gray-900 line-clamp-2">{alert.product.title}</div>
                        <span className={`px-2 py-1 text-xs rounded-full ${alert.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {alert.active ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Hedef fiyat: {formatPrice(alert.targetPrice)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Mevcut fiyat: {formatPrice(alert.product.currentPrice)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Henüz fiyat alarmınız yok
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Hızlı İşlemler
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              href="/products"
              className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
            >
              <ShoppingBag className="w-8 h-8 mx-auto mb-3 text-primary-600" />
              <div className="font-semibold text-gray-900 mb-1">Ürünleri İncele</div>
              <div className="text-sm text-gray-600">En iyi fiyatları bul</div>
            </Link>
            <Link
              href="/dashboard/cashback"
              className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
            >
              <Gift className="w-8 h-8 mx-auto mb-3 text-purple-600" />
              <div className="font-semibold text-gray-900 mb-1">Cashback İşlemleri</div>
              <div className="text-sm text-gray-600">Kazançlarını görüntüle</div>
            </Link>
            <Link
              href="/dashboard/profile"
              className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow"
            >
              <Wallet className="w-8 h-8 mx-auto mb-3 text-green-600" />
              <div className="font-semibold text-gray-900 mb-1">Para Çek</div>
              <div className="text-sm text-gray-600">Bakiyeni çek</div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
