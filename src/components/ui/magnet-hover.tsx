import React, { useState, useEffect, useRef, ReactNode, HTMLAttributes, useCallback } from "react";

// Throttle function for better performance
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

interface MagnetProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  padding?: number;
  disabled?: boolean;
  magnetStrength?: number;
  activeTransition?: string;
  inactiveTransition?: string;
  wrapperClassName?: string;
  innerClassName?: string;
}

export const Magnet: React.FC<MagnetProps> = ({
  children,
  padding = 100,
  disabled = false,
  magnetStrength = 2, // A higher number means less movement (more resistance)
  activeTransition = "transform 0.1s ease-out", // Quicker when active
  inactiveTransition = "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)", // Smoother return
  wrapperClassName = "",
  innerClassName = "",
  ...props
}) => {
  const [isActive, setIsActive] = useState<boolean>(false);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isInView, setIsInView] = useState<boolean>(false);
  const magnetRef = useRef<HTMLDivElement>(null);

  // Intersection observer to only track mouse when visible
  useEffect(() => {
    if (!magnetRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
        if (!entry.isIntersecting) {
          setIsActive(false);
          setPosition({ x: 0, y: 0 });
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    observer.observe(magnetRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (disabled || !isInView) {
      setPosition({ x: 0, y: 0 });
      setIsActive(false);
      return;
    }

    const handleMouseMove = throttle((e: MouseEvent) => {
      if (!magnetRef.current) return;

      const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // Calculate distance from mouse to center of the element
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Check if mouse is within the padded area
      if (
        mouseX >= left - padding &&
        mouseX <= left + width + padding &&
        mouseY >= top - padding &&
        mouseY <= top + height + padding
      ) {
        if (!isActive) setIsActive(true);
        // magnetStrength: higher value means less movement. We want to divide by it.
        // The movement should be a fraction of the distance from center.
        const offsetX = (mouseX - centerX) / magnetStrength;
        const offsetY = (mouseY - centerY) / magnetStrength;
        setPosition({ x: offsetX, y: offsetY });
      } else {
        if (isActive) setIsActive(false);
        setPosition({ x: 0, y: 0 });
      }
    }, 16); // ~60fps throttling

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [padding, disabled, magnetStrength, isActive, isInView]); // Updated dependencies

  const transitionStyle = isActive ? activeTransition : inactiveTransition;

  return (
    <div
      ref={magnetRef}
      className={wrapperClassName} // User can pass Tailwind classes here
      style={{ 
        position: "relative", 
        display: "inline-block", // So it takes the size of its content
        cursor: disabled ? 'default' : 'grab' 
      }}
      {...props}
    >
      <div
        className={innerClassName} // User can pass Tailwind classes here
        style={{
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          transition: transitionStyle,
          willChange: "transform", // Hint for browser optimization
          display: "inline-block", // Ensure inner div also sizes to content
        }}
      >
        {children}
      </div>
    </div>
  );
};