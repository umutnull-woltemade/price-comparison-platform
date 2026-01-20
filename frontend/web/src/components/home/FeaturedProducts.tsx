'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Heart, Star, Eye, ShoppingCart } from 'lucide-react';
import { api } from '@/lib/api';
import { formatPrice, calculateDiscount } from '@/lib/utils';

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
  rating?: number;
  reviewCount?: number;
}

function ProductCard({ product }: { product: Product }) {
  const discount = product.originalPrice
    ? calculateDiscount(product.originalPrice, product.currentPrice)
    : 0;

  return (
    <div className="group bg-white border border-gray-200 rounded-lg overflow-hidden hover:border-primary-500 hover:shadow-card-hover transition-all">
      {/* Image Container */}
      <div className="relative bg-gray-50 overflow-hidden">
        <Link href={`/products/${product.slug}`}>
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
        </Link>

        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-danger-500 text-white px-2 py-1 rounded text-xs font-bold">
            %{discount} OFF
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-primary-500 hover:text-white transition-colors">
            <Heart className="w-4 h-4" />
          </button>
          <button className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-primary-500 hover:text-white transition-colors">
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Button */}
        <div className="absolute bottom-0 left-0 right-0 bg-primary-500 text-white py-2 text-center text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-primary-600">
          <span className="flex items-center justify-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Magazaya Git
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4">
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
          <span className="text-xs text-gray-500">({product.reviewCount || 128})</span>
        </div>

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-sm text-gray-700 line-clamp-2 group-hover:text-primary-500 transition-colors mb-2 min-h-[40px]">
            {product.title}
          </h3>
        </Link>

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

        {/* Lowest Price Info */}
        {product.lowestPrice && product.lowestPrice < product.currentPrice && (
          <p className="text-xs text-success-500 mt-1">
            En dusuk: {formatPrice(product.lowestPrice)}
          </p>
        )}
      </div>
    </div>
  );
}

export function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: () => api.product.getFeaturedProducts(12),
  });

  const products = data?.data?.products || [];

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">One Cikan Urunler</h2>
            <p className="text-gray-500 mt-1">En cok aranan ve en iyi fiyatli urunler</p>
          </div>
          <Link
            href="/products"
            className="hidden md:flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
          >
            <span>Tumunu Gor</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-lg p-4">
                <div className="bg-gray-200 aspect-square rounded-lg mb-4" />
                <div className="h-3 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded mb-2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product: Product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Mobile View All Link */}
        <div className="mt-8 text-center md:hidden">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-primary-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-600 transition-colors"
          >
            <span>Tumunu Gor</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
