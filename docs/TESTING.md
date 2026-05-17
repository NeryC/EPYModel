# Frontend Test Plan (epimodel-next)

> Following IEEE 829-2008 _Standard for Software and System Test Documentation_.

## 1. Test plan identifier

`epimodel-next-test-plan-2026-05`

## 2. Introduction

This document describes the test plan for the EPI Model frontend (Next.js). It is part of the thesis deliverable. Full design and rationale: `../docs/superpowers/specs/2026-05-17-testing-system-design.md` (at the repo root, under the `Codigo/` parent directory).

## 3. Test items

- TypeScript/TSX source under `components/`, `hooks/`, `store/`, `services/`, `utils/`, `config/`.
- Public pages: `/` (projections) and `/Simulador` (simulator).

## 4. Features to be tested

- Redux store reducers and selectors (`graphInfoSlice`).
- Custom hooks (`useApi`, `useDateFormat`).
- `ApiService` HTTP client (success, error, dedup, key mapping).
- Components: `Loading`, `ErrorBoundary`, `MainGraph`, `SimulationGraph`.
- End-to-end flows on `/` and `/Simulador`.
- Accessibility (axe-core in components + Playwright pages).
- Contract: frontend fixtures match backend Zod schemas.

## 5. Features not to be tested

- Visual screenshot regression of D3 charts (anti-aliasing variance → false positives; see spec §4.3).
- Internationalization correctness of translation strings (out of scope; covered by manual review).
- Performance budgets (no SLA — academic project).

## 6. Approach (Testing Trophy — Dodds 2018)

| Level                     | Tool                                 |
| ------------------------- | ------------------------------------ |
| Static (lint, type-check) | ESLint, `next build`                 |
| Unit                      | Vitest + jsdom                       |
| Integration (component)   | Vitest + React Testing Library + MSW |
| Contract                  | Vitest + Zod                         |
| E2E                       | Playwright + axe-core                |
| Mutation                  | Stryker (vitest-runner)              |

## 7. Item pass / fail criteria

- All listed tests pass.
- Coverage thresholds in `vitest.config.ts > coverage.thresholds` met.
- Mutation score ≥ 75% on `store/`, `hooks/`, `utils/`, `services/`.
- Zero `critical` or `serious` axe-core violations on `/` and `/Simulador`.

## 8. Suspension and resumption criteria

- Same policy as backend: no `.skip`/`.only` allowed in main. Flaky tests get an issue + deadline.

## 9. Test deliverables

- Test files under `__tests__/` co-located + `tests/`.
- Coverage HTML under `coverage/`.
- Playwright HTML report under `playwright-report/`.
- Mutation report under `reports/mutation/`.
- This document + `TEST_TRACEABILITY.md` + `TEST_METRICS.md`.

## 10. Test environment

- Node 20.x.
- Browsers via Playwright: Chromium, Firefox, WebKit.
- No real backend required: hermetic stub at `tests/e2e/stub-backend.mjs` for E2E; MSW for unit + component.

## 11. How to run the suite

```bash
yarn install
yarn test:unit          # ~10s
yarn test:coverage      # ~30s + threshold gate
yarn test:e2e           # ~60-120s (3 browsers); needs Playwright browsers installed
yarn test:mutation      # ~5-15 min
yarn test:ci            # unit + coverage + build + e2e
```

## 12. Troubleshooting

| Symptom                                                      | Likely cause                                                                 | Fix                                                                                                    |
| ------------------------------------------------------------ | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| `getBoundingClientRect is not a function` in component tests | jsdom incomplete SVG support                                                 | Already mocked in `tests/setup.ts`; if a different test needs different geometry, add a per-test mock. |
| Playwright tests fail to find `<svg>`                        | Stub backend not running or page didn't render                               | Inspect `playwright-report/` traces. The webServer logs (stdout) live there too.                       |
| MSW logs `[MSW] Unhandled request`                           | A network call escaped the handlers                                          | Add a matching `http.get(...)` in `tests/msw/handlers.ts` or use `server.use(...)` per-test.           |
| Coverage gate fails on a new file                            | Add tests for the file or update the threshold pattern (with justification). |
