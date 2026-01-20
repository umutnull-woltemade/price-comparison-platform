'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  ArrowRight,
  Search,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  TrendingDown,
  Shield,
  Zap,
  Gift,
  Package,
  Store,
  Users
} from 'lucide-react';

const slides = [
  {
    id: 1,
    badge: 'OZEL KAMPANYA',
    title: 'Elektronik Urunlerde',
    highlight: '%40 Indirim',
    description: 'Binlerce urun, yuzlerce magaza. En iyi fiyati tek tikla bulun.',
    cta: 'Firsatlari Gor',
    ctaLink: '/deals',
    gradient: 'from-slate-900 via-slate-800 to-slate-900',
    accentColor: 'text-primary-400',
    icon: Zap,
  },
  {
    id: 2,
    badge: 'CASHBACK',
    title: 'Her Alisveriste',
    highlight: '%10 Para Iadesi',
    description: 'Alisveris yapin, cashback kazanin. Paranizi geri alin.',
    cta: 'Nasil Calisir?',
    ctaLink: '/cashback',
    gradient: 'from-primary-600 via-primary-500 to-orange-500',
    accentColor: 'text-white',
    icon: Gift,
  },
  {
    id: 3,
    badge: 'FIYAT TAKIBI',
    title: 'Fiyat Dusunce',
    highlight: 'Aninda Haber Al',
    description: 'Fiyat alarmı kurun, indirimlerden ilk siz haberdar olun.',
    cta: 'Alarm Kur',
    ctaLink: '/register',
    gradient: 'from-emerald-600 via-teal-600 to-cyan-600',
    accentColor: 'text-emerald-200',
    icon: TrendingDown,
  },
];

const stats = [
  { value: '50K+', label: 'Urun', icon: Package },
  { value: '500+', label: 'Magaza', icon: Store },
  { value: '%10', label: 'Cashback', icon: Gift },
  { value: '100K+', label: 'Kullanici', icon: Users },
];

export function Hero() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Auto-slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 500);
  };

  const nextSlide = () => goToSlide((currentSlide + 1) % slides.length);
  const prevSlide = () => goToSlide((currentSlide - 1 + slides.length) % slides.length);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const slide = slides[currentSlide];
  const SlideIcon = slide.icon;

  return (
    <section className="relative overflow-hidden">
      {/* Main Hero */}
      <div className={`relative bg-gradient-to-br ${slide.gradient} transition-all duration-700`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        {/* Animated Gradient Orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container mx-auto px-4 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[520px] py-16">
            {/* Content */}
            <div className="text-white">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full mb-6 border border-white/20">
                <Sparkles className="w-4 h-4 text-primary-400" />
                <span className="text-sm font-medium">{slide.badge}</span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
                {slide.title}
                <span className={`block ${slide.accentColor} mt-2`}>
                  {slide.highlight}
                </span>
              </h1>

              <p className="text-lg text-white/80 mb-8 max-w-lg leading-relaxed">
                {slide.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href={slide.ctaLink}
                  className="group inline-flex items-center gap-2 bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  <span>{slide.cta}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
                >
                  <span>Urunleri Incele</span>
                </Link>
              </div>
            </div>

            {/* Right Side Visual */}
            <div className="hidden lg:block relative">
              <div className="relative">
                {/* Main Card */}
                <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 shadow-2xl">
                  <div className="flex items-center justify-center mb-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <SlideIcon className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="text-center text-white">
                    <p className="text-3xl font-bold mb-2">FiyatRadar</p>
                    <p className="text-white/70">Akilli Fiyat Karsilastirma</p>
                  </div>

                  {/* Features */}
                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                      <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                        <TrendingDown className="w-5 h-5 text-green-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">En Dusuk Fiyat</p>
                        <p className="text-sm text-white/60">Otomatik bulunur</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                      <div className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center">
                        <Gift className="w-5 h-5 text-primary-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Cashback</p>
                        <p className="text-sm text-white/60">%10&apos;a varan iade</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                      <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="font-medium text-white">Guvenli</p>
                        <p className="text-sm text-white/60">Dogrulanmis magazalar</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-4 -right-4 bg-green-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg animate-bounce">
                  %40 OFF
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white text-gray-900 px-4 py-2 rounded-xl font-medium shadow-lg flex items-center gap-2">
                  <Shield className="w-4 h-4 text-green-500" />
                  <span>Guvenli Alisveris</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Navigation */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-6">
          <button
            onClick={prevSlide}
            className="w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all border border-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex gap-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide
                    ? 'bg-white w-8'
                    : 'bg-white/30 w-2 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
          <button
            onClick={nextSlide}
            className="w-12 h-12 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all border border-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Search Bar - Floating */}
      <div className="container mx-auto px-4">
        <div className="relative -mt-10 z-10">
          <form onSubmit={handleSearch} className="bg-white rounded-2xl shadow-2xl p-3 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="flex-1 flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center">
                  <Search className="w-6 h-6 text-primary-500" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="iPhone, Samsung, MacBook... ne ariyorsunuz?"
                  className="flex-1 h-12 text-gray-900 placeholder:text-gray-400 focus:outline-none text-lg"
                />
              </div>
              <button
                type="submit"
                className="h-12 px-8 bg-gradient-to-r from-primary-500 to-orange-500 text-white rounded-xl font-semibold hover:from-primary-600 hover:to-orange-600 transition-all shadow-lg hover:shadow-xl"
              >
                Ara
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Stats */}
      <div className="container mx-auto px-4 mt-10 mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={index}
                className="group bg-white rounded-2xl p-6 border border-gray-100 hover:border-primary-200 hover:shadow-lg transition-all cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center group-hover:bg-primary-100 transition-colors">
                    <Icon className="w-6 h-6 text-primary-500" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-gray-500 text-sm">{stat.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
