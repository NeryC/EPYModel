import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { server } from '../../tests/msw/server';
import { ApiService, ApiServiceError } from '../api';
import { fakeProjectionResponse, fakeSimulationResponse } from '../../tests/fixtures/responses';

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

describe('ApiService.getProjections', () => {
  const svc = new ApiService({ baseURL, timeout: 5000 });
  beforeEach(() => svc.clearRequestQueue());

  it('maps backend keys (R/H/U/F) to frontend keys (reported/hospitalized/ICU/deceases)', async () => {
    const result = await svc.getProjections({ format: 'json' });
    expect(result.reported).toEqual(fakeProjectionResponse.R);
    expect(result.hospitalized).toEqual(fakeProjectionResponse.H);
    expect(result.ICU).toEqual(fakeProjectionResponse.U);
    expect(result.deceases).toEqual(fakeProjectionResponse.F);
  });

  it('throws ApiServiceError when the server returns 500', async () => {
    server.use(
      http.get(`${baseURL}/api/v1/projections`, () =>
        HttpResponse.json({ success: false, error: 'oops' }, { status: 500 }),
      ),
    );
    await expect(svc.getProjections({})).rejects.toBeInstanceOf(ApiServiceError);
  });
});

describe('ApiService.getSimulation', () => {
  const svc = new ApiService({ baseURL, timeout: 5000 });
  beforeEach(() => svc.clearRequestQueue());

  it('returns the data field on success', async () => {
    const result = await svc.getSimulation({
      Rt: [1.1],
      UCI_threshold: 100,
      V_filtered: 1000,
      lambda_I_to_H: 0.5,
    });
    expect(result).toEqual(fakeSimulationResponse);
  });
});

describe('ApiService.getFirstSimulationData', () => {
  const svc = new ApiService({ baseURL, timeout: 5000 });
  beforeEach(() => svc.clearRequestQueue());

  it('keeps the fecha field through the transform', async () => {
    const result = await svc.getFirstSimulationData();
    expect(result.cumulative[0]).toHaveProperty('fecha');
  });

  it('handles backend "day" field by converting to "day-N"', async () => {
    server.use(
      http.get(`${baseURL}/api/v1/get-first-simulation-data`, () =>
        HttpResponse.json({
          success: true,
          data: {
            cumulative: [{ day: 7, value: 100 }],
            cumulative_deaths: [],
            exposed: [],
            hospitalized: [],
            immune: [],
            infectious: [],
            susceptible: [],
            uci: [],
          },
        }),
      ),
    );
    const result = await svc.getFirstSimulationData();
    expect(result.cumulative[0].fecha).toBe('day-7');
  });
});

describe('ApiServiceError', () => {
  it('stores status and code', () => {
    const err = new ApiServiceError('boom', 500, 'X');
    expect(err.message).toBe('boom');
    expect(err.status).toBe(500);
    expect(err.code).toBe('X');
    expect(err.name).toBe('ApiServiceError');
  });
});

describe('request deduplication', () => {
  it('returns the same promise for two concurrent identical requests', async () => {
    const svc = new ApiService({ baseURL, timeout: 5000 });
    const p1 = svc.getProjections({ format: 'json' });
    const p2 = svc.getProjections({ format: 'json' });
    const [r1, r2] = await Promise.all([p1, p2]);
    expect(r1).toEqual(r2);
  });
});
