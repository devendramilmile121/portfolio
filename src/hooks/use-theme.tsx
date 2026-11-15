import { useCallback, useLayoutEffect, useMemo, useState } from 'react'
import { ThemeContext, getInitialTheme, type Theme, type ThemeState } from '@/lib/theme'

type ThemeProviderProps = {
  children: React.ReactNode
  storageKey?: string
}

export function ThemeProvider({ children, storageKey = 'portfolio-theme' }: Readonly<ThemeProviderProps>) {
  const [theme, setThemeState] = useState<Theme>(() => getInitialTheme(storageKey))

  useLayoutEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const setTheme = useCallback(
    (next: Theme) => {
      try {
        localStorage.setItem(storageKey, next)
      } catch {
        // Storage blocked: the choice still applies for this visit
      }
      setThemeState(next)
    },
    [storageKey]
  )

  const value = useMemo<ThemeState>(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme(theme === 'dark' ? 'light' : 'dark'),
    }),
    [theme, setTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
