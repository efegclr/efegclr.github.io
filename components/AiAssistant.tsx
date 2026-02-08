
import React, { useState, useRef, useEffect } from 'react';
import { askAI } from '../geminiService';
import { ChatMessage } from '../types';
import { Sparkles, Send, X, MessageSquare, Loader2 } from 'lucide-react';

export const AiAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', content: "Merhaba! Ben Promil Analiz Asistanıyım. Alkol metabolizması, yasal sınırlar veya vücudun alkolü nasıl işlediği hakkında sorularınızı sorabilirsiniz." }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsLoading(true);

    const aiResponse = await askAI(userMsg);
    
    setMessages(prev => [...prev, { role: 'model', content: aiResponse }]);
    setIsLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white border border-gray-200 shadow-2xl rounded-3xl w-[85vw] md:w-[380px] overflow-hidden flex flex-col h-[60vh] md:h-[500px] animate-in slide-in-from-bottom-4 duration-300">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-black text-white">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-400" />
              <span className="font-semibold text-sm">Promil Asistanı</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:opacity-70 p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  m.role === 'user' 
                    ? 'bg-black text-white rounded-tr-none' 
                    : 'bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-100 bg-white flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Bir şey sorun..."
              className="flex-1 text-sm border-none focus:ring-0 bg-gray-50 rounded-xl px-4 py-2"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading}
              className="bg-black text-white p-2.5 rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-black text-white p-4 rounded-2xl shadow-xl hover:scale-105 transition-transform group flex items-center gap-2"
        >
          <MessageSquare className="w-6 h-6" />
          <span className="hidden md:block text-xs font-bold uppercase tracking-wider pr-1">Asistan</span>
        </button>
      )}
    </div>
  );
};
