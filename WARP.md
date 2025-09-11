# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

**billr** is a modern business management platform built with Next.js 15.5.2, React 19, and TypeScript. It features a responsive dashboard with animated UI components, focusing on business metrics visualization, payment tracking, and team management.

## Development Commands

### Core Development
- `npm run dev` - Start development server with Turbopack (faster builds)
- `npm run build` - Build production-ready application with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint for code linting

### Key Development Notes
- Development server runs on http://localhost:3000
- Uses Turbopack for faster builds in both dev and production
- ESLint is configured but set to ignore during builds
- No test suite currently configured
- TypeScript strict mode enabled with ES2017 target

## Architecture & Structure

### App Router Structure
- **App Directory**: `src/app/` - Next.js 15+ App Router with React 19
  - `layout.tsx` - Root layout with Geist and custom PP Neue Montreal fonts
  - `page.tsx` - Home page featuring HeroSection component
  - `ai-chart/page.tsx` - Dashboard analytics page with animated components
  - `globals.css` - Global styles using Tailwind CSS 4 inline theme configuration

### Component Architecture
- **UI Components**: `src/components/ui/` - Reusable shadcn/ui components
  - Follows shadcn/ui "new-york" style variant
  - Includes animated components (animated-card-diagram, animated-cart, interactive-visualization)
  - Button variants, cards, badges, navigation menus, dashboard switcher
  - Uses class-variance-authority for component variants
- **Magic UI**: `src/components/magicui/` - Advanced animated components
  - AnimatedBeam, AnimatedList, AnimatedShinyText
  - DotPattern, Globe, IconCloud, NumberTicker
  - OrbitingCircles with custom orbital animations
- **Feature Components**: Root level components for specific features
  - `hero-section.tsx` - Landing page hero with dashboard preview and switcher
  - `features-13.tsx`, `header.tsx` - Marketing/layout components
  - Illustration components (document, integrations, invoice, map, visualization)
- Lightweight SVG and CSS animations

### Font System
- **Primary**: PP Neue Montreal (custom local font) - Book (400), Medium (500), Bold (700)
- **Supporting**: Geist Sans and Geist Mono from Google Fonts
- Custom font utilities in globals.css for easy application

### Styling & Design System
- **Tailwind CSS 4** with inline theme configuration (not traditional config file)
- **shadcn/ui** component library with "new-york" style variant
- **Color scheme**: 
  - Brand colors: Orange (#F9620C, hsl(27 96% 61%))
  - Uses OKLCH color space for better color management
  - Full dark mode support with separate color definitions
- **Path aliases**: `@/` points to `src/` (components, lib, utils, hooks)

### Key Integrations
- **Framer Motion** (v12.23.12) - Animations and transitions
- **Lucide React** - Icon system
- **Radix UI** - Headless UI primitives (accordion, avatar, navigation-menu, slot)
- **class-variance-authority & clsx** - Conditional styling utilities
- **Cobe** - WebGL globe component
- **dotted-map** - Map visualizations
- **tw-animate-css** - Extended animation utilities

## Code Patterns

### Component Structure
- Client components marked with `"use client"` at the top
- TypeScript throughout with strict configuration
- Consistent use of Tailwind utility classes
- Path aliases configured: `@/components`, `@/lib/utils`, `@/hooks`
- Uses `cn()` utility from `@/lib/utils` for conditional classes (clsx + tailwind-merge)

### Styling Conventions
- Uses inline Tailwind CSS 4 theme configuration in globals.css
- Dark mode support with `dark:` prefixes and custom dark variant
- Responsive design with mobile-first approach
- Custom animation keyframes defined in CSS (orbit, shiny-text, appear-zoom, shine)
- Brand colors accessible via CSS variables (--brand, --brand-foreground)

### Data & State Management
- Mock data patterns in dashboard components (metrics, payments, team members)
- No external API integration currently
- Static data structures with TypeScript interfaces
- Local state management with React hooks

## Key Features

### Landing Page
- Hero section with PP Neue Montreal typography and gradient effects
- Dashboard preview with shine border effects and image vignetting
- DotPattern background with mask gradient
- Custom corner decorators and square elements
- Feature sections with animated components

### Dashboard Page (`/ai-chart`)
- Business metrics cards with NumberTicker animated counters
- Payment tracking with status badges and indicators
- Team member management interface with avatars
- OrbitingCircles animations for revenue visualization
- Responsive grid layouts for different screen sizes
- Mock chart placeholders for integration with charting libraries

## Development Guidelines

### Image Handling
- Next.js Image component with priority loading for hero images
- Remote image patterns configured for Cloudinary (res.cloudinary.com)
- Dashboard preview image located at `/dahsboard.jpg` (note: typo in filename)
- Uses proper aspect ratios and object-fit for responsive images

### Component Development
- Follow shadcn/ui patterns for new UI components
- Use TypeScript interfaces for component props
- Implement proper accessibility attributes (aria-hidden, role, etc.)
- Maintain consistent spacing and sizing using Tailwind scale
- Use class-variance-authority for component variants

### Animation Best Practices
- Leverage existing Magic UI components for complex animations
- Use Framer Motion for custom animations
- Custom CSS keyframes defined in globals.css for reusable animations
- NumberTicker for animated counters and metrics
- OrbitingCircles for circular motion effects

### Styling Best Practices
- Use semantic color names (primary, muted-foreground, brand, etc.)
- Implement proper hover states and transitions
- Support both light and dark modes with OKLCH color space
- Use responsive breakpoints (sm:, md:, lg:, xl:)
- Leverage CSS custom properties for dynamic theming
