'use client';

import Link from 'next/link';
import { ArrowRight, TrendingUp, Shield, Gift } from 'lucide-react';

export function Hero() {
  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white overflow-hidden">
      <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
      <div className="container mx-auto px-4 py-20 md:py-28 relative">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            En İyi Fiyatları Bulun,
            <br />
            <span className="text-secondary-200">Alışverişten Para Kazanın</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">
            Türkiye'nin en kapsamlı fiyat karşılaştırma platformu. Binlerce ürünü karşılaştırın, en uygun fiyatı bulun ve cashback kazanın.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              href="/products"
              className="bg-white text-primary-700 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-all flex items-center justify-center space-x-2 shadow-lg"
            >
              <span>Ürünleri Keşfet</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/register"
              className="bg-secondary-500 text-white px-8 py-4 rounded-lg font-semibold hover:bg-secondary-600 transition-all shadow-lg"
            >
              Ücretsiz Kayıt Ol
            </Link>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-all">
              <TrendingUp className="w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Fiyat Takibi</h3>
              <p className="text-primary-100 text-sm">
                Fiyat düşüşlerini otomatik takip edin, uyarı alın
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-all">
              <Shield className="w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Güvenli Alışveriş</h3>
              <p className="text-primary-100 text-sm">
                Sadece güvenilir mağazalardan alışveriş yapın
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/15 transition-all">
              <Gift className="w-10 h-10 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold mb-2">Cashback Kazan</h3>
              <p className="text-primary-100 text-sm">
                Her alışverişinizden %5'e kadar para iadesi
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
