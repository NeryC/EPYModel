# Requirements ↔ Tests Traceability Matrix (Frontend)

> Conforms to ISO/IEC/IEEE 29119-3:2021 §6.3.

| Req ID     | Requirement                                                                    | Covered by                                                          |
| ---------- | ------------------------------------------------------------------------------ | ------------------------------------------------------------------- |
| FE-REQ-001 | Page `/` displays a projections chart                                          | `tests/e2e/projections.spec.ts`                                     |
| FE-REQ-002 | Page `/Simulador` displays the simulator                                       | `tests/e2e/simulator.spec.ts`                                       |
| FE-REQ-003 | Redux store hydrates main graphs from backend response                         | `store/reducers/__tests__/graphInfoSlice.test.ts` (`initMain`)      |
| FE-REQ-004 | Redux store hydrates simulation series                                         | `store/reducers/__tests__/graphInfoSlice.test.ts` (`setSimulation`) |
| FE-REQ-005 | Data is sorted by `fecha` ascending                                            | `graphInfoSlice.test.ts` (sort test)                                |
| FE-REQ-006 | `lastUpdateDate` is the latest fecha across sources                            | `graphInfoSlice.test.ts`                                            |
| FE-REQ-007 | `useApi` handles loading / success / error states                              | `hooks/__tests__/useApi.test.tsx`                                   |
| FE-REQ-008 | `useApi` provides `refetch` and `reset`                                        | `hooks/__tests__/useApi.test.tsx`                                   |
| FE-REQ-009 | `ApiService.getProjections` maps R/H/U/F to reported/hospitalized/ICU/deceases | `services/__tests__/api.test.ts`                                    |
| FE-REQ-010 | `ApiService` surfaces `ApiServiceError` on 500                                 | `services/__tests__/api.test.ts`                                    |
| FE-REQ-011 | `ApiService` deduplicates concurrent identical GETs                            | `services/__tests__/api.test.ts`                                    |
| FE-REQ-012 | `ErrorBoundary` renders fallback on child throw                                | `components/ErrorBoundary/__tests__/ErrorBoundary.test.tsx`         |
| FE-REQ-013 | `ErrorBoundary` invokes `onError` callback                                     | `ErrorBoundary.test.tsx`                                            |
| FE-REQ-014 | `ErrorBoundary` retry button resets state                                      | `ErrorBoundary.test.tsx`                                            |
| FE-REQ-015 | `Loading` has accessible role=status                                           | `components/Loading/__tests__/Loading.test.tsx`                     |
| FE-REQ-016 | `Loading` passes axe-core in all sizes                                         | `Loading.test.tsx` (axe)                                            |
| FE-REQ-017 | `MainGraph` mounts and renders SVG without crashing                            | `components/MainGraph/__tests__/MainGraph.test.tsx`                 |
| FE-REQ-018 | `SimulationGraph` mounts and renders SVG without crashing                      | `components/SimulationGraph/__tests__/SimulationGraph.test.tsx`     |
| FE-REQ-019 | Pages have no critical/serious axe-core violations                             | `tests/e2e/projections.spec.ts`, `simulator.spec.ts`                |
| FE-REQ-020 | Frontend fixtures conform to backend Zod schemas                               | `tests/contract/backend-contract.test.ts`                           |
| FE-REQ-021 | Mutation score ≥75% on business-logic layers                                   | `yarn test:mutation` + Stryker report                               |
