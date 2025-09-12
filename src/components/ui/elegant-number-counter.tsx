"use client";

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DigitProps {
  digit: string;
  isChanging: boolean;
}

const Digit: React.FC<DigitProps & { animationKey: number }> = ({ digit, isChanging, animationKey }) => {
  return (
    <div className="relative inline-block w-[0.6em] h-[1.2em] overflow-hidden">
      {isChanging ? (
        <AnimatePresence mode="popLayout">
          <motion.span
            key={`${animationKey}-${digit}`}
            initial={{ y: '100%' }}
            animate={{ y: '0%' }}
            exit={{ y: '-100%' }}
            transition={{
              y: { type: "spring", stiffness: 350, damping: 25 },
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {digit}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span className="flex items-center justify-center h-full">
          {digit}
        </span>
      )}
    </div>
  );
};

interface ElegantNumberCounterProps {
  startingNumber?: number;
  className?: string;
}

export default function ElegantNumberCounter({ 
  startingNumber = 200000,
  className = ""
}: ElegantNumberCounterProps) {
  const [currentNumber, setCurrentNumber] = useState(startingNumber);
  const [previousNumber, setPreviousNumber] = useState(startingNumber);
  const [animationKey, setAnimationKey] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Start the interval to update the number every 2.5 seconds
    intervalRef.current = setInterval(() => {
      setCurrentNumber(prev => {
        setPreviousNumber(prev);
        const randomIncrement = Math.floor(Math.random() * 201) + 50; // 50-250
        setAnimationKey(k => k + 1); // Increment key to sync all animations
        return prev + randomIncrement;
      });
    }, 2500); // Update every 2.5 seconds for slower counting

    // Cleanup on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Format numbers with commas
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Convert numbers to padded digit arrays for comparison
  const currentFormatted = formatNumber(currentNumber);
  const previousFormatted = formatNumber(previousNumber);
  
  // Split into individual characters (including commas)
  const currentDigits = currentFormatted.split('');
  const previousDigits = previousFormatted.split('');
  
  // Ensure both arrays are the same length by padding the shorter one
  const maxLength = Math.max(currentDigits.length, previousDigits.length);
  while (previousDigits.length < maxLength) {
    previousDigits.unshift(' ');
  }
  while (currentDigits.length < maxLength) {
    currentDigits.unshift(' ');
  }

  return (
    <div className={`font-mono text-2xl font-semibold ${className}`}>
      <div className="inline-flex items-center">
        <span className="mr-[0.1em]">$</span>
        {currentDigits.map((digit, index) => {
          const prevDigit = previousDigits[index];
          const isChanging = digit !== prevDigit && digit !== ' ';
          
          if (digit === ',') {
            return (
              <span key={`comma-${index}`} className="inline-block w-[0.3em] text-center">
                ,
              </span>
            );
          }
          
          if (digit === ' ') {
            return <span key={`space-${index}`} className="inline-block w-[0.6em]" />;
          }
          
          return (
            <Digit
              key={`digit-${index}`}
              digit={digit}
              isChanging={isChanging}
              animationKey={animationKey}
            />
          );
        })}
      </div>
    </div>
  );
}
