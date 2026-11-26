import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import handler, { PAGES_TO_REVALIDATE } from "../../pages/api/revalidate";

function makeRes() {
  const res = {
    statusCode: 200,
    body: undefined as unknown,
    revalidate: vi.fn(async (_path: string): Promise<void> => undefined),
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(body: unknown) {
      this.body = body;
      return this;
    },
  };
  return res;
}

const call = async (query: Record<string, string> = {}, method = "POST") => {
  const res = makeRes();
  await handler({ method, query } as never, res as never);
  return res;
};

describe("/api/revalidate", () => {
  beforeEach(() => vi.stubEnv("REVALIDATE_TOKEN", "s3creto"));
  afterEach(() => vi.unstubAllEnvs());

  it("sin REVALIDATE_TOKEN configurado está deshabilitada (antes aceptaba peticiones sin secreto)", async () => {
    vi.stubEnv("REVALIDATE_TOKEN", "");
    const res = await call({});
    expect(res.statusCode).toBe(503);
    expect(res.revalidate).not.toHaveBeenCalled();
  });

  it("rechaza un secreto ausente o incorrecto", async () => {
    expect((await call({})).statusCode).toBe(401);
    expect((await call({ secret: "otro" })).statusCode).toBe(401);
  });

  it("solo acepta POST", async () => {
    expect((await call({ secret: "s3creto" }, "GET")).statusCode).toBe(405);
  });

  it("con el secreto correcto revalida inicio y simulador en ambos idiomas", async () => {
    const res = await call({ secret: "s3creto" });
    expect(res.statusCode).toBe(200);
    expect(res.revalidate.mock.calls.map((c) => c[0])).toEqual(
      PAGES_TO_REVALIDATE,
    );
    expect(PAGES_TO_REVALIDATE).toEqual([
      "/",
      "/Simulador",
      "/en",
      "/en/Simulador",
    ]);
    expect(res.body).toEqual({ revalidated: true, paths: PAGES_TO_REVALIDATE });
  });

  it("si una revalidación falla responde 500 sin dejar de intentar las demás", async () => {
    const res = makeRes();
    res.revalidate.mockImplementation(async (p: string) => {
      if (p === "/Simulador") throw new Error("backend caído");
    });
    await handler(
      { method: "POST", query: { secret: "s3creto" } } as never,
      res as never,
    );
    expect(res.statusCode).toBe(500);
    expect(res.revalidate).toHaveBeenCalledTimes(4);
    expect(res.body).toMatchObject({
      revalidated: false,
      failed: ["/Simulador"],
    });
  });
});
