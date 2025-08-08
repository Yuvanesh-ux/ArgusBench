import { useParams } from 'react-router-dom';
import FileUpload from '@/components/files/FileUpload';
import FileList from '@/components/files/FileList';
import AIAssistant from '@/components/ai/AIAssistant';
import { useWebSocket } from '@/hooks/useWebSocket';
import { useNotify } from '@/components/shared/Notification';
import { useEffect } from 'react';
import { getSocket } from '@/services/websocket';

export default function ProjectDetail() {
  const { id } = useParams();
  const { push } = useNotify();
  useWebSocket({
    onProjectActivity: (payload) => {
      if (payload?.projectId === id) push(`Project activity: ${payload.event || payload.type}`, 'info');
    },
  });

  useEffect(() => {
    if (!id) return;
    const socket = getSocket();
    socket.emit('join-project', id);
    return () => {
      socket.emit('leave-project', id);
    };
  }, [id]);
  return (
    <div>
      <h1 className="text-xl font-semibold mb-2">Project {id}</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="font-medium">Files</h2>
          <FileUpload projectId={id!} onUploaded={() => { /* will auto-refresh via FileList load */ }} />
          <FileList projectId={id!} />
        </div>
        <div className="space-y-3">
          <h2 className="font-medium">AI Assistant</h2>
          <AIAssistant />
        </div>
      </div>
    </div>
  );
}


