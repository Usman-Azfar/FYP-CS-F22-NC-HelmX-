"use client"

import { useState } from "react"

export function Footer() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null)

  return (
    <footer className="border-t border-border/40 bg-card py-12">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="mb-4 flex items-center gap-2 transition-transform hover:scale-105">
              <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg">
                <img
                  src="/futuristic-motorcycle-helmet-icon-minimal.jpg"
                  alt="HelmX Logo"
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-xl font-bold text-transparent">
                HelmX
              </span>
            </div>
            <p className="mb-4 max-w-md text-sm leading-relaxed text-muted-foreground">
              AI-powered smart helmet designed to make riding safer, smarter, and more connected. A collaboration of BS
              CS students from the University of the Punjab.
            </p>
            <p className="text-sm text-muted-foreground">© 2025 HelmX. The future of safe riding starts now.</p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">Product</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Features", "Technology", "Download App"].map((item, index) => (
                <li key={index}>
                  <a
                    href={`#${item.toLowerCase().replace(" ", "-")}`}
                    onMouseEnter={() => setHoveredLink(item)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={`relative inline-block transition-all duration-300 hover:text-primary hover:translate-x-1 ${
                      hoveredLink === item ? "text-primary translate-x-1" : ""
                    }`}
                  >
                    {item}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                        hoveredLink === item ? "w-full" : "w-0"
                      }`}
                    ></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold">About</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["Why HelmX", "Team", "Contact"].map((item, index) => (
                <li key={index}>
                  <a
                    href={item === "Why HelmX" ? "#about" : "#"}
                    onMouseEnter={() => setHoveredLink(item)}
                    onMouseLeave={() => setHoveredLink(null)}
                    className={`relative inline-block transition-all duration-300 hover:text-primary hover:translate-x-1 ${
                      hoveredLink === item ? "text-primary translate-x-1" : ""
                    }`}
                  >
                    {item}
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
                        hoveredLink === item ? "w-full" : "w-0"
                      }`}
                    ></span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p className="transition-all hover:text-primary hover:scale-105">
            Built with AI, designed for safety. Powered by innovation.
          </p>
        </div>
      </div>
    </footer>
  )
}
