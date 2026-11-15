import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Resume from './Resume';
import { mockConfig, mockPortfolioConfig } from '@/test/fixtures';

const resumeConfig = {
  ...mockConfig,
  resume: { headline: 'Full stack engineer · Angular and .NET', summary: 'Seven years of Angular.', pdf: '/resume.pdf' },
};

const renderResume = () =>
  render(
    <MemoryRouter>
      <Resume />
    </MemoryRouter>
  );

describe('Resume', () => {
  afterEach(() => jest.restoreAllMocks());

  it('builds the résumé from the portfolio config', () => {
    mockPortfolioConfig(resumeConfig);
    renderResume();

    expect(screen.getByRole('heading', { level: 1, name: 'Jane Doe' })).toBeInTheDocument();
    expect(screen.getByText('Seven years of Angular.')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Senior Engineer, Acme' })).toBeInTheDocument();
    expect(screen.getByText('Jan 2026 – Now · Pune')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'jane@example.com' })).toHaveAttribute('href', 'mailto:jane@example.com');
    expect(screen.getByRole('link', { name: 'github.com/jane' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Download PDF/ })).toHaveAttribute('href', '/resume.pdf');
  });

  it('lists only active own products and only featured certifications', () => {
    mockPortfolioConfig(resumeConfig);
    renderResume();

    // Samyo is "Present" and has a website; CLARIO is client work and ended
    expect(screen.getByText('Samyo')).toBeInTheDocument();
    expect(screen.queryByText('CLARIO')).not.toBeInTheDocument();
    expect(screen.getByText('Azure Fundamentals')).toBeInTheDocument();
    expect(screen.queryByText('Older Cert')).not.toBeInTheDocument();
  });
});
