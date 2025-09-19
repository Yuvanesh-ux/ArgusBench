import { useState, useEffect, useCallback } from 'react';
import { listMyProjects, Project } from '@/services/projects';
import { useApi } from './useApi';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const { execute: loadProjects, loading, error } = useApi(listMyProjects);

  const refresh = useCallback(async () => {
    try {
      const result = await loadProjects();
      setProjects(result);
    } catch (err) {
      console.error('Failed to load projects:', err);
    }
  }, [loadProjects]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    projects,
    loading,
    error,
    refresh,
  };
}