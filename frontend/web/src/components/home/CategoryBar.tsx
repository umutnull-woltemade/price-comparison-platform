'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
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
  { name: 'Elektronik', slug: 'elektronik', icon: Smartphone, gradient: 'from-blue-500 to-blue-600', bg: 'bg-blue-50', text: 'text-blue-600' },
  { name: 'Bilgisayar', slug: 'bilgisayar', icon: Laptop, gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-50', text: 'text-purple-600' },
  { name: 'TV & Ses', slug: 'tv-ses', icon: Tv, gradient: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50', text: 'text-indigo-600' },
  { name: 'Ev & Yasam', slug: 'ev-yasam', icon: Home, gradient: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50', text: 'text-emerald-600' },
  { name: 'Moda', slug: 'moda', icon: Shirt, gradient: 'from-pink-500 to-pink-600', bg: 'bg-pink-50', text: 'text-pink-600' },
  { name: 'Aksesuar', slug: 'aksesuar', icon: Headphones, gradient: 'from-orange-500 to-orange-600', bg: 'bg-orange-50', text: 'text-orange-600' },
  { name: 'Saat', slug: 'saat', icon: Watch, gradient: 'from-amber-500 to-amber-600', bg: 'bg-amber-50', text: 'text-amber-600' },
  { name: 'Fotograf', slug: 'fotograf', icon: Camera, gradient: 'from-red-500 to-red-600', bg: 'bg-red-50', text: 'text-red-600' },
  { name: 'Oyun', slug: 'oyun', icon: Gamepad2, gradient: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-50', text: 'text-cyan-600' },
  { name: 'Anne Bebek', slug: 'anne-bebek', icon: Baby, gradient: 'from-rose-500 to-rose-600', bg: 'bg-rose-50', text: 'text-rose-600' },
  { name: 'Spor', slug: 'spor', icon: Dumbbell, gradient: 'from-teal-500 to-teal-600', bg: 'bg-teal-50', text: 'text-teal-600' },
  { name: 'Otomotiv', slug: 'otomotiv', icon: Car, gradient: 'from-slate-500 to-slate-600', bg: 'bg-slate-50', text: 'text-slate-600' },
];

export function CategoryBar() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kategorilere Goz At</h2>
            <p className="text-gray-500 mt-1">Aradiginiz urunu kolayca bulun</p>
          </div>
          <Link
            href="/categories"
            className="hidden md:flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium transition-colors"
          >
            <span>Tum Kategoriler</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-3 md:gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="group"
              >
                <div className="flex flex-col items-center p-4 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg border border-transparent hover:border-gray-100 transition-all duration-300">
                  {/* Icon */}
                  <div className={`relative w-14 h-14 ${category.bg} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-7 h-7 ${category.text}`} />
                    {/* Hover gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                  {/* Name */}
                  <span className="text-xs md:text-sm font-medium text-gray-700 group-hover:text-gray-900 transition-colors text-center">
                    {category.name}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Mobile View All */}
        <div className="mt-6 text-center md:hidden">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600 font-medium"
          >
            <span>Tum Kategorileri Gor</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
