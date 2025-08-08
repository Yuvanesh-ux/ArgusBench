import { useState } from 'react';
import { api } from '@/services/api';

type Message = { role: 'user' | 'assistant' | 'system'; content: string };

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const nextMessages = [...messages, { role: 'user', content: input } as Message];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', { messages: nextMessages });
      const reply = data.data.message as string;
      setMessages((prev) => [...prev, { role: 'assistant', content: reply }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border rounded overflow-hidden">
      <div className="h-64 overflow-auto p-3 space-y-2">
        {messages.map((m, idx) => (
          <div key={idx} className={m.role === 'user' ? 'text-right' : 'text-left'}>
            <div className={`inline-block px-3 py-2 rounded ${m.role === 'user' ? 'bg-primary-50' : 'bg-gray-100'}`}>
              <div className="text-xs text-gray-500 mb-1">{m.role}</div>
              <div className="whitespace-pre-wrap text-sm">{m.content}</div>
            </div>
          </div>
        ))}
        {loading && <div className="text-xs text-gray-500">Thinking…</div>}
      </div>
      <div className="flex border-t">
        <input
          className="flex-1 px-3 py-2 outline-none"
          placeholder="Ask TaskFlow assistant…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
        />
        <button className="px-4 bg-primary-600 text-white" onClick={send} disabled={loading}>Send</button>
      </div>
    </div>
  );
}


