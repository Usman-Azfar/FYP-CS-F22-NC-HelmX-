"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"
import { useEffect, useState } from "react"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    setIsVisible(true)

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-32">
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-primary/20 blur-3xl transition-transform duration-1000"
          style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}
        ></div>
        <div
          className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-accent/20 blur-3xl transition-transform duration-1000"
          style={{ transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)` }}
        ></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm text-primary transition-all duration-700 hover:scale-105 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/20 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            <Sparkles className="h-3 w-3 animate-pulse" />
            AI Powered Smart Helmet
          </div>

          <h1
            className={`mb-6 text-balance text-5xl font-bold tracking-tight transition-all duration-700 delay-100 md:text-7xl ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            Redefining Motorcycle Safety Through{" "}
            <span className="relative inline-block bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent animate-shimmer">
              Artificial Intelligence
            </span>
          </h1>

          <p
            className={`mb-10 text-pretty text-lg leading-relaxed text-muted-foreground transition-all duration-700 delay-200 md:text-xl ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            HelmX combines AI, IoT sensors, and cloud computing to create a fully integrated safety ecosystem. Making
            every ride smarter, safer, and more connected.
          </p>

          <div
            className={`flex flex-col items-center justify-center gap-4 transition-all duration-700 delay-300 sm:flex-row ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <Button
              size="lg"
              className="group relative overflow-hidden bg-primary transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/50"
            >
              <span className="relative z-10">Explore Features</span>
              <ArrowRight className="relative z-10 ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="group bg-transparent transition-all hover:scale-105 hover:border-primary hover:bg-primary/5"
            >
              Watch Demo
            </Button>
          </div>

          <div
            className={`mt-16 grid grid-cols-2 md:flex md:flex-row items-center justify-center gap-4 md:gap-8 text-sm text-muted-foreground transition-all duration-700 delay-500 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <div className="group flex flex-col items-center gap-1 transition-all hover:scale-110 hover:text-primary rounded-lg border border-border/40 bg-card/50 p-4">
              <span className="text-2xl font-bold text-primary transition-colors group-hover:text-primary">98.5%</span>
              <span className="text-center">AI Accuracy</span>
            </div>
            <div className="group flex flex-col items-center gap-1 transition-all hover:scale-110 hover:text-primary rounded-lg border border-border/40 bg-card/50 p-4">
              <span className="text-2xl font-bold text-primary transition-colors group-hover:text-primary">
                {"<2s"}
              </span>
              <span className="text-center">Response Time</span>
            </div>
            <div className="group flex flex-col items-center gap-1 transition-all hover:scale-110 hover:text-primary rounded-lg border border-border/40 bg-card/50 p-4">
              <span className="text-2xl font-bold text-primary transition-colors group-hover:text-primary">95%</span>
              <span className="text-center">Crash Detection</span>
            </div>
            <div className="group flex flex-col items-center gap-1 transition-all hover:scale-110 hover:text-primary rounded-lg border border-border/40 bg-card/50 p-4">
              <span className="text-2xl font-bold text-primary transition-colors group-hover:text-primary">24/7</span>
              <span className="text-center">Monitoring</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
