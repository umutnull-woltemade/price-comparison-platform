'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Clock, Heart, Star, TrendingDown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { formatPrice, calculateDiscount } from '@/lib/utils';

interface Product {
  id: string;
  title: string;
  slug: string;
  brand: { name: string };
  image: string;
  currentPrice: number;
  originalPrice?: number;
  rating?: number;
  reviewCount?: number;
}

// Countdown timer component
function CountdownTimer() {
  return (
    <div className="flex items-center gap-2 text-white">
      <Clock className="w-5 h-5" />
      <div className="flex items-center gap-1">
        <div className="bg-white text-secondary-900 px-2 py-1 rounded font-bold text-sm">
          12
        </div>
        <span>:</span>
        <div className="bg-white text-secondary-900 px-2 py-1 rounded font-bold text-sm">
          45
        </div>
        <span>:</span>
        <div className="bg-white text-secondary-900 px-2 py-1 rounded font-bold text-sm">
          30
        </div>
      </div>
    </div>
  );
}

export function DealsSection() {
  const { data, isLoading } = useQuery({
    queryKey: ['deal-products'],
    queryFn: () => api.product.getFeaturedProducts(8),
  });

  const products = data?.data?.products || [];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="bg-warning-500 rounded-t-lg px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold text-secondary-900">Flash Indirimler</h2>
            <CountdownTimer />
          </div>
          <Link
            href="/deals"
            className="flex items-center gap-2 text-secondary-900 hover:text-secondary-700 font-medium"
          >
            <span>Tum Firsatlar</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Products Grid */}
        <div className="bg-white rounded-b-lg border border-t-0 border-gray-200 p-6">
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {products.slice(0, 4).map((product: Product) => {
                const discount = product.originalPrice
                  ? calculateDiscount(product.originalPrice, product.currentPrice)
                  : 0;

                return (
                  <Link
                    key={product.id}
                    href={`/products/${product.slug}`}
                    className="group"
                  >
                    <div className="relative bg-gray-50 rounded-lg overflow-hidden mb-4">
                      <div className="aspect-square flex items-center justify-center p-4">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.title}
                            width={200}
                            height={200}
                            className="object-contain group-hover:scale-105 transition-transform"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                      </div>

                      {/* Discount Badge */}
                      {discount > 0 && (
                        <div className="absolute top-2 left-2 bg-danger-500 text-white px-2 py-1 rounded text-xs font-bold flex items-center gap-1">
                          <TrendingDown className="w-3 h-3" />
                          %{discount}
                        </div>
                      )}

                      {/* Wishlist Button */}
                      <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:text-danger-500">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Product Info */}
                    <div>
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < (product.rating || 4)
                                  ? 'text-warning-500 fill-warning-500'
                                  : 'text-gray-200'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-gray-500">
                          ({product.reviewCount || 128})
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-sm text-gray-700 line-clamp-2 group-hover:text-primary-500 transition-colors mb-2">
                        {product.title}
                      </h3>

                      {/* Price */}
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-secondary-900">
                          {formatPrice(product.currentPrice)}
                        </span>
                        {product.originalPrice && product.originalPrice > product.currentPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            {formatPrice(product.originalPrice)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
