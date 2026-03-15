import { createContext, useContext, useEffect, useState } from 'react'

const themes = ['github', 'dark', 'yellow', 'green', 'white'] as const

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
  theme: 'github',
  setTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)
const themeClasses = themes.map((theme) => `theme-${theme}`)

const isTheme = (value: string | null): value is Theme =>
  value !== null && themes.includes(value as Theme)

const getThemeMigrationKey = (storageKey: string) => `${storageKey}-default-theme-v2`

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
  defaultTheme = 'github',
  storageKey = 'portfolio-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme(defaultTheme, storageKey))

  useEffect(() => {
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
