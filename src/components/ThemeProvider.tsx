
"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { ThemeProvider as NextThemesProvider, useTheme as useNextTheme } from "next-themes"

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: string;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: string | undefined;
  setTheme: (theme: string) => void;
};

const ThemeProviderContext = createContext<ThemeProviderState>({ theme: undefined, setTheme: () => null });

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

// Export the useTheme hook
export const useTheme = () => {
  const { theme, setTheme } = useNextTheme();
  return { theme, setTheme };
};
