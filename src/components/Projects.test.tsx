import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Projects } from './Projects';
import * as usePortfolioConfigModule from '@/hooks/usePortfolioConfig';

const mockConfig = {
  hero: {
    name: 'John Doe',
    title: 'Full Stack Developer',
    description: 'Building amazing web experiences',
    ctaPrimary: 'Get in Touch',
    ctaSecondary: 'View Projects',
    social: [],
    contact: { location: 'San Francisco', phone: '+1-555-0000' },
  },
  navigation: [],
  skills: [],
  experience: [],
  projects: [
    {
      title: 'E-Commerce Platform',
      period: '2023',
      description: 'A full-stack e-commerce platform with real-time inventory management',
      highlights: ['Real-time updates', 'Payment integration', 'Admin dashboard'],
      technologies: ['React', 'Node.js', 'MongoDB'],
      type: 'Commercial',
      links: {
        github: 'https://github.com/johndoe/ecommerce',
        npm: 'https://npmjs.com/ecommerce-platform',
      },
    },
    {
      title: 'Analytics Dashboard',
      period: '2022',
      description: 'Custom analytics dashboard with data visualization',
      highlights: ['Real-time analytics', 'Charts and graphs', 'Export data'],
      technologies: ['Angular', 'D3.js', '.NET Core'],
      type: 'Open Source',
    },
  ],
  education: { degrees: [] },
  blogs: { featured: [], all: [] },
  contact: { email: '', github: '', linkedin: '' },
  footer: { copyrightYear: 2024, socialLinks: [] },
};

describe('Projects', () => {
  beforeEach(() => {
    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: mockConfig,
      loading: false,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should render projects section with title', () => {
    render(<Projects />);

    expect(screen.getByText('Featured Projects')).toBeInTheDocument();
  });

  it('should render all project titles', () => {
    render(<Projects />);

    expect(screen.getByText('E-Commerce Platform')).toBeInTheDocument();
    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });

  it('should render project descriptions', () => {
    render(<Projects />);

    expect(screen.getByText('A full-stack e-commerce platform with real-time inventory management')).toBeInTheDocument();
    expect(screen.getByText('Custom analytics dashboard with data visualization')).toBeInTheDocument();
  });

  it('should render project highlights', () => {
    render(<Projects />);

    expect(screen.getByText('Real-time updates')).toBeInTheDocument();
    expect(screen.getByText('Payment integration')).toBeInTheDocument();
    expect(screen.getByText('Admin dashboard')).toBeInTheDocument();
  });

  it('should render project technologies', () => {
    render(<Projects />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('MongoDB')).toBeInTheDocument();
    expect(screen.getByText('Angular')).toBeInTheDocument();
    expect(screen.getByText('.NET Core')).toBeInTheDocument();
  });

  it('should render project periods', () => {
    render(<Projects />);

    expect(screen.getByText('2023')).toBeInTheDocument();
    expect(screen.getByText('2022')).toBeInTheDocument();
  });

  it('should render project types', () => {
    render(<Projects />);

    expect(screen.getByText('Commercial')).toBeInTheDocument();
    expect(screen.getByText('Open Source')).toBeInTheDocument();
  });

  it('should render project links when available', () => {
    render(<Projects />);

    const links = screen.getAllByRole('link');
    const githubLink = links.find(link => link.getAttribute('href') === 'https://github.com/johndoe/ecommerce');
    expect(githubLink).toBeInTheDocument();
  });

  it('should render loading state when config is null and loading is true', () => {
    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: null,
      loading: true,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);

    const { container } = render(<Projects />);

    const section = container.querySelector('section');
    expect(section).toBeInTheDocument();
    expect(section?.className).toContain('py-20');
  });

  it('should render nothing when config is null and loading is false', () => {
    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: null,
      loading: false,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);

    const { container } = render(<Projects />);

    const sections = container.querySelectorAll('section');
    expect(sections.length).toBe(0);
  });

  it('should handle empty projects array', () => {
    const emptyConfig = {
      ...mockConfig,
      projects: [],
    };

    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: emptyConfig,
      loading: false,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);

    render(<Projects />);

    expect(screen.getByText('Featured Projects')).toBeInTheDocument();
  });

  it('should render project cards with proper styling', () => {
    const { container } = render(<Projects />);

    const cards = container.querySelectorAll('[class*="bg-gradient-card"]');
    expect(cards.length).toBeGreaterThanOrEqual(mockConfig.projects.length);
  });

  it('should handle projects without optional links', () => {
    const projectWithoutLinks = {
      ...mockConfig.projects[1],
      links: undefined,
    };

    const configNoLinks = {
      ...mockConfig,
      projects: [projectWithoutLinks],
    };

    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: configNoLinks,
      loading: false,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);

    render(<Projects />);

    expect(screen.getByText('Analytics Dashboard')).toBeInTheDocument();
  });
});
