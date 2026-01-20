'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import {
  Smartphone,
  Laptop,
  Tv,
  Headphones,
  Watch,
  Camera,
  Gamepad2,
  Home,
  ShoppingBag,
  Shirt,
  Baby,
  Book
} from 'lucide-react';
import { api } from '@/lib/api';

const categoryIcons: Record<string, React.ReactNode> = {
  'elektronik': <Smartphone className="w-8 h-8" />,
  'bilgisayar': <Laptop className="w-8 h-8" />,
  'telefon': <Smartphone className="w-8 h-8" />,
  'tv': <Tv className="w-8 h-8" />,
  'ses-sistemleri': <Headphones className="w-8 h-8" />,
  'aksesuar': <Watch className="w-8 h-8" />,
  'fotograf': <Camera className="w-8 h-8" />,
  'oyun': <Gamepad2 className="w-8 h-8" />,
  'ev': <Home className="w-8 h-8" />,
  'moda': <Shirt className="w-8 h-8" />,
  'cocuk': <Baby className="w-8 h-8" />,
  'kitap': <Book className="w-8 h-8" />,
};

const colors = [
  'from-blue-500 to-blue-600',
  'from-purple-500 to-purple-600',
  'from-pink-500 to-pink-600',
  'from-green-500 to-green-600',
  'from-yellow-500 to-yellow-600',
  'from-red-500 to-red-600',
  'from-indigo-500 to-indigo-600',
  'from-teal-500 to-teal-600',
];

interface Category {
  id: string;
  name: string;
  slug: string;
  productCount: number;
}

export function PopularCategories() {
  const { data, isLoading } = useQuery({
    queryKey: ['popular-categories'],
    queryFn: () => api.category.getPopular(12),
  });

  if (isLoading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popüler Kategoriler</h2>
            <p className="text-gray-600">En çok tercih edilen kategorilere göz atın</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const categories = data?.data?.categories || [];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popüler Kategoriler</h2>
          <p className="text-gray-600">En çok tercih edilen kategorilere göz atın</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          {categories.map((category: Category, index: number) => {
            const icon = categoryIcons[category.slug] || <ShoppingBag className="w-8 h-8" />;
            const colorClass = colors[index % colors.length];

            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group"
              >
                <div className={`bg-gradient-to-br ${colorClass} rounded-2xl p-6 text-white hover:scale-105 transition-transform shadow-lg`}>
                  <div className="flex flex-col items-center text-center space-y-3">
                    <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                      {icon}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{category.name}</h3>
                      <p className="text-sm text-white/80">
                        {category.productCount?.toLocaleString('tr-TR')} ürün
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/categories"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Tüm Kategoriler
          </Link>
        </div>
      </div>
    </section>
  );
}
