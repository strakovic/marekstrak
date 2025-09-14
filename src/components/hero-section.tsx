"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button-toggle";
import { Magnet } from "@/components/ui/magnet-hover";
import HeroHeader from "@/components/header";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import FeaturesSection from '@/components/features-13'
import { motion } from 'framer-motion'
import ShinyText from "@/components/ui/shiny-text";
import ProximityText from "@/components/ui/proximity-text";
import { usePerformance } from "@/hooks/use-performance";

// Simple button styles matching the header button

type SwitchItem = {
  key: string;
  label: string;
  src: string;
  title?: string;
  description?: string;
};

function DashboardSwitcher({
  items,
  className,
}: {
  items: SwitchItem[];
  className?: string;
}) {
  const [active, setActive] = useState(items[0]?.key);
  const current = items.find((i) => i.key === active) ?? items[0];

  return (
    <div className={cn("relative w-full", className)}>
      <div className="relative rounded-3xl border border-[#111621]/5 bg-white/95 shadow-[0_10px_30px_rgba(17,22,33,0.05)] dark:border-white/10 dark:bg-[oklch(0.15_0.025_251)]">

        <div className="flex w-full justify-center px-4 pt-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#111621]/10 bg-white/95 p-1 dark:border-white/10 dark:bg-[oklch(0.18_0.03_251)]">
            {items.map((it) => {
              const selected = it.key === active;
              return (
                <button
                  key={it.key}
                  onClick={() => setActive(it.key)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full transition",
                    "hover:bg-[#111621]/5 dark:hover:bg-white/10",
                    selected && "bg-[#111621] text-white dark:bg-white dark:text-[#111621]"
                  )}
                >
                  {it.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="relative mx-auto mt-4 w-full max-w-5xl px-4 pb-10">

          {/* DASHBOARD FRAME (stays centered above the band) */}
          <div className="relative z-10 w-full overflow-hidden rounded-2xl border border-[#111621]/5 bg-white/80 shadow-md ring-1 ring-[#111621]/5 dark:border-white/10 dark:bg-[oklch(0.15_0.025_251)] dark:ring-white/10">
            <div className="relative aspect-[16/9]">
              <Image
                src={current.src}
                alt={current.title ?? current.label}
                fill
                className="object-cover"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(17,22,33,0.06)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,255,255,0.08)_100%)]" />
            </div>
          </div>

          {/* Bottom pill CTA */}
          <div className="relative z-10 mx-auto mt-4 flex w-fit items-center gap-2 rounded-full bg-[#111621] text-white px-4 py-2 text-sm shadow-lg dark:bg-white dark:text-[#111621]">
            <span>{current.title ?? current.label}</span>
            <a
              href="#learn-more"
              className="rounded-full bg-white/10 px-2 py-0.5 text-xs hover:bg-white/20 dark:bg-[#111621]/10 dark:hover:bg-[#111621]/20"
            >
              Learn more
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const { shouldReduceAnimations, shouldPauseAnimations } = usePerformance();
  
  // Ensure page always starts at top on mount/refresh
  useEffect(() => {
    // Force scroll to top on component mount (handles client-side navigation and refresh)
    window.scrollTo(0, 0);
    
    // Set scroll restoration to manual to prevent browser from jumping to previous position
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);
  
  return (
    <>
      <HeroHeader />
      <main 
        role="main" 
        className={cn(
          "relative overflow-x-hidden pt-20",
          shouldPauseAnimations && "performance-mode"
        )}
        data-paused={shouldPauseAnimations}
      >
        <section id="home">
          <div className="relative mx-auto max-w-5xl border-x px-6 xl:px-0 pb-10 pt-0 md:pb-16 md:pt-6">
            <DotPattern
              className="pointer-events-none absolute inset-0 z-0 text-foreground/10 [mask-image:radial-gradient(ellipse_60%_60%_at_center,#111621_30%,#111621_60%,transparent_90%)]"
              width={24}
              height={24}
              cx={2}
              cy={2}
              cr={1}
              static={shouldReduceAnimations}
              maxDots={shouldReduceAnimations ? 200 : 500}
            />
            <div className="relative z-10">
              <div className="relative mx-auto w-fit bg-[#111621]/5 dark:bg-[oklch(0.18_0.03_251)] p-2">
                <div aria-hidden={true} className="absolute left-1 top-1 size-[3px] rounded-full bg-[#111621] dark:bg-white" />
                <div aria-hidden={true} className="absolute right-1 top-1 size-[3px] rounded-full bg-[#111621] dark:bg-white" />
                <div aria-hidden={true} className="absolute bottom-1 left-1 size-[3px] rounded-full bg-[#111621] dark:bg-white" />
                <div aria-hidden={true} className="absolute bottom-1 right-1 size-[3px] rounded-full bg-[#111621] dark:bg-white" />
                <div className="relative flex h-fit items-center gap-2 rounded-full bg-white dark:bg-[oklch(0.11_0.02_251)] px-3 py-1 overflow-visible">
                  {/* Animated orange circle with blurred shadow glow */}
                  <div className="relative flex items-center p-3 -m-3">
                    <div className="relative w-2 h-2 bg-[#F9620C] rounded-full" />
                  </div>
                  <ShinyText 
                    text="From 0 to Enterprise" 
                    className="text-title text-sm"
                    speed={12}
                    disabled={true}
                  />
                  <span className="block h-3 w-px bg-gray-200" />
                  <a 
                    href="#features" 
                    className="group relative text-primary text-sm transition-all cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById('features')?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                      });
                    }}
                  >
                    <ShinyText 
                      text="Learn how" 
                      className="text-primary text-sm"
                      speed={12}
                      disabled={true}
                    />
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-current opacity-70 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-8 max-w-full px-2 sm:px-4 sm:max-w-3xl text-center md:mt-16 relative">
              <div className="relative z-10">
                <div className="relative">
                  <ProximityText 
                    text="The first and the last usage-based billing platform you'll ever need."
                    className="text-foreground text-[1.75rem] font-neue-montreal-bold sm:text-4xl md:text-5xl lg:text-6xl cursor-default leading-tight sm:text-balance md:leading-tight lg:leading-[1.1] inline"
                    radius={70}
                    maxScale={1.04}
                    falloff="gaussian"
                    enabled={false}
                  />
                </div>
                <p className="mx-auto mb-12 sm:mb-8 mt-10 sm:mt-16 max-w-xl px-6 sm:px-0 text-balance text-sm sm:text-base md:text-lg font-neue-montreal-book text-gray-900 dark:text-gray-300">
                  Billr gives you the power to experiment, scale, and evolve with a system <strong>flexible</strong> enough to support billing for <strong>pricing strategies</strong> you <strong>haven't even imagined</strong> <span className="font-neue-montreal-book">yet</span>.
                </p>
              </div>
              {/* Simple orange button without magnetic effect */}
              <div className="relative z-10 flex items-center justify-center">
                <Button asChild size="lg">
                  <Link href="#">
                    <span>Book a demo</span>
                  </Link>
                </Button>
              </div>
            </div>
            </div>
            
          <div className="relative min-h-[450px] sm:min-h-[500px] md:min-h-[600px] lg:min-h-[700px] z-10 mt-8 md:mt-12">
            {/* Orange background - mobile and desktop */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-[#F9620C]" />
              {/* White blur effect on desktop only */}
              <div className="absolute inset-0 bg-[radial-gradient(1600px_1200px_at_center,rgba(255,255,255,0.3),transparent_80%)] blur-3xl hidden md:block" />
            </div>
            <div className="relative mx-auto max-w-5xl px-6 md:px-6 lg:px-0 py-12 md:py-32 z-20 mt-8 mobile-dashboard-container">
              {/* Dashboard image display */}
              <DashboardImage />

            </div>
          </div>
        </section>

        <FeaturesSection />
      </main>
    </>
  );
}

// Industry Tags Component - Redesigned with colored squares
function IndustryTags() {
  const industries = [
    { name: 'AI', color: '#8B5CF6' }, // Purple for AI/tech
    { name: 'SaaS', color: '#3B82F6' }, // Blue for SaaS/cloud
    { name: '3PL', color: '#F59E0B' }, // Orange for logistics/shipping
    { name: 'Healthcare', color: '#EF4444' }, // Red for healthcare
    { name: 'Telecom', color: '#10B981' }, // Green for telecom/connectivity
    { name: 'Logistics', color: '#F97316' }, // Orange for logistics
    { name: 'Energy', color: '#FACC15' } // Yellow for energy
  ];
  
  return (
    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2 max-w-2xl mx-auto px-4 sm:px-0 -mt-0.5">
      {industries.map((industry, index) => {
        return (
          <motion.div
            key={industry.name}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{
              duration: 0.5,
              delay: index * 0.08,
              ease: "easeOut"
            }}
            whileHover={{ 
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
            className="group"
          >
            <div className="relative">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#111621] backdrop-blur-sm rounded-full text-[13px] md:text-[14px] font-neue-montreal-medium text-white hover:text-white transition-colors duration-300 cursor-default">
                <div 
                  className="w-1.5 h-1.5 shrink-0" 
                  style={{ backgroundColor: industry.color }}
                />
                <span>{industry.name}</span>
              </div>
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#111621]/15 to-[#111621]/8 dark:from-white/15 dark:to-white/8 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-sm" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

// Mobile Dashboard with Scroll Animation like Desktop
function MobileDashboardPanner() {
  const [scale, setScale] = useState(0.85); // Start smaller for bigger scaling effect
  const [translateY, setTranslateY] = useState(0); // For moving image down
  const [mobileHeadlineY, setMobileHeadlineY] = useState(60); // Mobile headline starts at 60px, independent from desktop
  const [mobileHeadlineOpacity, setMobileHeadlineOpacity] = useState(0); // Mobile headline fades in
  const [isMounted, setIsMounted] = useState(false); // Track client-side mounting
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    setIsMounted(true);
    if (typeof window === 'undefined') return;
    
    // Ensure we start at the top when component mounts
    window.scrollTo(0, 0);
    
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;
      
        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        // Calculate progress based on element position
        const elementTop = rect.top;
        const viewportCenter = windowHeight / 2;
        
        // Start animation immediately when user starts scrolling from top of page
        const scrollY = window.scrollY;
        const maxScroll = windowHeight * 0.5; // Animation completes after half screen length
        let progress = Math.min(1, scrollY / maxScroll); // 0 to 1 based on total page scroll
        
      // Scale from 0.85 to 1.05 for smaller final size with margins
        const newScale = 0.85 + (progress * 0.20);
        setScale(newScale);
        
      // Move image down more (0 to 40px)
        const imageTranslate = progress * 40;
        setTranslateY(imageTranslate);
        
        // Move mobile headline up and fade in - independent settings
        const mobileTextProgress = Math.min(1, progress * 1.1); // Slightly different timing for mobile
        const mobileHeadlineTranslate = 60 - (mobileTextProgress * 140); // Mobile: start at 60px, move to -80px (slightly lower final position)
        setMobileHeadlineY(mobileHeadlineTranslate);
        setMobileHeadlineOpacity(mobileTextProgress);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Initial calculation
    const timeoutId = setTimeout(() => {
      handleScroll();
    }, 0);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Show initial state during SSR/mounting to prevent image jumping
  if (!isMounted) {
    return (
      <div className="relative px-4 mt-14 min-h-[400px]">
        {/* Static headline for SSR */}
        <div className="absolute inset-x-0 mx-auto text-center z-0" style={{ transform: 'translateY(60px)', opacity: 0, top: '-15px' }}>
          <h2 className="text-[28px] font-neue-montreal-bold text-white mb-2">
            Made for Every Industry
          </h2>
          <IndustryTags />
        </div>
        
        {/* Static dashboard image for SSR - positioned to match initial mounted state */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-[oklch(0.15_0.025_251)] mt-12 mx-[1px]" style={{ transform: 'scale(0.85) translateY(0px)', willChange: 'transform' }}>
          <div className="relative aspect-[16/9]">
            <Image
              src="/dahsboard.jpg"
              alt="Dashboard"
              fill
              className="object-cover"
              priority
              sizes="100vw"
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative px-4 mt-14 min-h-[400px]">
      {/* Animated headline that appears from behind */}
      <div 
        className="absolute inset-x-0 mx-auto text-center transition-all duration-500 ease-out z-0"
        style={{
          transform: `translateY(${mobileHeadlineY}px)`,
          opacity: mobileHeadlineOpacity,
          top: '-15px'
        }}
      >
        <h2 className="text-[28px] font-neue-montreal-bold text-white mb-2">
          Made for Every Industry
        </h2>
        <IndustryTags />
      </div>
      
      {/* Dashboard image that scales up and moves down on scroll */}
      <div 
        className="relative rounded-2xl overflow-hidden shadow-sm bg-white dark:bg-[oklch(0.15_0.025_251)] transition-all duration-500 ease-out will-change-transform mt-12 mx-[1px]"
        style={{
          transform: `scale(${scale}) translateY(${translateY}px)`,
          willChange: 'transform'
        }}
      >
        <div className="relative aspect-[16/9]">
          <Image
            src="/dahsboard.jpg"
            alt="Dashboard"
            fill
            className="object-cover"
            priority
            sizes="100vw"
            quality={90}
            placeholder="blur"
            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
          />
        </div>
      </div>
    </div>
  );
}

// Dashboard image with scroll-based width expansion and headline reveal
function DashboardImage() {
  const [translateY, setTranslateY] = useState(0); // For image moving down
  const [scale, setScale] = useState(0.9); // Start smaller for scaling effect
  const [desktopHeadlineY, setDesktopHeadlineY] = useState(70); // Desktop headline starts higher, moves up
  const [desktopHeadlineOpacity, setDesktopHeadlineOpacity] = useState(0); // Desktop headline fades in
  const [isReady, setIsReady] = useState(false); // Prevent initial jump by fading in after first calc
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // Track client-side mounting
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const isScrollingRef = useRef(false);

  useEffect(() => {
    // Set mounted state and check if mobile on mount
    setIsMounted(true);
    setIsMobile(window.innerWidth < 768);
    
    // Only run scroll handling on the client side
    if (typeof window === 'undefined') return;
    
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      
      rafRef.current = requestAnimationFrame(() => {
        if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the image has been scrolled
      // We want to track from when it enters the viewport to when it reaches the center
      const elementTop = rect.top;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      
      // Start animation immediately when user starts scrolling from top of page (desktop)
      const scrollY = window.scrollY;
      const maxScroll = windowHeight * 0.5; // Animation completes after half screen length
      let progress = Math.min(1, scrollY / maxScroll); // 0 to 1 based on total page scroll
      
      // Scale image from 0.9 to 1.0 to stay within grey line boundaries
      const minScale = 0.9;
      const maxScale = 1.0;
      const newScale = minScale + (progress * (maxScale - minScale));
      setScale(newScale);
      
      // Move image with a higher starting point on initial page load, but same final position
      const isDesktop = window.innerWidth >= 1024;
      const imageTranslateStart = isDesktop ? -8 : -4; // reduced starting offset
      const imageTranslateEnd = 15; // reduced final position for less downward movement
      const baseTranslate = imageTranslateStart + progress * (imageTranslateEnd - imageTranslateStart);

      // Apply an initial lift that decays over the first ~120px of scroll
      const LIFT_DECAY_SCROLL = 120; // px window over which the lift goes to 0
      const rawLift = isDesktop ? 16 : 8; // px upward lift on initial load
      const decay = 1 - Math.min(1, window.scrollY / LIFT_DECAY_SCROLL);
      const initialLift = rawLift * decay; // 16px/8px at top, 0px after ~120px scroll

      const imageTranslate = baseTranslate - initialLift;
      setTranslateY(imageTranslate);
      
        // Move desktop headline up and fade in - independent settings
        const desktopTextProgress = Math.min(1, progress * 1.2); // Desktop timing
        const desktopHeadlineTranslate = 70 - (desktopTextProgress * 90); // Desktop: start at 70px, move to -20px (slightly lower final position)
        setDesktopHeadlineY(desktopHeadlineTranslate);
        setDesktopHeadlineOpacity(desktopTextProgress);
        
        // Ensure the first frame is computed before showing the element
        setIsReady(true);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Wait for initial rendering and then calculate
    // This avoids the hydration mismatch
    const timeoutId = setTimeout(() => {
      handleScroll();
    }, 0);
    
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  // Render mobile panner on small screens - only after mounting to prevent hydration issues
  if (isMounted && typeof window !== 'undefined' && window.innerWidth < 768) {
    return <MobileDashboardPanner />;
  }
  
  // Return null during SSR to prevent hydration mismatch
  if (!isMounted) {
    return null;
  }

  return (
    <div ref={containerRef} className="relative w-full px-6 lg:px-0">
      {/* Animated headline that appears from behind - hidden on mobile */}
      <div 
        className="absolute inset-x-0 mx-auto text-center transition-all duration-500 ease-out z-0 hidden md:block"
        style={typeof window === 'undefined' ? {
          // During SSR, use static values to avoid hydration mismatch
          transform: 'translateY(120px)',
          opacity: 0,
          maxWidth: '1100px',
          top: '20px'  // Position headline above dashboard - even lower on mobile/tablet
        } : {
          // On client, use dynamic values
          transform: `translateY(${desktopHeadlineY}px)`,
          opacity: desktopHeadlineOpacity,
          maxWidth: '1100px',
          top: typeof window !== 'undefined' && window.innerWidth >= 1024 ? '-70px' : '20px' // Even lower on mobile/tablet
        }}
      >
        <h2 className="text-2xl md:text-4xl lg:text-5xl font-neue-montreal-bold text-white px-6 leading-tight">
          Made for Every Industry
        </h2>
        
        {/* Industry Tags */}
        <div className="mt-4">
          <IndustryTags />
        </div>
      </div>
      
      {/* Dashboard image that moves down slightly - hidden on mobile */}
      <div 
        className={cn(
          "relative mt-6 lg:mt-4 transition-all duration-500 ease-out z-10 w-[120%] sm:w-[105%] md:w-[100%] lg:w-full opacity-0 hidden md:block will-change-transform",
          "mx-auto left-1/2 -translate-x-1/2", // Force center alignment on mobile
          isReady && "opacity-100"
        )}
        style={{
          maxWidth: '1280px',
          willChange: 'transform',
          transform: typeof window !== 'undefined' ? `translateY(${translateY}px) scale(${scale})` : 'translateY(0px) scale(1)'
        }}
      >
<div className="relative w-full overflow-hidden rounded-2xl bg-white/80 shadow-md dark:bg-[oklch(0.15_0.025_251)]">
          <div className="relative w-full">
            <Image
              src="/dahsboard.jpg"
              alt="Billr Dashboard"
              width={1200}
              height={675}
              className="w-full h-auto object-cover"
              priority
            />
            {/* Soft inner vignette */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(17,22,33,0.06)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,255,255,0.08)_100%)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

