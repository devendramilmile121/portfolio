import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Skills } from './Skills';
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
  skills: [
    {
      title: 'Frontend',
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
    },
    {
      title: 'Backend',
      skills: ['.NET Core', 'Node.js', 'SQL'],
    },
  ],
  experience: [],
  projects: [],
  education: { degrees: [] },
  blogs: { featured: [], all: [] },
  contact: { email: '', github: '', linkedin: '' },
  footer: { copyrightYear: 2024, socialLinks: [] },
};

describe('Skills', () => {
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

  it('should render skills section with title', () => {
    render(<Skills />);

    expect(screen.getByText('Technical Skills')).toBeInTheDocument();
  });

  it('should render description text', () => {
    render(<Skills />);

    expect(screen.getByText(/Comprehensive expertise across the full development stack/)).toBeInTheDocument();
  });

  it('should render all skill categories', () => {
    render(<Skills />);

    expect(screen.getByText('Frontend')).toBeInTheDocument();
    expect(screen.getByText('Backend')).toBeInTheDocument();
  });

  it('should render all skills within categories', () => {
    render(<Skills />);

    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('Tailwind CSS')).toBeInTheDocument();
    expect(screen.getByText('.NET Core')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('SQL')).toBeInTheDocument();
  });

  it('should render loading state when config is null and loading is true', () => {
    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: null,
      loading: true,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);

    const { container } = render(<Skills />);

    // Should render skeleton
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

    const { container } = render(<Skills />);

    const sections = container.querySelectorAll('section');
    expect(sections.length).toBe(0);
  });

  it('should render correct number of skill cards', () => {
    const { container } = render(<Skills />);

    // Cards are rendered within the grid
    const cards = container.querySelectorAll('[class*="bg-gradient-card"]');
    expect(cards.length).toBeGreaterThanOrEqual(mockConfig.skills.length);
  });

  it('should render skill cards with proper styling', () => {
    const { container } = render(<Skills />);

    const cards = container.querySelectorAll('[class*="hover:scale-105"]');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('should handle empty skills array', () => {
    const emptyConfig = {
      ...mockConfig,
      skills: [],
    };

    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: emptyConfig,
      loading: false,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);

    render(<Skills />);

    expect(screen.getByText('Technical Skills')).toBeInTheDocument();
    // Should still render the grid even if empty
  });

  it('should handle large number of skills', () => {
    const largeConfig = {
      ...mockConfig,
      skills: [
        {
          title: 'Languages',
          skills: Array(20).fill(0).map((_, i) => `Skill ${i + 1}`),
        },
      ],
    };

    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: largeConfig,
      loading: false,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);

    render(<Skills />);

    expect(screen.getByText('Languages')).toBeInTheDocument();
    expect(screen.getByText('Skill 1')).toBeInTheDocument();
    expect(screen.getByText('Skill 20')).toBeInTheDocument();
  });
});
