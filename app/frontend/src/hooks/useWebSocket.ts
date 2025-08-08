import { useEffect } from 'react';
import { getSocket } from '@/services/websocket';

export function useWebSocket(handlers?: {
  onProjectActivity?: (payload: any) => void;
  onTaskUpdated?: (payload: any) => void;
  onCommentUpdated?: (payload: any) => void;
}) {
  useEffect(() => {
    const socket = getSocket();

    if (handlers?.onProjectActivity) socket.on('project-activity', handlers.onProjectActivity);
    if (handlers?.onTaskUpdated) socket.on('task-updated', handlers.onTaskUpdated);
    if (handlers?.onCommentUpdated) socket.on('comment-updated', handlers.onCommentUpdated);

    return () => {
      if (handlers?.onProjectActivity) socket.off('project-activity', handlers.onProjectActivity);
      if (handlers?.onTaskUpdated) socket.off('task-updated', handlers.onTaskUpdated);
      if (handlers?.onCommentUpdated) socket.off('comment-updated', handlers.onCommentUpdated);
    };
  }, [handlers?.onProjectActivity, handlers?.onTaskUpdated, handlers?.onCommentUpdated]);
}


