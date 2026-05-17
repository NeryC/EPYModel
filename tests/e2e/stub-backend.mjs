import { createServer } from 'node:http';

const projections = {
  R: [{ fecha: '2024-01-01', value: 10 }, { fecha: '2024-01-02', value: 12 }],
  H: [{ fecha: '2024-01-01', value: 5 },  { fecha: '2024-01-02', value: 6 }],
  U: [{ fecha: '2024-01-01', value: 2 },  { fecha: '2024-01-02', value: 3 }],
  F: [{ fecha: '2024-01-01', value: 1 },  { fecha: '2024-01-02', value: 1 }],
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
