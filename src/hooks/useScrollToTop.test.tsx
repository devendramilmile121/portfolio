import React from 'react';
import { renderHook } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { useScrollToTop } from './useScrollToTop';

describe('useScrollToTop hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    window.scrollTo = jest.fn();
  });

  it('should scroll to top on mount', () => {
    const TestWrapper = ({ children }: { children: React.ReactNode }): React.ReactElement => 
      React.createElement(BrowserRouter, {}, children);

    renderHook(() => useScrollToTop(), {
      wrapper: TestWrapper,
    });

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('should use window.scrollTo correctly', () => {
    const TestWrapper = ({ children }: { children: React.ReactNode }): React.ReactElement =>
      React.createElement(BrowserRouter, {}, children);

    renderHook(() => useScrollToTop(), {
      wrapper: TestWrapper,
    });

    const scrollToMock = window.scrollTo as jest.Mock;
    expect(scrollToMock.mock.calls[0]).toEqual([0, 0]);
  });
});
