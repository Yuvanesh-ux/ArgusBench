import { useEffect, useState } from 'react';
import { listMyTasks, Task } from '@/services/tasks';

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        setTasks(await listMyTasks());
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Tasks</h1>
      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : tasks.length ? (
        <div className="divide-y bg-white border rounded">
          {tasks.map((t) => (
            <div key={t.id} className="px-3 py-2">
              <div className="font-medium">{t.title}</div>
              <div className="text-xs text-gray-500">{t.status} • {t.priority}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">No tasks assigned.</div>
      )}
    </div>
  );
}


