import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send } from 'lucide-react';
import { ChatMessage, GeneratedPlan } from '../types';
import { sendMessageToCoach } from '../services/geminiService';

interface CoachChatProps {
  plan: GeneratedPlan | null;
}

const CoachChat: React.FC<CoachChatProps> = ({ plan }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const toggleChat = () => setIsOpen(!isOpen);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [history, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg = input.trim();
    setInput('');
    setLoading(true);

    const newHistory: ChatMessage[] = [...history, { role: 'user', text: userMsg }];
    setHistory(newHistory);

    try {
      // Convert history for API (simplified for this component state, 
      // actual API call needs specific format which service handles)
      const aiResponse = await sendMessageToCoach(userMsg, newHistory, plan);
      setHistory(prev => [...prev, { role: 'model', text: aiResponse }]);
    } catch (error) {
      setHistory(prev => [...prev, { role: 'model', text: "Erro ao conectar com o coach. Tente novamente." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 ${
          isOpen ? 'bg-red-500 rotate-90' : 'bg-primary hover:bg-emerald-400'
        }`}
      >
        {isOpen ? <X className="text-white" /> : <MessageSquare className="text-slate-900" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm h-[500px] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="bg-slate-800 p-4 border-b border-slate-700 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-blue-500 flex items-center justify-center">
               <span className="text-slate-900 font-bold">AI</span>
            </div>
            <div>
              <h3 className="font-bold text-white">Coach BodyRecomp</h3>
              <p className="text-xs text-green-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span> Online
              </p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {history.length === 0 && (
              <div className="text-center text-slate-500 mt-10">
                <p>Olá! Sou seu treinador pessoal.</p>
                <p className="text-sm mt-2">Pergunte sobre exercícios, substituições de alimentos ou dicas de motivação.</p>
              </div>
            )}
            {history.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-primary text-slate-900 rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                 <div className="bg-slate-800 rounded-2xl rounded-tl-none p-3 border border-slate-700 flex gap-1">
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce delay-200"></span>
                 </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form onSubmit={handleSend} className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-slate-900 text-white rounded-xl px-4 py-2 border border-slate-700 focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="bg-primary p-2 rounded-xl text-slate-900 hover:bg-emerald-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send size={20} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default CoachChat;