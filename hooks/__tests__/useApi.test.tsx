import { describe, it, expect, vi } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useApi } from '../useApi';
import { ApiServiceError } from '../../services/api';

describe('useApi (generic hook)', () => {
  it('starts with loading=false, success=false, data=null', () => {
    const apiCall = vi.fn().mockResolvedValue('hello');
    const { result } = renderHook(() => useApi(apiCall));
    expect(result.current.loading).toBe(false);
    expect(result.current.success).toBe(false);
    expect(result.current.data).toBeNull();
  });

  it('runs immediately when immediate=true and lands on success state', async () => {
    const apiCall = vi.fn().mockResolvedValue('hello');
    const onSuccess = vi.fn();
    const { result } = renderHook(() => useApi(apiCall, { immediate: true, onSuccess }));

    await waitFor(() => expect(result.current.success).toBe(true));
    expect(result.current.data).toBe('hello');
    expect(result.current.loading).toBe(false);
    expect(onSuccess).toHaveBeenCalledWith('hello');
  });

  it('captures errors and exposes ApiServiceError', async () => {
    const apiCall = vi.fn().mockRejectedValue(new ApiServiceError('boom', 500));
    const onError = vi.fn();
    const { result } = renderHook(() => useApi(apiCall, { immediate: true, onError }));

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error?.message).toBe('boom');
    expect(result.current.loading).toBe(false);
    expect(onError).toHaveBeenCalled();
  });

  it('wraps non-ApiServiceError into ApiServiceError', async () => {
    const apiCall = vi.fn().mockRejectedValue(new Error('plain error'));
    const { result } = renderHook(() => useApi(apiCall, { immediate: true }));

    await waitFor(() => expect(result.current.error).not.toBeNull());
    expect(result.current.error).toBeInstanceOf(ApiServiceError);
    expect(result.current.error?.message).toBe('plain error');
  });

  it('refetch re-runs the apiCall', async () => {
    let count = 0;
    const apiCall = vi.fn().mockImplementation(() => Promise.resolve(`call-${++count}`));
    const { result } = renderHook(() => useApi(apiCall, { immediate: true }));

    await waitFor(() => expect(result.current.success).toBe(true));
    expect(result.current.data).toBe('call-1');

    await act(async () => {
      await result.current.refetch();
    });
    expect(result.current.data).toBe('call-2');
  });

  it('reset clears all state', async () => {
    const apiCall = vi.fn().mockResolvedValue('hello');
    const { result } = renderHook(() => useApi(apiCall, { immediate: true }));
    await waitFor(() => expect(result.current.success).toBe(true));

    act(() => result.current.reset());
    expect(result.current.data).toBeNull();
    expect(result.current.success).toBe(false);
    expect(result.current.error).toBeNull();
  });
});
