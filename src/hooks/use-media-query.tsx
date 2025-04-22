"use client"

import { useEffect, useState } from "react"

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Initial check on client side
    const media = window.matchMedia(query)
    setMatches(media.matches)

    // Add listener for changes
    const listener = () => setMatches(media.matches)
    media.addEventListener("change", listener)

    // Clean up
    return () => media.removeEventListener("change", listener)
  }, [query])

  return matches
}
