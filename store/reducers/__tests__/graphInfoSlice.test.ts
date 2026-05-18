import { describe, it, expect } from "vitest";
import graphInfoReducer, {
  graphInfoSlice,
  initMain,
  setSimulation,
  setChecks,
  setRange,
  setSimulationLoading,
  setSimulationUciThreshold,
  selectGraphData,
  selectMainGraphData,
  selectLastUpdateDate,
  selectSimulationLoading,
  selectSimulationUciThreshold,
} from "../graphInfoSlice";
import type { DataPoint } from "../../../types/api";

const fakePoint = (fecha: string, value: number): DataPoint => ({
  fecha,
  value,
});

const initial = () => graphInfoReducer(undefined, { type: "@@INIT" });

describe("graphInfoSlice - initial state", () => {
  it("initializes all main graph types as not ready", () => {
    const state = initial();
    expect(state.main.reported.isReady).toBe(false);
    expect(state.main.hospitalized.isReady).toBe(false);
    expect(state.main.ICU.isReady).toBe(false);
    expect(state.main.deceases.isReady).toBe(false);
  });

  it("initializes simulationLoading=false and threshold=null", () => {
    const state = initial();
    expect(state.simulationLoading).toBe(false);
    expect(state.simulationUciThreshold).toBeNull();
  });
});

describe("initMain reducer", () => {
  it("marks each main type ready and sets data", () => {
    const payload = {
      reported: [fakePoint("2024-01-01", 10), fakePoint("2024-01-02", 12)],
      hospitalized: [fakePoint("2024-01-01", 5)],
      ICU: [fakePoint("2024-01-01", 2)],
      deceases: [fakePoint("2024-01-01", 1)],
    };

    const state = graphInfoReducer(initial(), initMain(payload));

    expect(state.main.reported.isReady).toBe(true);
    expect(state.main.reported.data).toHaveLength(2);
    expect(state.main.hospitalized.isReady).toBe(true);
  });

  it("sorts data by fecha ascending", () => {
    const state = graphInfoReducer(
      initial(),
      initMain({
        reported: [fakePoint("2024-01-03", 30), fakePoint("2024-01-01", 10)],
        hospitalized: [],
        ICU: [],
        deceases: [],
      }),
    );
    expect(state.main.reported.data[0].fecha).toBe("2024-01-01");
    expect(state.main.reported.data[1].fecha).toBe("2024-01-03");
  });

  it("computes lastUpdateDate as the latest fecha across all sources", () => {
    const state = graphInfoReducer(
      initial(),
      initMain({
        reported: [fakePoint("2024-01-03", 1)],
        hospitalized: [fakePoint("2024-01-05", 1)],
        ICU: [fakePoint("2024-01-02", 1)],
        deceases: [fakePoint("2024-01-04", 1)],
      }),
    );
    expect(state.main.lastUpdateDate).toBe("2024-01-05");
  });

  it("clamps settings.range.start to dataLength when dataset is shorter than the default anchor", () => {
    const state = graphInfoReducer(
      initial(),
      initMain({
        reported: [fakePoint("2024-01-01", 1), fakePoint("2024-01-02", 2)],
        hospitalized: [],
        ICU: [],
        deceases: [],
      }),
    );
    // sortedData.length - 1 === 1 for reported; clamp must keep start <= finish
    expect(state.main.reported.settings.range.start).toBeLessThanOrEqual(
      state.main.reported.settings.range.finish,
    );
    expect(state.main.reported.settings.range.start).toBe(1);
  });

  it("keeps the default range.start (820) when dataset is large enough", () => {
    const reported = Array.from({ length: 900 }, (_, i) =>
      fakePoint(`2022-01-${String((i % 28) + 1).padStart(2, "0")}`, i),
    );
    const state = graphInfoReducer(
      initial(),
      initMain({ reported, hospitalized: [], ICU: [], deceases: [] }),
    );
    expect(state.main.reported.settings.range.start).toBe(820);
  });
});

describe("setSimulation reducer", () => {
  it("hydrates all simulation series and marks them ready", () => {
    const payload = {
      cumulative: [fakePoint("day-0", 1)],
      cumulative_deaths: [fakePoint("day-0", 0)],
      exposed: [fakePoint("day-0", 1)],
      hospitalized: [fakePoint("day-0", 0)],
      immune: [fakePoint("day-0", 0)],
      infectious: [fakePoint("day-0", 1)],
      susceptible: [fakePoint("day-0", 1000)],
      uci: [fakePoint("day-0", 0)],
    };
    const state = graphInfoReducer(initial(), setSimulation(payload));
    expect(state.simulation.cumulative.isReady).toBe(true);
    expect(state.simulation.susceptible.data[0].value).toBe(1000);
  });
});

describe("setChecks reducer", () => {
  it("toggles a boolean setting on the given main graph type", () => {
    const s0 = initial();
    const before = s0.main.reported.settings.isSmooth;
    const s1 = graphInfoReducer(
      s0,
      setChecks({ type: "reported", checkName: "isSmooth" }),
    );
    expect(s1.main.reported.settings.isSmooth).toBe(!before);
  });
});

describe("setRange reducer", () => {
  it("updates the range of a given main graph type", () => {
    const state = graphInfoReducer(
      initial(),
      setRange({ type: "reported", start: 0, finish: 100 }),
    );
    expect(state.main.reported.settings.range).toEqual({
      start: 0,
      finish: 100,
    });
  });
});

describe("simulation flags", () => {
  it("setSimulationLoading toggles the flag", () => {
    const s = graphInfoReducer(initial(), setSimulationLoading(true));
    expect(s.simulationLoading).toBe(true);
  });

  it("setSimulationUciThreshold stores the number", () => {
    const s = graphInfoReducer(initial(), setSimulationUciThreshold(42));
    expect(s.simulationUciThreshold).toBe(42);
  });
});

describe("selectors", () => {
  it("selectGraphData returns isReady false when state is empty", () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const result = selectGraphData({
      main: undefined,
      simulation: undefined,
    } as any);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(result.main.every((g: any) => g.isReady === false)).toBe(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect(result.simulation.every((g: any) => g.isReady === false)).toBe(true);
  });

  it("selectMainGraphData reflects readiness", () => {
    const state = graphInfoReducer(
      initial(),
      initMain({
        reported: [fakePoint("2024-01-01", 10)],
        hospitalized: [],
        ICU: [],
        deceases: [],
      }),
    );
    const result = selectMainGraphData(state);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const reported = result.find((g: any) => g.type === "reported");
    expect(reported?.isReady).toBe(true);
  });

  it("selectLastUpdateDate returns null on empty state", () => {
    expect(selectLastUpdateDate(initial())).toBeNull();
  });

  it("selectSimulationLoading default false", () => {
    expect(selectSimulationLoading(initial())).toBe(false);
  });

  it("selectSimulationUciThreshold default null", () => {
    expect(selectSimulationUciThreshold(initial())).toBeNull();
  });
});

describe("slice metadata", () => {
  it("exposes the slice name", () => {
    expect(graphInfoSlice.name).toBe("graphInfo");
  });
});
