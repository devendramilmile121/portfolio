import { fireEvent, render, screen } from '@testing-library/react'
import { ThemeProvider } from './use-theme'
import { useTheme, getInitialTheme } from '@/lib/theme'

const Probe = () => {
  const { theme, setTheme, toggleTheme } = useTheme()
  return (
    <div>
      <p data-testid="theme">{theme}</p>
      <button onClick={() => setTheme('dark')}>dark</button>
      <button onClick={toggleTheme}>toggle</button>
    </div>
  )
}

const prefersDark = (dark: boolean) =>
  (window.matchMedia as jest.Mock).mockImplementation((query: string) => ({
    matches: dark && query.includes('dark'),
    media: query,
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }))

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    prefersDark(false)
  })

  it('follows the system setting when nothing is saved', () => {
    prefersDark(true)
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    )
    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('prefers a saved choice over the system setting', () => {
    prefersDark(true)
    localStorage.setItem('portfolio-theme', 'light')
    expect(getInitialTheme('portfolio-theme')).toBe('light')
  })

  it('ignores saved values from the old theme set', () => {
    localStorage.setItem('portfolio-theme', 'glass-dark')
    expect(getInitialTheme('portfolio-theme')).toBe('light')
  })

  it('saves and applies a chosen theme, and toggles back', () => {
    render(
      <ThemeProvider>
        <Probe />
      </ThemeProvider>
    )
    fireEvent.click(screen.getByText('dark'))
    expect(localStorage.getItem('portfolio-theme')).toBe('dark')
    expect(document.documentElement).toHaveClass('dark')

    fireEvent.click(screen.getByText('toggle'))
    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(document.documentElement).not.toHaveClass('dark')
  })

  it('throws when used outside the provider', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<Probe />)).toThrow('useTheme must be used within a ThemeProvider')
    spy.mockRestore()
  })
})
