import Link from 'next/link';
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  CreditCard,
  Shield,
  Truck,
  Headphones,
} from 'lucide-react';

const footerLinks = {
  popular: [
    { name: 'iPhone 15', href: '/search?q=iphone+15' },
    { name: 'Samsung Galaxy', href: '/search?q=samsung+galaxy' },
    { name: 'PlayStation 5', href: '/search?q=playstation+5' },
    { name: 'MacBook Air', href: '/search?q=macbook+air' },
    { name: 'AirPods Pro', href: '/search?q=airpods+pro' },
  ],
  categories: [
    { name: 'Elektronik', href: '/categories/elektronik' },
    { name: 'Bilgisayar', href: '/categories/bilgisayar' },
    { name: 'Telefon', href: '/categories/telefon' },
    { name: 'TV & Ses', href: '/categories/tv-ses' },
    { name: 'Ev & Yasam', href: '/categories/ev-yasam' },
  ],
  help: [
    { name: 'Yardim Merkezi', href: '/help' },
    { name: 'Nasil Calisir?', href: '/how-it-works' },
    { name: 'Cashback Rehberi', href: '/cashback-guide' },
    { name: 'Sikca Sorulan Sorular', href: '/faq' },
    { name: 'Iletisim', href: '/contact' },
  ],
  company: [
    { name: 'Hakkimizda', href: '/about' },
    { name: 'Blog', href: '/blog' },
    { name: 'Kariyer', href: '/careers' },
    { name: 'Gizlilik Politikasi', href: '/privacy' },
    { name: 'Kullanim Sartlari', href: '/terms' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-secondary-900 text-gray-300">
      {/* Features Bar */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Hizli Kargo</h4>
                <p className="text-sm text-gray-400">Magazalardan hizli teslimat</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Guvenli Alisveris</h4>
                <p className="text-sm text-gray-400">Guvenilir magazalar</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h4 className="font-semibold text-white">Cashback Kazan</h4>
                <p className="text-sm text-gray-400">%10&apos;a varan para iadesi</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                <Headphones className="w-6 h-6 text-primary-500" />
              </div>
              <div>
                <h4 className="font-semibold text-white">7/24 Destek</h4>
                <p className="text-sm text-gray-400">Her zaman yanindayiz</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-primary-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-2xl font-bold text-white">
                Fiyat<span className="text-primary-500">Radar</span>
              </span>
            </Link>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Turkiye&apos;nin en kapsamli fiyat karsilastirma platformu. Binlerce urun, yuzlerce magaza, tek platformda. En iyi fiyatlari bulun, cashback kazanin.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <a href="tel:+902121234567" className="flex items-center gap-3 text-gray-400 hover:text-primary-500 transition-colors">
                <Phone className="w-5 h-5" />
                <span>0212 123 45 67</span>
              </a>
              <a href="mailto:destek@fiyatradar.com" className="flex items-center gap-3 text-gray-400 hover:text-primary-500 transition-colors">
                <Mail className="w-5 h-5" />
                <span>destek@fiyatradar.com</span>
              </a>
              <div className="flex items-start gap-3 text-gray-400">
                <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                <span>Maslak, Sariyer, Istanbul, Turkiye</span>
              </div>
            </div>
          </div>

          {/* Popular Searches */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Populer Aramalar</h4>
            <ul className="space-y-3">
              {footerLinks.popular.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Kategoriler</h4>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help & Support */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Yardim</h4>
            <ul className="space-y-3">
              {footerLinks.help.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase text-sm tracking-wider">Sirket</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-primary-500 transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold mb-2">Firsatlardan haberdar olun</h4>
              <p className="text-gray-400 text-sm">En iyi firsatlari ve indirimleri kacirmayin</p>
            </div>
            <form className="flex w-full md:w-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="flex-1 md:w-80 h-12 px-4 bg-gray-800 border border-gray-700 rounded-l-md text-white placeholder:text-gray-500 focus:outline-none focus:border-primary-500"
              />
              <button
                type="submit"
                className="h-12 px-6 bg-primary-500 text-white rounded-r-md hover:bg-primary-600 transition-colors flex items-center gap-2 font-medium"
              >
                <span>Abone Ol</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-6">
            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              &copy; {new Date().getFullYear()} FiyatRadar. Tum haklari saklidir.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 hover:bg-primary-500 hover:text-white transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            {/* Payment Methods */}
            <div className="flex items-center gap-2">
              <span className="text-gray-500 text-sm mr-2">Odeme Yontemleri:</span>
              <div className="flex items-center gap-2">
                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-gray-400 text-xs font-medium">
                  VISA
                </div>
                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-gray-400 text-xs font-medium">
                  MC
                </div>
                <div className="w-10 h-6 bg-gray-800 rounded flex items-center justify-center text-gray-400 text-xs font-medium">
                  AMEX
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
