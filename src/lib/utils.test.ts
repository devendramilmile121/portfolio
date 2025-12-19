import { cn } from '@/lib/utils';

describe('cn utility function', () => {
  it('should combine class values correctly', () => {
    expect(cn('px-2 py-1', 'px-4')).toBe('py-1 px-4');
  });

  it('should handle empty strings', () => {
    expect(cn('')).toBe('');
  });

  it('should handle multiple classes', () => {
    const result = cn('text-sm', 'font-bold', 'text-red-500');
    expect(result).toContain('text-sm');
    expect(result).toContain('font-bold');
    expect(result).toContain('text-red-500');
  });

  it('should merge tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4');
    expect(result).toContain('px-4');
    expect(result).not.toContain('px-2');
  });

  it('should handle conditional classes', () => {
    const isActive = true;
    expect(cn('base-class', isActive && 'active-class')).toContain('base-class');
    expect(cn('base-class', isActive && 'active-class')).toContain('active-class');
  });

  it('should handle false conditional classes', () => {
    const isActive = false;
    const result = cn('base-class', isActive && 'active-class');
    expect(result).toContain('base-class');
    expect(result).not.toContain('active-class');
  });

  it('should handle array of classes', () => {
    const classes = ['px-2', 'py-1'];
    const result = cn(...classes);
    expect(result).toContain('px-2');
    expect(result).toContain('py-1');
  });

  it('should handle object notation for classes', () => {
    const result = cn({
      'text-red-500': true,
      'text-blue-500': false,
    });
    expect(result).toContain('text-red-500');
    expect(result).not.toContain('text-blue-500');
  });

  it('should return empty string for undefined/null input', () => {
    expect(cn(undefined)).toBe('');
    expect(cn(null)).toBe('');
  });
});
