import { Navbar } from '@/components/layout/Navbar'
import { Hero } from '@/components/home/Hero'
import { SearchBar } from '@/components/search/SearchBar'
import { FeaturedProducts } from '@/components/home/FeaturedProducts'
import { PopularCategories } from '@/components/home/PopularCategories'
import { HowItWorks } from '@/components/home/HowItWorks'
import { Stats } from '@/components/home/Stats'
import { Footer } from '@/components/layout/Footer'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main>
        {/* Hero Section */}
        <Hero />

        {/* Search Bar */}
        <section className="bg-white py-8 shadow-sm">
          <div className="container mx-auto px-4">
            <SearchBar />
          </div>
        </section>

        {/* Stats */}
        <Stats />

        {/* Featured Products */}
        <FeaturedProducts />

        {/* Popular Categories */}
        <PopularCategories />

        {/* How It Works */}
        <HowItWorks />
      </main>

      <Footer />
    </div>
  )
}
