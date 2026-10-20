import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import { createApp } from '../src/app';

describe('API', () => {
  let app: ReturnType<typeof createApp>;

  beforeEach(() => {
    app = createApp();
  });

  it('reports healthy', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });

  it('starts with zero wins', async () => {
    const res = await request(app).get('/api/stats');
    expect(res.body).toEqual({ X: 0, O: 0 });
  });

  it('counts a win for each player', async () => {
    await request(app).post('/api/win').send({ winner: 'X' });
    await request(app).post('/api/win').send({ winner: 'X' });
    await request(app).post('/api/win').send({ winner: 'O' });

    const res = await request(app).get('/api/stats');
    expect(res.body).toEqual({ X: 2, O: 1 });
  });

  it.each([{ winner: 'Draw' }, { winner: 'Z' }, {}])(
    'rejects an invalid winner: %j',
    async (body) => {
      const res = await request(app).post('/api/win').send(body);
      expect(res.status).toBe(400);

      const stats = await request(app).get('/api/stats');
      expect(stats.body).toEqual({ X: 0, O: 0 });
    },
  );
});
