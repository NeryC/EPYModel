import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { axe } from 'jest-axe';
import graphInfoReducer, { initMain, setRange } from '../../../store/reducers/graphInfoSlice';
import MainGraph from '../index';
import type { DataPoint } from '../../../types/api';

const point = (fecha: string, value: number): DataPoint => ({ fecha, value });

const dimensions = {
  width: 800,
  height: 400,
  svgWidth: 800,
  svgHeight: 400,
  left: 40,
  top: 20,
  right: 20,
  bottom: 40,
};

// The slice hard-codes settings.range.start = 820, so we need at least 821
// data points for MultiRangeSlider's data[selectedMin] lookup to succeed.
const N = 900;

function isoDate(i: number): string {
  const d = new Date(2022, 0, 1);
  d.setDate(d.getDate() + i);
  return d.toISOString().slice(0, 10);
}

function makeStore() {
  const store = configureStore({ reducer: graphInfoReducer });
  store.dispatch(
    initMain({
      reported: Array.from({ length: N }, (_, i) => point(isoDate(i), i)),
      hospitalized: Array.from({ length: N }, (_, i) => point(isoDate(i), i / 2)),
      ICU: Array.from({ length: N }, (_, i) => point(isoDate(i), i / 4)),
      deceases: Array.from({ length: N }, (_, i) => point(isoDate(i), i / 8)),
    }),
  );
  // Make sure the range is fully inside the data envelope.
  store.dispatch(setRange({ type: 'reported', start: 820, finish: N - 1 }));
  return store;
}

describe('MainGraph (smoke)', () => {
  beforeAll(() => {
    Element.prototype.getBoundingClientRect = vi.fn(() => ({
      width: 800,
      height: 400,
      top: 0,
      left: 0,
      right: 800,
      bottom: 400,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    })) as never;
  });

  it('mounts without crashing for "reported" type', () => {
    const store = makeStore();
    const { container } = render(
      <Provider store={store}>
        <MainGraph type="reported" dimensions={dimensions} />
      </Provider>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('passes basic accessibility checks', async () => {
    const store = makeStore();
    const { container } = render(
      <Provider store={store}>
        <MainGraph type="reported" dimensions={dimensions} />
      </Provider>,
    );
    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(results.violations).toEqual([]);
  });
});
