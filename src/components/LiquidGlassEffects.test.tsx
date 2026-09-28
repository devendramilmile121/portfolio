import { act, fireEvent, render } from '@testing-library/react'
import { ThemeProvider } from '@/hooks/use-theme'
import { LiquidGlassEffects } from './LiquidGlassEffects'

const scrollTo = (y: number) => {
  Object.defineProperty(window, 'scrollY', { value: y, writable: true, configurable: true })
  act(() => {
    window.dispatchEvent(new Event('scroll'))
  })
}

// jsdom has no PointerEvent; a MouseEvent carries the same clientX/clientY
const pointerMove = (target: Element) =>
  fireEvent(target, new MouseEvent('pointermove', { bubbles: true, clientX: 40, clientY: 12 }))

const renderWithTheme = (theme: 'github' | 'glass-light' | 'glass-dark') =>
  render(
    <ThemeProvider defaultTheme={theme}>
      <div className="liquid-glass" data-testid="card">
        <button className="liquid-glass" data-testid="button">Press</button>
      </div>
      <LiquidGlassEffects />
    </ThemeProvider>
  )

describe('LiquidGlassEffects', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.className = ''
    document.documentElement.removeAttribute('data-glass-minimized')
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true, configurable: true })
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      callback(0)
      return 1
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('minimizes the nav while scrolling down and restores it on scroll up', () => {
    renderWithTheme('glass-dark')

    scrollTo(400)
    expect(document.documentElement).toHaveAttribute('data-glass-minimized')

    scrollTo(300)
    expect(document.documentElement).not.toHaveAttribute('data-glass-minimized')
  })

  it('does not minimize near the top of the page', () => {
    renderWithTheme('glass-light')

    scrollTo(80)
    expect(document.documentElement).not.toHaveAttribute('data-glass-minimized')
  })

  it('moves the specular light on the hovered glass and every glass around it', () => {
    const { getByTestId } = renderWithTheme('glass-light')

    pointerMove(getByTestId('button'))

    for (const id of ['button', 'card']) {
      expect(getByTestId(id).style.getPropertyValue('--glass-x')).toBe('40px')
      expect(getByTestId(id).style.getPropertyValue('--glass-y')).toBe('12px')
    }
  })

  it('shifts the wallpaper depth layers with the mouse', () => {
    const { container, getByTestId } = renderWithTheme('glass-dark')

    pointerMove(getByTestId('button'))

    const wallpaper = container.querySelector<HTMLElement>('.glass-wallpaper')!
    expect(wallpaper.children).toHaveLength(6)
    expect(Number(wallpaper.style.getPropertyValue('--glass-px'))).toBeCloseTo((40 / window.innerWidth) * 2 - 1, 3)
    expect(Number(wallpaper.style.getPropertyValue('--glass-py'))).toBeCloseTo((12 / window.innerHeight) * 2 - 1, 3)
  })

  it('stays inert outside the glass themes', () => {
    const { getByTestId } = renderWithTheme('github')

    scrollTo(400)
    pointerMove(getByTestId('button'))

    expect(document.documentElement).not.toHaveAttribute('data-glass-minimized')
    expect(getByTestId('button').style.getPropertyValue('--glass-x')).toBe('')
    expect(document.querySelector('.glass-wallpaper')).toBeNull()
  })

  it('clears the minimized flag when unmounted', () => {
    const { unmount } = renderWithTheme('glass-dark')

    scrollTo(400)
    unmount()

    expect(document.documentElement).not.toHaveAttribute('data-glass-minimized')
  })
})
