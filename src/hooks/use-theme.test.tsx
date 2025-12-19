import React from 'react';
import { render, screen, fireEvent, waitFor, renderHook } from '@testing-library/react';
import { ThemeProvider, useTheme } from './use-theme';

const TestComponent = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div>
      <p data-testid="current-theme">{theme}</p>
      <button onClick={() => setTheme('dark')} data-testid="dark-btn">
        Dark
      </button>
      <button onClick={() => setTheme('yellow')} data-testid="yellow-btn">
        Yellow
      </button>
      <button onClick={() => setTheme('green')} data-testid="green-btn">
        Green
      </button>
      <button onClick={() => setTheme('white')} data-testid="white-btn">
        White
      </button>
    </div>
  );
};

describe('ThemeProvider and useTheme', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
    document.documentElement.className = '';
  });

  it('should provide default theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeElement = screen.getByTestId('current-theme');
    expect(themeElement).toHaveTextContent('github');
  });

  it('should apply default theme class to root element', () => {
    render(
      <ThemeProvider defaultTheme="github">
        <TestComponent />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('theme-github')).toBe(
      true
    );
  });

  it('should use custom default theme', () => {
    render(
      <ThemeProvider defaultTheme="dark">
        <TestComponent />
      </ThemeProvider>
    );

    const themeElement = screen.getByTestId('current-theme');
    expect(themeElement).toHaveTextContent('dark');
  });

  it('should change theme when setTheme is called', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const darkButton = screen.getByTestId('dark-btn');
    fireEvent.click(darkButton);

    await waitFor(() => {
      const themeElement = screen.getByTestId('current-theme');
      expect(themeElement).toHaveTextContent('dark');
    });
  });

  it('should update class on root element when theme changes', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const darkButton = screen.getByTestId('dark-btn');
    fireEvent.click(darkButton);

    await waitFor(() => {
      expect(document.documentElement.classList.contains('theme-dark')).toBe(
        true
      );
      expect(document.documentElement.classList.contains('theme-github')).toBe(
        false
      );
    });
  });

  it('should persist theme to localStorage', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const yellowButton = screen.getByTestId('yellow-btn');
    fireEvent.click(yellowButton);

    await waitFor(() => {
      // Verify the theme was set in localStorage
      expect(localStorage.getItem('portfolio-theme')).toBe('yellow');
    });
  });

  it('should use custom storage key', async () => {
    render(
      <ThemeProvider storageKey="custom-theme-key">
        <TestComponent />
      </ThemeProvider>
    );

    const greenButton = screen.getByTestId('green-btn');
    fireEvent.click(greenButton);

    await waitFor(() => {
      expect(localStorage.getItem('custom-theme-key')).toBe('green');
    });
  });

  it('should restore theme from localStorage', () => {
    localStorage.setItem('portfolio-theme', 'dark');

    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeElement = screen.getByTestId('current-theme');
    expect(themeElement).toHaveTextContent('dark');
  });

  it('should provide default context', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const themeElement = screen.getByTestId('current-theme');
    expect(themeElement).toBeTruthy();
  });

  it('should handle multiple theme changes', async () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    );

    const darkButton = screen.getByTestId('dark-btn');
    const yellowButton = screen.getByTestId('yellow-btn');
    const whiteButton = screen.getByTestId('white-btn');

    fireEvent.click(darkButton);
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('dark');
    });

    fireEvent.click(yellowButton);
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('yellow');
    });

    fireEvent.click(whiteButton);
    await waitFor(() => {
      expect(screen.getByTestId('current-theme')).toHaveTextContent('white');
    });
  });
});
