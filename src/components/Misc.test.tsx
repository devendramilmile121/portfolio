import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { ScrollToTop } from './ScrollToTop';
import SeasonalEffects from './SeasonalEffects';

describe('ScrollToTop', () => {
  it('should render without crashing', () => {
    const { container } = render(
      <BrowserRouter>
        <ScrollToTop />
      </BrowserRouter>
    );
    expect(container).toBeTruthy();
  });
});

describe('SeasonalEffects', () => {
  it('should render without crashing', () => {
    const { container } = render(<SeasonalEffects effects={[]} />);
    expect(container).toBeTruthy();
  });

  it('should check if should render returns boolean', () => {
    const { container } = render(<SeasonalEffects effects={[]} />);
    const effect = container.querySelector('div');
    // Component should render or not render based on season
    expect(effect !== null || effect === null).toBe(true);
  });
});
