import { http, HttpResponse } from 'msw';
import { fakeProjectionResponse, fakeSimulationResponse } from '../fixtures/responses';

const apiBase = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export const handlers = [
  http.get(`${apiBase}/api/v1/projections`, () =>
    HttpResponse.json({ success: true, data: fakeProjectionResponse }),
  ),
  http.get(`${apiBase}/api/v1/simulations`, () =>
    HttpResponse.json({ success: true, data: fakeSimulationResponse }),
  ),
  http.get(`${apiBase}/api/v1/get-first-simulation-data`, () =>
    HttpResponse.json({ success: true, data: fakeSimulationResponse }),
  ),
  http.get(`${apiBase}/health`, () =>
    HttpResponse.json({ status: 'OK', timestamp: new Date().toISOString() }),
  ),
];
