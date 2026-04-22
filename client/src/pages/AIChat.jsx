import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Zap, MessageSquare, FileText, Code, User, Send, Bot } from 'lucide-react';
import { aiAPI } from '../utils/api';
import Card from '../components/ui/Card';

const AIChat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hello! I'm your AI interview coach. Ask me anything about interviews, practice questions, or get tips to improve your skills!" }
  ]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || loading) return;
    
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    const userInput = input;
    setInput('');
    setLoading(true);

    try {
      const res = await aiAPI.chat({ messages, userMessage: userInput });
      if (res.data.success) {
        const responseText = typeof res.data.response === 'string' 
          ? res.data.response 
          : res.data.response?.response || 'No response received';
        setMessages(prev => [...prev, { role: 'assistant', content: responseText }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    }
    setLoading(false);
  };

  const quickActions = [
    { label: 'Practice Questions', prompt: 'Give me 5 practice interview questions with sample answers', icon: MessageSquare },
    { label: 'HR Tips', prompt: 'What are the best tips for succeeding in an HR interview round?', icon: User },
    { label: 'Coding Tips', prompt: 'How can I improve my coding skills for technical interviews?', icon: Code },
    { label: 'Resume Help', prompt: 'Give me tips for creating a strong resume', icon: FileText }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 h-[calc(100vh-8rem)] flex flex-col"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="font-serif text-3xl text-white mb-2">AI Interview Coach</h1>
        <p className="text-white/40">Get personalized guidance and tips</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Chat Area */}
        <motion.div variants={itemVariants} className="lg:col-span-3 flex flex-col">
          <Card className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] p-4 rounded-2xl ${
                    msg.role === 'user' 
                      ? 'bg-violet-500/20 text-white' 
                      : 'bg-white/[0.02] text-white/80'
                  }`}>
                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                          <Bot className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-xs text-violet-400">AI Coach</span>
                      </div>
                    )}
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/[0.02] p-4 rounded-2xl">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/5">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask me anything about interviews..."
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-violet-500/50 focus:outline-none transition-colors"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={loading || !input.trim()}
                  className="p-4 rounded-xl bg-white text-black hover:bg-white/90 transition-colors disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                <Zap className="w-4 h-4 text-violet-400" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setInput(action.prompt);
                    }}
                    disabled={loading}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.02] text-white/60 hover:text-white hover:bg-white/[0.05] transition-colors text-sm"
                  >
                    <action.icon className="w-4 h-4 text-violet-400" />
                    {action.label}
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Tips */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border-violet-500/20">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-medium text-white mb-1">Pro Tip</h4>
                  <p className="text-sm text-white/50">
                    Be specific with your questions for better answers. Ask about specific roles, companies, or scenarios!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default AIChat;