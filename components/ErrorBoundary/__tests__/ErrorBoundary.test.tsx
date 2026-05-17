import { describe, it, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ErrorBoundary } from '../index';

function Boom(): never {
  throw new Error('kaboom');
}

describe('ErrorBoundary', () => {
  // eslint-disable-next-line no-console
  const origError = console.error;
  beforeAll(() => {
    // Silence React's caught-error logging
    // eslint-disable-next-line no-console
    console.error = vi.fn();
  });
  afterAll(() => {
    // eslint-disable-next-line no-console
    console.error = origError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>healthy content</div>
      </ErrorBoundary>,
    );
    expect(screen.getByText('healthy content')).toBeInTheDocument();
  });

  it('renders fallback UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByText('error-boundary-title')).toBeInTheDocument();
    expect(screen.getByText('error-boundary-retry')).toBeInTheDocument();
  });

  it('invokes onError callback when a child throws', () => {
    const onError = vi.fn();
    render(
      <ErrorBoundary onError={onError}>
        <Boom />
      </ErrorBoundary>,
    );
    expect(onError).toHaveBeenCalled();
    const callArgs = onError.mock.calls[0];
    expect(callArgs[0]).toBeInstanceOf(Error);
  });

  it('retry button resets the boundary', () => {
    const { rerender } = render(
      <ErrorBoundary>
        <Boom />
      </ErrorBoundary>,
    );
    // Swap to safe children BEFORE clicking retry so the boundary's
    // re-render after handleRetry does not re-throw via <Boom />.
    rerender(
      <ErrorBoundary>
        <div>recovered</div>
      </ErrorBoundary>,
    );
    const retryBtn = screen.getByText('error-boundary-retry');
    fireEvent.click(retryBtn);
    expect(screen.getByText('recovered')).toBeInTheDocument();
  });

  it('renders custom fallback when provided', () => {
    render(
      <ErrorBoundary fallback={<div>custom fallback</div>}>
        <Boom />
      </ErrorBoundary>,
    );
    expect(screen.getByText('custom fallback')).toBeInTheDocument();
  });
});
