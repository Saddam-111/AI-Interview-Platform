import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Zap, MessageSquare, FileText, Code, User } from 'lucide-react';
import { aiAPI } from '../utils/api';
import Card from '../components/ui/Card';
import AIChatInterface from '../components/ui/AIChatInterface';

const AIChat = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hello! I\'m your AI interview coach. Ask me anything about interviews, practice questions, or get tips to improve your skills!' }
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Transform messages for AIChatInterface format
  }, []);

  const handleSendMessage = async (input) => {
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setLoading(true);

    try {
      const res = await aiAPI.chat({ messages, userMessage: input });
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Interview Coach</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Get personalized guidance and tips for your interviews</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Chat Area */}
        <motion.div variants={itemVariants} className="lg:col-span-3">
          <AIChatInterface
            messages={messages}
            onSendMessage={handleSendMessage}
            loading={loading}
            title="AI Interview Coach"
            placeholder="Ask me anything about interviews, jobs, or career..."
          />
        </motion.div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                Quick Actions
              </h3>
              <div className="space-y-2">
                {quickActions.map((action, i) => (
                  <motion.button
                    key={i}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSendMessage(action.prompt)}
                    disabled={loading}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-slate-700/50 text-gray-700 dark:text-slate-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-sm"
                  >
                    <action.icon className="w-4 h-4 text-blue-500" />
                    {action.label}
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Tips Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Pro Tip</h4>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    Be specific with your questions for better answers. Ask about specific roles, companies, or scenarios!
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Resume Context */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-1">Resume Linked</h4>
                  <p className="text-sm text-gray-600 dark:text-slate-400">
                    I can answer questions about your uploaded resume. Try asking me to explain your projects!
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