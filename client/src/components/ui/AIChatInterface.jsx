import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Loader2, Copy, Check } from 'lucide-react';

export const TypingIndicator = () => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-1 p-4 bg-gray-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm"
  >
    <motion.span
      className="w-2 h-2 bg-gray-400 rounded-full"
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
    />
    <motion.span
      className="w-2 h-2 bg-gray-400 rounded-full"
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
    />
    <motion.span
      className="w-2 h-2 bg-gray-400 rounded-full"
      animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
    />
  </motion.div>
);

export const ChatMessage = ({ message, role }) => {
  const [copied, setCopied] = useState(false);
  const isUser = role === 'user';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}
    >
      {/* Avatar */}
      <motion.div
        className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center ${
          isUser 
            ? 'bg-gradient-to-br from-blue-500 to-purple-500' 
            : 'bg-gradient-to-br from-cyan-500 to-blue-500'
        }`}
        whileHover={{ scale: 1.1 }}
      >
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </motion.div>

      {/* Message Bubble */}
      <div className={`max-w-[75%] ${isUser ? 'items-end' : 'items-start'}`}>
        <motion.div
          className={`px-4 py-3 rounded-2xl ${
            isUser
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-sm'
              : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white rounded-tl-sm'
          }`}
          whileHover={{ scale: 1.01 }}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
        </motion.div>
        
        {!isUser && (
          <motion.button
            onClick={copyToClipboard}
            className="mt-1 p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {copied ? (
              <Check className="w-4 h-4 text-green-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

const AIChatInterface = ({ 
  messages = [], 
  onSendMessage, 
  loading = false, 
  placeholder = "Type your message...",
  title = "AI Assistant"
}) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !loading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-slate-700 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400">AI powered assistant</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((msg, index) => (
            <ChatMessage key={index} message={msg.content} role={msg.role} />
          ))}
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <TypingIndicator />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-100 dark:border-slate-700">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={loading}
              className="w-full px-5 py-3 pr-12 bg-gray-50 dark:bg-slate-900 border-2 border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <motion.button
            type="submit"
            disabled={!input.trim() || loading}
            className="px-5 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default AIChatInterface;