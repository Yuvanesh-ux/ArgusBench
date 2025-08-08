import { createContext, useContext, useMemo, useState } from 'react';

type Toast = { id: string; message: string; type?: 'info' | 'success' | 'error' };

const NotificationContext = createContext<{
  toasts: Toast[];
  push: (message: string, type?: Toast['type']) => void;
  remove: (id: string) => void;
} | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const push = (message: string, type: Toast['type'] = 'info') => {
    const toast: Toast = { id: Math.random().toString(36).slice(2), message, type };
    setToasts((prev) => [...prev, toast]);
    setTimeout(() => remove(toast.id), 4000);
  };
  const remove = (id: string) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const value = useMemo(() => ({ toasts, push, remove }), [toasts]);
  return (
    <NotificationContext.Provider value={value}>
      {children}
      <div className="fixed right-4 bottom-4 space-y-2 z-50">
        {toasts.map((t) => (
          <div key={t.id} className={`px-3 py-2 rounded shadow text-white ${t.type === 'success' ? 'bg-green-600' : t.type === 'error' ? 'bg-red-600' : 'bg-gray-800'}`}>{t.message}</div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotify() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotify must be used within NotificationProvider');
  return ctx;
}


