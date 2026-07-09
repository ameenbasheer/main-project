import { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend, FiZap, FiLoader } from 'react-icons/fi';
import { useApp } from '../../context/AppContext';
import { aiApi } from '../../services/api';

const STARTERS = [
  'What should I plant this season?',
  'My leaves are turning yellow — why?',
  'How often should I water in this heat?',
];

export default function AskGrownRoot() {
  const { crops, weather, farmerProfile } = useApp();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]); // { role: 'user'|'ai', text }
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Keep the latest message in view.
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (question) => {
    const q = question.trim();
    if (!q || loading) return;

    setMessages((m) => [...m, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);

    try {
      const context = {
        location: farmerProfile?.location || undefined,
        soilType: farmerProfile?.soilType || undefined,
        weather: { temperature: weather.temperature, condition: weather.condition, humidity: weather.humidity },
        crops: crops.map((c) => ({ name: c.name, stage: c.currentStage })),
      };
      const { answer } = await aiApi.chat({ question: q, context });
      setMessages((m) => [...m, { role: 'ai', text: answer }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'ai', text: err.message || 'Sorry, I could not answer right now.', error: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    send(input);
  };

  return (
    <>
      {/* Floating launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Ask GrownRoot AI"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#2D5A3D] to-[#1F4530] text-white grid place-items-center shadow-[0_8px_24px_rgba(45,90,61,0.35)] hover:scale-105 transition-transform"
      >
        {open ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm h-[28rem] rounded-3xl border border-[#E8DCC4] bg-white shadow-[0_20px_50px_rgba(14,42,24,0.25)] flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-[#2D5A3D] to-[#1F4530] text-white">
            <div className="w-9 h-9 rounded-xl bg-white/15 grid place-items-center">
              <FiZap size={16} />
            </div>
            <div className="min-w-0">
              <p className="font-bold text-sm leading-tight">Ask GrownRoot</p>
              <p className="text-[#D7E5DA] text-[11px]">Your AI farming assistant</p>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="text-[#6B5D4E] text-sm">
                  Hi! Ask me anything about your crops, weather, or what to do today.
                </p>
                <div className="space-y-2">
                  {STARTERS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="block w-full text-left text-xs text-[#2D5A3D] bg-[#F5EFE0] hover:bg-[#EFE9D8] border border-[#E8DCC4] rounded-xl px-3 py-2 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm leading-snug whitespace-pre-wrap ${
                    m.role === 'user'
                      ? 'bg-[#2D5A3D] text-white rounded-br-sm'
                      : m.error
                        ? 'bg-red-50 text-red-700 border border-red-200 rounded-bl-sm'
                        : 'bg-[#F5EFE0] text-[#0E2A18] border border-[#E8DCC4] rounded-bl-sm'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-[#F5EFE0] border border-[#E8DCC4] rounded-2xl rounded-bl-sm px-3 py-2 text-[#6B5D4E] text-sm inline-flex items-center gap-2">
                  <FiLoader size={14} className="animate-spin" /> Thinking…
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-[#E8DCC4] flex items-center gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your farm…"
              className="flex-1 bg-[#FAF7F0] border border-[#E8DCC4] rounded-full px-4 py-2 text-sm text-[#0E2A18] outline-none focus:border-[#2D5A3D]/40 placeholder:text-[#6B5D4E]"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="w-10 h-10 rounded-full bg-[#2D5A3D] text-white grid place-items-center shrink-0 hover:bg-[#1F4530] transition disabled:opacity-50"
            >
              <FiSend size={16} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
