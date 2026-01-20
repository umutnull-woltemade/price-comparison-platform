import { Hero } from '@/components/home/Hero'
import { CategoryBar } from '@/components/home/CategoryBar'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { DealsSection } from '@/components/home/DealsSection'
import { BrandsSection } from '@/components/home/BrandsSection'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Newsletter } from '@/components/home/Newsletter'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <Hero />

      {/* Category Bar */}
      <CategoryBar />

      {/* Featured Products */}
      <FeaturedProducts />

      {/* Deals / Flash Sale */}
      <DealsSection />

      {/* Popular Brands */}
      <BrandsSection />

      {/* How It Works */}
      <HowItWorks />

      {/* Newsletter CTA */}
      <Newsletter />
    </div>
  )
}
