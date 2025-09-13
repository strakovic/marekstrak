"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button-toggle"
import { cn } from "@/lib/utils"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Button variant="ghost" size="sm" className="w-9 px-0">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className={cn(
        "w-9 px-0 relative overflow-hidden",
        "hover:bg-accent hover:text-accent-foreground",
        "transition-all duration-300 ease-in-out"
      )}
    >
      <div className="relative w-[1.2rem] h-[1.2rem]">
        <Sun
          className={cn(
            "h-[1.2rem] w-[1.2rem] absolute inset-0",
            "transition-all duration-500 ease-in-out",
            theme === "dark"
              ? "rotate-90 scale-0 opacity-0"
              : "rotate-0 scale-100 opacity-100"
          )}
        />
        <Moon
          className={cn(
            "h-[1.2rem] w-[1.2rem] absolute inset-0",
            "transition-all duration-500 ease-in-out",
            theme === "dark"
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          )}
        />
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}