"use client"

import { useState, useEffect } from "react"

// SSR-safe media query hook to avoid hydration mismatches
export function useMedia(query: string, initial: boolean = false): boolean {
  const [matches, setMatches] = useState<boolean>(initial)

  useEffect(() => {
    if (typeof window === 'undefined' || !('matchMedia' in window)) return

    const mediaQuery = window.matchMedia(query)
    // Sync on mount
    setMatches(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches)
    mediaQuery.addEventListener("change", handleChange)

    return () => {
      mediaQuery.removeEventListener("change", handleChange)
    }
  }, [query])

  return matches
}
