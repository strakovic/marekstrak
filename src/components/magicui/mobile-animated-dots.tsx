"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useId, useRef, useState, useMemo } from "react";

interface MobileAnimatedDotsProps extends React.SVGProps<SVGSVGElement> {
    width?: number;
    height?: number;
    cx?: number;
    cy?: number;
    cr?: number;
    className?: string;
    maxDots?: number;
    [key: string]: unknown;
}

export function MobileAnimatedDots({
    width = 12,
    height = 20,
    cx = 1,
    cy = 1,
    cr = 1.2,
    className,
    maxDots = 1000,
    ...props
}: MobileAnimatedDotsProps) {
    const id = useId();
    const containerRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [isMounted, setIsMounted] = useState(false);
    const [animatingDots, setAnimatingDots] = useState<Set<number>>(new Set());

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;
        
        const updateDimensions = () => {
            if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setDimensions({ width, height });
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [isMounted]);

    // Randomly animate dots to squares with individual timing
    useEffect(() => {
        if (!isMounted || dimensions.width === 0) return;

        const interval = setInterval(() => {
            setAnimatingDots(prev => {
                const newSet = new Set(prev);
                
                // Randomly remove dots that have been animating for a while
                prev.forEach(dot => {
                    if (Math.random() > 0.9) { // 10% chance to stop - keeps them longer
                        newSet.delete(dot);
                    }
                });
                
                // Add new random dots to animate
                const totalDots = Math.ceil(dimensions.width / width) * Math.ceil(dimensions.height / height);
                const dotsToAdd = Math.random() > 0.5 ? 1 : 2; // Add 1-2 dots only
                
                for (let i = 0; i < dotsToAdd && newSet.size < 6; i++) { // Max 6 at a time
                    const randomDot = Math.floor(Math.random() * Math.min(totalDots, maxDots));
                    if (!newSet.has(randomDot)) {
                        newSet.add(randomDot);
                    }
                }
                
                return newSet;
            });
        }, 1200); // Check less frequently for more subtle changes

        return () => clearInterval(interval);
    }, [isMounted, dimensions.width, dimensions.height, width, height, maxDots]);

    const totalDots = Math.min(
        Math.ceil(dimensions.width / width) * Math.ceil(dimensions.height / height),
        maxDots
    );

    const dots = useMemo(() => {
        if (!isMounted || dimensions.width === 0 || dimensions.height === 0) return [];
        
        return Array.from({ length: totalDots }, (_, i) => {
            const col = i % Math.ceil(dimensions.width / width);
            const row = Math.floor(i / Math.ceil(dimensions.width / width));
            return {
                x: col * width + cx,
                y: row * height + cy,
                index: i,
                delay: Math.random() * 4, // Longer random delay spread
            };
        });
    }, [isMounted, dimensions.width, dimensions.height, width, height, cx, cy, totalDots]);

    return (
        <svg
            ref={containerRef}
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-0 h-full w-full",
                className,
            )}
            {...props}
        >
            <defs>
                <radialGradient id={`${id}-gradient`}>
                    <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
                <radialGradient id={`${id}-orange-gradient`}>
                    <stop offset="0%" stopColor="#F9620C" stopOpacity="1" />
                    <stop offset="100%" stopColor="#F9620C" stopOpacity="0.6" />
                </radialGradient>
            </defs>
            {dots.map((dot) => {
                const isAnimating = animatingDots.has(dot.index);
                
                if (isAnimating) {
                    // Render as pulsing square with sharp edges and random delay
                    return (
                        <g key={`${dot.x}-${dot.y}`}>
                            <rect
                                x={dot.x - cr * 1.1}
                                y={dot.y - cr * 1.1}
                                width={cr * 2.2}
                                height={cr * 2.2}
                                fill="#F9620C"
                                style={{
                                    animation: `pulseSquare 5s ease-in-out infinite`,
                                    animationDelay: `${dot.delay}s`,
                                    transformOrigin: `${dot.x}px ${dot.y}px`,
                                }}
                            />
                        </g>
                    );
                }
                
                // Regular dot
                return (
                    <circle
                        key={`${dot.x}-${dot.y}`}
                        cx={dot.x}
                        cy={dot.y}
                        r={cr}
                        fill={`url(#${id}-gradient)`}
                        className="text-neutral-400/60"
                    />
                );
            })}
            <style jsx>{`
                @keyframes pulseSquare {
                    0% {
                        opacity: 0;
                        transform: scale(0);
                    }
                    25% {
                        opacity: 0.4;
                        transform: scale(0.9);
                    }
                    50% {
                        opacity: 0.7;
                        transform: scale(1);
                    }
                    75% {
                        opacity: 0.4;
                        transform: scale(0.9);
                    }
                    100% {
                        opacity: 0;
                        transform: scale(0);
                    }
                }
            `}</style>
        </svg>
    );
}