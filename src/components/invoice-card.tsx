"use client"

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'
import { LogoIcon } from '@/components/logo'
import ElegantNumberCounter from '@/components/ui/elegant-number-counter'
import { AnimatedGradientText } from '@/components/magicui/animated-gradient-text'
import { Button as HeroUIButton } from '@heroui/button'
import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Pencil, Check, X, Bell, Send, Download, Share2, FileText, Play, Pause } from 'lucide-react'

interface InvoiceData {
    id: string
    currentAmount: number
    daysRemaining: number
    predictedAmount: number
    tokensUsed: number
    dailyGrowthRate: number
    historicalData?: number[]
    originalUnitPrice?: number
}

interface ModelData {
    id: string
    name: string
    share: number
    pricePerToken: number
}

// Activity Graph Component
const ActivityGraph = ({ data, predictions, isAnimating, unitPrice, currentAmount, predictedAmount, originalUnitPrice, isPaused }: { 
    data: number[], 
    predictions: number[],
    isAnimating: boolean,
    unitPrice: number,
    currentAmount: number,
    predictedAmount: number,
    originalUnitPrice?: number,
    isPaused?: boolean
}) => {
    const svgRef = useRef<SVGSVGElement>(null)
    const [pathLength, setPathLength] = useState(0)
    const [predPathLength, setPredPathLength] = useState(0)
    const [hoveredPoint, setHoveredPoint] = useState<{x: number, y: number, value: number, index: number, type: 'historical' | 'prediction'} | null>(null)
    const [mouseX, setMouseX] = useState<number | null>(null)
    
    // Graph dimensions
    const graphHeight = 50
    const graphWidth = 100
    const pointSpacing = graphWidth / (data.length + predictions.length - 1)
    
    // Build cumulative dollar values that match invoice amounts
    const totalDays = data.length + predictions.length
    const dailyTokens = [...data, ...predictions]
    const cumulativeValues: number[] = []
    
    // Calculate cumulative values that scale to match actual invoice amounts
    let runningTotal = 0
    for (let i = 0; i < dailyTokens.length; i++) {
        runningTotal += dailyTokens[i]
    }
    
    // Scale factor to make the graph match the invoice amounts
    const currentTokensUsed = data.reduce((sum, val) => sum + val, 0)
    const projectedTokensUsed = predictions.reduce((sum, val) => sum + val, 0)
    const totalTokensUsed = currentTokensUsed + projectedTokensUsed
    
    // Calculate whether price has changed significantly
    const priceChangeRatio = originalUnitPrice ? unitPrice / originalUnitPrice : 1
    const hasPriceChange = Math.abs(priceChangeRatio - 1) > 0.1 // More than 10% change
    
    // Calculate cumulative values with proper scaling
    let cumulativeTokens = 0
    let cumulativeDollars = 0
    
    for (let i = 0; i < dailyTokens.length; i++) {
        cumulativeTokens += dailyTokens[i]
        
        if (i < data.length - 1) {
            // Historical data - use original prices
            cumulativeDollars += dailyTokens[i] * (originalUnitPrice || unitPrice)
            cumulativeValues[i] = cumulativeDollars
        } else if (i === data.length - 1) {
            // Today - transition point if price changed
            if (hasPriceChange) {
                // Show price jump at current day
                const todayTokens = dailyTokens[i]
                const oldPrice = cumulativeDollars + (todayTokens * (originalUnitPrice || unitPrice))
                const newPrice = cumulativeDollars + (todayTokens * unitPrice)
                cumulativeValues[i] = currentAmount // Use actual current amount
                cumulativeDollars = currentAmount
            } else {
                cumulativeDollars += dailyTokens[i] * unitPrice
                cumulativeValues[i] = cumulativeDollars
            }
        } else {
            // Future predictions - use new price
            cumulativeDollars += dailyTokens[i] * unitPrice
            cumulativeValues[i] = cumulativeDollars
        }
    }
    
    // Adjust final values to match invoice amounts
    if (cumulativeValues.length > 0) {
        const lastHistoricalIndex = data.length - 1
        const lastPredictionIndex = cumulativeValues.length - 1
        
        // Scale historical values to match current amount
        const historicalScale = currentAmount / (cumulativeValues[lastHistoricalIndex] || 1)
        for (let i = 0; i <= lastHistoricalIndex; i++) {
            cumulativeValues[i] *= historicalScale
        }
        
        // Scale prediction values to match predicted amount
        if (lastPredictionIndex > lastHistoricalIndex) {
            const predictionScale = (predictedAmount - currentAmount) / 
                ((cumulativeValues[lastPredictionIndex] - cumulativeValues[lastHistoricalIndex]) || 1)
            for (let i = lastHistoricalIndex + 1; i <= lastPredictionIndex; i++) {
                cumulativeValues[i] = currentAmount + 
                    ((cumulativeValues[i] - cumulativeValues[lastHistoricalIndex]) * predictionScale)
            }
        }
    }
    
    // Use cumulative dollar data for graph display
    const graphData = cumulativeValues.slice(0, data.length)
    const graphPredictions = cumulativeValues.slice(data.length)
    
    // Set max value to match predicted amount with small padding
    const maxValue = predictedAmount * 1.05
    
    // Create path for historical cumulative data
    const historicalPath = graphData.map((value, index) => {
        const x = index * pointSpacing
        const y = graphHeight - (value / maxValue) * graphHeight
        return index === 0 ? `M ${x} ${y}` : `L ${x} ${y}`
    }).join(' ')
    
    // Create path for predictions (continues from last historical point)
    const lastHistoricalX = (data.length - 1) * pointSpacing
    const lastHistoricalY = graphHeight - (graphData[graphData.length - 1] / maxValue) * graphHeight
    
    const predictionPath = graphPredictions.map((value, index) => {
        const x = (data.length + index) * pointSpacing
        const y = graphHeight - (value / maxValue) * graphHeight
        return index === 0 ? `M ${lastHistoricalX} ${lastHistoricalY} L ${x} ${y}` : `L ${x} ${y}`
    }).join(' ')
    
    useEffect(() => {
        if (svgRef.current) {
            const historicalPathEl = svgRef.current.querySelector('.historical-path') as SVGPathElement
            const predictionPathEl = svgRef.current.querySelector('.prediction-path') as SVGPathElement
            
            if (historicalPathEl) {
                const length = historicalPathEl.getTotalLength()
                setPathLength(length)
            }
            if (predictionPathEl) {
                const length = predictionPathEl.getTotalLength()
                setPredPathLength(length)
            }
        }
    }, [historicalPath, predictionPath])
    
    const formatCurrency = (tokens: number) => {
        const amount = tokens * unitPrice
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(amount)
    }
    
    const handleMouseMove = (e: React.MouseEvent<SVGElement>) => {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const pointIndex = Math.round(x / pointSpacing)
        
        if (pointIndex >= 0 && pointIndex < cumulativeValues.length) {
            const actualX = pointIndex * pointSpacing
            const y = graphHeight - (cumulativeValues[pointIndex] / maxValue) * graphHeight
            
            setHoveredPoint({
                x: actualX,
                y,
                value: cumulativeValues[pointIndex],
                index: pointIndex,
                type: pointIndex < data.length ? 'historical' : 'prediction'
            })
            setMouseX(actualX)
        }
    }
    
    const handleMouseLeave = () => {
        setHoveredPoint(null)
        setMouseX(null)
    }
    
    return (
        <div className="relative">
            <svg 
                ref={svgRef}
                width={graphWidth} 
                height={graphHeight} 
                className="overflow-visible cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Vertical hover line */}
                {mouseX !== null && (
                    <line
                        x1={mouseX}
                        y1={0}
                        x2={mouseX}
                        y2={graphHeight}
                        stroke="#F9620C"
                        strokeWidth={1}
                        strokeDasharray="2 2"
                        className="pointer-events-none"
                    />
                )}
                
                {/* Historical data path - solid line */}
                <path
                    className="historical-path"
                    d={historicalPath}
                    fill="none"
                    stroke="#F9620C"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                
                {/* Prediction path - dashed line with transparency */}
                <path
                    className="prediction-path"
                    d={predictionPath}
                    fill="none"
                    stroke="#F9620C"
                    strokeWidth={2}
                    strokeOpacity={isPaused ? 0.2 : 0.4}
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                
                {/* Current point indicator */}
                <circle
                    cx={(data.length - 1) * pointSpacing}
                    cy={graphHeight - (graphData[graphData.length - 1] / maxValue) * graphHeight}
                    r={3}
                    fill="#F9620C"
                    className={isAnimating && !isPaused ? 'animate-pulse' : ''}
                />
                
                {/* Hover dot on line */}
                {hoveredPoint && (
                    <circle
                        cx={hoveredPoint.x}
                        cy={hoveredPoint.y}
                        r={4}
                        fill="#F9620C"
                        stroke="white"
                        strokeWidth={2}
                        className="pointer-events-none"
                    />
                )}
            </svg>
            
            {/* Hover tooltip - showing just the number at top of line */}
            {hoveredPoint && (
                <div 
                    className="absolute pointer-events-none text-xs font-medium whitespace-nowrap z-50"
                    style={{
                        left: `${hoveredPoint.x}px`,
                        top: '-20px',
                        transform: 'translateX(-50%)',
                        color: '#F9620C'
                    }}
                >
                    {Math.floor(hoveredPoint.value).toLocaleString()}
                </div>
            )}
        </div>
    )
}

export const InvoiceCard = ({ className }: { className?: string }) => {
    const [shakeInput, setShakeInput] = useState<string | null>(null)
    const [isLivePaused, setIsLivePaused] = useState(false)
    
    // Generate models first as we need them for calculations
    const generateModels = (): ModelData[] => {
        const availableModels = ['gpt-5', 'gpt-4.2', 'gpt-4o', 'o3', 'o4-mini', 'gpt-4.1']
        const selectedModels = [...availableModels].sort(() => 0.5 - Math.random()).slice(0, 3)
        
        const firstShare = 40
        const secondShare = Math.floor(Math.random() * 30) + 20 // 20-50
        const thirdShare = 100 - firstShare - secondShare
        
        return [
            { id: 'm1', name: selectedModels[0], share: firstShare, pricePerToken: 0.012 },
            { id: 'm2', name: selectedModels[1], share: secondShare, pricePerToken: 0.018 },
            { id: 'm3', name: selectedModels[2], share: thirdShare, pricePerToken: 0.009 }
        ]
    }
    
    // Initialize with static data for SSR
    const [models, setModels] = useState<ModelData[]>([
        { id: 'm1', name: 'gpt-4o', share: 40, pricePerToken: 0.012 },
        { id: 'm2', name: 'gpt-5', share: 35, pricePerToken: 0.018 },
        { id: 'm3', name: 'o3', share: 25, pricePerToken: 0.009 }
    ])
    
    const [invoice, setInvoice] = useState<InvoiceData | null>(null)
    const [editingModelId, setEditingModelId] = useState<string | null>(null)
    const [editingPrice, setEditingPrice] = useState<string>('')
    
    // Generate fresh data on client mount
    useEffect(() => {
        const newModels = generateModels()
        const newInvoice = generateInvoiceData(newModels)
        setModels(newModels)
        setInvoice(newInvoice)
    }, [])
    
    // Generate random invoice data based on models
    const generateInvoiceData = (currentModels: ModelData[]): InvoiceData => {
        // Calculate weighted average price per token
        const avgPricePerToken = currentModels.reduce((sum, m) => sum + (m.share / 100) * m.pricePerToken, 0)
        
        const baseAmount = Math.floor(Math.random() * 300000 + 200000) // 200k-500k range
        const tokensUsed = Math.floor(baseAmount / avgPricePerToken) // Calculate tokens based on weighted price
        const daysRemaining = 15
        const daysElapsed = 30 - daysRemaining
        const dailyGrowthRate = 0.05 + Math.random() * 0.1 // 5-15% daily growth
        
        // Generate realistic historical token usage data with company-like patterns
        const historicalData: number[] = []
        let cumulativeUsage = 0
        
        // Company-specific patterns
        const companySize = Math.random() > 0.5 ? 'large' : 'medium'
        const hasWeekendOps = Math.random() > 0.7 // 30% chance of weekend operations
        const peakDay = Math.floor(Math.random() * 5) + 1 // Random peak weekday
        
        for (let i = 0; i < daysElapsed; i++) {
            const dayOfWeek = i % 7 // 0 = Sunday, 6 = Saturday
            let dailyUsage = 0
            const baseDaily = tokensUsed / 22 // Base on ~22 working days per month
            
            // Day of week patterns
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                // Weekend
                if (hasWeekendOps) {
                    dailyUsage = baseDaily * (0.3 + Math.random() * 0.3) // 30-60% usage
                } else {
                    dailyUsage = baseDaily * (0.05 + Math.random() * 0.15) // 5-20% usage
                }
            } else if (dayOfWeek === 1) {
                // Monday - ramp up
                dailyUsage = baseDaily * (0.7 + Math.random() * 0.3)
            } else if (dayOfWeek === peakDay) {
                // Peak day - highest usage
                dailyUsage = baseDaily * (1.3 + Math.random() * 0.4)
            } else if (dayOfWeek === 5) {
                // Friday - wind down
                dailyUsage = baseDaily * (0.8 + Math.random() * 0.2)
            } else {
                // Regular weekdays
                dailyUsage = baseDaily * (0.9 + Math.random() * 0.3)
            }
            
            // Add random events
            const eventChance = Math.random()
            if (eventChance < 0.05) {
                // 5% chance of major spike (product launch, processing job)
                dailyUsage *= (1.5 + Math.random() * 0.8)
            } else if (eventChance < 0.1) {
                // 5% chance of low usage (maintenance, holiday)
                dailyUsage *= (0.2 + Math.random() * 0.3)
            }
            
            // Time-based variations (morning/evening in different timezones)
            const timeVariation = Math.sin(i * 0.3 + Math.random() * Math.PI) * 0.15 + 1
            dailyUsage *= timeVariation
            
            // Apply growth trend with some volatility
            const growthNoise = (Math.random() - 0.5) * 0.02
            dailyUsage *= (1 + (i / daysElapsed) * (dailyGrowthRate + growthNoise))
            
            // Ensure non-negative
            dailyUsage = Math.max(0, dailyUsage)
            
            cumulativeUsage += dailyUsage
            historicalData.push(dailyUsage)
        }
        
        // Adjust to match actual tokens used with some final smoothing
        const scaleFactor = tokensUsed / cumulativeUsage
        for (let i = 0; i < historicalData.length; i++) {
            historicalData[i] *= scaleFactor
            // Smooth extreme spikes slightly
            if (i > 0 && i < historicalData.length - 1) {
                const avg = (historicalData[i-1] + historicalData[i+1]) / 2
                if (historicalData[i] > avg * 2.5) {
                    historicalData[i] = historicalData[i] * 0.7 + avg * 0.3
                }
            }
        }
        
        // Calculate predicted amount based on growth
        const currentDailyUsage = tokensUsed / daysElapsed
        let projectedTokens = 0
        let dailyUsage = currentDailyUsage
        
        for (let day = 1; day <= daysRemaining; day++) {
            projectedTokens += dailyUsage
            dailyUsage *= (1 + dailyGrowthRate)
        }
        
        const projectedAmount = projectedTokens * avgPricePerToken
        
        return {
            id: `INV-${Math.floor(Math.random() * 900000 + 100000)}`,
            currentAmount: baseAmount,
            daysRemaining: daysRemaining,
            predictedAmount: Math.round(baseAmount + projectedAmount),
            tokensUsed: tokensUsed,
            dailyGrowthRate: dailyGrowthRate,
            historicalData: historicalData,
            originalUnitPrice: avgPricePerToken
        }
    }
    
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num)
    }
    
    const handleEditPrice = (modelId: string, currentPrice: number) => {
        setEditingModelId(modelId)
        setEditingPrice(currentPrice.toString())
    }
    
    const handleSavePrice = (modelId: string) => {
        const newPrice = parseFloat(editingPrice)
        if (!isNaN(newPrice) && newPrice > 0 && invoice) {
            // Store original price if this is the first edit
            if (!invoice.originalUnitPrice) {
                const currentAvgPrice = models.reduce((sum, m) => sum + (m.share / 100) * m.pricePerToken, 0)
                setInvoice(prev => prev ? { ...prev, originalUnitPrice: currentAvgPrice } : null)
            }
            
            const updatedModels = models.map(model => 
                model.id === modelId ? { ...model, pricePerToken: newPrice } : model
            )
            setModels(updatedModels)
            
            // Recalculate invoice with new prices
            const avgPricePerToken = updatedModels.reduce((sum, m) => sum + (m.share / 100) * m.pricePerToken, 0)
            const currentDailyUsage = invoice.tokensUsed / (30 - invoice.daysRemaining)
            let projectedTokens = 0
            let dailyUsage = currentDailyUsage
            
            for (let day = 1; day <= invoice.daysRemaining; day++) {
                projectedTokens += dailyUsage
                dailyUsage *= (1 + invoice.dailyGrowthRate)
            }
            
            const projectedAmount = projectedTokens * avgPricePerToken
            // Calculate current amount based on elapsed days
            const elapsedDays = 30 - invoice.daysRemaining
            const tokensUsedSoFar = (invoice.tokensUsed / 30) * elapsedDays
            const newCurrentAmount = tokensUsedSoFar * avgPricePerToken
            
            setInvoice(prev => prev ? ({
                ...prev,
                currentAmount: Math.round(newCurrentAmount),
                predictedAmount: Math.round(newCurrentAmount + projectedAmount)
            }) : null)
        }
        setEditingModelId(null)
        setEditingPrice('')
    }
    
    const handleCancelEdit = () => {
        setEditingModelId(null)
        setEditingPrice('')
    }
    
    // Generate prediction data for graph with realistic company patterns
    const generatePredictions = (data: InvoiceData): number[] => {
        const predictions: number[] = []
        const avgDailyUsage = data.tokensUsed / (30 - data.daysRemaining)
        const baseDaily = avgDailyUsage * 22 / 30 // Adjust for working days
        
        // Continue company patterns from historical data
        const hasWeekendOps = data.historicalData && 
            data.historicalData.some((val, idx) => (idx % 7 === 0 || idx % 7 === 6) && val > avgDailyUsage * 0.3)
        const currentDayIndex = 30 - data.daysRemaining
        
        for (let day = 1; day <= data.daysRemaining; day++) {
            const dayOfWeek = (currentDayIndex + day - 1) % 7
            let dailyUsage = 0
            
            // Continue weekday patterns
            if (dayOfWeek === 0 || dayOfWeek === 6) {
                // Weekend
                if (hasWeekendOps) {
                    dailyUsage = baseDaily * (0.3 + Math.random() * 0.3)
                } else {
                    dailyUsage = baseDaily * (0.05 + Math.random() * 0.15)
                }
            } else if (dayOfWeek === 1) {
                // Monday
                dailyUsage = baseDaily * (0.7 + Math.random() * 0.3)
            } else if (dayOfWeek === 5) {
                // Friday
                dailyUsage = baseDaily * (0.8 + Math.random() * 0.2)
            } else {
                // Tuesday-Thursday
                dailyUsage = baseDaily * (0.95 + Math.random() * 0.35)
            }
            
            // Add prediction uncertainty (increases further into future)
            const uncertaintyFactor = 1 + (day / data.daysRemaining) * 0.2
            dailyUsage *= (0.8 + Math.random() * 0.4 * uncertaintyFactor)
            
            // Random events (less frequent than historical)
            if (Math.random() < 0.03) {
                dailyUsage *= (1.3 + Math.random() * 0.5)
            }
            
            // Apply growth with volatility
            const growthNoise = (Math.random() - 0.5) * 0.03
            dailyUsage *= (1 + data.dailyGrowthRate + growthNoise)
            
            // Seasonal pattern
            const seasonalFactor = Math.sin((currentDayIndex + day) * 0.2) * 0.1 + 1
            dailyUsage *= seasonalFactor
            
            predictions.push(Math.max(0, dailyUsage))
        }
        
        return predictions
    }
    
    // Return loading state if invoice not ready
    if (!invoice) {
        return (
            <div className={cn("relative w-full", className)}>
                <div className="relative bg-white dark:bg-[#0A0A0A] rounded-t-2xl p-8 shadow-xl dark:shadow-white/20 border-t border-l border-r border-zinc-200 dark:border-[#282828] overflow-hidden">
                    <div className="animate-pulse">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        )
    }
    
    return (
        <div className={cn("relative w-full", className)}>
            {/* Card container */}
            <div className="relative bg-white dark:bg-[#0A0A0A] rounded-t-2xl pt-8 px-8 pb-16 shadow-xl dark:shadow-white/20 border-t border-l border-r border-zinc-200 dark:border-[#282828] overflow-hidden">
                
                {/* Top-right actions menu */}
                <div className="absolute top-4 right-4 z-20">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <HeroUIButton isIconOnly size="sm" variant="light" className="text-foreground/80 hover:text-foreground relative">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                                    <circle cx="12" cy="5" r="1.6" />
                                    <circle cx="12" cy="12" r="1.6" />
                                    <circle cx="12" cy="19" r="1.6" />
                                </svg>
                                {/* Red indicator dot */}
                                <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-red-500 rounded-full pointer-events-none" />
                            </HeroUIButton>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="min-w-[14rem]">
                            <DropdownMenuItem
                                onClick={() => {
                                    // Find and click the first price edit button
                                    const firstModel = models[0]
                                    if (firstModel) {
                                        handleEditPrice(firstModel.id, firstModel.pricePerToken)
                                    }
                                }}
                            >
                                <Pencil className="mr-2 h-3.5 w-3.5" />
                                Edit Prices
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setIsLivePaused(prev => !prev)}
                                className="relative"
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center">
                                        {isLivePaused ? (
                                            <Play className="mr-2 h-3.5 w-3.5" />
                                        ) : (
                                            <Pause className="mr-2 h-3.5 w-3.5" />
                                        )}
                                        {isLivePaused ? 'Resume' : 'Pause'}
                                    </div>
                                    {/* Red indicator dot for this menu item */}
                                    <div className="w-1 h-1 bg-red-500 rounded-full flex-shrink-0 ml-3" />
                                </div>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled>
                                <Bell className="mr-2 h-3.5 w-3.5" />
                                Set Notification
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <Send className="mr-2 h-3.5 w-3.5" />
                                Send
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <FileText className="mr-2 h-3.5 w-3.5" />
                                Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem disabled>
                                <Download className="mr-2 h-3.5 w-3.5" />
                                Download
                            </DropdownMenuItem>
                            <DropdownMenuItem disabled>
                                <Share2 className="mr-2 h-3.5 w-3.5" />
                                Share
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                
                {/* Two column layout */}
                <div className="grid grid-cols-2 gap-4 mb-2">
                    {/* Left column */}
                    <div>
                        <LogoIcon 
                            className="mb-3 -ml-1" 
                            isPaused={isLivePaused}
                        />
                        <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-1">
                            {invoice.id}
                        </div>
                        <div>
                            <ElegantNumberCounter 
                                startingNumber={invoice.currentAmount}
                                className="font-neue-montreal-bold text-2xl"
                                disabled={isLivePaused}
                            />
                        </div>
                    </div>
                    
                    {/* Right column - Activity Graph */}
                    <div className="flex items-end justify-end">
                        <ActivityGraph 
                            data={invoice.historicalData || []}
                            predictions={generatePredictions(invoice)}
                            isAnimating={!isLivePaused}
                            unitPrice={models.reduce((sum, m) => sum + (m.share / 100) * m.pricePerToken, 0)}
                            currentAmount={invoice.currentAmount}
                            predictedAmount={invoice.predictedAmount}
                            originalUnitPrice={invoice.originalUnitPrice}
                            isPaused={isLivePaused}
                        />
                    </div>
                </div>
                
                {/* Billing prediction */}
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mb-6">
                    <span>Billed in {invoice.daysRemaining} days (est. </span>
                    <AnimatedGradientText 
                        className="text-xs font-neue-montreal-medium inline"
                        colorFrom="#10b981"
                        colorTo="#06d6a0"
                        speed={0.3}
                    >
                        ${formatNumber(invoice.predictedAmount)}
                    </AnimatedGradientText>
                    <span>)</span>
                </div>
                
                {/* Model usage rows */}
                <div className="space-y-2">
                    {models.map((model) => (
                        <div key={model.id} className="flex items-center gap-2 group">
                            {/* Model name */}
                            <div className="flex-1 text-sm font-neue-montreal-book truncate">
                                {model.name}
                            </div>
                            
                            {/* Bar and percentage grouped together */}
                            <div className="flex items-center">
                                {/* Progress bar */}
                                <div className="w-16 h-1.5 rounded-full bg-zinc-200 dark:bg-[#282828] overflow-hidden">
                                    <div
                                        className="h-full bg-[#111621] dark:bg-white transition-all"
                                        style={{ width: `${model.share}%` }}
                                    />
                                </div>
                                
                                {/* Percentage */}
                                <div className="text-xs text-zinc-500 w-10 text-right">
                                    {model.share}%
                                </div>
                            </div>
                            
                            {/* Price with edit functionality */}
                            <div className="flex items-center gap-0.5">
                                {editingModelId === model.id ? (
                                    <div className="flex items-center gap-1">
                                        <Input
                                            type="number"
                                            value={editingPrice}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                // Only allow numbers and one decimal point
                                                if (/^\d*\.?\d*$/.test(value)) {
                                                    if (value.length <= 6) {
                                                        setEditingPrice(value)
                                                    } else {
                                                        // Trigger shake animation
                                                        setShakeInput(model.id)
                                                        setTimeout(() => setShakeInput(null), 200)
                                                    }
                                                }
                                            }}
                                            className={cn(
                                                "w-16 h-6 text-xs px-1",
                                                shakeInput === model.id && "animate-shake"
                                            )}
                                            step="0.001"
                                            min="0"
                                            max="9.999"
                                            autoFocus
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSavePrice(model.id)
                                                } else if (e.key === 'Escape') {
                                                    handleCancelEdit()
                                                } else if (
                                                    editingPrice.length >= 6 && 
                                                    !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'ArrowUp', 'ArrowDown'].includes(e.key) &&
                                                    !e.ctrlKey && !e.metaKey
                                                ) {
                                                    // Shake on any character input when at limit
                                                    e.preventDefault()
                                                    setShakeInput(model.id)
                                                    setTimeout(() => setShakeInput(null), 200)
                                                }
                                            }}
                                        />
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 w-6 p-0"
                                            onClick={() => handleSavePrice(model.id)}
                                        >
                                            <Check className="h-3 w-3 text-green-600" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 w-6 p-0"
                                            onClick={handleCancelEdit}
                                        >
                                            <X className="h-3 w-3 text-red-600" />
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="text-xs text-zinc-600 dark:text-zinc-400 w-20 text-right">
                                            ${model.pricePerToken.toFixed(3)}/token
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground transition-colors"
                                            onClick={() => handleEditPrice(model.id, model.pricePerToken)}
                                        >
                                            <Pencil className="h-2 w-2" style={{ transform: 'scale(0.9)' }} />
                                        </Button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Gradient fade overlay at bottom - fades to website background */}
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-9 bg-gradient-to-t from-muted/90 via-white/60 dark:from-[#090D14] dark:via-[#090D14]/60 to-transparent" />
            </div>
        </div>
    )
}