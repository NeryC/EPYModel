import { describe, it, expect, beforeAll, vi } from "vitest";
import { render } from "@testing-library/react";
import Graph from "../Graph";

// Serie realista de fallecidos acumulados: crece de 18,5k a 24,5k.
const deaths = Array.from({ length: 30 }, (_, day) => ({
  day,
  value: 18_500 + day * 200,
}));

describe("SimulationGraph/Graph — eje Y", () => {
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

  it('no muestra la etiqueta fija "×1,000"', () => {
    const { container } = render(
      <Graph type="cumulative_deaths" data={deaths} />,
    );
    expect(container.textContent).not.toContain("×1,000");
  });

  it("el eje Y arranca en 0 y usa unidades legibles (k)", () => {
    const { container, rerender } = render(
      <Graph type="cumulative_deaths" data={deaths} />,
    );
    // Los ejes D3 se dibujan en un efecto que necesita los refs ya montados.
    rerender(<Graph type="cumulative_deaths" data={deaths} />);
    const ticks = Array.from(
      container.querySelectorAll("#YAxis .tick text"),
    ).map((t) => t.textContent);
    expect(ticks[0]).toBe("0");
    expect(ticks.some((t) => /k$/.test(t ?? ""))).toBe(true);
    // Sin la división por 1000, ningún tick debería ser un número chico como "24.5"
    expect(ticks).not.toContain("24.5");
  });
});
