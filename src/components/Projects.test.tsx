import { fireEvent, render, screen } from '@testing-library/react';
import { Projects } from './Projects';
import { mockConfig, mockPortfolioConfig } from '@/test/fixtures';

describe('Projects', () => {
  afterEach(() => jest.restoreAllMocks());

  it('lists every project as a numbered row with its summary and years', () => {
    mockPortfolioConfig();
    render(<Projects />);

    expect(screen.getByRole('heading', { name: 'Selected work' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /01\s*Samyo/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /02\s*CLARIO/ })).toBeInTheDocument();
    expect(screen.getAllByText('Public API platform').length).toBeGreaterThan(0);
    expect(screen.getByText('2026–')).toBeInTheDocument();
    expect(screen.getByText('2024–25')).toBeInTheDocument();
  });

  it('opens the first project and toggles the others', () => {
    mockPortfolioConfig();
    render(<Projects />);

    const first = screen.getByRole('button', { name: /Samyo/ });
    const second = screen.getByRole('button', { name: /CLARIO/ });
    expect(first).toHaveAttribute('aria-expanded', 'true');
    expect(second).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(second);
    expect(second).toHaveAttribute('aria-expanded', 'true');
    fireEvent.click(first);
    expect(first).toHaveAttribute('aria-expanded', 'false');
  });

  it('shows role, client, stack and links inside a project', () => {
    mockPortfolioConfig();
    render(<Projects />);

    expect(screen.getByText('Founder')).toBeInTheDocument();
    expect(screen.getByText('Clario')).toBeInTheDocument();
    expect(screen.getByText('.NET 8, YARP')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Website/ })).toHaveAttribute('href', 'https://samyo.in');
    expect(screen.getByAltText('Samyo dashboard')).toHaveAttribute('loading', 'lazy');
  });

  it('renders nothing without projects', () => {
    mockPortfolioConfig({ ...mockConfig, projects: [] });
    const { container } = render(<Projects />);
    expect(container).toBeEmptyDOMElement();
  });
});
