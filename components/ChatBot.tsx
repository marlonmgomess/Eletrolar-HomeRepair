
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { sendChatMessage } from '../services/geminiService';

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const initialMessage: ChatMessage = { 
    role: 'model', 
    text: 'Olá! Sou o EletroBot. Qual eletrodoméstico está te dando dor de cabeça hoje?', 
    timestamp: Date.now() 
  };
  
  const [messages, setMessages] = useState<ChatMessage[]>([initialMessage]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    const userMsg: ChatMessage = {
      role: 'user',
      text: userText,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    
    // Pequeno delay antes de mostrar que está digitando para parecer mais humano
    setTimeout(async () => {
      setIsTyping(true);
      
      try {
        const responseText = await sendChatMessage([...messages, userMsg].map(m => ({ role: m.role, text: m.text })));
        
        const botMsg: ChatMessage = {
          role: 'model',
          text: responseText || 'Desculpe, tive um problema na minha placa lógica. Pode repetir?',
          timestamp: Date.now()
        };

        setMessages(prev => [...prev, botMsg]);
      } catch (error) {
        console.error("Chat error:", error);
      } finally {
        setIsTyping(false);
      }
    }, 600);
  };

  const handleResetConversation = () => {
    if (window.confirm('Deseja limpar todo o histórico desta conversa?')) {
      setMessages([initialMessage]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="w-[90vw] sm:w-[380px] h-[500px] bg-white rounded-3xl shadow-2xl border border-slate-100 flex flex-col mb-4 animate-in slide-in-from-bottom-4 zoom-in-95 duration-300 overflow-hidden">
          {/* Header */}
          <div className="bg-slate-900 p-4 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <i className="fa-solid fa-robot text-xs"></i>
              </div>
              <div>
                <h3 className="text-sm font-black">EletroBot</h3>
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Online</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleResetConversation}
                title="Resetar Conversa"
                className="text-slate-400 hover:text-red-400 transition-colors"
              >
                <i className="fa-solid fa-trash-can text-sm"></i>
              </button>
              <button onClick={() => setIsOpen(false)} className="opacity-50 hover:opacity-100">
                <i className="fa-solid fa-times text-lg"></i>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm font-medium leading-relaxed shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-none' 
                    : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3.5 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm flex items-center gap-1.5">
                  <span className="text-[10px] font-bold text-slate-400 mr-1">EletroBot está pensando</span>
                  <div className="flex gap-1">
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-duration:0.6s]"></div>
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.1s]"></div>
                    <div className="w-1 h-1 bg-blue-600 rounded-full animate-bounce [animation-duration:0.6s] [animation-delay:0.2s]"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-slate-100 flex gap-2">
            <input 
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua dúvida..."
              className="flex-1 bg-slate-100 border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              disabled={isTyping}
            />
            <button 
              type="submit"
              disabled={!inputValue.trim() || isTyping}
              className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center disabled:opacity-30 transition-all active:scale-90"
            >
              <i className="fa-solid fa-paper-plane text-xs"></i>
            </button>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
          isOpen ? 'bg-slate-900 text-white rotate-90' : 'bg-blue-600 text-white'
        }`}
      >
        <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-comment-dots'} text-xl`}></i>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-pulse"></span>
        )}
      </button>
    </div>
  );
};
