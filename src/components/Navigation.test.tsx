import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navigation } from './Navigation';
import { ThemeProvider } from '@/hooks/use-theme';
import { mockConfig, mockPortfolioConfig } from '@/test/fixtures';

const renderAt = (path = '/') =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <ThemeProvider>
        <Navigation />
      </ThemeProvider>
    </MemoryRouter>
  );

describe('Navigation', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.className = '';
  });
  afterEach(() => jest.restoreAllMocks());

  it('links sections on the home page and routes elsewhere', () => {
    mockPortfolioConfig();
    renderAt();

    expect(screen.getByRole('link', { name: 'Jane Doe' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'Work' })).toHaveAttribute('href', '/#work');
    expect(screen.getByRole('link', { name: 'Writing' })).toHaveAttribute('href', '/blogs');
  });

  it('marks the current route', () => {
    mockPortfolioConfig();
    renderAt('/blogs/some-post');
    expect(screen.getByRole('link', { name: 'Writing' })).toHaveAttribute('aria-current', 'page');
  });

  it('hides Writing when blogs are disabled', () => {
    mockPortfolioConfig({ ...mockConfig, blogs: { enabled: false } });
    renderAt();
    expect(screen.queryByRole('link', { name: 'Writing' })).not.toBeInTheDocument();
  });

  it('toggles between light and dark', () => {
    mockPortfolioConfig();
    renderAt();

    const toggle = screen.getByRole('button', { name: 'Toggle dark theme' });
    fireEvent.click(toggle);
    expect(document.documentElement).toHaveClass('dark');
    expect(localStorage.getItem('portfolio-theme')).toBe('dark');

    fireEvent.click(toggle);
    expect(document.documentElement).not.toHaveClass('dark');
  });

  it('opens and closes the mobile menu', () => {
    mockPortfolioConfig();
    renderAt();

    const toggle = screen.getByRole('button', { name: 'Menu' });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(document.getElementById('mobile-menu')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(document.getElementById('mobile-menu')).not.toBeInTheDocument();
  });
});
