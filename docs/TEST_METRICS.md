# Test Metrics & Evolution Policy (Frontend)

## Snapshot (initial release)

### Coverage targets per layer (see `vitest.config.ts`)

Initial thresholds are calibrated to current coverage with small headroom. Targets below are the documented goal.

| Layer                      | Target lines | Target branches | Target funcs | Target stmts |
| -------------------------- | -----------: | --------------: | -----------: | -----------: |
| `store/**/*.ts`            |          90% |             85% |          90% |          90% |
| `hooks/**/*.{ts,tsx}`      |          85% |             80% |          85% |          85% |
| `utils/**/*.ts`            |          90% |             85% |          90% |          90% |
| `services/**/*.ts`         |          85% |             80% |          85% |          85% |
| `components/**/*.{ts,tsx}` |          75% |             70% |          75% |          75% |
| Global floor               |          70% |             65% |          70% |          70% |

The current `vitest.config.ts` thresholds are set to 0 for global metrics because not all layers are tested yet. As tests land in each layer, raise that layer's threshold per `docs/superpowers/plans/2026-05-17-testing-system-frontend.md`.

### Mutation score targets (Stryker)

- `high` (HTML report green): 85%
- `low` (HTML report yellow): 75%
- `break` (CI gate): **currently `null` — informational only.**

`break` is intentionally disabled in `stryker.conf.json` until we have a measured baseline. The first mutation run on `main` after the test-infra fixes reported 18.35% — but `vitest-runner@8` undercounts coverage when `vitest.config.ts` uses workspace-style `projects`, so the genuine score is higher. Same calibration plan as the backend (`newBack/docs/TEST_METRICS.md`): upgrade `@stryker-mutator/*` to v9, or split a `vitest.mutation.config.ts` exposing only the unit project, then re-enable `break` at the realistic floor.

### Accessibility targets

- 0 `critical` or `serious` axe-core violations on `/` and `/Simulador`.
- Color-contrast rule is disabled because of dynamic D3 colors — alternative checks live in design review.

### Execution time budgets (informational)

- `yarn test:unit`: ≤ 30s
- `yarn test:e2e`: ≤ 5 min (3 browsers)
- `yarn test:mutation`: ≤ 15 min

## Evolution policy

Identical to backend (see `newBack/docs/TEST_METRICS.md`):

1. New code → new tests that keep its layer above threshold.
2. Removed code → tests removed in the same commit.
3. No `.skip` / `.only` in main.
4. Lowering a threshold is a regression — justify in PR description.
5. Mutation report reviewed at every milestone freeze.

## How to read reports

- `coverage/index.html` — coverage drill-down.
- `playwright-report/index.html` — E2E results + traces for failures.
- `reports/mutation/index.html` — surviving mutants per file.

## Known issues

### Lint gate (non-blocking)

ESLint 9 + `eslint-config-next` 16 via `FlatCompat` crashes with `TypeError: Converting circular structure to JSON` while loading the Next preset. Next 16 has also removed the legacy `next lint` CLI, so we cannot fall back to that path.

Current mitigation:

- The CI step `Lint (zero warnings)` in `.github/workflows/frontend-ci.yml` is marked `continue-on-error: true`.
- ESLint is commented out in `lint-staged.config.cjs` (Prettier still runs).
- `yarn build` still type-checks via TypeScript, so type safety is enforced.

This is upstream-tracked and will be re-enabled by un-commenting once `eslint-config-next` ships a clean ESLint 9 flat-config (expected in a near-future Next 16 patch). When that happens:

1. Remove `continue-on-error: true` from the CI lint step.
2. Restore `eslint --fix --max-warnings=0` in `lint-staged.config.cjs`.
3. Run `yarn lint` locally to confirm zero errors.

### E2E specs

Root cause of the previously failing specs: the hermetic stub backend returned only 2 data points, but the default chart range (`createInitialSettings.range.start = 820` in `store/reducers/graphInfoSlice.ts`) assumes a production-scale dataset (~900 daily points). Accessing `data[820].fecha` threw `TypeError: Cannot read properties of undefined`, the ErrorBoundary swallowed it, and all three projections/simulator assertions failed downstream.

Fixes applied:

- `tests/e2e/stub-backend.mjs` now generates ~900 daily synthetic points per series, matching the shape the frontend expects.
- `tests/e2e/simulator.spec.ts` › numeric-input change now targets only non-`readonly`, non-`disabled` inputs, since the Rt input is controlled exclusively by +/- buttons.
- `playwright.config.ts` accepts `E2E_FRONTEND_PORT` / `E2E_BACKEND_PORT` env vars (defaults remain 3000/3001) so local runs can side-step port conflicts.

Result: 6 specs × 3 browsers = 18 tests pass locally and in CI.

Additionally, `createInitialSettings` in `store/reducers/graphInfoSlice.ts` now clamps `range.start` to `Math.min(DEFAULT_RANGE_START, amountOfData)` so a short backend response can no longer trigger the same TypeError. Two unit tests guard the clamp behavior (short dataset clamps, long dataset keeps the 820 anchor).
