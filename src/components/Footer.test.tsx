import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Footer } from './Footer';
import * as usePortfolioConfigModule from '@/hooks/usePortfolioConfig';

jest.mock('lucide-react', () => ({
  Github: () => <div data-testid="github-icon">Github</div>,
  Linkedin: () => <div data-testid="linkedin-icon">Linkedin</div>,
  Mail: () => <div data-testid="mail-icon">Mail</div>,
}));

const mockConfig = {
  hero: { name: 'John Doe', title: 'Developer' },
  navigation: [],
  skills: [],
  experience: [],
  projects: [],
  education: { degrees: [] },
  blogs: { featured: [], all: [] },
  contact: { heading: 'Contact', description: '', info: [], social: [], ctaText: '', ctaLink: '' },
  footer: {
    name: 'John Doe',
    title: 'Full Stack Developer',
    copyright: 'All rights reserved.',
    builtWith: 'Built with React and TypeScript',
    social: [
      { name: 'github', url: 'https://github.com/johndoe' },
      { name: 'linkedin', url: 'https://linkedin.com/in/johndoe' },
      { name: 'mail', url: 'mailto:john@example.com' },
    ],
  },
};

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Footer', () => {
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

  it('should render footer', () => {
    const { container } = renderWithRouter(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();
  });

  it('should render footer branding with name', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should render footer title', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText('Full Stack Developer')).toBeInTheDocument();
  });

  it('should render Blogs link', () => {
    renderWithRouter(<Footer />);
    const blogsLink = screen.getByRole('link', { name: 'Blogs' });
    expect(blogsLink).toBeInTheDocument();
    expect(blogsLink).toHaveAttribute('href', '/blogs');
  });

  it('should render Contact link', () => {
    renderWithRouter(<Footer />);
    const contactLink = screen.getByRole('link', { name: 'Contact' });
    expect(contactLink).toBeInTheDocument();
    expect(contactLink).toHaveAttribute('href', '#contact');
  });

  it('should render social media links', () => {
    renderWithRouter(<Footer />);
    const socialLinks = screen.getAllByRole('link');
    expect(socialLinks.length).toBeGreaterThan(2);
  });

  it('should render GitHub social icon', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByTestId('github-icon')).toBeInTheDocument();
  });

  it('should render LinkedIn social icon', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByTestId('linkedin-icon')).toBeInTheDocument();
  });

  it('should render Mail social icon', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByTestId('mail-icon')).toBeInTheDocument();
  });

  it('should render copyright notice with current year', () => {
    renderWithRouter(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
  });

  it('should render copyright text', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText(/All rights reserved/)).toBeInTheDocument();
  });

  it('should render built with text', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByText(/Built with React and TypeScript/)).toBeInTheDocument();
  });

  it('should render nothing when loading is true', () => {
    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: null,
      loading: true,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);

    const { container } = renderWithRouter(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).not.toBeInTheDocument();
  });

  it('should render nothing when config is null', () => {
    jest.spyOn(usePortfolioConfigModule, 'usePortfolioConfig').mockReturnValue({
      config: null,
      loading: false,
      error: '',
    } as unknown as ReturnType<typeof usePortfolioConfigModule.usePortfolioConfig>);

    const { container } = renderWithRouter(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).not.toBeInTheDocument();
  });

  it('should render footer with proper background', () => {
    const { container } = renderWithRouter(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('bg-secondary/10');
  });

  it('should render footer with border', () => {
    const { container } = renderWithRouter(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('border-t');
  });

  it('should render social links with target blank', () => {
    renderWithRouter(<Footer />);
    const externalLinks = screen.getAllByRole('link');
    const githubLink = externalLinks.find(link => link.getAttribute('href')?.includes('github'));
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('should render social links with aria labels', () => {
    renderWithRouter(<Footer />);
    expect(screen.getByLabelText('github Profile')).toBeInTheDocument();
    expect(screen.getByLabelText('linkedin Profile')).toBeInTheDocument();
  });

  it('should have proper spacing classes', () => {
    const { container } = renderWithRouter(<Footer />);
    const footer = container.querySelector('footer');
    expect(footer).toHaveClass('py-12');
  });
});
