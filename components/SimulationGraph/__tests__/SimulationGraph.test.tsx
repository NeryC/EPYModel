import { describe, it, expect, beforeAll, vi } from 'vitest';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { axe } from 'jest-axe';
import graphInfoReducer, { setSimulation } from '../../../store/reducers/graphInfoSlice';
// Note: `components/SimulationGraph/index.tsx` does `export *`, which does
// not re-export default exports, so we import the component file directly.
import SimulationGraph from '../SimulationGraph';

const series = (n: number) =>
  Array.from({ length: n }, (_, i) => ({ fecha: `day-${i}`, value: i }));

function makeStore() {
  const store = configureStore({ reducer: graphInfoReducer });
  store.dispatch(
    setSimulation({
      cumulative: series(30),
      cumulative_deaths: series(30),
      exposed: series(30),
      hospitalized: series(30),
      immune: series(30),
      infectious: series(30),
      susceptible: series(30),
      uci: series(30),
    }),
  );
  return store;
}

describe('SimulationGraph (smoke)', () => {
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

  it('mounts without crashing for type=cumulative', () => {
    const store = makeStore();
    const { container } = render(
      <Provider store={store}>
        <SimulationGraph type="cumulative" />
      </Provider>,
    );
    expect(container.firstChild).toBeInTheDocument();
  });

  it('passes basic accessibility checks', async () => {
    const store = makeStore();
    const { container } = render(
      <Provider store={store}>
        <SimulationGraph type="cumulative" />
      </Provider>,
    );
    const results = await axe(container, {
      rules: { 'color-contrast': { enabled: false } },
    });
    expect(results.violations).toEqual([]);
  });
});
