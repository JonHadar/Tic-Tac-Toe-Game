import { useCallback, useEffect, useState } from 'react';
import { fetchStats } from './api';
import type { Stats } from './types';

const POLL_INTERVAL_MS = 3000;

// All-time stats from the server, refreshed periodically and on demand.
export function useGlobalStats() {
  const [stats, setStats] = useState<Stats>({ X: 0, O: 0 });

  const refresh = useCallback(async () => {
    try {
      setStats(await fetchStats());
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    // Polling: setState runs in the async callback, not synchronously in the effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh();
    const intervalId = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [refresh]);

  return { stats, refresh };
}
