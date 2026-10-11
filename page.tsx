'use client';
import { useState } from 'react';

export default function Home() {
  const [selectedModel, setSelectedModel] = useState('chatgpt');
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!prompt.trim()) return;
    const userMsg = { sender: 'user', content: prompt };
    setMessages(prev => [...prev, userMsg]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('http://localhost:8000/api/v1/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: selectedModel, prompt: userMsg.content })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { sender: 'assistant', content: data.response || 'No response' }]);
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'assistant', content: 'Error connecting to backend.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-950 p-4 border-r border-gray-800 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold text-cyan-400 mb-6">Faaiz AI</h1>
          <div className="space-y-2">
            <label className="text-sm text-gray-400">Select AI Model</label>
            <select 
              value={selectedModel} 
              onChange={(e) => setSelectedModel(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 p-2 rounded text-sm"
            >
              <option value="chatgpt">ChatGPT (OpenAI)</option>
              <option value="claude">Claude (Anthropic)</option>
              <option value="gemini">Google Gemini</option>
              <option value="deepseek">DeepSeek</option>
            </select>
          </div>
        </div>
        <div className="text-xs text-gray-500">
          Intelligence Redefined
        </div>
      </aside>

      {/* Main Chat Window */}
      <section className="flex-1 flex flex-col">
        <header className="p-4 border-b border-gray-800 bg-gray-900 flex justify-between items-center">
          <span className="font-medium uppercase tracking-wider text-sm text-cyan-300">Model: {selectedModel}</span>
        </header>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xl p-3 rounded-lg text-sm ${msg.sender === 'user' ? 'bg-cyan-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
                {msg.content}
              </div>
            </div>
          ))}
          {loading && <div className="text-gray-400 text-sm italic">Faaiz AI is thinking...</div>}
        </div>

        <div className="p-4 border-t border-gray-800 bg-gray-900 flex gap-2">
          <input 
            type="text" 
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask Faaiz AI anything..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-4 py-2 text-sm focus:outline-none focus:border-cyan-500"
          />
          <button 
            onClick={handleSend}
            className="bg-cyan-600 hover:bg-cyan-500 px-5 py-2 rounded text-sm font-medium transition"
          >
            Send
          </button>
        </div>
      </section>
    </main>
  );
}
