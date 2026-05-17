import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { fakeProjectionResponse, fakeSimulationResponse } from '../fixtures/responses';

const SimulationDataPointSchema = z.object({
  fecha: z.string(),
  value: z.number(),
  uncertainty_lower: z.number().optional(),
  uncertainty_upper: z.number().optional(),
});

const SimulationResponseSchema = z.object({
  cumulative: z.array(SimulationDataPointSchema),
  cumulative_deaths: z.array(SimulationDataPointSchema),
  exposed: z.array(SimulationDataPointSchema),
  hospitalized: z.array(SimulationDataPointSchema),
  immune: z.array(SimulationDataPointSchema),
  infectious: z.array(SimulationDataPointSchema),
  susceptible: z.array(SimulationDataPointSchema),
  uci: z.array(SimulationDataPointSchema),
});

const ProjectionDataPointSchema = z.object({
  fecha: z.string(),
  value: z.number(),
  uncertainty_lower: z.number().optional(),
  uncertainty_upper: z.number().optional(),
  scenario: z.string().optional(),
});

const ProjectionResponseSchema = z.object({
  R: z.array(ProjectionDataPointSchema),
  H: z.array(ProjectionDataPointSchema),
  U: z.array(ProjectionDataPointSchema),
  F: z.array(ProjectionDataPointSchema),
});

describe('Backend contract — fixtures match published schemas', () => {
  it('fakeSimulationResponse satisfies SimulationResponseSchema', () => {
    expect(() => SimulationResponseSchema.parse(fakeSimulationResponse)).not.toThrow();
  });

  it('fakeProjectionResponse satisfies ProjectionResponseSchema', () => {
    expect(() => ProjectionResponseSchema.parse(fakeProjectionResponse)).not.toThrow();
  });
});
