import { Header } from "@/components/header"
import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { TechStack } from "@/components/tech-stack"
import { WhyHelmX } from "@/components/why-helmx"
import { AppDownload } from "@/components/app-download"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <Features />
      <TechStack />
      <WhyHelmX />
      <AppDownload />
      <Footer />
    </main>
  )
}
