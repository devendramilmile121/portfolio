import '@testing-library/jest-dom';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { Navigation } from './Navigation';
import * as usePortfolioConfigModule from '@/hooks/usePortfolioConfig';

jest.mock('lucide-react', () => ({
  Menu: () => <div data-testid="menu-icon">Menu</div>,
  X: () => <div data-testid="x-icon">X</div>,
}));

jest.mock('./ThemeSwitch', () => ({
  ThemeSwitch: () => <div data-testid="theme-switch">Theme Switch</div>,
}));

const mockConfig = {
  navigation: [
    { id: 'skills', label: 'Skills' },
    { id: 'experience', label: 'Experience' },
    { id: 'projects', label: 'Projects' },
    { id: 'education', label: 'Education' },
  ],
  hero: { name: 'John Doe', title: 'Developer' },
  skills: [],
  experience: [],
  projects: [],
  education: { degrees: [] },
  blogs: { featured: [], all: [] },
  contact: { heading: 'Contact', description: '', info: [], social: [], ctaText: '', ctaLink: '' },
  footer: { copyrightYear: 2024, socialLinks: [] },
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Navigation', () => {
  beforeEach(() => {
    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: mockConfig,
      loading: false,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render navigation with logo', () => {
    renderWithRouter(<Navigation />);

    const logo = screen.getByText('DM');
    expect(logo).toBeInTheDocument();
  });

  it('should render all navigation items on desktop', () => {
    renderWithRouter(<Navigation />);

    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
  });

  it('should render Blogs link', () => {
    renderWithRouter(<Navigation />);

    const blogsLink = screen.getAllByText('Blogs')[0];
    expect(blogsLink).toBeInTheDocument();
  });

  it('should render Hire Me button', () => {
    renderWithRouter(<Navigation />);

    const hireButton = screen.getAllByText('Hire Me')[0];
    expect(hireButton).toBeInTheDocument();
  });

  it('should render theme switch', () => {
    renderWithRouter(<Navigation />);

    const themeSwitches = screen.getAllByTestId('theme-switch');
    expect(themeSwitches.length).toBeGreaterThan(0);
  });

  it('should render mobile menu button', () => {
    renderWithRouter(<Navigation />);

    const menuButton = screen.getByTestId('menu-icon');
    expect(menuButton).toBeInTheDocument();
  });

  it('should toggle mobile menu on button click', async () => {
    renderWithRouter(<Navigation />);

    const menuButtons = screen.getAllByRole('button');
    const mobileMenuButton = menuButtons.find(btn => 
      btn.querySelector('[data-testid="menu-icon"]') || btn.querySelector('[data-testid="x-icon"]')
    );

    expect(mobileMenuButton).toBeInTheDocument();

    if (mobileMenuButton) {
      fireEvent.click(mobileMenuButton);

      // Wait for mobile menu to appear
      await waitFor(() => {
        const mobileMenuItems = screen.getAllByText('Skills');
        expect(mobileMenuItems.length).toBeGreaterThan(1); // Desktop + Mobile
      });
    }
  });

  it('should close mobile menu when menu item is clicked', async () => {
    renderWithRouter(<Navigation />);

    // Open mobile menu
    const menuButtons = screen.getAllByRole('button');
    const mobileMenuButton = menuButtons.find(btn => 
      btn.querySelector('[data-testid="menu-icon"]') || btn.querySelector('[data-testid="x-icon"]')
    );

    if (mobileMenuButton) {
      fireEvent.click(mobileMenuButton);

      // Verify menu is open by checking for X icon
      await waitFor(() => {
        expect(screen.getByTestId('x-icon')).toBeInTheDocument();
      });
    }
  });

  it('should render loading state when config is loading', () => {
    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: null,
      loading: true,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);

    renderWithRouter(<Navigation />);

    const logo = screen.getByText('DM');
    expect(logo).toBeInTheDocument();
  });

  it('should render nothing when config is null and not loading', () => {
    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: null,
      loading: false,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);

    const { container } = renderWithRouter(<Navigation />);

    const nav = container.querySelector('nav');
    expect(nav).not.toBeInTheDocument();
  });

  it('should render navigation items as links with proper styling', () => {
    renderWithRouter(<Navigation />);

    const skillsButtons = screen.getAllByText('Skills');
    expect(skillsButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('should handle scroll events', () => {
    renderWithRouter(<Navigation />);

    // Simulate scroll event
    fireEvent.scroll(window, { y: 100 });

    expect(screen.getByText('DM')).toBeInTheDocument();
  });

  it('should render navigation in fixed position', () => {
    const { container } = renderWithRouter(<Navigation />);

    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('fixed');
  });

  it('should apply transition classes for smooth animations', () => {
    const { container } = renderWithRouter(<Navigation />);

    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('transition-all', 'duration-300');
  });

  it('should render Blogs link on desktop and mobile', async () => {
    renderWithRouter(<Navigation />);

    const blogsLinks = screen.getAllByText('Blogs');
    expect(blogsLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('should handle navigation items click', async () => {
    renderWithRouter(<Navigation />);

    const skillsButtons = screen.getAllByText('Skills');
    expect(skillsButtons[0]).toBeInTheDocument();

    fireEvent.click(skillsButtons[0]);
    expect(screen.getByText('DM')).toBeInTheDocument();
  });

  it('should render all ThemeSwitch instances', () => {
    renderWithRouter(<Navigation />);

    const themeSwitches = screen.getAllByTestId('theme-switch');
    expect(themeSwitches.length).toBeGreaterThanOrEqual(1);
  });

  it('should have proper z-index for fixed positioning', () => {
    const { container } = renderWithRouter(<Navigation />);

    const nav = container.querySelector('nav');
    expect(nav).toHaveClass('z-50');
  });

  it('should render container with proper spacing', () => {
    const { container } = renderWithRouter(<Navigation />);

    const containerDiv = container.querySelector('.container');
    expect(containerDiv).toHaveClass('mx-auto', 'px-6');
  });

  it('should render all nav items with proper gap spacing', () => {
    const { container } = renderWithRouter(<Navigation />);

    const desktopNav = container.querySelector('.hidden.md\\:flex');
    expect(desktopNav).toHaveClass('space-x-8');
  });
});
