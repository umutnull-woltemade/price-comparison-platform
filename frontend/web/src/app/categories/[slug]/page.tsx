'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Filter, ChevronRight, Heart, TrendingDown } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPrice, calculateDiscount } from '@/lib/utils';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface Product {
  id: string;
  title: string;
  slug: string;
  brand: { name: string };
  category: { name: string };
  image: string;
  currentPrice: number;
  originalPrice?: number;
  lowestPrice?: number;
}

export default function CategoryPage({ params }: PageProps) {
  const { slug } = use(params);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    brand: '',
    minPrice: '',
    maxPrice: '',
    sort: 'popular',
  });

  const { data: categoryData } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => api.category.getBySlug(slug),
  });

  const { data: productsData, isLoading } = useQuery({
    queryKey: ['category-products', slug, page, filters],
    queryFn: () => api.product.getAll({ categorySlug: slug, page, limit: 24, ...filters }),
  });

  const category = categoryData?.data;
  const products = productsData?.data?.products || [];
  const pagination = productsData?.data?.pagination;

  if (!category) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Kategori Bulunamadı</h1>
          <Link href="/categories" className="text-primary-600 hover:text-primary-700">
            Kategorilere Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-gray-600">
            <Link href="/" className="hover:text-primary-600">Ana Sayfa</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/categories" className="hover:text-primary-600">Kategoriler</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-medium">{category.name}</span>
          </nav>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-gradient-to-br from-primary-600 to-secondary-600 text-white">
        <div className="container mx-auto px-4 py-12">
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-xl text-primary-100 max-w-3xl">{category.description}</p>
          )}
          <p className="text-primary-100 mt-4">
            {pagination?.total?.toLocaleString('tr-TR')} ürün bulundu
          </p>
        </div>
      </div>

      {/* Subcategories */}
      {category.subcategories && category.subcategories.length > 0 && (
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Alt Kategoriler</h2>
            <div className="flex flex-wrap gap-3">
              {category.subcategories.map((sub: any) => (
                <Link
                  key={sub.id}
                  href={`/categories/${slug}/${sub.slug}`}
                  className="px-4 py-2 bg-gray-100 hover:bg-primary-50 hover:text-primary-700 rounded-lg transition-colors"
                >
                  {sub.name} ({sub.productCount})
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 shadow-sm sticky top-20">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Filter className="w-5 h-5 mr-2" />
                  Filtreler
                </h2>
                <button
                  onClick={() => setFilters({ brand: '', minPrice: '', maxPrice: '', sort: 'popular' })}
                  className="text-sm text-primary-600 hover:text-primary-700"
                >
                  Temizle
                </button>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sıralama</label>
                <select
                  value={filters.sort}
                  onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary-500 focus:outline-none"
                >
                  <option value="popular">En Popüler</option>
                  <option value="price_asc">Fiyat: Düşükten Yükseğe</option>
                  <option value="price_desc">Fiyat: Yüksekten Düşüğe</option>
                  <option value="newest">En Yeni</option>
                  <option value="discount">En Çok İndirim</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Fiyat Aralığı</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice}
                    onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary-500 focus:outline-none"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:border-primary-500 focus:outline-none"
                  />
                </div>
              </div>

              <button className="w-full bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors">
                Filtreleri Uygula
              </button>
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-4" />
                    <div className="h-4 bg-gray-200 rounded mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-gray-600 text-lg">Bu kategoride henüz ürün bulunmamaktadır</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product: Product) => {
                    const discount = product.originalPrice
                      ? calculateDiscount(product.originalPrice, product.currentPrice)
                      : 0;

                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="group bg-white rounded-lg border border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all overflow-hidden"
                      >
                        <div className="relative aspect-square bg-gray-100 overflow-hidden">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.title}
                              fill
                              className="object-contain p-4 group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-gray-400">No Image</span>
                            </div>
                          )}
                          {discount > 0 && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-semibold flex items-center space-x-1">
                              <TrendingDown className="w-4 h-4" />
                              <span>%{discount}</span>
                            </div>
                          )}
                          <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50">
                            <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                          </button>
                        </div>
                        <div className="p-4">
                          <div className="text-xs text-gray-500 mb-1">{product.brand.name}</div>
                          <h3 className="text-sm font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600">
                            {product.title}
                          </h3>
                          <div className="flex flex-col space-y-1">
                            {product.originalPrice && product.originalPrice > product.currentPrice && (
                              <span className="text-xs text-gray-400 line-through">
                                {formatPrice(product.originalPrice)}
                              </span>
                            )}
                            <span className="text-lg font-bold text-primary-600">
                              {formatPrice(product.currentPrice)}
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center mt-12 space-x-2">
                    <button
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Önceki
                    </button>
                    {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={i}
                          onClick={() => setPage(pageNum)}
                          className={`px-4 py-2 border rounded-lg ${
                            page === pageNum
                              ? 'bg-primary-600 text-white border-primary-600'
                              : 'border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage(page + 1)}
                      disabled={page === pagination.totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Sonraki
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
