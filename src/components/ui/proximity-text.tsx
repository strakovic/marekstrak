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

  useEffect(() => {
    let frameId: number;

    const updateScales = () => {
      if (!containerRef.current) return;

      const newScales = letterRefs.current.map((letterRef) => {
        if (!letterRef) return 1;

        const rect = letterRef.getBoundingClientRect();
        const letterCenterX = rect.left + rect.width / 2;
        const letterCenterY = rect.top + rect.height / 2;

        const distance = calculateDistance(
          mousePositionRef.current.x,
          mousePositionRef.current.y,
          letterCenterX,
          letterCenterY
        );

        if (distance >= radius) return 1;

        const falloffValue = calculateFalloff(distance);
        return 1 + (maxScale - 1) * falloffValue;
      });

      setLetterScales(newScales);
      frameId = requestAnimationFrame(updateScales);
    };

    frameId = requestAnimationFrame(updateScales);
    return () => cancelAnimationFrame(frameId);
  }, [radius, maxScale, falloff]);

  const words = useMemo(() => text.split(' '), [text]);
  let letterIndex = 0;

  return (
    <div
      ref={containerRef}
      className={cn("inline-block", className)}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split('').map((letter) => {
            const currentLetterIndex = letterIndex++;
            return (
              <motion.span
                key={currentLetterIndex}
                ref={(el) => {
                  letterRefs.current[currentLetterIndex] = el;
                }}
                className="inline-block origin-center"
                style={{
                  transform: `scale(${letterScales[currentLetterIndex] || 1})`,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                {letter}
              </motion.span>
            );
          })}
          {wordIndex < words.length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </div>
  );
});

ProximityText.displayName = 'ProximityText';
export default ProximityText;
