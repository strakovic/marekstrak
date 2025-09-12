"use client"

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { LogoIcon } from '@/components/logo'
import { DocumentIllustation } from "@/components/document-illustration"
import ElegantNumberCounter from '@/components/ui/elegant-number-counter'
import { AnimatedProgressBar } from '@/components/ui/animated-progress-bar'
import { Button, ButtonGroup } from '@heroui/button'
import { Pen2Icon } from '@/components/icons/pen-2'
import { Zap, Coins, Edit3, Check, X, Send, Bell } from 'lucide-react'

export const InvoiceIllustration = ({ className }: { className?: string }) => {
    const [isEditingPrice, setIsEditingPrice] = useState(false)
    const [priceValue, setPriceValue] = useState('0.012')
    const [tempPriceValue, setTempPriceValue] = useState('0.012')
    
    // Calculate predicted value based on price (base calculation: 128457 tokens * price per token)
    const basePredictionTokens = 128457
    const calculatePredictedValue = (price: string) => {
        const priceNum = parseFloat(price) || 0.012
        return Math.round(basePredictionTokens * priceNum)
    }
    
    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num)
    }

    const handleEditClick = () => {
        setTempPriceValue(priceValue)
        setIsEditingPrice(true)
    }

    const handleApprove = () => {
        setPriceValue(tempPriceValue)
        setIsEditingPrice(false)
    }

    const handleCancel = () => {
        setTempPriceValue(priceValue)
        setIsEditingPrice(false)
    }

    return (
        <div
            aria-hidden
            className="relative">
            <div className={cn('mask-b-from-65% group relative -mx-4 px-4 pt-6', className)}>
                <div className="bg-illustration relative z-10 overflow-hidden rounded-2xl p-8 text-sm shadow-xl shadow-black/10 border border-foreground/10">
                    <div className="mb-6 flex items-start justify-between">
                        <div className="space-y-0.5">
                            <LogoIcon />
                            <div className="mt-4 font-neue-montreal-book text-xs">INV-456789</div>
                            <div className="mt-1 -translate-x-1">
                                <ElegantNumberCounter 
                                    startingNumber={284342}
                                    className="font-neue-montreal-bold text-2xl"
                                />
                            </div>
                            <div className="text-xs font-medium text-muted-foreground flex items-center justify-between">
                                <span>Billed in 15 days</span>
                                <span className="text-foreground font-neue-montreal-medium">
                                    Predicted ${formatNumber(calculatePredictedValue(priceValue))}
                                </span>
                            </div>
                        </div>
                        <DocumentIllustation />
                    </div>

                    <div className="space-y-2 [--color-border:color-mix(in_oklab,var(--color-foreground)10%,transparent)]">
                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-xs">Usage:</span>
                            <AnimatedProgressBar 
                                value={51.4} 
                                className="flex-1" 
                                duration={4000}
                                startOnVisible={true}
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground text-xs">Unit Price:</span>
                            {!isEditingPrice ? (
                                <>
                                    <span className="text-foreground text-xs font-medium">${priceValue}/token</span>
                                    <button 
                                        onClick={handleEditClick}
                                        className="text-muted-foreground hover:text-brand transition-colors p-0.5 rounded hover:bg-muted"
                                        aria-label="Edit price"
                                    >
                                        <Pen2Icon size={12} className="text-current" />
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <span className="text-foreground text-xs">$</span>
                                    <input 
                                        type="text" 
                                        value={tempPriceValue}
                                        onChange={(e) => setTempPriceValue(e.target.value)}
                                        className="w-14 px-1 py-0.5 text-xs border border-border rounded bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-brand"
                                        autoFocus
                                    />
                                    <span className="text-foreground text-xs">/token</span>
                                    <button 
                                        onClick={handleApprove}
                                        className="text-green-600 hover:text-green-700 transition-colors p-0.5 rounded hover:bg-muted"
                                        aria-label="Approve changes"
                                    >
                                        <Check className="h-3 w-3" />
                                    </button>
                                    <button 
                                        onClick={handleCancel}
                                        className="text-red-500 hover:text-red-600 transition-colors p-0.5 rounded hover:bg-muted"
                                        aria-label="Cancel changes"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="pt-4">
                            <ButtonGroup size="sm" className="w-full">
                                <Button 
                                    variant="bordered" 
                                    startContent={<Send className="h-4 w-4" />}
                                    className="flex-1"
                                >
                                    Send
                                </Button>
                                <Button 
                                    variant="bordered" 
                                    startContent={<Pen2Icon size={16} className="text-current" />}
                                    className="flex-1"
                                >
                                    Edit
                                </Button>
                                <Button 
                                    variant="bordered" 
                                    startContent={<Bell className="h-4 w-4" />}
                                    className="flex-1"
                                >
                                    Notifications
                                </Button>
                            </ButtonGroup>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
