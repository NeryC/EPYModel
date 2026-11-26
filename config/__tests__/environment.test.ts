import { describe, it, expect } from "vitest";
import { getApiUrl } from "../environment";

describe("getApiUrl", () => {
  it("en el navegador usa NEXT_PUBLIC_API_URL", () => {
    expect(
      getApiUrl(
        {
          NEXT_PUBLIC_API_URL: "http://localhost:3001",
          API_URL_INTERNAL: "http://backend:3001",
        },
        false,
      ),
    ).toBe("http://localhost:3001");
  });

  it("en el servidor prefiere API_URL_INTERNAL (p. ej. la red interna de Docker)", () => {
    expect(
      getApiUrl(
        {
          NEXT_PUBLIC_API_URL: "http://localhost:3001",
          API_URL_INTERNAL: "http://backend:3001",
        },
        true,
      ),
    ).toBe("http://backend:3001");
  });

  it("en el servidor sin API_URL_INTERNAL cae a NEXT_PUBLIC_API_URL (comportamiento anterior)", () => {
    expect(
      getApiUrl({ NEXT_PUBLIC_API_URL: "http://localhost:3001" }, true),
    ).toBe("http://localhost:3001");
  });

  it("el navegador nunca usa API_URL_INTERNAL", () => {
    expect(
      getApiUrl(
        { API_URL_INTERNAL: "http://backend:3001", NODE_ENV: "development" },
        false,
      ),
    ).toBe("http://localhost:3001");
  });

  it("en producción sin overrides usa NEXT_PUBLIC_API_URL_PROD", () => {
    expect(
      getApiUrl(
        {
          NODE_ENV: "production",
          NEXT_PUBLIC_API_URL_PROD: "http://prod:3001",
        },
        false,
      ),
    ).toBe("http://prod:3001");
  });
});
