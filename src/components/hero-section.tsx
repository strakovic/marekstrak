"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button-toggle";
import { Magnet } from "@/components/ui/magnet-hover";
import HeroHeader from "@/components/header";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { cn } from "@/lib/utils";
import FeaturesSection from "@/components/features-13";
import ShinyText from "@/components/ui/shiny-text";
import ProximityText from "@/components/ui/proximity-text";

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
      <div className="relative rounded-3xl border border-black/5 bg-white/95 shadow-[0_10px_30px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-gray-900/95">

        <div className="flex w-full justify-center px-4 pt-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 p-1 dark:border-white/10 dark:bg-gray-800/90">
            {items.map((it) => {
              const selected = it.key === active;
              return (
                <button
                  key={it.key}
                  onClick={() => setActive(it.key)}
                  className={cn(
                    "px-3 py-1.5 text-sm font-medium rounded-full transition",
                    "hover:bg-black/5 dark:hover:bg-white/10",
                    selected && "bg-black text-white dark:bg-white dark:text-black"
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
          <div className="relative z-10 w-full overflow-hidden rounded-2xl border border-black/5 bg-white/80 shadow-md ring-1 ring-black/5 dark:border-white/10 dark:bg-white/10 dark:ring-white/10">
            <div className="relative aspect-[16/9]">
              <Image
                src={current.src}
                alt={current.title ?? current.label}
                fill
                className="object-cover"
                priority
              />
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.06)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,255,255,0.08)_100%)]" />
            </div>
          </div>

          {/* Bottom pill CTA */}
          <div className="relative z-10 mx-auto mt-4 flex w-fit items-center gap-2 rounded-full bg-black text-white px-4 py-2 text-sm shadow-lg dark:bg-white dark:text-black">
            <span>{current.title ?? current.label}</span>
            <a
              href="#learn-more"
              className="rounded-full bg-white/10 px-2 py-0.5 text-xs hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20"
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
  return (
    <>
      <HeroHeader />
      <main role="main" className="relative overflow-x-hidden pt-20">
        <section id="home">
          <div className="relative mx-auto max-w-5xl border-x px-6 xl:px-0 pb-10 pt-0 md:pb-16 md:pt-6">
            <DotPattern
              className="pointer-events-none absolute inset-0 z-0 text-foreground/10 [mask-image:radial-gradient(ellipse_60%_60%_at_center,black_30%,black_60%,transparent_90%)]"
              width={24}
              height={24}
              cx={2}
              cy={2}
              cr={1}
            />
            <div className="relative z-10">
              <div className="relative mx-auto w-fit bg-gray-950/5 p-2">
                <div aria-hidden={true} className="absolute left-1 top-1 size-[3px] rounded-full bg-black" />
                <div aria-hidden={true} className="absolute right-1 top-1 size-[3px] rounded-full bg-black" />
                <div aria-hidden={true} className="absolute bottom-1 left-1 size-[3px] rounded-full bg-black" />
                <div aria-hidden={true} className="absolute bottom-1 right-1 size-[3px] rounded-full bg-black" />
                <div className="relative flex h-fit items-center gap-2 rounded-full bg-white px-3 py-1 shadow overflow-visible">
                  {/* Animated orange circle with blurred shadow glow */}
                  <div className="relative flex items-center p-3 -m-3">
                    <style jsx>{`
                      @keyframes pulseShadow {
                        0%, 100% {
                          box-shadow: 0 0 2px 0 rgba(249, 98, 12, 0.3);
                        }
                        50% {
                          box-shadow: 0 0 12px 2px rgba(249, 98, 12, 0.6),
                                      0 0 6px 1px rgba(249, 98, 12, 0.8);
                        }
                      }
                    `}</style>
                    <div 
                      className="relative w-2 h-2 bg-[#F9620C] rounded-full"
                      style={{
                        boxShadow: '0 0 12px 2px rgba(249, 98, 12, 0.6)',
                        animation: 'pulseShadow 2s ease-in-out infinite',
                      }}
                    />
                  </div>
                  <ShinyText 
                    text="From 0 to Enterprise" 
                    className="text-title text-sm"
                    speed={6}
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
                      speed={6}
                    />
                    <span className="absolute bottom-0 left-0 w-full h-[1px] bg-current opacity-70 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
                  </a>
                </div>
              </div>
            </div>

            <div className="mx-auto mt-12 max-w-3xl text-center md:mt-16 relative">
              {/* Soft radial gradient background for better text readability */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_1000px_800px_at_center,rgba(250,250,250,0.9),transparent_70%)] dark:bg-[radial-gradient(ellipse_1000px_800px_at_center,rgba(255,255,255,0.15),transparent_70%)]" />
              <div className="relative z-10">
                <ProximityText 
                  text="The first and the last usage-based billing platform you'll ever need."
                  className="text-foreground text-balance text-4xl font-neue-montreal-bold sm:text-5xl lg:text-6xl"
                  radius={150}
                  maxScale={1.15}
                  falloff="gaussian"
                />
                <p className="mx-auto mb-12 mt-12 max-w-xl text-balance text-lg font-neue-montreal-book" style={{ color: '#0A0A0A' }}>
                  Billr gives you the power to experiment, scale, and evolve with a system <strong>flexible</strong> enough to support billing for <strong>pricing strategies</strong> you <strong>haven't even imagined</strong> <span className="font-neue-montreal-book">yet</span>.
                </p>
              </div>
              {/* Simple orange button matching header style with magnet hover effect */}
              <div className="relative z-10 flex items-center justify-center">
                <Magnet
                  padding={60}
                  magnetStrength={6}
                  activeTransition="transform 0.15s ease-out"
                  inactiveTransition="transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
                >
                  <Button asChild size="lg">
                    <Link href="#">
                      <span>Book a demo</span>
                    </Link>
                  </Button>
                </Magnet>
              </div>
            </div>
            </div>
          <div className="border-b relative min-h-[800px]">
            {/* Blurred glow effect - full width */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(1600px_1200px_at_center,rgba(0,72,124,0.35),transparent_80%)] blur-3xl" />
            </div>
            <div className="relative mx-auto max-w-5xl border-x px-6 xl:px-0 py-24 z-10">
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

// Dashboard image with scroll-based width expansion and headline reveal
function DashboardImage() {
  const [scale, setScale] = useState(0.85); // Start at 85% width
  const [translateY, setTranslateY] = useState(0); // For image moving down
  const [headlineY, setHeadlineY] = useState(90); // Headline starts lower, moves up
  const [headlineOpacity, setHeadlineOpacity] = useState(0); // Headline fades in
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the image has been scrolled
      // We want to track from when it enters the viewport to when it reaches the center
      const elementTop = rect.top;
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      
      let progress;
      
      if (elementTop > viewportCenter) {
        // Image is below center of viewport - start scaling up
        // Progress from 0 to 1 as image moves from bottom to center
        const distanceToTravel = windowHeight / 2;
        const currentDistance = elementTop - viewportCenter;
        progress = Math.max(0, Math.min(1, 1 - (currentDistance / distanceToTravel)));
      } else {
        // Image has passed center or is above center - keep at max size
        progress = 1;
      }
      
      // Scale from 0.85 (85%) to 1 (100%) based on scroll
      const newScale = 0.85 + (progress * 0.15);
      setScale(newScale);
      
      // Move image down slightly (0 to 30px)
      const imageTranslate = progress * 30;
      setTranslateY(imageTranslate);
      
      // Move headline up (from 90px to -10px) and fade in
      const headlineTranslate = 90 - (progress * 100);
      setHeadlineY(headlineTranslate);
      setHeadlineOpacity(progress);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial calculation
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full px-6 xl:px-0">
      {/* Animated headline that appears from behind */}
      <div 
        className="absolute inset-x-0 mx-auto text-center transition-all duration-500 ease-out z-0"
        style={{
          transform: `translateY(${headlineY}px)`,
          opacity: headlineOpacity,
          maxWidth: '1100px',
          top: '-60px'  // Position headline above dashboard
        }}
      >
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-neue-montreal-bold text-black dark:text-white px-6 leading-tight">
          Unmatched pricing flexibility across SaaS, AI, 3PL, healthcare and more.
        </h2>
      </div>
      
      {/* Dashboard image that moves down slightly */}
      <div 
        className="relative mx-auto mt-6 transition-all duration-300 ease-out z-10"
        style={{ 
          width: `${scale * 100}%`,
          maxWidth: '1280px',
          transform: `translateY(${translateY}px)`
        }}
      >
        <div className="relative w-full overflow-hidden rounded-2xl border border-black/5 bg-white/80 shadow-md ring-1 ring-black/5 dark:border-white/10 dark:bg-white/10 dark:ring-white/10">
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
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.06)_100%)] dark:bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(255,255,255,0.08)_100%)]" />
          </div>
        </div>
      </div>
    </div>
  );
}

