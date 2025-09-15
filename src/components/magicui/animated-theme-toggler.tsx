"use client";

import { Moon, SunDim } from "lucide-react";
import React, { useState, useRef } from "react";
import { useTheme } from "next-themes";
import { flushSync } from "react-dom";
import { cn } from "@/lib/utils";

type props = {
  className?: string;
};

export const AnimatedThemeToggler = ({ className }: props) => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  
  // Initialize theme state on mount
  React.useEffect(() => {
    setMounted(true);
  }, []);
  
  const changeTheme = async () => {
    if (!buttonRef.current || !mounted) return;

    const newTheme = theme === "light" ? "dark" : "light";

    // Check if View Transitions API is supported
    if (!('startViewTransition' in document)) {
      // Fallback to immediate theme change
      setTheme(newTheme);
      return;
    }

    try {
      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setTheme(newTheme);
        });
      });

      await transition.ready;

      const { top, left, width, height } =
        buttonRef.current.getBoundingClientRect();
      const y = top + height / 2;
      const x = left + width / 2;

      const right = window.innerWidth - left;
      const bottom = window.innerHeight - top;
      const maxRad = Math.hypot(Math.max(left, right), Math.max(top, bottom));

      document.documentElement.animate(
        {
          clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRad}px at ${x}px ${y}px)`,
          ],
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    } catch (error) {
      // Fallback if view transition fails
      console.error('View transition failed:', error);
      setTheme(newTheme);
    }
  };
  
  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return (
      <button 
        className={cn(
          "p-2 rounded-md transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          className
        )}
        aria-label="Toggle theme"
      >
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
