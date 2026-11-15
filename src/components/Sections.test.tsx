import { fireEvent, render, screen, within } from '@testing-library/react';
import { Experience } from './Experience';
import { About } from './About';
import { Contact } from './Contact';
import { Footer } from './Footer';
import { mockConfig, mockPortfolioConfig } from '@/test/fixtures';

afterEach(() => jest.restoreAllMocks());

describe('Experience', () => {
  it('lists each job with its period, company and bullets', () => {
    mockPortfolioConfig();
    render(<Experience />);

    expect(screen.getByRole('heading', { name: 'Experience' })).toBeInTheDocument();
    expect(screen.getByText('Jan 2026 – Now')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Senior Engineer at Acme/ })).toBeInTheDocument();
    expect(screen.getByText('Moved a monolith to micro frontends')).toBeInTheDocument();
    expect(screen.getByText('Angular / .NET')).toBeInTheDocument();
  });

  it('renders nothing without jobs', () => {
    mockPortfolioConfig({ ...mockConfig, experience: { description: '', jobs: [] } });
    const { container } = render(<Experience />);
    expect(container).toBeEmptyDOMElement();
  });
});

describe('About', () => {
  it('shows the bio, toolkit and education', () => {
    mockPortfolioConfig();
    render(<About />);

    expect(screen.getByText('First paragraph of the bio.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Samyo' })).toHaveAttribute('href', 'https://samyo.in');
    expect(screen.getByText('Hackathon proposal adopted')).toBeInTheDocument();
    expect(screen.getByText('Going on the roadmap')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Frontend' })).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
    expect(screen.getByText('MCA')).toBeInTheDocument();
  });

  it('shows featured certifications and reveals the rest on request', () => {
    mockPortfolioConfig();
    render(<About />);

    const list = screen.getByRole('heading', { name: 'Certifications' }).nextElementSibling as HTMLElement;
    expect(within(list).getAllByRole('listitem')).toHaveLength(1);
    expect(within(list).getByRole('link', { name: /Azure Fundamentals/ })).toHaveAttribute('href', 'https://learn.microsoft.com');
    expect(screen.queryByText('Older Cert')).not.toBeInTheDocument();

    const toggle = screen.getByRole('button', { name: 'Show 1 more certificate' });
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText('Older Cert')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Show fewer' }));
    expect(screen.queryByText('Older Cert')).not.toBeInTheDocument();
  });
});

describe('Contact', () => {
  it('leads with the email address and lists other channels, without the location', () => {
    mockPortfolioConfig();
    render(<Contact />);

    expect(screen.getByText('Have something in mind?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'jane@example.com' })).toHaveAttribute('href', 'mailto:jane@example.com');
    expect(screen.getByRole('link', { name: '+91 00000' })).toHaveAttribute('href', 'tel:+9100000');
    expect(screen.getByRole('link', { name: 'jane' })).toHaveAttribute('href', 'https://github.com/jane');
    expect(screen.queryByText('Location')).not.toBeInTheDocument();
  });
});

describe('Footer', () => {
  it('shows the name, year and colophon', () => {
    mockPortfolioConfig();
    render(<Footer />);

    expect(screen.getByText(`© ${new Date().getFullYear()} Jane Doe`)).toBeInTheDocument();
    expect(screen.getByText('Set in Newsreader.')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Back to top/ })).toBeInTheDocument();
  });
});
