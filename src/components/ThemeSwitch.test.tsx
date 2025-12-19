import React from 'react';
import { render, screen } from '@testing-library/react';
import { ThemeSwitch } from './ThemeSwitch';
import { ThemeProvider } from '@/hooks/use-theme';

// Mock lucide-react
jest.mock('lucide-react', () => ({
  Palette: () => <div data-testid="palette-icon">Palette</div>,
}));

// Mock the ui components to simplify testing
jest.mock('@/components/ui/button', () => ({
  Button: function MockButton({ children, ...props }: unknown) {
    return React.createElement('button', props, children);
  },
}));

jest.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: function MockDropdownMenu({ children }: unknown) {
    return React.createElement('div', { 'data-testid': 'dropdown' }, children);
  },
  DropdownMenuTrigger: function MockDropdownMenuTrigger({ children }: unknown) {
    return React.createElement('div', { 'data-testid': 'dropdown-trigger' }, children);
  },
  DropdownMenuContent: function MockDropdownMenuContent({ children }: unknown) {
    return React.createElement('div', { 'data-testid': 'dropdown-content' }, children);
  },
  DropdownMenuItem: function MockDropdownMenuItem({ children, onClick }: unknown) {
    const props = { 'data-testid': 'dropdown-item', onClick } as Record<string, unknown>;
    return React.createElement('div', props, children);
  },
}));

describe('ThemeSwitch Component', () => {
  it('should render theme switch button', () => {
    render(
      <ThemeProvider>
        <ThemeSwitch />
      </ThemeProvider>
    );

    const button = screen.getByRole('button');
    expect(button).toBeTruthy();
  });

  it('should display palette icon', () => {
    render(
      <ThemeProvider>
        <ThemeSwitch />
      </ThemeProvider>
    );

    const icon = screen.getByTestId('palette-icon');
    expect(icon).toBeTruthy();
  });

  it('should have accessibility label', () => {
    render(
      <ThemeProvider>
        <ThemeSwitch />
      </ThemeProvider>
    );

    const srOnly = document.querySelector('.sr-only');
    expect(srOnly).toBeTruthy();
    expect(srOnly?.textContent).toBe('Toggle theme');
  });

  it('should render dropdown structure', () => {
    render(
      <ThemeProvider>
        <ThemeSwitch />
      </ThemeProvider>
    );

    const dropdown = screen.getByTestId('dropdown');
    expect(dropdown).toBeTruthy();
  });

  it('should have default theme', () => {
    render(
      <ThemeProvider defaultTheme="github">
        <ThemeSwitch />
      </ThemeProvider>
    );

    expect(document.documentElement.classList.contains('theme-github')).toBe(true);
  });

  it('should render as a button component', () => {
    const { container } = render(
      <ThemeProvider>
        <ThemeSwitch />
      </ThemeProvider>
    );

    const button = container.querySelector('button');
    expect(button).toBeTruthy();
  });
});
