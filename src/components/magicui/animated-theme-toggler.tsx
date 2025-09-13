"use client";

import { Moon, SunDim } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

type props = {
  className?: string;
};

export const AnimatedThemeToggler = ({ className }: props) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const changeTheme = async () => {
    if (!buttonRef.current || !mounted) return;

    const isCurrentlyDark = theme === "dark";
    const nextTheme = isCurrentlyDark ? "light" : "dark";

    // Check if browser supports View Transitions API
    if (!('startViewTransition' in document)) {
      // Fallback to simple theme change
      setTheme(nextTheme);
      return;
    }

    // Get button position before transition
    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect();
    const x = left + width / 2;
    const y = top + height / 2;

    // Calculate the maximum radius needed to cover the screen
    const right = window.innerWidth - left;
    const bottom = window.innerHeight - top;
    const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

    // Start the view transition
    try {
      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setTheme(nextTheme);
        });
      });

      await transition.ready;

      // Always animate the new view expanding from the button
      // This ensures consistency across both transitions
      document.documentElement.animate(
        { 
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRad}px at ${x}px ${y}px)`,
          ]
        },
        {
          duration: 600,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    } catch (e) {
      // Fallback if view transition fails
      console.error('View transition failed:', e);
      setTheme(nextTheme);
    }
  };

  // Show loading state while mounting
  if (!mounted) {
    return (
      <button className={cn("p-2", className)}>
        <SunDim className="h-[1.2rem] w-[1.2rem]" />
      </button>
    );
  }

  return (
    <button 
      ref={buttonRef} 
      onClick={changeTheme} 
      className={cn(
        "p-2 rounded-md transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        className
      )}
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <SunDim className="h-[1.2rem] w-[1.2rem]" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
    </button>
  );
};
