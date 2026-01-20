'use client';

import Link from 'next/link';
import {
  Smartphone,
  Laptop,
  Tv,
  Home,
  Shirt,
  Headphones,
  Watch,
  Camera,
  Gamepad2,
  Baby,
  Dumbbell,
  Car,
} from 'lucide-react';

const categories = [
  { name: 'Elektronik', slug: 'elektronik', icon: Smartphone, color: 'bg-blue-50 text-blue-600' },
  { name: 'Bilgisayar', slug: 'bilgisayar', icon: Laptop, color: 'bg-purple-50 text-purple-600' },
  { name: 'TV & Ses', slug: 'tv-ses', icon: Tv, color: 'bg-indigo-50 text-indigo-600' },
  { name: 'Ev & Yasam', slug: 'ev-yasam', icon: Home, color: 'bg-green-50 text-green-600' },
  { name: 'Moda', slug: 'moda', icon: Shirt, color: 'bg-pink-50 text-pink-600' },
  { name: 'Aksesuar', slug: 'aksesuar', icon: Headphones, color: 'bg-orange-50 text-orange-600' },
  { name: 'Saat', slug: 'saat', icon: Watch, color: 'bg-yellow-50 text-yellow-600' },
  { name: 'Fotograf', slug: 'fotograf', icon: Camera, color: 'bg-red-50 text-red-600' },
  { name: 'Oyun', slug: 'oyun', icon: Gamepad2, color: 'bg-cyan-50 text-cyan-600' },
  { name: 'Anne & Bebek', slug: 'anne-bebek', icon: Baby, color: 'bg-rose-50 text-rose-600' },
  { name: 'Spor', slug: 'spor', icon: Dumbbell, color: 'bg-emerald-50 text-emerald-600' },
  { name: 'Otomotiv', slug: 'otomotiv', icon: Car, color: 'bg-slate-50 text-slate-600' },
];

export function CategoryBar() {
  return (
    <section className="py-8 bg-white border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Kategoriler</h2>
          <Link href="/categories" className="text-primary-500 hover:text-primary-600 font-medium text-sm">
            Tum Kategoriler
          </Link>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group flex flex-col items-center text-center"
              >
                <div className={`w-14 h-14 ${category.color} rounded-xl flex items-center justify-center mb-2 group-hover:scale-110 transition-transform`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-600 group-hover:text-primary-500 transition-colors">
                  {category.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
