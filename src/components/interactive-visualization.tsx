'use client'

import { cn } from '@/lib/utils'
import { Marquee } from '@/components/magicui/marquee'

// Sample data for the scrolling cards - split into three rows
const firstRow = [
  {
    id: 1,
    label: "Total Revenue",
    value: "45.2K",
    change: "+12.5%",
    trend: "up" as const,
    chartData: [30, 28, 35, 42, 38, 44, 45]
  },
  {
    id: 2,
    label: "Active Users",
    value: "2,345",
    change: "+0.3%",
    trend: "neutral" as const,
    chartData: [22, 23, 22, 24, 23, 24, 23]
  },
  {
    id: 3,
    label: "Conversion Rate",
    value: "23.4%",
    change: "+5.2%",
    trend: "up" as const,
    chartData: [18, 15, 22, 19, 25, 23, 28]
  },
  {
    id: 4,
    label: "Avg Order Value",
    value: "$128",
    change: "-2.1%",
    trend: "down" as const,
    chartData: [35, 38, 32, 30, 28, 25, 24]
  }
]

const secondRow = [
  {
    id: 5,
    label: "Page Views",
    value: "89.3K",
    change: "+15.7%",
    trend: "up" as const,
    chartData: [60, 58, 72, 68, 85, 82, 89]
  },
  {
    id: 6,
    label: "Engagement",
    value: "67%",
    change: "+1.1%",
    trend: "neutral" as const,
    chartData: [65, 66, 65, 67, 66, 67, 67]
  },
  {
    id: 7,
    label: "Total Orders",
    value: "342",
    change: "+21.3%",
    trend: "up" as const,
    chartData: [25, 22, 30, 35, 32, 40, 42]
  },
  {
    id: 8,
    label: "Bounce Rate",
    value: "32.1%",
    change: "-4.2%",
    trend: "down" as const,
    chartData: [45, 48, 42, 38, 36, 34, 32]
  }
]

const thirdRow = [
  {
    id: 9,
    label: "Net Profit",
    value: "$18.5K",
    change: "+9.8%",
    trend: "up" as const,
    chartData: [12, 10, 15, 14, 18, 16, 19]
  },
  {
    id: 10,
    label: "Cart Abandonment",
    value: "28.3%",
    change: "-0.5%",
    trend: "neutral" as const,
    chartData: [29, 28, 29, 28, 28, 29, 28]
  },
  {
    id: 11,
    label: "Customer LTV",
    value: "$486",
    change: "+11.2%",
    trend: "up" as const,
    chartData: [40, 38, 44, 42, 48, 45, 49]
  },
  {
    id: 12,
    label: "Churn Rate",
    value: "5.8%",
    change: "-1.3%",
    trend: "down" as const,
    chartData: [8, 9, 7.5, 7, 6.5, 6.8, 5.8]
  }
]

interface DataCardProps {
  label: string
  value: string
  change: string
  trend: 'up' | 'down' | 'neutral'
  chartData: number[]
}

const DataCard = ({ label, value, change, trend, chartData }: DataCardProps) => {
  // Calculate chart points for SVG path with smoother curves
  const maxValue = Math.max(...chartData)
  const minValue = Math.min(...chartData)
  const range = maxValue - minValue || 1
  const width = 40
  const height = 20
  
  // Create points for polyline
  const points = chartData.map((val, i) => {
    const x = (i / (chartData.length - 1)) * width
    const y = height - ((val - minValue) / range) * height
    return `${x},${y}`
  }).join(' ')
  
  // Generate unique ID for gradients
  const gradientId = `gradient-${label.replace(/\s+/g, '-')}-${Math.random().toString(36).substr(2, 9)}`
  
  // Determine colors based on trend
  const getChartColor = () => {
    switch(trend) {
      case 'up': return '#10b981' // green
      case 'down': return '#ef4444' // red
      case 'neutral': return '#eab308' // yellow
    }
  }
  
  const getTrendTextColor = () => {
    switch(trend) {
      case 'up': return 'text-green-600 dark:text-green-400'
      case 'down': return 'text-red-600 dark:text-red-400'
      case 'neutral': return 'text-yellow-600 dark:text-yellow-400'
    }
  }
  
  const chartColor = getChartColor()
  
  return (
    <div className={cn(
      "relative w-32 h-[76px] rounded-lg p-2.5 bg-white dark:bg-slate-900",
      "shadow-sm hover:shadow-md transition-all duration-300",
      "cursor-pointer group border border-slate-200/50 dark:border-slate-700/50",
      "flex-shrink-0" // Prevent shrinking
    )}>
      <div className="flex justify-between items-start h-full">
        {/* Left side: Text content */}
        <div className="flex flex-col justify-between h-full flex-1">
          <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider truncate">
            {label}
          </p>
          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight">
            {value}
          </p>
          <div className="flex items-center gap-0.5">
            <span className={cn(
              "text-[9px] font-medium",
              getTrendTextColor()
            )}>
              {change}
            </span>
            <span className="text-[8px] text-slate-400 dark:text-slate-500">
              vs last
            </span>
          </div>
        </div>
        
        {/* Right side: Line chart */}
        <div className="relative w-10 h-full flex items-center">
          <svg 
            width={width} 
            height={height} 
            className="absolute right-0"
            viewBox={`0 0 ${width} ${height}`}
          >
            {/* Gradient definition */}
            <defs>
              <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop 
                  offset="0%" 
                  stopColor={chartColor} 
                  stopOpacity="0.25"
                />
                <stop 
                  offset="100%" 
                  stopColor={chartColor} 
                  stopOpacity="0.05"
                />
              </linearGradient>
            </defs>
            
            {/* Area under the line */}
            <path
              d={`M ${points} L ${width},${height} L 0,${height} Z`}
              fill={`url(#${gradientId})`}
            />
            
            {/* Line */}
            <polyline
              points={points}
              fill="none"
              stroke={chartColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Dots on data points for more visual interest */}
            {chartData.map((val, i) => {
              const x = (i / (chartData.length - 1)) * width
              const y = height - ((val - minValue) / range) * height
              return (
                <circle
                  key={i}
                  cx={x}
                  cy={y}
                  r="1"
                  fill={chartColor}
                  opacity="0.8"
                />
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}

export default function InteractiveVisualization() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Three-row marquee container - no background or borders */}
      <div className="relative h-full flex flex-col justify-center gap-2">
          {/* First row - scrolling left */}
          <div className="relative overflow-hidden">
            <Marquee 
              pauseOnHover 
              className="[--duration:60s] [--gap:1.5rem]"
            >
              {firstRow.map((card) => (
                <DataCard key={card.id} {...card} />
              ))}
            </Marquee>
          </div>
          
          {/* Second row - scrolling right (reverse) */}
          <div className="relative overflow-hidden">
            <Marquee 
              reverse
              pauseOnHover 
              className="[--duration:70s] [--gap:1.5rem]"
            >
              {secondRow.map((card) => (
                <DataCard key={card.id} {...card} />
              ))}
            </Marquee>
          </div>
          
          {/* Third row - scrolling left */}
          <div className="relative overflow-hidden">
            <Marquee 
              pauseOnHover 
              className="[--duration:65s] [--gap:1.5rem]"
            >
              {thirdRow.map((card) => (
                <DataCard key={card.id} {...card} />
              ))}
            </Marquee>
          </div>
          
        {/* Gradient fade edges - matching parent background */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />
      </div>
    </div>
  )
}
