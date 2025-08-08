import { useEffect, useState } from 'react';
import { api } from '@/services/api';

type UserTaskStats = { todo: number; in_progress: number; review: number; done: number };

export default function Dashboard() {
  const [stats, setStats] = useState<UserTaskStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/tasks/my-stats');
        setStats(data.data.stats as UserTaskStats);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Dashboard</h1>
      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : stats ? (
        <div className="grid gap-3 md:grid-cols-4">
          {Object.entries(stats).map(([k, v]) => (
            <div key={k} className="bg-white border rounded p-3">
              <div className="text-sm text-gray-500">{k.replace('_', ' ')}</div>
              <div className="text-2xl font-semibold">{v}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">No stats available.</div>
      )}
    </div>
  );
}


