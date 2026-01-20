'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, TrendingDown, Heart } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPrice, calculateDiscount, slugify } from '@/lib/utils';

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

export function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.product.getFeaturedProducts(12),
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Öne Çıkan Ürünler</h2>
            <p className="text-gray-600">En çok aranan ve en iyi fiyatlı ürünler</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const products = data?.data?.products || [];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Öne Çıkan Ürünler</h2>
            <p className="text-gray-600">En çok aranan ve en iyi fiyatlı ürünler</p>
          </div>
          <Link
            href="/products"
            className="hidden md:flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            <span>Tümünü Gör</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
                  {product.lowestPrice && product.lowestPrice < product.currentPrice && (
                    <div className="text-xs text-gray-500 mt-2">
                      En düşük: {formatPrice(product.lowestPrice)}
                    </div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-semibold"
          >
            <span>Tümünü Gör</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
