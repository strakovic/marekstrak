"use client"

import { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'

interface AnimatedProgressBarProps {
  value: number // Target percentage (0-100)
  className?: string
  duration?: number // Duration in milliseconds
  showPercentage?: boolean
  startOnVisible?: boolean // Start animation when element becomes visible
}

export function AnimatedProgressBar({ 
  value, 
  className, 
  duration = 3000, 
  showPercentage = true,
  startOnVisible = false 
}: AnimatedProgressBarProps) {
  const [currentValue, setCurrentValue] = useState(0)
  const [hasStarted, setHasStarted] = useState(!startOnVisible)
  const elementRef = useRef<HTMLDivElement>(null)

  // Intersection Observer for visibility-based animation
  useEffect(() => {
    if (!startOnVisible || hasStarted) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [startOnVisible, hasStarted])

  // Animation logic
  useEffect(() => {
    if (!hasStarted) return

    const increment = value / (duration / 50) // Update every 50ms
    let current = 0
    
    const timer = setInterval(() => {
      current += increment
      if (current >= value) {
        setCurrentValue(value)
        clearInterval(timer)
      } else {
        setCurrentValue(current)
      }
    }, 50)

    return () => clearInterval(timer)
  }, [value, duration, hasStarted])

  // Get color based on progress value
  const getProgressColor = (progress: number) => {
    if (progress <= 33) {
      return 'from-green-500 to-green-400'
    } else if (progress <= 66) {
      return 'from-yellow-500 to-orange-400'
    } else {
      return 'from-orange-500 to-red-500'
    }
  }

  return (
    <div ref={elementRef} className={cn("flex items-center gap-2", className)}>
      <div className="relative h-2 flex-1 bg-border rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${getProgressColor(currentValue)} rounded-full transition-all duration-75 ease-out`}
          style={{ width: `${currentValue}%` }}
        />
      </div>
      {showPercentage && (
        <span className="text-xs font-medium text-muted-foreground min-w-[2.5rem] text-right">
          {currentValue.toFixed(1)}%
        </span>
      )}
    </div>
  )
}
