import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code2, Cpu, Brain, Zap, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { interviewAPI } from '../utils/api';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(user?.role || 'cse');
  const [stream, setStream] = useState(user?.stream || '');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);

  const handleStartInterview = async () => {
    setLoading(true);
    try {
      const res = await interviewAPI.start({
        type: selectedRole,
        stream: selectedRole === 'non-cse' ? stream : null,
        difficulty
      });
      
      if (res.data.success) {
        navigate(`/interview/${res.data.interview._id}`);
      }
    } catch (error) {
      console.error('Error starting interview:', error);
    }
    setLoading(false);
  };

  const streams = [
    { value: 'mechanical', label: 'Mechanical Engineering' },
    { value: 'civil', label: 'Civil Engineering' },
    { value: 'electrical', label: 'Electrical Engineering' },
    { value: 'electronics', label: 'Electronics Engineering' },
    { value: 'other', label: 'Other' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy', color: 'from-green-400 to-green-500' },
    { value: 'medium', label: 'Medium', color: 'from-yellow-400 to-orange-500' },
    { value: 'hard', label: 'Hard', color: 'from-red-400 to-red-600' }
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
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="text-center py-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-500 mb-6 shadow-lg shadow-blue-500/30"
        >
          <Brain className="w-10 h-10 text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
          Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}!</span>
        </h1>
        <p className="text-gray-500 dark:text-slate-400 text-lg">
          Ready to ace your next interview? Let's get started.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Interview Setup Card */}
        <motion.div variants={itemVariants}>
          <Card hover className="h-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-500" />
              Start Your Interview
            </h2>
            
            {/* Role Selection */}
            <div className="space-y-3 mb-6">
              <button
                onClick={() => setSelectedRole('cse')}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                  selectedRole === 'cse'
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/20'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-md">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">CSE/IT</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Computer Science & IT</p>
                </div>
                {selectedRole === 'cse' && (
                  <CheckCircle2 className="w-5 h-5 text-blue-500 ml-auto" />
                )}
              </button>

              <button
                onClick={() => setSelectedRole('non-cse')}
                className={`w-full p-4 rounded-xl border-2 transition-all duration-200 flex items-center gap-4 ${
                  selectedRole === 'non-cse'
                    ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 shadow-lg shadow-purple-500/20'
                    : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                }`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-md">
                  <Cpu className="w-6 h-6 text-white" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-gray-900 dark:text-white">Non-CSE</p>
                  <p className="text-sm text-gray-500 dark:text-slate-400">Other Engineering Streams</p>
                </div>
                {selectedRole === 'non-cse' && (
                  <CheckCircle2 className="w-5 h-5 text-purple-500 ml-auto" />
                )}
              </button>
            </div>

            {/* Stream Selection */}
            {selectedRole === 'non-cse' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mb-6"
              >
                <Select
                  label="Select Your Stream"
                  value={stream}
                  onChange={(e) => setStream(e.target.value)}
                  placeholder="Choose your stream"
                  options={streams}
                />
              </motion.div>
            )}

            {/* Difficulty Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">
                Difficulty Level
              </label>
              <div className="flex gap-3">
                {difficulties.map((d) => (
                  <button
                    key={d.value}
                    onClick={() => setDifficulty(d.value)}
                    className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                      difficulty === d.value
                        ? `bg-gradient-to-r ${d.color} text-white border-transparent shadow-lg`
                        : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-500'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <Button
              onClick={handleStartInterview}
              loading={loading}
              disabled={selectedRole === 'non-cse' && !stream}
              className="w-full"
              icon={ArrowRight}
              size="lg"
            >
              Start Interview
            </Button>
          </Card>
        </motion.div>

        {/* Info Cards */}
        <div className="space-y-6">
          {/* Interview Flow */}
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                Interview Flow
              </h3>
              {selectedRole === 'cse' ? (
                <div className="space-y-3">
                  {[
                    { step: 1, title: 'Assessment', desc: '15 MCQ Questions', color: 'blue' },
                    { step: 2, title: 'Coding', desc: '3 Problems', color: 'green' },
                    { step: 3, title: 'HR Round', desc: '10 Behavioral', color: 'purple' }
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50"
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center text-white font-bold text-sm`}>
                        {item.step}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {[
                    { step: 1, title: 'Assessment', desc: '15 MCQ Questions', color: 'blue' },
                    { step: 2, title: 'Core Round', desc: '10 Technical Questions', color: 'green' },
                    { step: 3, title: 'HR Round', desc: '10 Behavioral', color: 'purple' }
                  ].map((item, i) => (
                    <motion.div
                      key={item.step}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50"
                    >
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 flex items-center justify-center text-white font-bold text-sm`}>
                        {item.step}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{item.title}</p>
                        <p className="text-sm text-gray-500 dark:text-slate-400">{item.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </motion.div>

          {/* AI Features */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
              <h3 className="text-lg font-bold mb-4">AI-Powered Features</h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Smart Question Generation',
                  'Real-time Voice Analysis',
                  'Behavioral Insights',
                  'Personalized Reports'
                ].map((feature, i) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-center gap-2 text-sm"
                  >
                    <CheckCircle2 className="w-4 h-4 text-white/80" />
                    <span>{feature}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Home;