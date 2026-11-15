import { createContext, useContext } from 'react'

export type Theme = 'light' | 'dark'

export type ThemeState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const ThemeContext = createContext<ThemeState | undefined>(undefined)

const systemTheme = (): Theme =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

// Must match the inline script in index.html, which applies the same choice before first paint
export const getInitialTheme = (storageKey: string): Theme => {
  if (typeof window === 'undefined') return 'light' // pre-rendering: the inline script in index.html decides
  try {
    const saved = localStorage.getItem(storageKey)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // Storage blocked (private mode): fall back to the system setting
  }
  return systemTheme()
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
