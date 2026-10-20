import express, { Request, Response } from 'express';
import cors from 'cors';

type Player = 'X' | 'O';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Win counters for all games played against this server, kept in memory.
  const victoryStats: Record<Player, number> = { X: 0, O: 0 };

  // Liveness check used by Docker and CI.
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // Record the winner of a finished game.
  app.post('/api/win', (req: Request, res: Response) => {
    const winner = req.body?.winner;

    if (winner !== 'X' && winner !== 'O') {
      res.status(400).json({ message: 'winner must be "X" or "O"' });
      return;
    }

    victoryStats[winner as Player]++;
    console.log(`Winner updated: ${winner}. Current stats:`, victoryStats);
    res.json({ message: 'Score updated', currentStats: victoryStats });
  });

  // Return the all-time win counters.
  app.get('/api/stats', (_req: Request, res: Response) => {
    res.json(victoryStats);
  });

  return app;
}
