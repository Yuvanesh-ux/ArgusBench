import { useState, useEffect, useCallback } from 'react';
import { listMyTasks, listProjectTasks, Task } from '@/services/tasks';
import { useApi } from './useApi';

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { execute: loadMyTasks, loading: loadingMyTasks, error } = useApi(listMyTasks);

  const refreshMyTasks = useCallback(async () => {
    try {
      const result = await loadMyTasks();
      setTasks(result);
    } catch (err) {
      console.error('Failed to load tasks:', err);
    }
  }, [loadMyTasks]);

  useEffect(() => {
    refreshMyTasks();
  }, [refreshMyTasks]);

  return {
    tasks,
    loading: loadingMyTasks,
    error,
    refresh: refreshMyTasks,
  };
}

export function useProjectTasks(projectId: string | null) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const { execute: loadProjectTasks, loading, error } = useApi(listProjectTasks);

  const refresh = useCallback(async () => {
    if (!projectId) return;
    
    try {
      const result = await loadProjectTasks(projectId);
      setTasks(result);
    } catch (err) {
      console.error('Failed to load project tasks:', err);
    }
  }, [loadProjectTasks, projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    tasks,
    loading,
    error,
    refresh,
  };
}