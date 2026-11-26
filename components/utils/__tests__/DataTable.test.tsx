import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import DataTable from "../DataTable";

describe("DataTable", () => {
  it('con datos de simulación de la carga inicial (day + fecha "day-N") muestra la columna Día', () => {
    const data = [
      { day: 0, fecha: "day-0", value: 2866492.69 },
      { day: 1, fecha: "day-1", value: 2877381.37 },
    ];
    render(<DataTable title="t" data={data} />);
    expect(screen.getByText("data-table-day")).toBeInTheDocument();
    expect(screen.queryByText("day-0")).not.toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
  });

  it("muestra personas enteras con el separador de miles del idioma (es)", () => {
    render(<DataTable title="t" data={[{ day: 0, value: 2866492.69 }]} />);
    expect(screen.getByText("2.866.493")).toBeInTheDocument();
  });

  it("con fechas reales (proyecciones) mantiene la columna Fecha", () => {
    render(
      <DataTable title="t" data={[{ fecha: "2022-12-24", value: 772.3 }]} />,
    );
    expect(screen.getByText("data-table-date")).toBeInTheDocument();
    expect(screen.getByText("2022-12-24")).toBeInTheDocument();
  });
});
