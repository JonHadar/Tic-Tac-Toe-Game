import type { Player, Stats } from './types';

// Empty by default: the API is served from the same origin (Vite proxy in
// development, nginx in Docker). Set VITE_API_URL to call a server elsewhere.
const API_URL = import.meta.env.VITE_API_URL ?? '';

export async function fetchStats(): Promise<Stats> {
  const res = await fetch(`${API_URL}/api/stats`);
  return res.json();
}

export async function reportWin(winner: Player): Promise<void> {
  await fetch(`${API_URL}/api/win`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ winner }),
  });
}
