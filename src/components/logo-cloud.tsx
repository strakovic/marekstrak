'use client'
import { GeminiFull } from '@/components/logos/Gemini'
import { Beacon } from '@/components/logos/beacon'
import { Bolt } from '@/components/logos/bolt'
import { Cisco } from '@/components/logos/cisco'
import { Hulu } from '@/components/logos/hulu'
import { OpenAIFull } from '@/components/logos/open-ai'
import { Primevideo } from '@/components/logos/prime'
import { Stripe } from '@/components/logos/stripe'
import { Supabase } from '@/components/logos/supabase'
import { Polars } from '@/components/logos/polars'
import { AnimatePresence, motion } from 'motion/react'
import React, { useEffect, useState } from 'react'
import { Cloudflare } from '@/components/logos/cloudflare'
import { VercelFull } from '@/components/logos/vercel'
import { Spotify } from '@/components/logos/spotify'
import { PayPal } from '@/components/logos/paypal'
import { LeapWallet } from '@/components/logos/leap-wallet'
import { cn } from '@/lib/utils'

const aiLogos: React.ReactNode[] = [
    <OpenAIFull
        height={24}
        width="auto"
    />,
    <Bolt
        height={20}
        width="auto"
    />,
    <GeminiFull
        height={24}
        width="auto"
        className="-translate-y-0.5"
    />,
]

const hostingLogos: React.ReactNode[] = [
    <Supabase
        height={24}
        width="auto"
    />,
    <Cloudflare
        height={24}
        width="auto"
    />,
    <VercelFull
        height={20}
        width="auto"
    />,
]

const paymentsLogos: React.ReactNode[] = [
    <Stripe
        height={24}
        width="auto"
    />,
    <PayPal
        height={24}
        width="auto"
    />,
    <LeapWallet
        height={24}
        width="auto"
    />,
]

const streamingLogos: React.ReactNode[] = [
    <Primevideo
        height={28}
        width="auto"
    />,
    <Hulu
        height={22}
        width="auto"
    />,
    <Spotify
        height={24}
        width="auto"
    />,
]

const otherLogos: React.ReactNode[] = [
    <Cisco
        height={32}
        width="auto"
    />,
    <Beacon
        height={20}
        width="auto"
    />,
    <Polars
        height={24}
        width="auto"
    />,
]

const logoGroups = [aiLogos, hostingLogos, paymentsLogos, streamingLogos, otherLogos]

export default function LogoCloudTwo() {
    const [logoIndices, setLogoIndices] = useState([0, 0, 0, 0, 0])

    useEffect(() => {
        let wrapperIndex = 0
        const interval = setInterval(() => {
            setLogoIndices((prev) => {
                const newIndices = [...prev]
                const groupLogos = logoGroups[wrapperIndex]
                newIndices[wrapperIndex] = (newIndices[wrapperIndex] + 1) % groupLogos.length
                return newIndices
            })
            wrapperIndex = (wrapperIndex + 1) % logoGroups.length
        }, 2000)

        return () => clearInterval(interval)
    }, [])

    return (
        <section className="">
            <div className="mx-auto max-w-5xl px-6">
                <div className="grid grid-cols-2 gap-y-6 md:grid-cols-4 lg:grid-cols-5">
                    <LogoWrapper
                        logos={aiLogos}
                        group="ai"
                        logoIndex={logoIndices[1]}
                    />
                    <LogoWrapper
                        logos={hostingLogos}
                        group="hosting"
                        logoIndex={logoIndices[3]}
                    />
                    <LogoWrapper
                        logos={paymentsLogos}
                        group="payments"
                        logoIndex={logoIndices[0]}
                    />
                    <LogoWrapper
                        logos={streamingLogos}
                        group="streaming"
                        logoIndex={logoIndices[4]}
                    />
                    <LogoWrapper
                        logos={otherLogos}
                        group="other"
                        logoIndex={logoIndices[2]}
                        className="max-lg:hidden"
                    />
                </div>
            </div>
        </section>
    )
}

const LogoWrapper = ({ logos, group, logoIndex = 0, className }: { logos: React.ReactNode[]; group?: string; logoIndex?: number; className?: string }) => {
    return (
        <div className={cn('relative h-10', className)}>
            <AnimatePresence
                mode="popLayout"
                initial={false}>
                <motion.div
                    key={`${group}-${logoIndex}`}
                    initial={{ opacity: 0, scale: 0.75, y: -24, filter: 'blur(6px)' }}
                    animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.75, y: 24, filter: 'blur(6px)' }}
                    transition={{ duration: 0.5 }}
                    className="absolute inset-0 flex *:m-auto">
                    {logos[logoIndex]}
                </motion.div>
            </AnimatePresence>
        </div>
    )
}