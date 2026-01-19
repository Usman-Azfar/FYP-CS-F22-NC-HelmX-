import { Badge } from "@/components/ui/badge"

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-lg">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-primary to-accent transition-all hover:scale-110 hover:shadow-lg hover:shadow-primary/50">
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

        <nav className="hidden items-center gap-6 md:flex">
          <a
            href="#features"
            className="relative text-sm text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Features
          </a>
          <a
            href="#technology"
            className="relative text-sm text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Technology
          </a>
          <a
            href="#about"
            className="relative text-sm text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            About
          </a>
          <a
            href="#download"
            className="relative text-sm text-muted-foreground transition-colors hover:text-foreground after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
          >
            Download
          </a>
        </nav>

        <Badge variant="outline" className="border-primary/50 bg-primary/10 text-primary">
          <span className="relative mr-2 flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </span>
          Available Now
        </Badge>
      </div>
    </header>
  )
}
