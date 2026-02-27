import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

function PolicyChatbot({ policy, userProfile, isEli5 }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: isEli5
        ? `Hello! I can explain everything about ${policy.name} in a very simple way, like a story. Ask me anything!`
        : `Hello! I'm your AI assistant for ${policy.name}. I've analyzed your profile and I can help with eligibility, application, or finding nearby agents.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: userMessage,
        policy: policy,
        userProfile: userProfile,
        isEli5: isEli5
      });

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: response.data.response,
      }]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[40px] p-8 border-2 border-dashed border-india-blue/20">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-india-blue rounded-2xl flex items-center justify-center text-white text-2xl">
          🤖
        </div>
        <div>
          <h3 className="text-xl font-black text-gray-800 tracking-tight">Smart Advisor Assistant</h3>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{isEli5 ? 'ELI5 Mode Active' : 'Real-time Traceable Data'}</p>
        </div>
      </div>

      <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto px-2 scrollbar-hide">
        {messages.map((msg, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[85%] px-6 py-4 rounded-[30px] shadow-sm ${msg.role === 'user'
              ? 'bg-india-blue text-white rounded-tr-none'
              : 'bg-gray-50 text-gray-700 rounded-tl-none border border-gray-100'
              }`}>
              <p className="text-sm font-bold leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {loading && <div className="text-xs font-black text-blue-300 animate-pulse px-4 uppercase italic">Assistant is thinking...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSend} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about application, eligibility..."
          className="w-full pl-6 pr-20 py-5 bg-gray-50 border-2 border-transparent focus:border-india-blue focus:bg-white rounded-[25px] outline-none transition-all font-bold text-sm"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute right-2 top-2 bottom-2 bg-india-blue text-white px-6 rounded-[20px] font-black uppercase text-[10px] tracking-widest hover:bg-blue-800 transition-all disabled:opacity-30"
        >
          Send
        </button>
      </form>
    </div>
  );
}

export default PolicyChatbot;
