// ts-jest compiles with an inline tsconfig that has no "include", so pull in the image module declarations here
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="../assets.d.ts" />
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';
import { mockPortfolioConfig } from '@/test/fixtures';

describe('Hero', () => {
  afterEach(() => jest.restoreAllMocks());

  it('renders the headline with the name for screen readers and the emphasised phrase', () => {
    mockPortfolioConfig();
    render(<Hero />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Jane Doe. I build fast things.');
    expect(heading.querySelector('em')).toHaveTextContent('fast');
  });

  it('shows role, location, portrait and the Pune clock', () => {
    mockPortfolioConfig();
    render(<Hero />);

    expect(screen.getByText(/Full stack engineer/)).toBeInTheDocument();
    expect(screen.getByAltText('Illustrated portrait of Jane Doe')).toBeInTheDocument();
    expect(screen.getByText(/^\d{2}:\d{2}$/)).toBeInTheDocument();
  });

  it('labels social links and opens only external ones in a new tab', () => {
    mockPortfolioConfig();
    render(<Hero />);

    expect(screen.getByRole('link', { name: /GitHub/ })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: /Email/ })).not.toHaveAttribute('target');
  });

  it('lists what is happening now, linking where a link is given', () => {
    mockPortfolioConfig();
    render(<Hero />);

    expect(screen.getByText('Replatforming a monolith')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'A side project' })).toHaveAttribute('href', 'https://example.com');
  });

  it('reserves space while the config loads', () => {
    mockPortfolioConfig(null);
    const { container } = render(<Hero />);
    expect(container.firstChild).toHaveAttribute('aria-hidden', 'true');
  });
});
