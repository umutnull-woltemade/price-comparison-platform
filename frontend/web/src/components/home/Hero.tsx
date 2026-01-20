'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ArrowRight, Search, ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    badge: 'EN IYI FIRSATLAR',
    title: 'Elektronik Urunlerde',
    highlight: '%40\'a Varan Indirim',
    description: 'Binlerce urun, yuzlerce magaza. En iyi fiyati biz bulalim.',
    cta: 'Firsatlari Gor',
    ctaLink: '/deals',
    bgColor: 'bg-secondary-900',
  },
  {
    id: 2,
    badge: 'CASHBACK FIRSATI',
    title: 'Alisverislerinizden',
    highlight: '%10 Para Iadesi',
    description: 'Her alisveriste cashback kazanin. Biriktirin, cekin.',
    cta: 'Nasil Calisir?',
    ctaLink: '/cashback',
    bgColor: 'bg-primary-600',
  },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative">
      {/* Main Hero Slider */}
      <div className={`${slide.bgColor} transition-colors duration-500`}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[400px] md:min-h-[480px] py-12">
            {/* Content */}
            <div className="text-white">
              <span className="inline-block px-3 py-1 bg-primary-500 text-white text-xs font-semibold rounded mb-4">
                {slide.badge}
              </span>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
                {slide.title}
              </h1>
              <p className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary-400 mb-4">
                {slide.highlight}
              </p>
              <p className="text-gray-300 text-lg mb-8 max-w-md">
                {slide.description}
              </p>
              <Link
                href={slide.ctaLink}
                className="inline-flex items-center gap-2 bg-primary-500 text-white px-8 py-4 rounded font-semibold hover:bg-primary-600 transition-colors"
              >
                <span>{slide.cta}</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Image Placeholder */}
            <div className="hidden lg:flex justify-center">
              <div className="relative w-full max-w-md h-80">
                <div className="absolute inset-0 bg-white/10 rounded-2xl backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <div className="w-24 h-24 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center">
                      <Search className="w-12 h-12" />
                    </div>
                    <p className="text-lg">Binlerce Urun</p>
                    <p className="text-sm">Tek Platformda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Navigation */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
          <button
            onClick={prevSlide}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentSlide ? 'bg-primary-500' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Search Bar - Floating */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-8 z-10">
          <form onSubmit={handleSearch} className="bg-white rounded-lg shadow-lg p-2">
            <div className="flex items-center">
              <div className="flex-1 flex items-center">
                <Search className="w-6 h-6 text-gray-400 ml-4" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Urun, marka veya kategori ara..."
                  className="flex-1 h-14 px-4 text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="h-14 px-8 bg-primary-500 text-white rounded font-semibold hover:bg-primary-600 transition-colors"
              >
                Ara
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
            <p className="text-2xl font-bold text-primary-500">50K+</p>
            <p className="text-gray-500 text-sm">Urun</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
            <p className="text-2xl font-bold text-primary-500">500+</p>
            <p className="text-gray-500 text-sm">Magaza</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
            <p className="text-2xl font-bold text-primary-500">%10</p>
            <p className="text-gray-500 text-sm">Cashback</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center border border-gray-100">
            <p className="text-2xl font-bold text-primary-500">100K+</p>
            <p className="text-gray-500 text-sm">Kullanici</p>
          </div>
        </div>
      </div>
    </section>
  );
}
