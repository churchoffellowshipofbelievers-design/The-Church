import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import FeaturesSection from '@/components/FeaturesSection'
import CommunitySection from '@/components/CommunitySection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <FeaturesSection />
      <CommunitySection />
      <ContactSection />
      <Footer />
    </main>
  )
}
