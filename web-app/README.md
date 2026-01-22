# HelmX Web App

A modern, responsive web application for HelmX - a smart motorcycle helmet platform. Built with Next.js 16, React 19, TypeScript, and Tailwind CSS.

## 🚀 Features

- Modern UI/UX: Built with shadcn/ui components and Radix UI primitives
- Responsive Design: Fully responsive layout that works on all devices
- Dark Mode Support: Theme switching with next-themes
- Type-Safe: Full TypeScript support
- Performance Optimized: Built on Next.js 16 with React 19

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- pnpm (recommended) or npm/yarn
- Git

## 🛠️ Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd web-app
   ```

2. Install dependencies
   ```bash
   # Using pnpm (recommended)
   pnpm install
   
   # Or using npm
   npm install
   
   # Or using yarn
   yarn install
   ```

## 🚦 Getting Started

### Development Mode

Run the development server:

```bash
# Using pnpm
pnpm dev

# Or using npm
npm run dev

# Or using yarn
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

### Build for Production

Create an optimized production build:

```bash
pnpm build
# or
npm run build
```

### Start Production Server

```bash
pnpm start
# or
npm start
```

### Linting

Run ESLint to check for code issues:

```bash
pnpm lint
# or
npm run lint
```

## 📁 Project Structure

```
web-app/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── header.tsx        # Header component
│   ├── hero.tsx          # Hero section
│   ├── features.tsx      # Features section
│   ├── tech-stack.tsx    # Tech stack section
│   ├── why-helmx.tsx     # Why HelmX section
│   ├── app-download.tsx  # App download section
│   └── footer.tsx        # Footer component
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
├── styles/               # Additional styles
├── components.json       # shadcn/ui configuration
├── next.config.mjs       # Next.js configuration
├── package.json          # Dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md            # This file
```

## 🎨 Tech Stack

### Core
- Next.js 16 - React framework with App Router
- React 19 - UI library
- TypeScript - Type safety

### Styling
- Tailwind CSS 4 - Utility-first CSS framework
- shadcn/ui - High-quality component library
- Radix UI - Unstyled, accessible component primitives
- next-themes - Dark mode support

### Forms & Validation
- React Hook Form - Form state management
- Zod - Schema validation
- @hookform/resolvers - Form validation resolvers

### UI Components
- Lucide React - Icon library
- Sonner - Toast notifications
- Recharts - Chart library
- Embla Carousel - Carousel component

### Development Tools
- ESLint - Code linting
- PostCSS - CSS processing
- TypeScript - Static type checking

## 📦 Key Dependencies

See `requirements.txt` for a complete list of all dependencies with versions.

### Production Dependencies
- `next` - Next.js framework
- `react` & `react-dom` - React library
- `@radix-ui/*` - UI component primitives
- `tailwindcss` - CSS framework
- `lucide-react` - Icons
- `next-themes` - Theme management

### Development Dependencies
- `typescript` - TypeScript compiler
- `@types/*` - TypeScript type definitions
- `tailwindcss` - CSS framework
- `postcss` - CSS processing

## 🔧 Configuration

### Next.js Config
The project uses a custom Next.js configuration (`next.config.mjs`):
- TypeScript build errors are ignored (for development)
- Images are unoptimized

### Tailwind CSS
Tailwind is configured via `components.json` and uses:
- CSS variables for theming
- New York style from shadcn/ui
- Custom animations via `tailwindcss-animate`

## 📝 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🌐 Deployment

This project can be deployed on various platforms:

### Vercel (Recommended)
1. Push your code to GitHub
2. Import your repository in Vercel
3. Vercel will automatically detect Next.js and deploy

### Other Platforms
The app can also be deployed on:
- Netlify
- AWS Amplify
- Any Node.js hosting platform

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is part of the FYP-CS-F22-NC-HelmX project.

## 👥 Authors

FYP-CS-F22-NC-HelmX Team

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for the amazing component library
- [Radix UI](https://www.radix-ui.com/) for accessible primitives
- [Next.js](https://nextjs.org/) for the excellent framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS

---

For more information, visit the project repository or contact the development team.
