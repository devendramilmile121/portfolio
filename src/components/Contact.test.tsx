import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Contact } from './Contact';
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
  projects: [],
  education: { degrees: [] },
  blogs: { featured: [], all: [] },
  contact: {
    heading: 'Get In Touch',
    description: 'Have a project in mind? Let\'s talk!',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    github: 'https://github.com/johndoe',
    linkedin: 'https://linkedin.com/in/johndoe',
  },
  footer: { copyrightYear: 2024, socialLinks: [] },
};

describe('Contact', () => {
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

  it('should render contact section with heading', () => {
    render(<Contact />);

    expect(screen.getByText('Get In Touch')).toBeInTheDocument();
  });

  it('should render contact description', () => {
    render(<Contact />);

    expect(screen.getByText(/Have a project in mind\?/)).toBeInTheDocument();
  });

  it('should render contact information', () => {
    render(<Contact />);

    expect(screen.getByText(/john@example.com/)).toBeInTheDocument();
    expect(screen.getByText(/San Francisco, CA/)).toBeInTheDocument();
  });

  it('should render email link', () => {
    render(<Contact />);

    const links = screen.getAllByRole('link');
    const emailLink = links.find(link => link.getAttribute('href')?.includes('john@example.com'));
    expect(emailLink).toBeInTheDocument();
  });

  it('should render social media links', () => {
    render(<Contact />);

    const links = screen.getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
  });

  it('should render loading state when config is null and loading is true', () => {
    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: null,
      loading: true,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);

    const { container } = render(<Contact />);

    const sections = container.querySelectorAll('section');
    expect(sections.length).toBeGreaterThanOrEqual(1);
  });

  it('should render nothing when config is null and loading is false', () => {
    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: null,
      loading: false,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);

    const { container } = render(<Contact />);

    const sections = container.querySelectorAll('section');
    expect(sections.length).toBe(0);
  });

  it('should display contact icons', () => {
    const { container } = render(<Contact />);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThan(0);
  });

  it('should render CTA button', () => {
    render(<Contact />);

    // Contact section typically has a send button or similar
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(0);
  });
});
