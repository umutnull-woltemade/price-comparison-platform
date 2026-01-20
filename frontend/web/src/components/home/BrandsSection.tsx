'use client';

import Link from 'next/link';

const brands = [
  { name: 'Apple', slug: 'apple', logo: 'A' },
  { name: 'Samsung', slug: 'samsung', logo: 'S' },
  { name: 'Sony', slug: 'sony', logo: 'S' },
  { name: 'LG', slug: 'lg', logo: 'LG' },
  { name: 'HP', slug: 'hp', logo: 'HP' },
  { name: 'Dell', slug: 'dell', logo: 'D' },
  { name: 'Asus', slug: 'asus', logo: 'A' },
  { name: 'Lenovo', slug: 'lenovo', logo: 'L' },
  { name: 'Xiaomi', slug: 'xiaomi', logo: 'X' },
  { name: 'Huawei', slug: 'huawei', logo: 'H' },
  { name: 'Dyson', slug: 'dyson', logo: 'D' },
  { name: 'Bosch', slug: 'bosch', logo: 'B' },
];

export function BrandsSection() {
  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Populer Markalar</h2>
            <p className="text-gray-500 mt-1">En cok tercih edilen markalar</p>
          </div>
          <Link
            href="/brands"
            className="text-primary-500 hover:text-primary-600 font-medium"
          >
            Tum Markalar
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-4">
          {brands.map((brand) => (
            <Link
              key={brand.slug}
              href={`/brands/${brand.slug}`}
              className="group"
            >
              <div className="aspect-square bg-gray-50 rounded-lg border border-gray-100 flex items-center justify-center group-hover:border-primary-500 group-hover:shadow-md transition-all">
                <div className="text-center">
                  <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center text-gray-600 font-bold text-lg group-hover:bg-primary-50 group-hover:text-primary-500 transition-colors">
                    {brand.logo}
                  </div>
                  <span className="text-xs text-gray-600 group-hover:text-primary-500 transition-colors">
                    {brand.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
