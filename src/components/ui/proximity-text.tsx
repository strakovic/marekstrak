"use client";

import { forwardRef, useRef, useEffect, useState, useMemo, useCallback } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ProximityTextProps {
  text: string;
  className?: string;
  radius?: number;
  maxScale?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
  enabled?: boolean;
}

// Throttle function for performance
function throttle<T extends (...args: any[]) => any>(func: T, delay: number): T {
  let timeoutId: NodeJS.Timeout | null = null;
  let lastExecTime = 0;
  return ((...args: any[]) => {
    const currentTime = Date.now();
    
    if (currentTime - lastExecTime > delay) {
      func(...args);
      lastExecTime = currentTime;
    } else {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
        lastExecTime = Date.now();
      }, delay - (currentTime - lastExecTime));
    }
  }) as T;
}

function useMousePositionRef() {
  const positionRef = useRef({ x: 0, y: 0 });
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    // Throttle mouse movement to 60fps max
    const handleMouseMove = throttle((ev: MouseEvent) => {
      positionRef.current = { x: ev.clientX, y: ev.clientY };
      if (!isActive) setIsActive(true);
    }, 16); // ~60fps

    const handleTouchMove = throttle((ev: TouchEvent) => {
      const touch = ev.touches[0];
      positionRef.current = { x: touch.clientX, y: touch.clientY };
      if (!isActive) setIsActive(true);
    }, 16);

    // Add mouse leave to pause animations when not needed
    const handleMouseLeave = () => {
      setIsActive(false);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isActive]);

  return { positionRef, isActive };
}

const ProximityText = forwardRef<HTMLDivElement, ProximityTextProps>((props, ref) => {
  const {
    text,
    className,
    radius = 120,
    maxScale = 1.3,
    falloff = 'gaussian',
    enabled = false, // Disabled by default to save GPU
    ...restProps
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const { positionRef: mousePositionRef, isActive } = useMousePositionRef();
  const [letterScales, setLetterScales] = useState<number[]>([]);
  const [letterColors, setLetterColors] = useState<string[]>([]);
  const [isInView, setIsInView] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => 
    Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const calculateFalloff = (distance: number) => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloff) {
      case 'exponential':
        return norm ** 2;
      case 'gaussian':
        return Math.exp(-((distance / (radius / 3)) ** 2) / 2);
      case 'linear':
      default:
        return norm;
    }
  };

  // Helper function to interpolate colors
  const interpolateColor = (falloffValue: number) => {
    // From black (0, 0, 0) to orange (#F9620C)
    const r = Math.round(falloffValue * 249);
    const g = Math.round(falloffValue * 98);
    const b = Math.round(falloffValue * 12);
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Check if character is punctuation (period, exclamation, question mark)
  const isPunctuation = (char: string) => /[.!?]/.test(char);

  const words = useMemo(() => text.split(' '), [text]);

  // Track mounted state to prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Intersection observer to only animate when visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Skip all animation logic if disabled
    if (!enabled) {
      setLetterScales([]);
      setLetterColors([]);
      return;
    }
    
    // Only animate if component is active, in view, and mouse is active
    if (!isActive || !isInView) {
      // Reset to default state when not active
      setLetterScales([]);
      setLetterColors([]);
      return;
    }

    let frameId: number;
    let lastUpdateTime = 0;
    const minUpdateInterval = 32; // ~30fps instead of 60fps

    const updateScales = () => {
      const now = Date.now();
      if (now - lastUpdateTime < minUpdateInterval) {
        frameId = requestAnimationFrame(updateScales);
        return;
      }
      lastUpdateTime = now;
      
      if (!containerRef.current) return;

      const newScales: number[] = [];
      const newColors: string[] = [];
      
      // Get all letters for punctuation check
      const allLetters: string[] = [];
      words.forEach(word => {
        word.split('').forEach(letter => allLetters.push(letter));
      });

      letterRefs.current.forEach((letterRef, index) => {
        if (!letterRef) {
          newScales.push(1);
          newColors.push('inherit');
          return;
        }

        const rect = letterRef.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2;
        const letterCenterY = rect.top + rect.height / 2;

        const distance = calculateDistance(
          mousePositionRef.current.x,
          mousePositionRef.current.y,
          letterCenterX,
          letterCenterY
        );

        if (distance >= radius) {
          newScales.push(1);
          newColors.push('inherit');
          return;
        }

        const falloffValue = calculateFalloff(distance);
        const scale = 1 + (maxScale - 1) * falloffValue;
        newScales.push(scale);
        
        // Apply color change only to punctuation marks with larger radius
        const currentLetter = allLetters[index];
        if (isPunctuation(currentLetter)) {
          // Use a larger radius (2x) for punctuation color change
          const punctuationRadius = radius * 2;
          if (distance < punctuationRadius) {
            const punctuationFalloff = calculateFalloff(distance * 0.5); // Scale distance for smoother transition
            newColors.push(interpolateColor(punctuationFalloff));
          } else {
            newColors.push('inherit');
          }
        } else {
          newColors.push('inherit');
        }
      });

      setLetterScales(newScales);
      setLetterColors(newColors);
      frameId = requestAnimationFrame(updateScales);
    };

    frameId = requestAnimationFrame(updateScales);
    return () => cancelAnimationFrame(frameId);
  }, [radius, maxScale, falloff, words, isActive, isInView, enabled]);
  let letterIndex = 0;

  // Render simple text when disabled for performance, but always render the same structure for hydration
  if (!enabled) {
    return (
      <div className={cn("inline-block", className)} {...restProps}>
        {text}
      </div>
    );
  }
  
  // If not mounted yet, render the same structure but without animations
  if (!isMounted) {
    return (
      <div
        className={cn("inline-block", className)}
        style={{ cursor: 'default' }}
        {...restProps}
      >
        {words.map((word, wordIndex) => (
          <span key={wordIndex} className="inline-block whitespace-nowrap cursor-default">
            {word.split('').map((letter, letterIdx) => {
              const currentLetterIndex = wordIndex * 1000 + letterIdx; // Ensure unique keys
              return (
                <span
                  key={currentLetterIndex}
                  className="inline-block origin-center cursor-default"
                >
                  {letter}
                </span>
              );
            })}
            {wordIndex < words.length - 1 && (
              <span className="inline-block cursor-default">&nbsp;</span>
            )}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={cn("inline-block", className)}
      style={{ cursor: 'default' }}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap cursor-default">
          {word.split('').map((letter) => {
            const currentLetterIndex = letterIndex++;
            return (
              <span
                key={currentLetterIndex}
                ref={(el) => {
                  letterRefs.current[currentLetterIndex] = el;
                }}
                className="inline-block origin-center cursor-default"
                style={{
                  transform: `scale(${letterScales[currentLetterIndex] || 1})`,
                  color: letterColors[currentLetterIndex] || 'inherit',
                  transition: 'transform 0.15s ease-out, color 0.2s ease-out',
                  willChange: 'transform'
                }}
              >
                {letter}
              </span>
            );
          })}
          {wordIndex < words.length - 1 && (
            <span className="inline-block cursor-default">&nbsp;</span>
          )}
        </span>
      ))}
    </div>
  );
});

ProximityText.displayName = 'ProximityText';
export default ProximityText;
