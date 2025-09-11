'use client'

import { cn } from '@/lib/utils'

interface ShinyTextProps {
  text: string
  disabled?: boolean
  speed?: number
  className?: string
}

const ShinyText = ({ text, disabled = false, speed = 5, className = '' }: ShinyTextProps) => {
  const shimmerStyle = {
    backgroundImage: `linear-gradient(
      120deg,
      rgba(60, 60, 60, 1) 0%,
      rgba(60, 60, 60, 1) 35%,
      rgba(80, 80, 80, 1) 45%,
      rgba(120, 120, 120, 0.9) 50%,
      rgba(80, 80, 80, 1) 55%,
      rgba(60, 60, 60, 1) 65%,
      rgba(60, 60, 60, 1) 100%
    )`,
    backgroundSize: '200% 100%',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: disabled ? 'none' : `shimmer ${speed}s linear infinite`,
  }
  
  const darkShimmerStyle = {
    backgroundImage: `linear-gradient(
      120deg,
      rgba(180, 180, 180, 1) 0%,
      rgba(180, 180, 180, 1) 35%,
      rgba(200, 200, 200, 1) 45%,
      rgba(230, 230, 230, 0.9) 50%,
      rgba(200, 200, 200, 1) 55%,
      rgba(180, 180, 180, 1) 65%,
      rgba(180, 180, 180, 1) 100%
    )`,
    backgroundSize: '200% 100%',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    animation: disabled ? 'none' : `shimmer ${speed}s linear infinite`,
  }

  return (
    <>
      <span 
        className={cn('inline-block dark:hidden', className)}
        style={shimmerStyle}
      >
        {text}
      </span>
      <span 
        className={cn('hidden dark:inline-block', className)}
        style={darkShimmerStyle}
      >
        {text}
      </span>
    </>
  )
}

export default ShinyText
