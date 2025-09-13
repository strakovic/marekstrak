'use client'

import { cn } from '@/lib/utils'
import { Marquee } from '@/components/magicui/marquee'
import { useMemo, useState } from 'react'

// Mixed data cards with randomized distribution and diverse time periods
const firstRow = [
  {
    id: 1,
    label: "Revenue",
    value: "87.3K",
    change: "+12.4%",
    period: "vs last month",
    trend: "up" as const,
    chartData: [77.7, 76.2, 75.2, 76.8, 78.1, 79.1, 77.9, 76.4, 73.6, 75.1, 77.2, 79.8, 81.4, 83.1, 82.3, 84.7, 85.9, 86.2, 87.1, 86.8, 87.3]
  },
  {
    id: 2,
    label: "Churn",
    value: "5.6%",
    change: "−1.4%",
    period: "vs yesterday",
    trend: "down" as const,
    chartData: [5.92, 5.88, 5.78, 5.84, 5.81, 5.91, 5.88, 5.82, 5.79, 5.75, 5.78, 5.72, 5.74, 5.69, 5.63, 5.67, 5.61, 5.58, 5.62, 5.59, 5.6]
  },
  {
    id: 3,
    label: "Rules",
    value: "176",
    change: "+2.4%",
    period: "vs last quarter",
    trend: "neutral" as const,
    chartData: [172, 171, 169, 170, 172, 174, 173, 172, 171, 170, 172, 174, 173, 175, 174, 175, 176, 175, 174, 175, 176]
  },
  {
    id: 4,
    label: "Collected",
    value: "78.5K",
    change: "+10.1%",
    period: "vs last year",
    trend: "up" as const,
    chartData: [71.3, 70.8, 69.8, 70.5, 71.2, 72.4, 71.9, 70.8, 70.1, 71.4, 73.2, 74.8, 76.2, 75.9, 75.1, 75.8, 76.9, 77.8, 78.1, 78.0, 78.5]
  },
  {
    id: 5,
    label: "Failures",
    value: "1,123",
    change: "−2.8%",
    period: "vs last week",
    trend: "down" as const,
    chartData: [1287, 1258, 1239, 1252, 1225, 1204, 1218, 1197, 1184, 1175, 1168, 1156, 1149, 1142, 1138, 1135, 1128, 1123, 1129, 1121, 1123]
  },
  {
    id: 6,
    label: "Customs",
    value: "41",
    change: "−1.2%",
    period: "vs last month",
    trend: "neutral" as const,
    chartData: [41.5, 41.8, 42, 41.7, 41.2, 40.8, 41.1, 41.4, 41.9, 41.6, 41.0, 40.6, 40.9, 41.2, 41.4, 41.1, 40.8, 41.0, 41.2, 41.1, 41]
  }
]

const secondRow = [
  {
    id: 7,
    label: "Activations",
    value: "1,247",
    change: "+8.6%",
    period: "vs last week",
    trend: "up" as const,
    chartData: [1148, 1152, 1134, 1145, 1167, 1189, 1178, 1165, 1162, 1174, 1188, 1195, 1203, 1209, 1198, 1218, 1232, 1238, 1245, 1241, 1247]
  },
  {
    id: 8,
    label: "Retries",
    value: "812",
    change: "−1.2%",
    period: "vs last month",
    trend: "down" as const,
    chartData: [784, 789, 798, 791, 785, 771, 778, 791, 819, 815, 808, 795, 799, 803, 806, 809, 805, 812, 808, 810, 812]
  },
  {
    id: 9,
    label: "Contracts",
    value: "24",
    change: "+1",
    period: "vs yesterday",
    trend: "neutral" as const,
    chartData: [23, 22.8, 22, 22.4, 23.1, 23.5, 23.2, 22.9, 22.8, 23.2, 23.8, 24.1, 24.2, 24.0, 23.8, 23.7, 23.9, 24.1, 24.0, 23.8, 24]
  },
  {
    id: 10,
    label: "Recovered",
    value: "6.9K",
    change: "+14.2%",
    period: "vs last quarter",
    trend: "up" as const,
    chartData: [6.04, 6.08, 5.82, 5.95, 6.12, 6.31, 6.25, 6.08, 5.97, 6.15, 6.32, 6.38, 6.45, 6.52, 6.48, 6.72, 6.79, 6.84, 6.88, 6.87, 6.9]
  },
  {
    id: 11,
    label: "Disputes",
    value: "62",
    change: "−3.5%",
    period: "vs last week",
    trend: "down" as const,
    chartData: [74.2, 72.8, 71.1, 70.5, 69.1, 68.4, 67.9, 66.6, 65.7, 65.2, 64.5, 63.8, 63.4, 62.9, 62.3, 62.7, 62.2, 61.8, 62.1, 61.9, 62]
  },
  {
    id: 12,
    label: "Invoice",
    value: "$438",
    change: "+0.6%",
    period: "vs last month",
    trend: "neutral" as const,
    chartData: [435.4, 436.2, 437.1, 436.8, 435.9, 434.8, 435.5, 436.2, 436.9, 436.4, 435.8, 435.2, 435.9, 436.8, 437.3, 437.6, 437.2, 437.8, 438.1, 437.9, 438]
  },
  {
    id: 13,
    label: "Events",
    value: "92.1K",
    change: "+16.3%",
    period: "vs last year",
    trend: "up" as const,
    chartData: [79.2, 78.5, 76.8, 78.9, 81.2, 83.1, 82.4, 79.8, 78.4, 80.7, 83.9, 85.8, 86.7, 87.9, 88.6, 89.3, 90.1, 90.8, 91.5, 91.8, 92.1]
  }
]

const thirdRow = [
  {
    id: 14,
    label: "Charges",
    value: "23.4K",
    change: "+5.1%",
    period: "vs last quarter",
    trend: "up" as const,
    chartData: [22.26, 22.18, 21.89, 22.05, 22.34, 22.67, 22.58, 22.31, 21.95, 22.12, 22.45, 22.78, 23.12, 23.05, 22.91, 22.84, 23.08, 23.21, 23.35, 23.28, 23.4]
  },
  {
    id: 15,
    label: "Discounts",
    value: "79",
    change: "+3.2%",
    period: "vs last month",
    trend: "neutral" as const,
    chartData: [76.5, 76.1, 75.2, 75.8, 76.7, 77.8, 77.5, 76.8, 76.1, 76.4, 77.1, 77.6, 78.4, 78.1, 77.8, 77.9, 78.3, 78.6, 78.9, 78.7, 79]
  },
  {
    id: 16,
    label: "Unpriced",
    value: "4,218",
    change: "−4.1%",
    period: "vs yesterday",
    trend: "down" as const,
    chartData: [3946, 3978, 4089, 4052, 3958, 3821, 3887, 3965, 4156, 4121, 4087, 4023, 4058, 4091, 4134, 4167, 4189, 4203, 4218, 4201, 4218]
  },
  {
    id: 17,
    label: "Quotes",
    value: "398",
    change: "+6.8%",
    period: "vs last month",
    trend: "up" as const,
    chartData: [373, 371, 368, 372, 377, 381, 379, 376, 375, 378, 383, 386, 389, 391, 393, 394, 396, 397, 398, 397, 398]
  },
  {
    id: 18,
    label: "Adjustments",
    value: "36",
    change: "−2.1%",
    period: "vs last year",
    trend: "neutral" as const,
    chartData: [36.8, 37.1, 37.4, 37.2, 36.9, 36.2, 36.5, 36.8, 37.1, 36.7, 36.4, 35.9, 36.2, 36.4, 36.5, 36.3, 36.1, 36.2, 36.0, 35.9, 36]
  },
  {
    id: 19,
    label: "Leakage",
    value: "3.5K",
    change: "−5.7%",
    period: "vs last week",
    trend: "down" as const,
    chartData: [3.21, 3.28, 3.34, 3.31, 3.19, 3.08, 3.15, 3.24, 3.42, 3.38, 3.32, 3.26, 3.29, 3.34, 3.38, 3.42, 3.45, 3.47, 3.5, 3.48, 3.5]
  },
  {
    id: 20,
    label: "Delays",
    value: "118",
    change: "−6.2%",
    period: "vs last quarter",
    trend: "down" as const,
    chartData: [115, 114, 112, 113, 115, 117, 116, 114, 109, 111, 114, 118, 121, 119, 117, 116, 117, 118, 119, 118, 118]
  }
]

interface DataCardProps {
  label: string
  value: string
  change: string
  period: string
  trend: 'up' | 'down' | 'neutral'
  chartData: number[]
}

const DataCard = ({ label, value, change, period, trend, chartData }: DataCardProps) => {
  // State for hover functionality
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  // Format tooltip values to match the main display format
  const formatTooltipValue = (rawValue: number): string => {
    // Determine the format based on the main value
    if (value.includes('K')) {
      // For K values, determine if raw data is already in K format or needs conversion
      if (rawValue < 100) {
        // Raw data is likely already in K format (like 6.9, 7.2, etc.)
        return rawValue.toFixed(1) + 'K'
      } else {
        // Raw data is in full numbers, needs conversion to K
        return (rawValue / 1000).toFixed(1) + 'K'
      }
    } else if (value.includes('%')) {
      // For percentage values, show one decimal place
      return rawValue.toFixed(1) + '%'
    } else if (value.includes('$')) {
      // For dollar values, show whole numbers or one decimal for small amounts
      return rawValue >= 1000 ? '$' + Math.round(rawValue).toLocaleString() : '$' + rawValue.toFixed(1)
    } else if (value.includes(',')) {
      // For comma-separated values, show whole numbers
      return Math.round(rawValue).toLocaleString()
    } else {
      // For simple numbers, match decimal places of the main value
      const mainDecimalPlaces = value.includes('.') ? value.split('.')[1].length : 0
      return rawValue.toFixed(mainDecimalPlaces)
    }
  }
  
  // Calculate chart points for SVG path with smoother curves
  const maxValue = Math.max(...chartData)
  const minValue = Math.min(...chartData)
  const range = maxValue - minValue || 1
  const width = 58 // Adjusted for the narrower w-16 container
  const height = 20
  
  // Create points for polyline
  const points = chartData.map((val, i) => {
    const x = (i / (chartData.length - 1)) * width
    const y = height - ((val - minValue) / range) * height
    return `${x},${y}`
  }).join(' ')
  
  // Generate stable unique ID for gradients using label and value (deterministic)
  const gradientId = useMemo(() => {
    const labelHash = label.split(' ').join('-').toLowerCase()
    const valueHash = value.split('').filter(char => {
      const code = char.charCodeAt(0)
      return (code >= 48 && code <= 57) || (code >= 65 && code <= 90) || (code >= 97 && code <= 122)
    }).join('')
    return `gradient-${labelHash}-${valueHash}`
  }, [label, value])
  
  // Determine colors based on trend
  const getChartColor = () => {
    switch(trend) {
      case 'up': return '#10b981' // green
      case 'down': return '#ef4444' // red
      case 'neutral': return '#F0C351' // yellow
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
      "relative w-36 h-[78px] rounded-lg p-2.5 bg-white dark:bg-[#181818]",
      "hover:bg-gray-50 dark:hover:bg-[#202020] transition-all duration-300 ease-out",
      "cursor-pointer group border border-slate-200/50 dark:border-[#282828]",
      "flex-shrink-0 hover:scale-110 hover:z-50 transform-gpu", // Increased z-index to 50
      "hover:-translate-y-1" // Slight upward movement
    )}>
      {/* Bento-style layout with three rows */}
      <div className="flex flex-col h-full">
        {/* Top row: Headline */}
        <div className="flex-shrink-0 mb-2">
          <p className="text-[9px] text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider truncate">
            {label}
          </p>
        </div>
        
        {/* Middle row: Value and Chart side by side */}
        <div className="flex justify-between items-start flex-1">
          <div className="flex-1">
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight -mt-1">
              {value}
            </p>
          </div>
          
          {/* Chart container - made narrower and positioned higher */}
          <div className="relative w-16 h-5 flex justify-end -mt-1">
          <svg 
            width={width} 
            height={height} 
            className="absolute right-0 cursor-crosshair"
            viewBox={`0 0 ${width} ${height}`}
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const svgX = ((e.clientX - rect.left) / rect.width) * width
              
              // Find closest data point
              const closestIndex = Math.round((svgX / width) * (chartData.length - 1))
              const clampedIndex = Math.max(0, Math.min(chartData.length - 1, closestIndex))
              
              setHoveredIndex(clampedIndex)
            }}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            {/* Drop shadow filter definition - enhanced visibility */}
            <defs>
              <filter id={`shadow-${gradientId}`} x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow 
                  dx="0" 
                  dy="3" 
                  stdDeviation="2.5" 
                  floodColor={chartColor}
                  floodOpacity="0.4"
                />
              </filter>
            </defs>
            
            {/* Main smooth line with drop shadow */}
            <polyline
              points={points}
              fill="none"
              stroke={chartColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter={`url(#shadow-${gradientId})`}
            />
            
            {/* Hover indicator */}
            {hoveredIndex !== null && (() => {
              const hoverX = (hoveredIndex / (chartData.length - 1)) * width
              const hoverY = height - ((chartData[hoveredIndex] - minValue) / range) * height
              return (
                <>
                  {/* Vertical line */}
                  <line
                    x1={hoverX}
                    y1={0}
                    x2={hoverX}
                    y2={height}
                    stroke={chartColor}
                    strokeWidth="1"
                    opacity="0.5"
                    strokeDasharray="2,2"
                  />
                  {/* Hover point */}
                  <circle
                    cx={hoverX}
                    cy={hoverY}
                    r="3"
                    fill={chartColor}
                    stroke="white"
                    strokeWidth="1.5"
                  />
                </>
              )
            })()}
          </svg>
          </div>
        </div>
        
        {/* Bottom row: Full-width percentage change and period */}
        <div className="flex-shrink-0">
          <div className="flex items-center gap-1">
            <span className={cn(
              "text-[10px] font-medium",
              getTrendTextColor()
            )}>
              {change}
            </span>
            <span className="text-[9px] text-slate-400 dark:text-slate-500">
              {period}
            </span>
          </div>
        </div>
      </div>
        
      {/* Absolutely positioned tooltip - positioned relative to the chart area */}
      {hoveredIndex !== null && (() => {
        // Calculate the position of the data point relative to the card
        const hoverX = (hoveredIndex / (chartData.length - 1)) * width
        const hoverY = height - ((chartData[hoveredIndex] - minValue) / range) * height
        
        // Position tooltip relative to the chart container in the new bento layout
        // Chart is now in the middle row, positioned at the right
        const chartOffsetX = 144 - 64 // Card width (144px = w-36) minus chart width (64px = w-16)
        const tooltipLeft = chartOffsetX + hoverX - 3 // Small adjustment for better centering
        const tooltipTop = 24 + hoverY // Accounts for headline (16px) + minimal spacing + middle row positioning
        
        return (
          <div 
            className="absolute pointer-events-none z-50 text-[8px] font-medium tabular-nums"
            style={{
              left: tooltipLeft,
              top: tooltipTop - 20, // Position above the data point
              transform: 'translateX(-50%)', // This centers the tooltip on the vertical line
              color: chartColor, // Use the same color as the graph line
            }}
          >
            {formatTooltipValue(chartData[hoveredIndex])}
          </div>
        )
      })()}
    </div>
  )
}

export default function InteractiveVisualization() {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Three-row marquee container - no background or borders */}
      <div className="relative h-full flex flex-col justify-center gap-1">
          {/* First row - scrolling left */}
          <div className="relative overflow-hidden">
            <Marquee 
              pauseOnHover 
              className="[--duration:60s] [--gap:0.75rem]"
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
              className="[--duration:70s] [--gap:0.75rem]"
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
              className="[--duration:65s] [--gap:0.75rem]"
            >
              {thirdRow.map((card) => (
                <DataCard key={card.id} {...card} />
              ))}
            </Marquee>
          </div>
          
        {/* Enhanced gradient fade edges - responsive to theme background */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#FAFAFA] via-[#FAFAFA]/80 to-transparent dark:from-[#181818] dark:via-[#181818]/80 z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#FAFAFA] via-[#FAFAFA]/80 to-transparent dark:from-[#181818] dark:via-[#181818]/80 z-10" />
        
        {/* Additional subtle inner gradient for smoother transition */}
        <div className="pointer-events-none absolute inset-y-0 left-16 w-8 bg-gradient-to-r from-[#FAFAFA]/60 to-transparent dark:from-[#181818]/60 z-[9]" />
        <div className="pointer-events-none absolute inset-y-0 right-16 w-8 bg-gradient-to-l from-[#FAFAFA]/60 to-transparent dark:from-[#181818]/60 z-[9]" />
      </div>
    </div>
  )
}
