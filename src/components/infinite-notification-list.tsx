'use client'

import React, { useEffect, useState, useRef } from 'react'
import { cn } from '@/lib/utils'
import { Database, Zap, Cloud, ShieldCheck, Sparkles, Webhook, Mail, GitBranch, Bell, Activity } from 'lucide-react'

const notifications = [
  {
    name: "Stripe Connected",
    description: "Payment gateway is ready",
    icon: <Zap className="h-4 w-4" />,
    color: "bg-yellow-500",
    time: "Just now"
  },
  {
    name: "Database Synced",
    description: "PostgreSQL connected successfully",
    icon: <Database className="h-4 w-4" />,
    color: "bg-green-500",
    time: "2 sec ago"
  },
  {
    name: "AWS Integration",
    description: "Cloud storage is configured",
    icon: <Cloud className="h-4 w-4" />,
    color: "bg-blue-500",
    time: "5 sec ago"
  },
  {
    name: "Webhook Created",
    description: "Real-time events configured",
    icon: <Webhook className="h-4 w-4" />,
    color: "bg-orange-500",
    time: "7 sec ago"
  },
  {
    name: "Email Service",
    description: "SendGrid integration complete",
    icon: <Mail className="h-4 w-4" />,
    color: "bg-indigo-500",
    time: "9 sec ago"
  },
  {
    name: "Git Repository",
    description: "GitHub webhook established",
    icon: <GitBranch className="h-4 w-4" />,
    color: "bg-gray-600",
    time: "11 sec ago"
  },
  {
    name: "Security Updated",
    description: "Auth0 authentication enabled",
    icon: <ShieldCheck className="h-4 w-4" />,
    color: "bg-purple-500",
    time: "13 sec ago"
  },
  {
    name: "Notifications Live",
    description: "Push notifications activated",
    icon: <Bell className="h-4 w-4" />,
    color: "bg-teal-500",
    time: "15 sec ago"
  },
  {
    name: "AI Features Active",
    description: "OpenAI API connected",
    icon: <Sparkles className="h-4 w-4" />,
    color: "bg-pink-500",
    time: "17 sec ago"
  },
  {
    name: "Monitoring Started",
    description: "Datadog analytics running",
    icon: <Activity className="h-4 w-4" />,
    color: "bg-red-500",
    time: "20 sec ago"
  }
]

export default function InfiniteNotificationList() {
  const [items, setItems] = useState<Array<{notification: typeof notifications[0], id: string}>>([])
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let index = 0
    
    // Add first item
    const firstTimeout = setTimeout(() => {
      setItems([{
        notification: notifications[0],
        id: `${Date.now()}-0`
      }])
      index = 1
    }, 300)

    // Add new notifications every 2 seconds
    const interval = setInterval(() => {
      const currentNotification = notifications[index % notifications.length]
      
      setItems(prevItems => {
        const newItem = {
          notification: currentNotification,
          id: `${Date.now()}-${index}`
        }
        // Keep only last 4 items and add new one at beginning
        return [newItem, ...prevItems.slice(0, 3)]
      })
      
      index++
    }, 2000)

    return () => {
      clearTimeout(firstTimeout)
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="relative h-64 w-full overflow-hidden" ref={containerRef}>
      <div className="relative">
        {items.map((item, idx) => {
          const isNew = idx === 0
          return (
            <div
              key={item.id}
              className="absolute w-full"
              style={{
                transform: `translateY(${idx * 74}px)`,
                opacity: 1 - (idx * 0.25),
                zIndex: 10 - idx,
                transition: isNew ? 'none' : 'all 500ms ease-out'
              }}
            >
              <div 
                className={cn(
                  "w-full transition-transform duration-500 ease-out",
                  isNew && "animate-in zoom-in-95 fade-in duration-500"
                )}
                style={{
                  transform: isNew ? undefined : 'scale(0.98)'
                }}
              >
                <div className="group flex items-start gap-3 rounded-xl border border-border/50 bg-card/95 p-3 shadow-sm backdrop-blur hover:shadow-md hover:border-border">
                  {/* Icon with colored background */}
                  <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white", item.notification.color)}>
                    {item.notification.icon}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium leading-none">
                        {item.notification.name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        {item.notification.time}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {item.notification.description}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      {/* Bottom gradient fade to FAFAFA */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-b from-transparent via-[#FAFAFA]/80 to-[#FAFAFA]" />
    </div>
  )
}
