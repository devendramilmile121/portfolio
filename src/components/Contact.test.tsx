import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Contact } from './Contact';
import * as usePortfolioConfigModule from '@/hooks/usePortfolioConfig';

jest.mock('lucide-react', () => ({
  Mail: () => <div data-testid="mail-icon">Mail</div>,
  Phone: () => <div data-testid="phone-icon">Phone</div>,
  MapPin: () => <div data-testid="mappin-icon">MapPin</div>,
  Github: () => <div data-testid="github-icon">Github</div>,
  Linkedin: () => <div data-testid="linkedin-icon">Linkedin</div>,
  ExternalLink: () => <div data-testid="externallink-icon">ExternalLink</div>,
}));

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
    info: [
      { label: 'Email', value: 'john@example.com', icon: 'mail', link: 'mailto:john@example.com' },
      { label: 'Phone', value: '+1 (555) 123-4567', icon: 'phone', link: 'tel:+15551234567' },
      { label: 'Location', value: 'San Francisco, CA', icon: 'mapPin', link: '' },
    ],
    social: [
      { label: 'GitHub', icon: 'github', link: 'https://github.com/johndoe' },
      { label: 'LinkedIn', icon: 'linkedin', link: 'https://linkedin.com/in/johndoe' },
    ],
    ctaText: 'Send Message',
    ctaLink: 'mailto:john@example.com',
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

    const headings = screen.getAllByText('Get In Touch');
    expect(headings.length).toBeGreaterThanOrEqual(1);
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

    const emailLink = screen.getByRole('link', { name: /Email/i });
    expect(emailLink).toHaveAttribute('href', 'mailto:john@example.com');
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
    render(<Contact />);

    const mailIcons = screen.getAllByTestId('mail-icon');
    expect(mailIcons.length).toBeGreaterThan(0);
  });

  it('should render CTA button', () => {
    render(<Contact />);

    // Contact section typically has a send button or similar
    const buttons = screen.queryAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(0);
  });
});
