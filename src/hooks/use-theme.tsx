import { createContext, useContext, useLayoutEffect, useState } from 'react'

const themes = ['github', 'dark', 'yellow', 'green', 'white', 'glass-light', 'glass-dark'] as const

type Theme = (typeof themes)[number]

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const initialState: ThemeProviderState = {
  theme: 'glass-dark',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)
const themeClasses = themes.map((theme) => `theme-${theme}`)

const isTheme = (value: string | null): value is Theme =>
  value !== null && themes.includes(value as Theme)

// Bump the version whenever the default theme changes, so returning visitors see the new default once
const getThemeMigrationKey = (storageKey: string) => `${storageKey}-default-theme-v3`

const getInitialTheme = (defaultTheme: Theme, storageKey: string): Theme => {
  const migrationKey = getThemeMigrationKey(storageKey)
  const hasAppliedDefaultTheme = localStorage.getItem(migrationKey) === 'true'

  if (!hasAppliedDefaultTheme) {
    localStorage.setItem(storageKey, defaultTheme)
    localStorage.setItem(migrationKey, 'true')
    return defaultTheme
  }

  const storedTheme = localStorage.getItem(storageKey)
  return isTheme(storedTheme) ? storedTheme : defaultTheme
}

export function ThemeProvider({
  children,
  defaultTheme = 'glass-dark',
  storageKey = 'portfolio-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme(defaultTheme, storageKey))

  // Layout effect: the theme class must land before first paint, or the default theme flashes in late
  useLayoutEffect(() => {
    const root = window.document.documentElement

    root.classList.remove(...themeClasses)
    root.classList.add(`theme-${theme}`)
  }, [theme])

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
