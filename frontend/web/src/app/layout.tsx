import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'FiyatKarşılaştır - En İyi Fiyatları Karşılaştır',
  description: 'Türkiye\'nin en kapsamlı fiyat karşılaştırma ve cashback platformu',
  keywords: ['fiyat karşılaştırma', 'cashback', 'online alışveriş', 'indirim'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={inter.variable}>
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
