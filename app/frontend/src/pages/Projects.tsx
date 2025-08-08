import { useEffect, useState } from 'react';
import { createProject, listMyProjects, Project } from '@/services/projects';

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      setProjects(await listMyProjects());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const onCreate = async () => {
    if (!name.trim()) return;
    await createProject({ name });
    setName('');
    await load();
  };

  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Projects</h1>
      <div className="mb-4 flex gap-2">
        <input className="border rounded px-3 py-2" placeholder="New project name" value={name} onChange={(e) => setName(e.target.value)} />
        <button className="px-3 py-2 rounded bg-primary-600 text-white" onClick={onCreate}>Create</button>
      </div>
      {loading ? (
        <div className="text-sm text-gray-500">Loading…</div>
      ) : projects.length ? (
        <div className="grid gap-3 md:grid-cols-2">
          {projects.map((p) => (
            <div key={p.id} className="bg-white border rounded p-3">
              <div className="font-medium">{p.name}</div>
              <div className="text-sm text-gray-500">{p.description || 'No description'}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">No projects yet.</div>
      )}
    </div>
  );
}


