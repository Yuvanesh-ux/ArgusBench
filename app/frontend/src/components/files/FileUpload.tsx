import { useState } from 'react';
import { uploadFile } from '@/services/files';

type Props = {
  projectId?: string;
  taskId?: string;
  onUploaded?: () => void;
};

export default function FileUpload({ projectId, taskId, onUploaded }: Props) {
  const [isUploading, setIsUploading] = useState(false);

  const onChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (projectId) formData.append('projectId', projectId);
      if (taskId) formData.append('taskId', taskId);
      await uploadFile(formData);
      onUploaded?.();
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <label className="inline-flex items-center gap-2 px-3 py-2 bg-white border rounded cursor-pointer">
      <input className="hidden" type="file" onChange={onChange} disabled={isUploading} />
      <span className="text-sm">{isUploading ? 'Uploading...' : 'Upload file'}</span>
    </label>
  );
}


