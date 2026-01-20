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
  Book,
  Utensils,
  Dumbbell,
  Palette,
  Wrench
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
  'gida': <Utensils className="w-8 h-8" />,
  'spor': <Dumbbell className="w-8 h-8" />,
  'hobi': <Palette className="w-8 h-8" />,
  'yapim': <Wrench className="w-8 h-8" />,
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
  'from-orange-500 to-orange-600',
  'from-cyan-500 to-cyan-600',
];

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount: number;
  subcategories?: Category[];
}

export default function CategoriesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['all-categories'],
    queryFn: () => api.category.getAll(),
  });

  const categories = data?.data?.categories || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white">
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Tüm Kategoriler</h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto">
            Binlerce ürün arasından ihtiyacınız olan kategoriye kolayca ulaşın
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="bg-gray-200 aspect-square rounded-2xl" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {categories.map((category: Category, index: number) => (
              <div key={category.id}>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{category.name}</h2>
                    {category.description && (
                      <p className="text-gray-600">{category.description}</p>
                    )}
                  </div>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-primary-600 hover:text-primary-700 font-semibold"
                  >
                    Tümünü Gör →
                  </Link>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  <Link
                    href={`/categories/${category.slug}`}
                    className="group"
                  >
                    <div className={`bg-gradient-to-br ${colors[index % colors.length]} rounded-2xl p-6 text-white hover:scale-105 transition-transform shadow-lg`}>
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className="bg-white/20 rounded-full p-4 backdrop-blur-sm group-hover:bg-white/30 transition-colors">
                          {categoryIcons[category.slug] || <ShoppingBag className="w-8 h-8" />}
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

                  {category.subcategories?.map((sub: Category, subIndex: number) => (
                    <Link
                      key={sub.id}
                      href={`/categories/${category.slug}/${sub.slug}`}
                      className="group bg-white rounded-2xl p-6 border-2 border-gray-200 hover:border-primary-300 hover:shadow-lg transition-all"
                    >
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`bg-gradient-to-br ${colors[(index + subIndex + 1) % colors.length]} bg-opacity-10 rounded-full p-4 group-hover:scale-110 transition-transform`}>
                          {categoryIcons[sub.slug] || <ShoppingBag className="w-6 h-6 text-gray-600" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-primary-600">
                            {sub.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {sub.productCount?.toLocaleString('tr-TR')} ürün
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Popular Categories CTA */}
        <div className="mt-16 bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Aradığınızı Bulamadınız mı?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Akıllı arama özelliğimizi kullanarak binlerce ürün arasından ihtiyacınız olanı kolayca bulabilirsiniz.
          </p>
          <Link
            href="/"
            className="inline-block bg-primary-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            Arama Yap
          </Link>
        </div>
      </div>
    </div>
  );
}
