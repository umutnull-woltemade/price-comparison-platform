'use client';

import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Share2, Bell, TrendingDown, TrendingUp, ExternalLink, Star } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPrice, formatDate, calculateDiscount } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: PageProps) {
  const { slug } = use(params);

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => api.product.getBySlug(slug),
  });

  const { data: priceHistoryData } = useQuery({
    queryKey: ['price-history', productData?.data?.id],
    queryFn: () => api.product.getPriceHistory(productData?.data?.id),
    enabled: !!productData?.data?.id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="bg-gray-200 h-8 w-64 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 aspect-square rounded-lg" />
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 w-full" />
                <div className="bg-gray-200 h-6 w-3/4" />
                <div className="bg-gray-200 h-12 w-1/2" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const product = productData?.data;
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Ürün Bulunamadı</h1>
          <Link href="/products" className="text-primary-600 hover:text-primary-700">
            Ürünlere Dön
          </Link>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.currentPrice)
    : 0;

  const priceHistory = priceHistoryData?.data?.history || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Ana Sayfa</Link>
            <span>/</span>
            <Link href="/products" className="hover:text-primary-600">Ürünler</Link>
            <span>/</span>
            <Link href={`/categories/${product.category.slug}`} className="hover:text-primary-600">
              {product.category.name}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-medium truncate">{product.title}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="bg-white rounded-lg p-8">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain p-8"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              {discount > 0 && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-2 rounded-lg font-semibold flex items-center space-x-2">
                  <TrendingDown className="w-5 h-5" />
                  <span>%{discount} İndirim</span>
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="bg-white rounded-lg p-8">
            <div className="mb-4">
              <Link href={`/brands/${product.brand.slug}`} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                {product.brand.name}
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>

            {/* Rating */}
            <div className="flex items-center space-x-2 mb-6">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">(4.0) - 127 değerlendirme</span>
            </div>

            {/* Price */}
            <div className="mb-6 pb-6 border-b">
              {product.originalPrice && product.originalPrice > product.currentPrice && (
                <div className="text-gray-400 line-through text-lg mb-2">
                  {formatPrice(product.originalPrice)}
                </div>
              )}
              <div className="text-4xl font-bold text-primary-600 mb-2">
                {formatPrice(product.currentPrice)}
              </div>
              {product.lowestPrice && (
                <div className="text-sm text-gray-600">
                  Son 30 günün en düşük fiyatı: {formatPrice(product.lowestPrice)}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-6">
              <button className="w-full bg-primary-600 text-white px-6 py-4 rounded-lg font-semibold hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2">
                <span>Mağazaya Git ve Cashback Kazan</span>
                <ExternalLink className="w-5 h-5" />
              </button>
              <div className="grid grid-cols-3 gap-3">
                <button className="border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Heart className="w-5 h-5" />
                  <span className="hidden sm:inline">Favori</span>
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Bell className="w-5 h-5" />
                  <span className="hidden sm:inline">Alarm</span>
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2">
                  <Share2 className="w-5 h-5" />
                  <span className="hidden sm:inline">Paylaş</span>
                </button>
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Ürün Açıklaması</h2>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-3">Özellikler</h2>
                <ul className="space-y-2">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className="text-primary-600 mr-2">•</span>
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Price History Chart */}
        {priceHistory.length > 0 && (
          <div className="bg-white rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Fiyat Geçmişi</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={priceHistory}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => formatDate(date, 'short')}
                  stroke="#9CA3AF"
                />
                <YAxis
                  tickFormatter={(value) => `${value}₺`}
                  stroke="#9CA3AF"
                />
                <Tooltip
                  formatter={(value: number) => formatPrice(value)}
                  labelFormatter={(date) => formatDate(date)}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={{ fill: '#3B82F6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Store Prices */}
        <div className="bg-white rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Mağaza Fiyatları</h2>
          <div className="space-y-4">
            {product.prices?.map((price: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-primary-300 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{price.store.name}</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{price.store.name}</div>
                    <div className="text-sm text-gray-600">Ücretsiz Kargo</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary-600">{formatPrice(price.price)}</div>
                    <div className="text-sm text-green-600">%2.5 Cashback</div>
                  </div>
                  <a
                    href={price.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                  >
                    <span>Git</span>
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
