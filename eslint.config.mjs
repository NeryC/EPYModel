import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

// eslint-config-next 16 ya exporta flat config: se importa directo.
// (Antes se cargaba con FlatCompat, pensado para el formato .eslintrc, y
// ESLint fallaba con "Converting circular structure to JSON".)
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Mismo alcance que la config de Next, donde se definen los plugins
    files: ["**/*.{js,jsx,mjs,ts,tsx,mts,cts}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "react-hooks/exhaustive-deps": "warn",
      "no-console": ["warn", { allow: ["error", "warn"] }],
      // Reglas nuevas de eslint-plugin-react-hooks 6 (orientadas al React
      // Compiler). Señalan patrones existentes que hoy funcionan — p. ej. los
      // gráficos D3 hacen d3.select(ref.current) durante el render —. Quedan
      // como advertencia hasta refactorizar esos componentes con tests que
      // cubran el dibujo; no ocultarlas: `yarn lint` las sigue listando.
      "react-hooks/refs": "warn",
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/static-components": "warn",
    },
  },
  {
    // CommonJS legítimo: next.config.js y los mocks de vitest (vi.mock no
    // admite import estático dentro de la fábrica).
    files: ["next.config.js", "next-i18next.config.js", "tests/setup.ts"],
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "coverage/**",
    "playwright-report/**",
    "test-results/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
