'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  Menu,
  X,
  User,
  Heart,
  Search,
  ChevronDown,
  Phone,
  ArrowRight,
  ShoppingCart,
  LayoutGrid,
  Smartphone,
  Laptop,
  Tv,
  Home,
  Shirt,
  Headphones,
  Watch,
  Gift,
  LogOut,
  Settings,
  Bell,
  Wallet,
  Sparkles,
  Zap,
  TrendingDown,
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';

const categories = [
  { name: 'Elektronik', slug: 'elektronik', icon: Smartphone, color: 'bg-blue-50 text-blue-500' },
  { name: 'Bilgisayar', slug: 'bilgisayar', icon: Laptop, color: 'bg-purple-50 text-purple-500' },
  { name: 'TV & Ses', slug: 'tv-ses', icon: Tv, color: 'bg-indigo-50 text-indigo-500' },
  { name: 'Ev & Yasam', slug: 'ev-yasam', icon: Home, color: 'bg-emerald-50 text-emerald-500' },
  { name: 'Moda', slug: 'moda', icon: Shirt, color: 'bg-pink-50 text-pink-500' },
  { name: 'Aksesuar', slug: 'aksesuar', icon: Headphones, color: 'bg-orange-50 text-orange-500' },
  { name: 'Saat', slug: 'saat', icon: Watch, color: 'bg-amber-50 text-amber-500' },
  { name: 'Hediye', slug: 'hediye', icon: Gift, color: 'bg-rose-50 text-rose-500' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const categoryRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  return (
    <header className={`sticky top-0 z-50 transition-shadow duration-300 ${scrolled ? 'shadow-lg' : ''}`}>
      {/* Top Bar - Gradient */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-gray-300 text-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10">
            {/* Left - Promo */}
            <div className="hidden md:flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary-400" />
              <p>
                <span className="text-primary-400 font-medium">%10 Cashback</span> firsatini kacirmayin!
              </p>
            </div>

            {/* Right - Contact & Links */}
            <div className="flex items-center gap-6 ml-auto">
              <Link href="/deals" className="hidden sm:flex items-center gap-1 hover:text-primary-400 transition-colors">
                <Zap className="w-4 h-4" />
                <span>Firsatlar</span>
              </Link>
              <a href="tel:+902121234567" className="hidden md:flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span>0212 123 45 67</span>
              </a>
              <div className="flex items-center gap-4 text-xs">
                <Link href="/help" className="hover:text-white transition-colors">Yardim</Link>
                <span className="text-gray-600">|</span>
                <Link href="/about" className="hover:text-white transition-colors">Hakkimizda</Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6 lg:gap-10 h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 shrink-0">
              <div className="w-11 h-11 bg-gradient-to-br from-primary-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/25">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold text-gray-900">
                  Fiyat<span className="text-primary-500">Radar</span>
                </span>
                <p className="text-[10px] text-gray-400 -mt-1">Akilli Fiyat Karsilastirma</p>
              </div>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative w-full flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Urun, marka veya kategori ara..."
                  className="w-full h-12 pl-5 pr-4 border-2 border-gray-200 rounded-l-xl focus:border-primary-500 focus:outline-none transition-colors bg-gray-50 focus:bg-white"
                />
                <button
                  type="submit"
                  className="h-12 px-6 bg-gradient-to-r from-primary-500 to-orange-500 text-white rounded-r-xl hover:from-primary-600 hover:to-orange-600 transition-all shadow-lg shadow-primary-500/25"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Action Icons */}
            <div className="flex items-center gap-1 ml-auto">
              {isAuthenticated ? (
                <>
                  {/* Favorites */}
                  <Link
                    href="/dashboard/favorites"
                    className="relative p-3 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all"
                  >
                    <Heart className="w-6 h-6" />
                  </Link>

                  {/* Alerts */}
                  <Link
                    href="/dashboard/alerts"
                    className="relative p-3 text-gray-500 hover:text-primary-500 hover:bg-primary-50 rounded-xl transition-all"
                  >
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-gradient-to-r from-primary-500 to-orange-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                      3
                    </span>
                  </Link>

                  {/* User Menu */}
                  <div ref={userMenuRef} className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-2 pl-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all border border-transparent hover:border-gray-200"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-orange-500 rounded-lg flex items-center justify-center text-white font-medium">
                        {user?.firstName?.charAt(0) || 'U'}
                      </div>
                      <span className="hidden lg:block text-sm font-medium text-gray-700">
                        {user?.firstName || 'Hesabim'}
                      </span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* User Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fade-in overflow-hidden">
                        <div className="px-4 py-3 bg-gradient-to-r from-primary-50 to-orange-50 border-b border-gray-100">
                          <p className="font-semibold text-gray-900">{user?.firstName} {user?.lastName}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        <div className="py-2">
                          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                            <LayoutGrid className="w-5 h-5 text-gray-400" />
                            <span>Dashboard</span>
                          </Link>
                          <Link href="/dashboard/cashback" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                            <Wallet className="w-5 h-5 text-gray-400" />
                            <span>Cashback</span>
                            <span className="ml-auto text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full font-medium">125 TL</span>
                          </Link>
                          <Link href="/dashboard/favorites" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                            <Heart className="w-5 h-5 text-gray-400" />
                            <span>Favorilerim</span>
                          </Link>
                          <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                            <Settings className="w-5 h-5 text-gray-400" />
                            <span>Ayarlar</span>
                          </Link>
                        </div>
                        <div className="border-t border-gray-100 pt-2">
                          <button
                            onClick={() => {
                              logout();
                              setUserMenuOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-50 transition-colors w-full"
                          >
                            <LogOut className="w-5 h-5" />
                            <span>Cikis Yap</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="hidden md:flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-primary-500 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Giris Yap</span>
                  </Link>
                  <Link
                    href="/register"
                    className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-primary-500 to-orange-500 text-white rounded-xl font-medium hover:from-primary-600 hover:to-orange-600 transition-all shadow-lg shadow-primary-500/25"
                  >
                    <span>Kayit Ol</span>
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-3 text-gray-600 hover:text-primary-500 hover:bg-gray-50 rounded-xl transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-12">
            {/* Categories Dropdown */}
            <div ref={categoryRef} className="relative">
              <button
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                className="flex items-center gap-2 h-12 px-5 -ml-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white hover:from-slate-700 hover:to-slate-800 transition-all rounded-b-xl"
              >
                <LayoutGrid className="w-5 h-5" />
                <span className="font-medium">Kategoriler</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${categoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Categories Dropdown Menu */}
              {categoryMenuOpen && (
                <div className="absolute left-0 top-full w-72 bg-white rounded-2xl shadow-xl border border-gray-100 py-3 animate-slide-down overflow-hidden">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors group"
                        onClick={() => setCategoryMenuOpen(false)}
                      >
                        <div className={`w-10 h-10 ${category.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-medium group-hover:text-primary-500 transition-colors">{category.name}</span>
                        <ArrowRight className="w-4 h-4 ml-auto text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                      </Link>
                    );
                  })}
                  <div className="border-t border-gray-100 mt-2 pt-2 px-4">
                    <Link
                      href="/categories"
                      className="flex items-center justify-center gap-2 py-3 text-primary-500 font-semibold hover:bg-primary-50 rounded-xl transition-colors"
                      onClick={() => setCategoryMenuOpen(false)}
                    >
                      <span>Tum Kategoriler</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 ml-6">
              <Link href="/products" className="px-4 py-2 text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg font-medium transition-all">
                Urunler
              </Link>
              <Link href="/stores" className="px-4 py-2 text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg font-medium transition-all">
                Magazalar
              </Link>
              <Link href="/cashback" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg font-medium transition-all">
                Cashback
                <span className="bg-gradient-to-r from-primary-500 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">%10</span>
              </Link>
              <Link href="/deals" className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg font-medium transition-all">
                <Zap className="w-4 h-4 text-yellow-500" />
                Firsatlar
              </Link>
            </nav>

            {/* Right side - Support */}
            <div className="hidden lg:flex items-center gap-3 ml-auto">
              <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-primary-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">7/24 Destek</p>
                <p className="font-semibold text-gray-900">0212 123 45 67</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 animate-slide-down shadow-lg">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Urun ara..."
                  className="w-full h-12 pl-4 pr-14 border border-gray-200 rounded-xl focus:border-primary-500 focus:outline-none bg-gray-50"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 h-9 w-9 bg-gradient-to-r from-primary-500 to-orange-500 text-white rounded-lg flex items-center justify-center"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-1">
              <Link
                href="/products"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Urunler</span>
              </Link>
              <Link
                href="/categories"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutGrid className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Kategoriler</span>
              </Link>
              <Link
                href="/stores"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Magazalar</span>
              </Link>
              <Link
                href="/cashback"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Wallet className="w-5 h-5 text-gray-400" />
                <span className="font-medium">Cashback</span>
                <span className="bg-gradient-to-r from-primary-500 to-orange-500 text-white text-xs px-2 py-0.5 rounded-full ml-auto font-medium">%10</span>
              </Link>
              <Link
                href="/deals"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Zap className="w-5 h-5 text-yellow-500" />
                <span className="font-medium">Firsatlar</span>
              </Link>

              {!isAuthenticated && (
                <>
                  <div className="border-t border-gray-100 my-3" />
                  <Link
                    href="/login"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5 text-gray-400" />
                    <span className="font-medium">Giris Yap</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-2 px-4 py-3.5 bg-gradient-to-r from-primary-500 to-orange-500 text-white rounded-xl font-semibold shadow-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Ucretsiz Kayit Ol</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}
