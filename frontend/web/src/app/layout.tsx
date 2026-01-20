import type { Metadata } from 'next'
import { Public_Sans } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

const publicSans = Public_Sans({
  subsets: ['latin'],
  variable: '--font-public-sans',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'FiyatRadar - En Iyi Fiyatlari Karsilastir, Cashback Kazan',
  description: 'Turkiye\'nin en kapsamli fiyat karsilastirma ve cashback platformu. Binlerce urun, yuzlerce magaza.',
  keywords: ['fiyat karsilastirma', 'cashback', 'online alisveris', 'indirim', 'en ucuz'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="tr" className={publicSans.variable}>
      <body className="min-h-screen bg-white font-sans">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
