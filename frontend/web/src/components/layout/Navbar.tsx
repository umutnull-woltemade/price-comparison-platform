'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, User, Heart, Bell, Search, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">FiyatKarşılaştır</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-primary-600 transition-colors">
              Ürünler
            </Link>
            <Link href="/categories" className="text-gray-700 hover:text-primary-600 transition-colors">
              Kategoriler
            </Link>
            <Link href="/stores" className="text-gray-700 hover:text-primary-600 transition-colors">
              Mağazalar
            </Link>
            <Link href="/cashback" className="text-gray-700 hover:text-primary-600 transition-colors">
              Cashback
            </Link>
          </div>

          {/* Right Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link href="/dashboard/favorites" className="text-gray-700 hover:text-primary-600 transition-colors">
                  <Heart className="w-5 h-5" />
                </Link>
                <Link href="/dashboard/alerts" className="text-gray-700 hover:text-primary-600 transition-colors">
                  <Bell className="w-5 h-5" />
                </Link>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors">
                    <User className="w-5 h-5" />
                    <span>{user?.firstName || 'Hesabım'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <Link href="/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Dashboard
                    </Link>
                    <Link href="/dashboard/profile" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Profilim
                    </Link>
                    <Link href="/dashboard/cashback" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Cashback
                    </Link>
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Çıkış Yap
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Giriş Yap
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-primary-600"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2">
            <Link href="/products" className="block py-2 text-gray-700 hover:text-primary-600">
              Ürünler
            </Link>
            <Link href="/categories" className="block py-2 text-gray-700 hover:text-primary-600">
              Kategoriler
            </Link>
            <Link href="/stores" className="block py-2 text-gray-700 hover:text-primary-600">
              Mağazalar
            </Link>
            <Link href="/cashback" className="block py-2 text-gray-700 hover:text-primary-600">
              Cashback
            </Link>
            {isAuthenticated ? (
              <>
                <Link href="/dashboard" className="block py-2 text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
                <Link href="/dashboard/favorites" className="block py-2 text-gray-700 hover:text-primary-600">
                  Favorilerim
                </Link>
                <Link href="/dashboard/alerts" className="block py-2 text-gray-700 hover:text-primary-600">
                  Fiyat Alarmları
                </Link>
                <button onClick={logout} className="block w-full text-left py-2 text-gray-700 hover:text-primary-600">
                  Çıkış Yap
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="block py-2 text-gray-700 hover:text-primary-600">
                  Giriş Yap
                </Link>
                <Link href="/register" className="block py-2 text-gray-700 hover:text-primary-600">
                  Kayıt Ol
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
