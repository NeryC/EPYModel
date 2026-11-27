import { describe, it, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ChangeEvent } from "react";
import {
  parseNumericInput,
  getSimulationErrorKey,
  formatPercent,
} from "../utils";
import { useNumericInput } from "../hooks";
import { ApiServiceError } from "../../../../services/api";

const UCI = { MIN: 1, MAX: 5000 };
const change = (value: string) =>
  ({ target: { value } }) as ChangeEvent<HTMLInputElement>;

describe("parseNumericInput", () => {
  it.each([
    ["250", 250, null],
    ["1", 1, null],
    ["5000", 5000, null],
    ["", null, "required"],
    ["   ", null, "required"],
    ["0", null, "out-of-range"],
    ["5001", null, "out-of-range"],
    ["6000", null, "out-of-range"],
    ["-3", null, "out-of-range"],
    ["abc", null, "required"],
  ])('"%s" → value=%s error=%s', (text, value, error) => {
    expect(parseNumericInput(text, UCI)).toEqual({ value, error });
  });

  it("camas y vacunados deben ser enteros (12,5 camas no tiene sentido)", () => {
    const enteros = { MIN: 1, MAX: 5000, INTEGER: true };
    expect(parseNumericInput("12.5", enteros)).toEqual({
      value: null,
      error: "not-integer",
    });
    expect(parseNumericInput("12", enteros)).toEqual({
      value: 12,
      error: null,
    });
    // λ sí admite decimales
    expect(parseNumericInput("0.003", { MIN: 0, MAX: 0.99 })).toEqual({
      value: 0.003,
      error: null,
    });
  });
});

describe("useNumericInput — el campo se puede editar libremente", () => {
  it('permite vaciar el campo y escribir otro número (antes 100 → borrar → "80" daba 280)', () => {
    const { result } = renderHook(() => useNumericInput(100, UCI));
    act(() => result.current.onChange(change("")));
    expect(result.current.text).toBe("");
    expect(result.current.value).toBeNull();
    expect(result.current.error).toBe("required");
    act(() => result.current.onChange(change("8")));
    act(() => result.current.onChange(change("80")));
    expect(result.current.text).toBe("80");
    expect(result.current.value).toBe(80);
    expect(result.current.error).toBeNull();
  });

  it('muestra lo escrito aunque esté fuera de rango y lo marca como error (antes "6000" quedaba en 600)', () => {
    const { result } = renderHook(() => useNumericInput(100, UCI));
    act(() => result.current.onChange(change("6000")));
    expect(result.current.text).toBe("6000");
    expect(result.current.value).toBeNull();
    expect(result.current.error).toBe("out-of-range");
  });

  it("reset vuelve al valor inicial", () => {
    const { result } = renderHook(() => useNumericInput(100, UCI));
    act(() => result.current.onChange(change("")));
    act(() => result.current.reset());
    expect(result.current).toMatchObject({
      text: "100",
      value: 100,
      error: null,
    });
  });
});

describe("formatPercent", () => {
  it.each([
    [0.002, "es", "0,2 %"],
    [0.01, "es", "1 %"],
    [0.015, "es", "1,5 %"],
    [0.3, "es", "30 %"],
    [0.015, "en", "1.5%"],
  ])('%s (%s) → "%s"', (v, locale, expected) => {
    expect(formatPercent(v, locale).replace(/ /g, " ")).toBe(expected);
  });
});

describe("getSimulationErrorKey", () => {
  it("sin respuesta del servidor → error-network", () => {
    expect(
      getSimulationErrorKey(
        new ApiServiceError("x", undefined, "NETWORK_ERROR"),
      ),
    ).toEqual({
      key: "error-network",
    });
  });
  it("429 → error-rate-limited con los minutos a esperar (redondeo hacia arriba)", () => {
    expect(
      getSimulationErrorKey(
        new ApiServiceError("x", 429, undefined, undefined, 61),
      ),
    ).toEqual({
      key: "error-rate-limited",
      minutes: 2,
    });
  });
  it.each([
    [400, "error-invalid-params"],
    [422, "error-not-converged"],
    [500, "error-server"],
    [503, "error-server"],
  ])("%d → %s", (status, key) => {
    expect(getSimulationErrorKey(new ApiServiceError("x", status))).toEqual({
      key,
    });
  });
  it("error desconocido → simulation-error", () => {
    expect(getSimulationErrorKey(new Error("???"))).toEqual({
      key: "simulation-error",
    });
  });
});
