"use client";

import { forwardRef, useRef, useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

interface ProximityTextProps {
  text: string;
  className?: string;
  radius?: number;
  maxScale?: number;
  falloff?: 'linear' | 'exponential' | 'gaussian';
}

function useMousePositionRef() {
  const positionRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (ev: MouseEvent) => {
      positionRef.current = { x: ev.clientX, y: ev.clientY };
    };

    const handleTouchMove = (ev: TouchEvent) => {
      const touch = ev.touches[0];
      positionRef.current = { x: touch.clientX, y: touch.clientY };
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  return positionRef;
}

const ProximityText = forwardRef<HTMLDivElement, ProximityTextProps>((props, ref) => {
  const {
    text,
    className,
    radius = 120,
    maxScale = 1.3,
    falloff = 'gaussian',
    ...restProps
  } = props;

  const containerRef = useRef<HTMLDivElement>(null);
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const mousePositionRef = useMousePositionRef();
  const [letterScales, setLetterScales] = useState<number[]>([]);
  const [letterColors, setLetterColors] = useState<string[]>([]);

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

  useEffect(() => {
    let frameId: number;

    const updateScales = () => {
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
  }, [radius, maxScale, falloff, words]);
  let letterIndex = 0;

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
              <motion.span
                key={currentLetterIndex}
                ref={(el) => {
                  letterRefs.current[currentLetterIndex] = el;
                }}
                className="inline-block origin-center cursor-default"
                style={{
                  transform: `scale(${letterScales[currentLetterIndex] || 1})`,
                  color: letterColors[currentLetterIndex] || 'inherit',
                  transition: 'color 0.2s ease-out'
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {letter}
              </motion.span>
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
