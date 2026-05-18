import { createServer } from 'node:http';

// Production projections span ~900 daily points. The frontend's default
// chart range starts at index 820 (createInitialSettings in graphInfoSlice),
// so the stub must provide at least that many points or the slider crashes.
const DATA_POINTS = 900;
const START_DATE = new Date('2022-01-01T00:00:00Z');

const generateSeries = (baseValue) => {
  const out = [];
  for (let i = 0; i < DATA_POINTS; i++) {
    const d = new Date(START_DATE.getTime() + i * 24 * 60 * 60 * 1000);
    out.push({
      fecha: d.toISOString().slice(0, 10),
      value: Math.round(baseValue + Math.sin(i / 30) * baseValue * 0.3 + i * 0.1),
    });
  }
  return out;
};

const projections = {
  R: generateSeries(100),
  H: generateSeries(50),
  U: generateSeries(20),
  F: generateSeries(5),
};

const simulation = {
  cumulative: [{ day: 0, value: 1 }, { day: 1, value: 2 }],
  cumulative_deaths: [{ day: 0, value: 0 }],
  exposed: [{ day: 0, value: 0 }],
  hospitalized: [{ day: 0, value: 0 }],
  immune: [{ day: 0, value: 0 }],
  infectious: [{ day: 0, value: 1 }],
  susceptible: [{ day: 0, value: 1000 }],
  uci: [{ day: 0, value: 0 }],
};

const send = (res, status, body) => {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  });
  res.end(JSON.stringify(body));
};

const server = createServer((req, res) => {
  if (!req.url) return send(res, 404, { error: 'no url' });
  if (req.url.startsWith('/health')) return send(res, 200, { status: 'OK' });
  if (req.url.startsWith('/api/v1/projections')) return send(res, 200, { success: true, data: projections });
  if (req.url.startsWith('/api/v1/simulations')) return send(res, 200, { success: true, data: simulation });
  if (req.url.startsWith('/api/v1/get-first-simulation-data')) return send(res, 200, { success: true, data: simulation });
  return send(res, 404, { error: 'not stubbed' });
});

const port = Number(process.env.STUB_PORT ?? 3001);
server.listen(port, () => {
  console.log(`stub backend listening on http://localhost:${port}`);
});
