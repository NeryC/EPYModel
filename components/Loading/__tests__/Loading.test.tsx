import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import Loading from '../index';

describe('Loading', () => {
  it('renders with default size md and no text', () => {
    render(<Loading />);
    const spinner = screen.getByRole('status', { name: /loading/i });
    expect(spinner).toBeInTheDocument();
  });

  it('renders the provided text', () => {
    render(<Loading text="Cargando datos…" />);
    expect(screen.getByText('Cargando datos…')).toBeInTheDocument();
  });

  it.each(['sm', 'md', 'lg'] as const)('renders size %s without crashing', (size) => {
    const { container } = render(<Loading size={size} />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('accessibility — no detectable violations', async () => {
    const { container } = render(<Loading text="Cargando" />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
