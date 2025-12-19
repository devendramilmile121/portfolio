import { renderHook, waitFor } from '@testing-library/react';
import { usePortfolioConfig } from './usePortfolioConfig';

describe('usePortfolioConfig hook', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Mock fetch globally
    const mockFetch = jest.fn().mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({}),
    });
    global.fetch = mockFetch;
  });

  it('should have loading, config, and error properties', () => {
    const { result } = renderHook(() => usePortfolioConfig());

    // Verify the hook returns the expected structure
    expect(result.current).toHaveProperty('config');
    expect(result.current).toHaveProperty('loading');
    expect(result.current).toHaveProperty('error');
  });

  it('should initialize with proper types', () => {
    const { result } = renderHook(() => usePortfolioConfig());

    expect(typeof result.current.loading).toBe('boolean');
    expect(result.current.config === null || typeof result.current.config === 'object').toBe(true);
    expect(result.current.error === null || typeof result.current.error === 'string').toBe(true);
  });

  it('should have all required fields in return object', () => {
    const { result } = renderHook(() => usePortfolioConfig());

    const returnKeys = Object.keys(result.current).sort();
    const expectedKeys = ['config', 'error', 'loading'].sort();
    
    expect(returnKeys).toEqual(expectedKeys);
  });
});
