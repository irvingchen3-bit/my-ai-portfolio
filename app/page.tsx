"use client"; // 告诉 Next.js 这是一个客户端组件

import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PortfolioWithAI() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  // 👇 初始欢迎语改为繁体中文/英文 👇
  const [messages, setMessages] = useState([
    { role: 'ai', content: '你好！我是專屬 AI 助理。關於他的履歷或合作意向，你都可以問我哦！(Hello! I am the exclusive AI assistant. Feel free to ask me anything about his background!)' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // @ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const newMessages = [...messages, { role: 'user', content: userText }];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      // 这里的 fetch 会调用我们刚刚在第四步写的后端接口
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userText }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessages([...newMessages, { role: 'ai', content: data.reply }]);
      } else {
        setMessages([...newMessages, { role: 'ai', content: '抱歉，網路出了點問題。(Sorry, there is a network issue.)' }]);
      }
    } catch (error) {
      setMessages([...newMessages, { role: 'ai', content: '抱歉，連接伺服器失敗。(Sorry, failed to connect to the server.)' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {/* 个人主页内容区 */}
      <main className="max-w-4xl mx-auto p-8 pt-20">
        <header className="mb-12 text-center">
          {/* 👇 这里可以改成你的名字 👇 */}
          <h1 className="text-4xl font-bold mb-4 text-gray-900">陳鴻權 (Irving)</h1>
          <p className="text-xl text-gray-600 mb-6">AI Training/ Full Stack Developer/Electronics Engineer</p>
        </header>
        <section className="bg-white rounded-2xl shadow-sm p-8 mb-8">
          <h2 className="text-2xl font-semibold mb-4 border-b pb-2">關於我 (About Me)</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
          
            Hello! I am a developer passionate about technology. Feel free to ask the AI assistant in the bottom right corner about me.
            <br/>
            (你好！我是一名熱愛技術的開發者。你可以隨時向右下角的 AI 助理提問關於我的資訊。)
          </p>
        </section>
      </main>

      {/* 悬浮 AI 聊天按钮 */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-transform transform hover:scale-110 z-50"
      >
        <MessageCircle size={28} />
      </button>

      {/* 聊天窗口 */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-100"
          >
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold text-sm">專屬 AI 助理 (AI Assistant)</h3>
              <button onClick={() => setIsChatOpen(false)}><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-white text-gray-800 shadow-sm border border-gray-100 rounded-tl-none'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && <div className="text-gray-500 text-sm">AI 正在思考... (AI is thinking...)</div>}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSendMessage} className="p-4 bg-white border-t border-gray-100 flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="輸入問題... (Type your question...)"
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
              />
              <button type="submit" disabled={!inputValue.trim()} className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50">
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
