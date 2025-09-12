"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface SquareHoverTextProps {
  children: string;
  className?: string;
}

export function SquareHoverText({ children, className }: SquareHoverTextProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [scrambledText, setScrambledText] = useState(children);

  const squares = ['■', '▪', '▫', '□', '▮', '▯'];

  const scrambleText = () => {
    if (isHovered) return;
    
    setIsHovered(true);
    let iterations = 0;
    const originalText = children;
    
    const interval = setInterval(() => {
      setScrambledText((current) => {
        return current
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            
            if (index < iterations) {
              return originalText[index];
            }
            
            return squares[Math.floor(Math.random() * squares.length)];
          })
          .join('');
      });
      
      if (iterations >= originalText.length) {
        clearInterval(interval);
        setIsHovered(false);
        setScrambledText(originalText);
      }
      
      iterations += 1 / 3;
    }, 50);
  };

  return (
    <h1 
      className={cn("transition-all duration-200 cursor-pointer", className)}
      onMouseEnter={scrambleText}
      onTouchStart={scrambleText}
    >
      {scrambledText}
    </h1>
  );
}
