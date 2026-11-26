import { describe, it, expect } from "vitest";
import { renderHook } from "@testing-library/react";
import { formatAxisValue, useGetDomain } from "../index";

describe("useGetDomain", () => {
  const data = [{ v: 18_500 }, { v: 24_500 }];

  it("por defecto usa el extent de los datos (comportamiento de MainGraph)", () => {
    const { result } = renderHook(() => useGetDomain({ data, field: "v" }));
    expect(result.current).toEqual([18_500, 24_500]);
  });

  it("con includeZero el dominio empieza en 0", () => {
    const { result } = renderHook(() =>
      useGetDomain({ data, field: "v", includeZero: true }),
    );
    expect(result.current).toEqual([0, 24_500]);
  });

  it("con includeZero y datos todos en 0 devuelve un dominio no degenerado", () => {
    const { result } = renderHook(() =>
      useGetDomain({
        data: [{ v: 0 }, { v: 0 }],
        field: "v",
        includeZero: true,
      }),
    );
    expect(result.current).toEqual([0, 1]);
  });
});

describe("formatAxisValue", () => {
  it.each([
    [0, "0"],
    [250, "250"],
    [0.5, "0.5"],
    [1_500, "1.5k"],
    [20_000, "20k"],
    [6_000_000, "6M"],
  ])("%d → %s", (value, expected) => {
    expect(formatAxisValue(value)).toBe(expected);
  });
});
