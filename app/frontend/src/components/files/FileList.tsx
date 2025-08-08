import { useEffect, useState } from 'react';
import { deleteFile, downloadFileUrl, listProjectFiles, listTaskFiles, UploadedFile } from '@/services/files';

type Props = {
  projectId?: string;
  taskId?: string;
};

export default function FileList({ projectId, taskId }: Props) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = projectId ? await listProjectFiles(projectId) : taskId ? await listTaskFiles(taskId) : [];
      setFiles(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectId, taskId]);

  if (loading) return <div className="text-sm text-gray-500">Loading files...</div>;
  if (!files.length) return <div className="text-sm text-gray-500">No files yet.</div>;

  const onDelete = async (id: string) => {
    await deleteFile(id);
    await load();
  };

  return (
    <div className="divide-y bg-white border rounded">
      {files.map((f) => (
        <div key={f.id} className="flex items-center justify-between px-3 py-2">
          <div className="min-w-0">
            <div className="truncate text-sm font-medium">{f.original_name}</div>
            <div className="text-xs text-gray-500">{f.mime_type} • {(f.file_size / 1024).toFixed(1)} KB</div>
          </div>
          <div className="shrink-0 flex items-center gap-2">
            <a className="text-primary-600 text-sm" href={downloadFileUrl(f.id)}>Download</a>
            <button className="text-red-600 text-sm" onClick={() => onDelete(f.id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}


