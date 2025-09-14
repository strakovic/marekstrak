"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import React, { useEffect, useId, useRef, useState, useMemo } from "react";

interface DotPatternProps extends React.SVGProps<SVGSVGElement> {
    width?: number;
    height?: number;
    x?: number;
    y?: number;
    cx?: number;
    cy?: number;
    cr?: number;
    className?: string;
    glow?: boolean;
    static?: boolean; // New prop to disable animations
    maxDots?: number; // Limit number of dots for performance
    enableEnergyWaves?: boolean; // Enable desktop energy wave animation
    gradientFade?: boolean; // Enable gradient fade from bottom to top
    ellipticalFade?: boolean; // Enable elliptical fade around center for text readability
    [key: string]: unknown;
}

interface EnergyWave {
    id: number;
    direction: 'horizontal' | 'vertical' | 'horizontal-reverse' | 'vertical-reverse';
    position: number; // Current position (0-1 normalized)
    lane: number; // Which row/column it travels in
    speed: number; // Speed multiplier
}

export function DotPattern({
    width = 16,
    height = 16,
    x = 0,
    y = 0,
    cx = 1,
    cy = 1,
    cr = 1,
    className,
    glow = false,
    static: isStatic = true, // Default to static for performance
    maxDots = 500, // Reasonable limit
    enableEnergyWaves = false,
    gradientFade = false,
    ellipticalFade = false,
    ...props
}: DotPatternProps) {
    const id = useId();
    const containerRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [isMounted, setIsMounted] = useState(false);
    const [isDesktop, setIsDesktop] = useState(false);
    const [isLowPerformance, setIsLowPerformance] = useState(false);
    const [energyWaves, setEnergyWaves] = useState<EnergyWave[]>([]);
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
    const animationFrameRef = useRef<number>();
    const lastFrameTime = useRef<number>(0);
    const targetFPS = 30; // Limit to 30 FPS for better performance
    const frameInterval = 1000 / targetFPS;

    useEffect(() => {
        setIsMounted(true);
        // Check if desktop on mount and resize
        const checkDesktop = () => setIsDesktop(window.innerWidth >= 768);
        checkDesktop();
        
        // Performance detection for mobile devices - more conservative
        const checkPerformance = () => {
            const isMobile = window.innerWidth < 768;
            const isVerySlowDevice = (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) || 
                                    (navigator.deviceMemory && navigator.deviceMemory <= 2);
            setIsLowPerformance(isMobile && isVerySlowDevice);
        };
        
        checkPerformance();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    // Track mouse position for cursor energy effect
    useEffect(() => {
        if (!enableEnergyWaves || !isDesktop) return;

        const handleMouseMove = (e: MouseEvent) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Only update if mouse is within bounds
            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                setMousePosition({ x, y });
            }
        };

        const handleMouseLeave = () => {
            setMousePosition(null);
        };

        // Add listeners to document to capture mouse over the pattern area
        document.addEventListener('mousemove', handleMouseMove);
        
        if (containerRef.current) {
            containerRef.current.addEventListener('mouseleave', handleMouseLeave);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (containerRef.current) {
                containerRef.current.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [enableEnergyWaves, isDesktop]);

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
                col,
                row,
                delay: isStatic ? 0 : Math.random() * 5,
                duration: isStatic ? 0 : Math.random() * 3 + 2,
            };
        });
    }, [isMounted, dimensions.width, dimensions.height, width, height, cx, cy, totalDots, isStatic]);

    // Initialize energy waves for mobile only (skip on low performance devices)
    useEffect(() => {
        if (!enableEnergyWaves || isDesktop || !isMounted || dimensions.width === 0 || isLowPerformance) return;

        const cols = Math.ceil(dimensions.width / width);
        const rows = Math.ceil(dimensions.height / height);
        
        // Create initial waves for mobile
        const initialWaves: EnergyWave[] = [];
        const waveCount = isLowPerformance ? 2 : 6; // Adaptive wave count based on device performance
        
        for (let i = 0; i < waveCount; i++) {
            const directionChoice = Math.random();
            let direction: 'horizontal' | 'vertical' | 'horizontal-reverse' | 'vertical-reverse';
            
            if (directionChoice < 0.25) {
                direction = 'horizontal'; // left to right
            } else if (directionChoice < 0.5) {
                direction = 'horizontal-reverse'; // right to left
            } else if (directionChoice < 0.75) {
                direction = 'vertical'; // top to bottom
            } else {
                direction = 'vertical-reverse'; // bottom to top
            }
            
            const isHorizontal = direction.includes('horizontal');
            
            initialWaves.push({
                id: i,
                direction,
                position: Math.random(), // Start at random position (0-1)
                lane: Math.floor(Math.random() * (isHorizontal ? rows : cols)),
                speed: 0.008 + Math.random() * 0.008, // Slower speed for mobile squares
            });
        }
        
        setEnergyWaves(initialWaves);
    }, [enableEnergyWaves, isDesktop, isMounted, dimensions, width, height]);

    // Animate energy waves for mobile (skip on low performance devices)
    useEffect(() => {
        if (!enableEnergyWaves || isDesktop || energyWaves.length === 0 || isLowPerformance) return;

        const animate = (currentTime: number) => {
            // Throttle animation to target FPS
            if (currentTime - lastFrameTime.current < frameInterval) {
                animationFrameRef.current = requestAnimationFrame(animate);
                return;
            }
            lastFrameTime.current = currentTime;
            
            setEnergyWaves(prevWaves => 
                prevWaves.map(wave => {
                    let newPosition = wave.position + wave.speed;
                    
                    // Handle wrapping based on direction
                    if (wave.direction === 'horizontal' || wave.direction === 'vertical') {
                        // Forward direction
                        if (newPosition > 1.1) {
                            // Reset to start with new random lane
                            const cols = Math.ceil(dimensions.width / width);
                            const rows = Math.ceil(dimensions.height / height);
                            const isHorizontal = wave.direction === 'horizontal';
                            
                            return {
                                ...wave,
                                position: -0.1,
                                lane: Math.floor(Math.random() * (isHorizontal ? rows : cols)),
                                speed: 0.008 + Math.random() * 0.008, // Slower for mobile squares
                            };
                        }
                    } else {
                        // Reverse direction
                        if (newPosition < -0.1) {
                            // Reset to end with new random lane
                            const cols = Math.ceil(dimensions.width / width);
                            const rows = Math.ceil(dimensions.height / height);
                            const isHorizontal = wave.direction === 'horizontal-reverse';
                            
                            return {
                                ...wave,
                                position: 1.1,
                                lane: Math.floor(Math.random() * (isHorizontal ? rows : cols)),
                                speed: -(0.008 + Math.random() * 0.008), // Slower for mobile squares
                            };
                        }
                    }
                    
                    return { ...wave, position: newPosition };
                })
            );
            
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        
        animationFrameRef.current = requestAnimationFrame(animate);
        
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [enableEnergyWaves, isDesktop, energyWaves.length, dimensions, width, height]);

    // Calculate if a dot should be transformed to a square
    const getDotTransformation = (dot: any) => {
        if (!enableEnergyWaves) return { isSquare: false, opacity: 0, fromCursor: false };
        
        let maxEffect = 0; // Initialize maxEffect variable
        let fromCursor = false;
        
        // Apply gradient fade if enabled
        let baseOpacity = 1;
        if (gradientFade && dimensions.height > 0) {
            const yProgress = dot.y / dimensions.height; // 0 at top, 1 at bottom
            // Fade out from 40% down to 100% (bottom)
            if (yProgress > 0.4) {
                const fadeProgress = (yProgress - 0.4) / 0.6; // 0 to 1 over bottom 60%
                baseOpacity = 1 - fadeProgress; // 1 at 40%, 0 at 100%
            }
        }
        
        // Apply elliptical fade if enabled (for text readability)
        if (ellipticalFade && dimensions.width > 0 && dimensions.height > 0) {
            const centerX = dimensions.width / 2;
            const centerY = dimensions.height * 0.45; // Center at 45% from top (moved up slightly)
            
            // Create elliptical distance calculation
            const ellipseWidth = dimensions.width * 0.9; // 90% of container width (much wider)
            const ellipseHeight = dimensions.height * 0.7; // 70% of container height (extended upward)
            
            const normalizedX = (dot.x - centerX) / (ellipseWidth / 2);
            const normalizedY = (dot.y - centerY) / (ellipseHeight / 2);
            const ellipticalDistance = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
            
            // Create fade effect: stronger fade closer to center (reduce opacity for text readability)
            if (ellipticalDistance < 1.2) {
                const fadeStrength = Math.max(0, 1 - ellipticalDistance / 1.2); // 1 at center, 0 at edge
                const opacityReduction = fadeStrength * 0.85; // Reduce opacity by up to 85% (stronger gradient)
                baseOpacity *= (1 - opacityReduction);
            }
        }
        
        // Desktop: Only mouse cursor energy effect
        if (isDesktop && mousePosition) {
            const distance = Math.sqrt(
                Math.pow(dot.x - mousePosition.x, 2) + 
                Math.pow(dot.y - mousePosition.y, 2)
            );
            
            const cursorRadius = 100; // 100px total radius for gradual effect
            const coreRadius = 20; // 20px core area
            
            if (distance < cursorRadius) {
                fromCursor = true;
                if (distance < coreRadius) {
                    // Core area - strongest effect
                    const t = 1 - (distance / coreRadius);
                    maxEffect = Math.max(maxEffect, 0.7 + (0.3 * t));
                } else if (distance < coreRadius * 2) {
                    // Middle area
                    const t = 1 - ((distance - coreRadius) / coreRadius);
                    maxEffect = Math.max(maxEffect, 0.4 + (0.3 * t));
                } else if (distance < coreRadius * 3) {
                    // Outer area  
                    const t = 1 - ((distance - coreRadius * 2) / coreRadius);
                    maxEffect = Math.max(maxEffect, 0.2 + (0.2 * t));
                } else {
                    // Far outer area - very subtle
                    const t = 1 - ((distance - coreRadius * 3) / (cursorRadius - coreRadius * 3));
                    maxEffect = Math.max(maxEffect, 0.2 * t);
                }
            }
        }
        
        // Mobile: Traveling wave effects with squares
        if (!isDesktop) {
            for (const wave of energyWaves) {
                const isHorizontal = wave.direction.includes('horizontal');
                
                if (isHorizontal) {
                    // Check if dot is in the wave's lane
                    if (dot.row === wave.lane) {
                        // Calculate actual position in pixels
                        const wavePosition = wave.position * dimensions.width;
                        const distance = Math.abs(dot.x - wavePosition);
                        const normalizedDistance = distance / width;
                        
                        // Smooth gradient effect based on distance
                        if (normalizedDistance < 0.5) {
                            // Very close to center
                            const t = 1 - (normalizedDistance / 0.5);
                            maxEffect = Math.max(maxEffect, 0.7 + (0.3 * t));
                        } else if (normalizedDistance < 1.5) {
                            // First adjacent dots
                            const t = 1 - ((normalizedDistance - 0.5) / 1.0);
                            maxEffect = Math.max(maxEffect, 0.3 + (0.4 * t));
                        } else if (normalizedDistance < 2.5) {
                            // Outer dots
                            const t = 1 - ((normalizedDistance - 1.5) / 1.0);
                            maxEffect = Math.max(maxEffect, 0.3 * t);
                        }
                    }
                } else {
                    // Vertical wave
                    if (dot.col === wave.lane) {
                        // Calculate actual position in pixels
                        const wavePosition = wave.position * dimensions.height;
                        const distance = Math.abs(dot.y - wavePosition);
                        const normalizedDistance = distance / height;
                        
                        // Smooth gradient effect based on distance
                        if (normalizedDistance < 0.5) {
                            // Very close to center
                            const t = 1 - (normalizedDistance / 0.5);
                            maxEffect = Math.max(maxEffect, 0.7 + (0.3 * t));
                        } else if (normalizedDistance < 1.5) {
                            // First adjacent dots
                            const t = 1 - ((normalizedDistance - 0.5) / 1.0);
                            maxEffect = Math.max(maxEffect, 0.3 + (0.4 * t));
                        } else if (normalizedDistance < 2.5) {
                            // Outer dots
                            const t = 1 - ((normalizedDistance - 1.5) / 1.0);
                            maxEffect = Math.max(maxEffect, 0.3 * t);
                        }
                    }
                }
            }
        }
        
        return { 
            isSquare: maxEffect > 0, // Remove threshold to prevent sudden appearance
            opacity: maxEffect * baseOpacity, // Apply gradient fade to energy effects
            fromCursor,
            baseOpacity // Store base opacity for regular dots
        };
    };

    return (
        <svg
            ref={containerRef}
            aria-hidden="true"
            className={cn(
                "pointer-events-none absolute inset-0 h-full w-full",
                className,
            )}
            style={props.style}
            {...props}
        >
            <defs>
                <radialGradient id={`${id}-gradient`}>
                    <stop offset="0%" stopColor="currentColor" stopOpacity="1" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
                </radialGradient>
            </defs>
            {/* Render dots - they change color based on energy wave */}
            {dots.map((dot) => {
                const transformation = enableEnergyWaves ? getDotTransformation(dot) : { isSquare: false, opacity: 0 };
                
                // Energy waves enabled (desktop or mobile)
                if (enableEnergyWaves) {
                    // Show square when transformation is strong enough
                    if (transformation.isSquare) {
                        // Smaller squares on mobile
                        const squareMultiplier = isDesktop ? 2.1 : 1.5; // Smaller on mobile
                        return (
                            <motion.rect
                                key={`${dot.x}-${dot.y}`}
                                x={dot.x - cr * squareMultiplier}
                                y={dot.y - cr * squareMultiplier}
                                width={cr * squareMultiplier * 2}
                                height={cr * squareMultiplier * 2}
                                fill="currentColor"
                                className="text-orange-500"
                                initial={{ opacity: 0 }}
                                animate={{ 
                                    opacity: transformation.opacity,
                                }}
                                transition={{
                                    duration: 0.3, // Slower transition for better performance
                                    ease: "easeOut",
                                }}
                            />
                        );
                    }
                    
                    // Show colored dot when affected but not square
                    const orangeAmount = transformation.opacity;
                    const finalOpacity = orangeAmount > 0.01 ? (0.6 + orangeAmount * 0.3) * transformation.baseOpacity : 0.6 * transformation.baseOpacity;
                    // Use motion for dots that could be affected
                    return (
                        <motion.circle
                            key={`${dot.x}-${dot.y}`}
                            cx={dot.x}
                            cy={dot.y}
                            r={cr}
                            fill="currentColor"
                            className={orangeAmount > 0.01 ? "text-orange-500" : "text-neutral-400/60"}
                            initial={{ opacity: finalOpacity }}
                            animate={{ 
                                opacity: finalOpacity
                            }}
                            transition={{
                                duration: 0.3, // Slower transition for better performance
                                ease: "easeOut",
                            }}
                        />
                    );
                }
                
                // Static dots with gradient fade and elliptical fade support
                if (isStatic || !glow) {
                    let staticOpacity = 0.6;
                    
                    // Apply gradient fade
                    if (gradientFade && dimensions.height > 0) {
                        const yProgress = dot.y / dimensions.height;
                        if (yProgress > 0.4) {
                            const fadeProgress = (yProgress - 0.4) / 0.6;
                            staticOpacity = 0.6 * (1 - fadeProgress);
                        }
                    }
                    
                    // Apply elliptical fade
                    if (ellipticalFade && dimensions.width > 0 && dimensions.height > 0) {
                        const centerX = dimensions.width / 2;
                        const centerY = dimensions.height * 0.45;
                        const ellipseWidth = dimensions.width * 0.9;
                        const ellipseHeight = dimensions.height * 0.7;
                        
                        const normalizedX = (dot.x - centerX) / (ellipseWidth / 2);
                        const normalizedY = (dot.y - centerY) / (ellipseHeight / 2);
                        const ellipticalDistance = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY);
                        
                        if (ellipticalDistance < 1.2) {
                            const fadeStrength = Math.max(0, 1 - ellipticalDistance / 1.2);
                            const opacityReduction = fadeStrength * 0.85; // Reduce opacity by up to 85% (stronger gradient)
                            staticOpacity *= (1 - opacityReduction);
                        }
                    }
                    return (
                        <circle
                            key={`${dot.x}-${dot.y}`}
                            cx={dot.x}
                            cy={dot.y}
                            r={cr}
                            fill={glow ? `url(#${id}-gradient)` : "currentColor"}
                            className="text-neutral-400/60"
                            opacity={staticOpacity}
                        />
                    );
                }
                
                // Animated glowing dots (non-desktop or no energy waves)
                return (
                    <motion.circle
                        key={`${dot.x}-${dot.y}`}
                        cx={dot.x}
                        cy={dot.y}
                        r={cr}
                        fill={`url(#${id}-gradient)`}
                        className="text-neutral-400/60"
                        initial={{ opacity: 0.4, scale: 1 }}
                        animate={{
                            opacity: [0.4, 1, 0.4],
                            scale: [1, 1.5, 1],
                        }}
                        transition={{
                            duration: dot.duration,
                            repeat: Infinity,
                            repeatType: "reverse",
                            delay: dot.delay,
                            ease: "easeInOut",
                        }}
                    />
                );
            })}
        </svg>
    );
}
