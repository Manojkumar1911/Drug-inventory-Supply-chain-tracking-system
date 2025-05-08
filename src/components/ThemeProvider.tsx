
"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: string;
  storageKey?: string;
};

export function ThemeProvider({ 
  children, 
  defaultTheme = "system", 
  storageKey = "theme" 
}: ThemeProviderProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <NextThemesProvider attribute="class" defaultTheme={defaultTheme} enableSystem storageKey={storageKey}>
      {children}
    </NextThemesProvider>
  )
}
