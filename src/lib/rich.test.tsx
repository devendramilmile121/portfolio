import { render, screen } from '@testing-library/react';
import { renderRich } from './rich';

describe('renderRich', () => {
  it('renders plain text unchanged', () => {
    const { container } = render(<p>{renderRich('Just text.')}</p>);
    expect(container.textContent).toBe('Just text.');
  });

  it('renders *emphasis* with an optional class', () => {
    render(<p>{renderRich('I build *fast* things', { emphasisClassName: 'accent' })}</p>);
    expect(screen.getByText('fast').tagName).toBe('EM');
    expect(screen.getByText('fast')).toHaveClass('accent');
  });

  it('opens external links in a new tab and keeps internal ones in place', () => {
    render(<p>{renderRich('See [Samyo](https://samyo.in), [posts](/blogs) and [jobs](#experience).')}</p>);
    expect(screen.getByRole('link', { name: 'Samyo' })).toHaveAttribute('target', '_blank');
    expect(screen.getByRole('link', { name: 'posts' })).not.toHaveAttribute('target');
    expect(screen.getByRole('link', { name: 'jobs' })).toHaveAttribute('href', '#experience');
  });

  it('leaves a lone asterisk alone', () => {
    const { container } = render(<p>{renderRich('5 * 3')}</p>);
    expect(container.textContent).toBe('5 * 3');
    expect(container.querySelector('em')).toBeNull();
  });
});
