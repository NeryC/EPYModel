import { describe, it, expect } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { http, HttpResponse } from "msw";
import { server } from "../../../../tests/msw/server";
import graphInfoReducer from "../../../../store/reducers/graphInfoSlice";
import SimulationFilter from "../SimulationFilter";
import type { SimulationDefaults } from "../../../../types/api";
import { fakeSimulationDefaults } from "../../../../tests/fixtures/responses";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001";

function setup(defaults: SimulationDefaults | null = null) {
  const store = configureStore({ reducer: graphInfoReducer });
  const user = userEvent.setup();
  render(
    <Provider store={store}>
      <SimulationFilter defaults={defaults} />
    </Provider>,
  );
  const uci = screen.getByLabelText("uci-setting") as HTMLInputElement;
  const simulate = screen.getByRole("button", {
    name: "simulate",
  }) as HTMLButtonElement;
  return { user, uci, simulate, store };
}

/** Serie mínima de un punto para identificar de qué respuesta vienen los gráficos. */
const serie = (value: number) => [{ day: 0, value }];
const simulationWith = (value: number) => ({
  success: true,
  data: {
    cumulative: serie(value),
    cumulative_deaths: serie(value),
    exposed: serie(value),
    hospitalized: serie(value),
    immune: serie(value),
    infectious: serie(value),
    susceptible: serie(value),
    uci: serie(value),
  },
});

describe("SimulationFilter — campos numéricos (regresiones reportadas)", () => {
  it("se puede vaciar UCI y escribir 80 (antes quedaba 180/280)", async () => {
    const { user, uci } = setup();
    await user.clear(uci);
    expect(uci.value).toBe("");
    expect(screen.getByText("field-required")).toBeInTheDocument();
    await user.type(uci, "80");
    expect(uci.value).toBe("80");
    expect(screen.queryByText("field-required")).not.toBeInTheDocument();
  });

  it("un valor fuera de rango se muestra tal cual, se marca y bloquea Simular (antes 6000 → 600 en silencio)", async () => {
    const { user, uci, simulate } = setup();
    await user.clear(uci);
    await user.type(uci, "6000");
    expect(uci.value).toBe("6000");
    expect(uci).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByText("field-out-of-range")).toBeInTheDocument();
    expect(simulate).toBeDisabled();
  });

  it("el input declara el mismo máximo que valida el código (5000, antes 3000)", () => {
    const { uci } = setup();
    expect(uci).toHaveAttribute("max", "5000");
  });

  it("con un valor válido nuevo se habilita Simular y se envía ese valor", async () => {
    let received: URLSearchParams | null = null;
    server.use(
      http.get(`${baseURL}/api/v1/simulations`, ({ request }) => {
        received = new URL(request.url).searchParams;
        return HttpResponse.json({
          success: true,
          data: {
            cumulative: [],
            cumulative_deaths: [],
            exposed: [],
            hospitalized: [],
            immune: [],
            infectious: [],
            susceptible: [],
            uci: [],
          },
        });
      }),
    );
    const { user, uci, simulate } = setup();
    await user.clear(uci);
    await user.type(uci, "4000");
    expect(simulate).toBeEnabled();
    await user.click(simulate);
    await waitFor(() => expect(received?.get("UCI_threshold")).toBe("4000"));
  });

  it("el slider de hospitalización avanza de a 0,1 % (permite el ≈0,3 % ajustado por R)", () => {
    setup();
    const slider = screen.getByLabelText("lambda_I_to_H") as HTMLInputElement;
    expect(slider.step).toBe("0.001");
    expect(slider.max).toBe("0.99");
    expect(slider.value).toBe("0.003");
  });

  it("muestra el mensaje de límite de simulaciones con los minutos de espera", async () => {
    server.use(
      http.get(`${baseURL}/api/v1/simulations`, () =>
        HttpResponse.json(
          { success: false, error: "rate_limited", retryAfterSeconds: 300 },
          { status: 429 },
        ),
      ),
    );
    const { user, uci, simulate } = setup();
    await user.clear(uci);
    await user.type(uci, "200");
    await user.click(simulate);
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "error-rate-limited",
    );
  });
});

describe("SimulationFilter — valores iniciales desde /simulation-defaults", () => {
  const custom: SimulationDefaults = {
    ...fakeSimulationDefaults,
    Rt: [0.9, 1.4],
    UCI_threshold: 250,
    V_filtered: 3000,
    lambda_I_to_H: 0.004,
  };

  it("el formulario arranca con los valores del backend", () => {
    setup(custom);
    expect(
      (screen.getByLabelText("uci-setting") as HTMLInputElement).value,
    ).toBe("250");
    expect(
      (screen.getByLabelText("v_filtered") as HTMLInputElement).value,
    ).toBe("3000");
    expect(
      (screen.getByLabelText("lambda_I_to_H") as HTMLInputElement).value,
    ).toBe("0.004");
    expect(screen.getAllByLabelText("rt-month-value")).toHaveLength(2);
    // Sin cambios respecto de lo ya simulado: Simular deshabilitado
    expect(screen.getByRole("button", { name: "simulate" })).toBeDisabled();
  });

  it("Reiniciar vuelve a los valores del backend (no a constantes fijas)", async () => {
    const { user, uci } = setup(custom);
    await user.clear(uci);
    await user.type(uci, "999");
    await user.click(screen.getByRole("button", { name: "reset" }));
    expect(uci.value).toBe("250");
  });

  it("Reiniciar también vuelve a mostrar la simulación inicial (gráficos = formulario)", async () => {
    server.use(
      http.get(`${baseURL}/api/v1/simulations`, () =>
        HttpResponse.json(simulationWith(111)),
      ),
      http.get(`${baseURL}/api/v1/get-first-simulation-data`, () =>
        HttpResponse.json(simulationWith(222)),
      ),
    );
    const { user, uci, simulate, store } = setup(custom);
    const hospitalized = () =>
      store.getState().simulation.hospitalized.data[0]?.value;

    // Se simula otro escenario: los gráficos muestran esa respuesta
    await user.clear(uci);
    await user.type(uci, "999");
    await user.click(simulate);
    await waitFor(() => expect(hospitalized()).toBe(111));

    // Reiniciar: formulario y gráficos vuelven a los valores iniciales
    await user.click(screen.getByRole("button", { name: "reset" }));
    await waitFor(() => expect(hospitalized()).toBe(222));
    expect(uci.value).toBe("250");
    expect(store.getState().simulationUciThreshold).toBe(250);
    // Ya no hay nada distinto que simular
    expect(simulate).toBeDisabled();
  });

  it("si falla la simulación inicial al reiniciar, avisa y deja Simular habilitado", async () => {
    server.use(
      http.get(`${baseURL}/api/v1/get-first-simulation-data`, () =>
        HttpResponse.json({ success: false }, { status: 500 }),
      ),
    );
    const { user, simulate } = setup(custom);
    await user.click(screen.getByRole("button", { name: "reset" }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(simulate).toBeEnabled();
  });

  it("muestra desde qué fecha y con qué Rt estimado parte la simulación", () => {
    setup(fakeSimulationDefaults);
    expect(screen.getByText("simulation-start-note")).toBeInTheDocument();
  });

  it("sin valores del backend usa los de respaldo (λ = 0,3 %)", () => {
    setup(null);
    expect(
      (screen.getByLabelText("lambda_I_to_H") as HTMLInputElement).value,
    ).toBe("0.003");
    expect(screen.queryByText("simulation-start-note")).not.toBeInTheDocument();
  });
});
