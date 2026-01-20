'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, Package, Store, Users } from 'lucide-react';

interface StatItem {
  icon: React.ReactNode;
  value: number;
  label: string;
  suffix?: string;
}

export function Stats() {
  const [counts, setCounts] = useState({
    products: 0,
    stores: 0,
    users: 0,
    savings: 0,
  });

  const stats: StatItem[] = [
    { icon: <Package className="w-8 h-8" />, value: counts.products, label: 'Ürün', suffix: '+' },
    { icon: <Store className="w-8 h-8" />, value: counts.stores, label: 'Mağaza', suffix: '+' },
    { icon: <Users className="w-8 h-8" />, value: counts.users, label: 'Kullanıcı', suffix: 'K+' },
    { icon: <TrendingUp className="w-8 h-8" />, value: counts.savings, label: 'Toplam Tasarruf', suffix: 'M TL+' },
  ];

  useEffect(() => {
    // Animate numbers
    const targets = { products: 50000, stores: 250, users: 100, savings: 5 };
    const duration = 2000;
    const steps = 60;
    const increment = duration / steps;

    let current = { products: 0, stores: 0, users: 0, savings: 0 };

    const timer = setInterval(() => {
      current = {
        products: Math.min(current.products + targets.products / steps, targets.products),
        stores: Math.min(current.stores + targets.stores / steps, targets.stores),
        users: Math.min(current.users + targets.users / steps, targets.users),
        savings: Math.min(current.savings + targets.savings / steps, targets.savings),
      };

      setCounts({
        products: Math.floor(current.products),
        stores: Math.floor(current.stores),
        users: Math.floor(current.users),
        savings: Math.floor(current.savings),
      });

      if (
        current.products >= targets.products &&
        current.stores >= targets.stores &&
        current.users >= targets.users &&
        current.savings >= targets.savings
      ) {
        clearInterval(timer);
      }
    }, increment);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 text-white rounded-full mb-4">
                {stat.icon}
              </div>
              <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {stat.value.toLocaleString('tr-TR')}
                {stat.suffix}
              </div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
