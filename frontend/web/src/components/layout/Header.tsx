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
  MapPin,
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
} from 'lucide-react';
import { useAuthStore } from '@/store/auth';

const categories = [
  { name: 'Elektronik', slug: 'elektronik', icon: Smartphone },
  { name: 'Bilgisayar', slug: 'bilgisayar', icon: Laptop },
  { name: 'TV & Ses', slug: 'tv-ses', icon: Tv },
  { name: 'Ev & Yasam', slug: 'ev-yasam', icon: Home },
  { name: 'Moda', slug: 'moda', icon: Shirt },
  { name: 'Aksesuar', slug: 'aksesuar', icon: Headphones },
  { name: 'Saat', slug: 'saat', icon: Watch },
  { name: 'Hediye', slug: 'hediye', icon: Gift },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoryMenuOpen, setCategoryMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isAuthenticated, logout } = useAuthStore();
  const categoryRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

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
    <header className="sticky top-0 z-50">
      {/* Top Bar - Dark */}
      <div className="bg-secondary-900 text-gray-300 text-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-10">
            {/* Left - Welcome message */}
            <p className="hidden md:block">
              Hosgeldiniz! <span className="text-primary-500">%10&apos;a varan cashback</span> firsatlarini kacirmayin.
            </p>

            {/* Right - Contact & Language */}
            <div className="flex items-center gap-6 ml-auto">
              <a href="tel:+902121234567" className="hidden md:flex items-center gap-2 hover:text-white transition-colors">
                <Phone className="w-4 h-4" />
                <span>0212 123 45 67</span>
              </a>
              <div className="flex items-center gap-2 hover:text-white transition-colors cursor-pointer">
                <MapPin className="w-4 h-4" />
                <span>Istanbul</span>
              </div>
              <select className="bg-transparent border-none text-gray-300 text-sm focus:outline-none cursor-pointer hover:text-white">
                <option value="tr">Turkce</option>
                <option value="en">English</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Bar - Logo, Search, Actions */}
      <div className="bg-white border-b border-gray-100">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8 h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <Search className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-secondary-900">
                Fiyat<span className="text-primary-500">Radar</span>
              </span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl">
              <div className="relative w-full flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Urun, marka veya kategori ara..."
                  className="w-full h-12 pl-5 pr-14 border-2 border-gray-200 rounded-l-md focus:border-primary-500 focus:outline-none transition-colors"
                />
                <button
                  type="submit"
                  className="h-12 px-6 bg-primary-500 text-white rounded-r-md hover:bg-primary-600 transition-colors"
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
                    className="relative p-3 text-gray-600 hover:text-primary-500 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Heart className="w-6 h-6" />
                  </Link>

                  {/* Cart / Alerts */}
                  <Link
                    href="/dashboard/alerts"
                    className="relative p-3 text-gray-600 hover:text-primary-500 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <Bell className="w-6 h-6" />
                    <span className="absolute top-1 right-1 w-5 h-5 bg-primary-500 text-white text-xs rounded-full flex items-center justify-center">
                      3
                    </span>
                  </Link>

                  {/* User Menu */}
                  <div ref={userMenuRef} className="relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-2 p-3 text-gray-600 hover:text-primary-500 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <User className="w-6 h-6" />
                      <span className="hidden lg:block text-sm font-medium">
                        {user?.firstName || 'Hesabim'}
                      </span>
                      <ChevronDown className={`w-4 h-4 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* User Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-dropdown border border-gray-100 py-2 animate-fade-in">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-medium text-gray-900">{user?.firstName} {user?.lastName}</p>
                          <p className="text-sm text-gray-500">{user?.email}</p>
                        </div>
                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                          <LayoutGrid className="w-5 h-5" />
                          <span>Dashboard</span>
                        </Link>
                        <Link href="/dashboard/cashback" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                          <Wallet className="w-5 h-5" />
                          <span>Cashback</span>
                        </Link>
                        <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2.5 text-gray-700 hover:bg-gray-50 transition-colors">
                          <Settings className="w-5 h-5" />
                          <span>Ayarlar</span>
                        </Link>
                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={() => {
                              logout();
                              setUserMenuOpen(false);
                            }}
                            className="flex items-center gap-3 px-4 py-2.5 text-danger-500 hover:bg-gray-50 transition-colors w-full"
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
                    className="hidden md:flex items-center gap-2 px-4 py-2.5 text-gray-700 hover:text-primary-500 transition-colors"
                  >
                    <User className="w-5 h-5" />
                    <span className="font-medium">Giris Yap</span>
                  </Link>
                  <Link
                    href="/register"
                    className="btn-primary btn-md"
                  >
                    Kayit Ol
                  </Link>
                </>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-3 text-gray-700 hover:text-primary-500 hover:bg-gray-50 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar - Navigation */}
      <div className="bg-white border-b border-gray-200 shadow-header">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-8 h-14">
            {/* Categories Dropdown */}
            <div ref={categoryRef} className="relative">
              <button
                onClick={() => setCategoryMenuOpen(!categoryMenuOpen)}
                className="flex items-center gap-2 h-14 px-4 -ml-4 bg-secondary-900 text-white hover:bg-gray-800 transition-colors"
              >
                <LayoutGrid className="w-5 h-5" />
                <span className="font-medium">Kategoriler</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${categoryMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Categories Dropdown Menu */}
              {categoryMenuOpen && (
                <div className="absolute left-0 top-full w-64 bg-white rounded-b-lg shadow-dropdown border border-gray-100 py-2 animate-slide-down">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    return (
                      <Link
                        key={category.slug}
                        href={`/categories/${category.slug}`}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-primary-500 transition-colors group"
                        onClick={() => setCategoryMenuOpen(false)}
                      >
                        <Icon className="w-5 h-5 text-gray-400 group-hover:text-primary-500" />
                        <span>{category.name}</span>
                        <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    );
                  })}
                  <div className="border-t border-gray-100 mt-2 pt-2">
                    <Link
                      href="/categories"
                      className="flex items-center gap-3 px-4 py-3 text-primary-500 font-medium hover:bg-primary-50 transition-colors"
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
            <nav className="hidden md:flex items-center gap-8">
              <Link href="/products" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">
                Urunler
              </Link>
              <Link href="/stores" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">
                Magazalar
              </Link>
              <Link href="/cashback" className="flex items-center gap-1 text-gray-700 hover:text-primary-500 font-medium transition-colors">
                Cashback
                <span className="bg-primary-500 text-white text-xs px-1.5 py-0.5 rounded">%10</span>
              </Link>
              <Link href="/deals" className="text-gray-700 hover:text-primary-500 font-medium transition-colors">
                Firsatlar
              </Link>
            </nav>

            {/* Right side - Support */}
            <div className="hidden lg:flex items-center gap-2 ml-auto text-gray-600">
              <Phone className="w-5 h-5 text-primary-500" />
              <div>
                <p className="text-xs text-gray-500">7/24 Destek</p>
                <p className="font-semibold text-secondary-900">0212 123 45 67</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 animate-slide-down">
          <div className="container mx-auto px-4 py-4">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative flex">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Urun ara..."
                  className="w-full h-12 pl-4 pr-12 border border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 h-10 w-10 bg-primary-500 text-white rounded-md flex items-center justify-center"
                >
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Mobile Navigation */}
            <nav className="space-y-1">
              <Link
                href="/products"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <ShoppingCart className="w-5 h-5" />
                <span>Urunler</span>
              </Link>
              <Link
                href="/categories"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LayoutGrid className="w-5 h-5" />
                <span>Kategoriler</span>
              </Link>
              <Link
                href="/stores"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home className="w-5 h-5" />
                <span>Magazalar</span>
              </Link>
              <Link
                href="/cashback"
                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Wallet className="w-5 h-5" />
                <span>Cashback</span>
                <span className="bg-primary-500 text-white text-xs px-1.5 py-0.5 rounded ml-auto">%10</span>
              </Link>
              {!isAuthenticated && (
                <>
                  <div className="border-t border-gray-100 my-2" />
                  <Link
                    href="/login"
                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="w-5 h-5" />
                    <span>Giris Yap</span>
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-primary-500 text-white rounded-lg font-medium"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>Kayit Ol</span>
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
