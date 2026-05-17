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

- `high`: 85%
- `low`: 75%
- `break`: 75%

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
