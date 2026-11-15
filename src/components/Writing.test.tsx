import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Writing } from './Writing';
import { mockConfig, mockPortfolioConfig } from '@/test/fixtures';
import type { BlogPost } from '@/data/blogs';

// blogs.ts relies on Vite's import.meta.glob, which Jest can't evaluate
jest.mock('@/data/blogs', () => ({ getListedBlogs: jest.fn() }));
import { getListedBlogs } from '@/data/blogs';

const post = (n: number): BlogPost => ({
  slug: `post-${n}`,
  title: `Post number ${n}`,
  date: `2026-0${(n % 9) + 1}-10`,
  summary: 'Summary',
  tags: [],
  body: 'word '.repeat(440),
  unlisted: false,
});

const renderWriting = () =>
  render(
    <MemoryRouter>
      <Writing />
    </MemoryRouter>
  );

describe('Writing', () => {
  afterEach(() => jest.restoreAllMocks());

  it('shows the five latest posts with reading time and a link to the rest', () => {
    mockPortfolioConfig();
    (getListedBlogs as jest.Mock).mockReturnValue([1, 2, 3, 4, 5, 6, 7].map(post));
    renderWriting();

    expect(screen.getByRole('link', { name: /Post number 1/ })).toHaveAttribute('href', '/blogs/post-1');
    expect(screen.queryByText('Post number 6')).not.toBeInTheDocument();
    expect(screen.getAllByText('2 min')).toHaveLength(5);
    expect(screen.getByRole('link', { name: /All 7 posts/ })).toHaveAttribute('href', '/blogs');
  });

  it('renders nothing when blogs are disabled', () => {
    mockPortfolioConfig({ ...mockConfig, blogs: { enabled: false } });
    (getListedBlogs as jest.Mock).mockReturnValue([post(1)]);
    const { container } = renderWriting();
    expect(container).toBeEmptyDOMElement();
  });
});
