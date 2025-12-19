import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Experience } from './Experience';
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
  experience: [
    {
      company: 'Tech Corp',
      role: 'Senior Developer',
      period: '2020-2023',
      location: 'San Francisco, CA',
      description: ['Led development team', 'Improved performance by 40%'],
      technologies: ['React', 'Node.js', 'PostgreSQL'],
    },
    {
      company: 'StartUp Inc',
      role: 'Full Stack Developer',
      period: '2018-2020',
      location: 'New York, NY',
      description: ['Built REST APIs', 'Developed frontend'],
      technologies: ['Angular', '.NET Core'],
    },
  ],
  projects: [],
  education: { degrees: [] },
  blogs: { featured: [], all: [] },
  contact: { email: '', github: '', linkedin: '' },
  footer: { copyrightYear: 2024, socialLinks: [] },
};

describe('Experience', () => {
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

  it('should render experience section with title', () => {
    render(<Experience />);

    expect(screen.getByText('Professional Experience')).toBeInTheDocument();
  });

  it('should render description text', () => {
    render(<Experience />);

    expect(screen.getByText(/6 years of professional growth/)).toBeInTheDocument();
  });

  it('should render all experience entries', () => {
    render(<Experience />);

    expect(screen.getByText('Senior Developer')).toBeInTheDocument();
    expect(screen.getByText('Tech Corp')).toBeInTheDocument();
    expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
    expect(screen.getByText('StartUp Inc')).toBeInTheDocument();
  });

  it('should render experience details', () => {
    render(<Experience />);

    expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
    expect(screen.getByText('2020-2023')).toBeInTheDocument();
    expect(screen.getByText('New York, NY')).toBeInTheDocument();
    expect(screen.getByText('2018-2020')).toBeInTheDocument();
  });

  it('should render descriptions and technologies', () => {
    render(<Experience />);

    expect(screen.getByText('Led development team')).toBeInTheDocument();
    expect(screen.getByText('Improved performance by 40%')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Node.js')).toBeInTheDocument();
    expect(screen.getByText('.NET Core')).toBeInTheDocument();
  });

  it('should render loading state when config is null and loading is true', () => {
    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: null,
      loading: true,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);

    const { container } = render(<Experience />);

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

    const { container } = render(<Experience />);

    const sections = container.querySelectorAll('section');
    expect(sections.length).toBe(0);
  });

  it('should render correct number of experience cards', () => {
    const { container } = render(<Experience />);

    const cards = container.querySelectorAll('[class*="bg-gradient-card"]');
    expect(cards.length).toBeGreaterThanOrEqual(mockConfig.experience.length);
  });

  it('should handle empty experience array', () => {
    const emptyConfig = {
      ...mockConfig,
      experience: [],
    };

    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: emptyConfig,
      loading: false,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);

    render(<Experience />);

    expect(screen.getByText('Professional Experience')).toBeInTheDocument();
  });

  it('should display calendar and location icons', () => {
    const { container } = render(<Experience />);

    // Icons should be rendered
    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });
});
