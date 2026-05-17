import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDateFormat } from '../useDateFormat';

describe('useDateFormat', () => {
  it('returns a defined value with a formatDate function', () => {
    const { result } = renderHook(() => useDateFormat());
    expect(result.current).toBeDefined();
    expect(typeof result.current.formatDate).toBe('function');
  });

  it('formatDate returns a string for a valid YYYY-MM-DD input', () => {
    // The next-i18next mock returns t(key) => key, so the date-format key
    // itself is returned. We just verify the function does not throw and
    // returns a string.
    const { result } = renderHook(() => useDateFormat());
    const output = result.current.formatDate('2024-01-15');
    expect(typeof output).toBe('string');
  });
});
