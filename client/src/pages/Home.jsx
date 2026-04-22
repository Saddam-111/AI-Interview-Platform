import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code2, Cpu, Brain, Zap, ArrowRight, CheckCircle2, 
  MessageSquare, Target, TrendingUp, Award, Clock,
  Play, FileText, Users, Sparkles, Activity, BarChart3
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { interviewAPI } from '../utils/api';
import Card from '../components/ui/Card';

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
    { value: 'mechanical', label: 'Mechanical' },
    { value: 'civil', label: 'Civil' },
    { value: 'electrical', label: 'Electrical' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'other', label: 'Other' }
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
  ];

  const quickStats = [
    { icon: Target, label: 'Practice Score', value: '78%', color: 'from-emerald-500' },
    { icon: Activity, label: 'Streak', value: '5 days', color: 'from-violet-500' },
    { icon: Award, label: 'Rounds', value: '12', color: 'from-cyan-500' },
    { icon: TrendingUp, label: 'Rank', value: '#42', color: 'from-orange-500' }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
  };

  return (
    <div className="min-h-screen bg-[#030303] relative">
      {/* Floating Orbs Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1 }}
          className="orb w-[500px] h-[500px] bg-violet-500/20 blur-[100px] absolute -top-1/4 -right-1/4"
          style={{ animation: 'float 12s ease-in-out infinite' }}
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="orb w-[400px] h-[400px] bg-cyan-500/15 blur-[80px] absolute -bottom-1/4 -left-1/4"
          style={{ animation: 'float 15s ease-in-out infinite reverse' }}
        />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.2 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="orb w-[300px] h-[300px] bg-violet-500/10 blur-[60px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ animation: 'float 10s ease-in-out infinite', animationDelay: '2s' }}
        />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative space-y-8"
      >
        {/* Hero Welcome Section */}
        <motion.div variants={itemVariants} className="pt-4 pb-2">
          <div className="text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: 'spring' }}
              className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-violet-500 via-cyan-500 to-violet-500 mb-6 violet-glow relative"
            >
              <Brain className="w-12 h-12 text-white" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-400 rounded-full"
              />
            </motion.div>
            <h1 className="font-serif text-5xl md:text-6xl text-white mb-4 leading-tight">
              Welcome back,{' '}
              <span className="gradient-text-static">{user?.name?.split(' ')[0]}</span>
            </h1>
            <p className="text-white/40 text-lg max-w-lg mx-auto">
              Your next interview is waiting. Let's make it count.
            </p>
          </div>
        </motion.div>

        {/* Quick Stats Ticker */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all cursor-pointer"
              >
                <stat.icon className={`w-6 h-6 mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`} />
                <p className="text-2xl font-serif text-white">{stat.value}</p>
                <p className="text-xs uppercase tracking-widest text-white/40">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interview Setup Card - Spans 2 columns */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <Card className="h-full relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-cyan-5/5" />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-serif text-2xl text-white flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    Start Your Interview
                  </h2>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-xs text-white/50">
                    <Clock className="w-3 h-3" />
                    ~45 min
                  </div>
                </div>
                
                {/* Role Selection */}
                <div className="space-y-3 mb-6">
                  <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">
                    Select Your Track
                  </label>
                  
                  <motion.button
                    onClick={() => setSelectedRole('cse')}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${
                      selectedRole === 'cse'
                        ? 'border-violet-500 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg">
                      <Code2 className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-serif text-lg text-white">CSE/IT Track</p>
                      <p className="text-sm text-white/40">Coding, Algorithms & Technical</p>
                    </div>
                    {selectedRole === 'cse' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </motion.button>

                  <motion.button
                    onClick={() => setSelectedRole('non-cse')}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${
                      selectedRole === 'non-cse'
                        ? 'border-violet-500 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.2)]'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <Cpu className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-serif text-lg text-white">Non-CSE Track</p>
                      <p className="text-sm text-white/40">Core Engineering & Technical</p>
                    </div>
                    {selectedRole === 'non-cse' && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-8 h-8 rounded-full bg-violet-500 flex items-center justify-center"
                      >
                        <CheckCircle2 className="w-5 h-5 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                </div>

                {/* Stream Selection */}
                {selectedRole === 'non-cse' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mb-6"
                  >
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">
                      Select Stream
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {streams.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => setStream(s.value)}
                          className={`py-3 px-4 rounded-xl border transition-all duration-300 ${
                            stream === s.value
                              ? 'border-violet-500 bg-violet-500/10 text-white'
                              : 'border-white/10 text-white/50 hover:border-white/20'
                          }`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Difficulty Selection */}
                <div className="mb-8">
                  <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">
                    Difficulty Level
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {difficulties.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setDifficulty(d.value)}
                        className={`py-4 rounded-xl border-2 font-medium transition-all duration-300 ${
                          difficulty === d.value
                            ? 'border-violet-500 bg-violet-500/10 text-white shadow-[0_0_15px_rgba(139,92,246,0.15)]'
                            : 'border-white/10 text-white/50 hover:border-white/20'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <motion.button
                  onClick={handleStartInterview}
                  disabled={loading || (selectedRole === 'non-cse' && !stream)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 rounded-2xl bg-gradient-to-r from-violet-500 via-cyan-500 to-violet-500 text-white font-medium text-lg relative overflow-hidden group disabled:opacity-50"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-violet-400 via-cyan-400 to-violet-400"
                    animate={{ x: ['0%', '100%', '0%'] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    style={{ backgroundSize: '200% 100%' }}
                  />
                  <span className="relative flex items-center justify-center gap-3">
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Play className="w-6 h-6" />
                        Start Interview Session
                      </>
                    )}
                  </span>
                </motion.button>
              </div>
            </Card>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Interview Flow */}
            <motion.div variants={itemVariants}>
              <Card>
                <h3 className="font-serif text-lg text-white mb-5 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  Interview Flow
                </h3>
                
                <div className="relative">
                  {/* Vertical line */}
                  <div className="absolute left-5 top-8 bottom-8 w-px bg-gradient-to-b from-violet-500 via-cyan-500 to-emerald-500" />
                  
                  {selectedRole === 'cse' ? (
                    <div className="space-y-4">
                      {[
                        { step: 1, title: 'Assessment', desc: '15 MCQ', icon: Target, color: 'from-violet-500' },
                        { step: 2, title: 'Coding', desc: '2 Problems', icon: Code2, color: 'from-cyan-500' },
                        { step: 3, title: 'HR Round', desc: 'Behavioral', icon: Users, color: 'from-emerald-500' }
                      ].map((item, i) => (
                        <motion.div
                          key={item.step}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex items-center gap-4 pl-2"
                        >
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold relative z-10`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{item.title}</p>
                            <p className="text-xs text-white/40">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {[
                        { step: 1, title: 'Assessment', desc: '15 MCQ', icon: Target, color: 'from-violet-500' },
                        { step: 2, title: 'Core', desc: 'Technical', icon: Cpu, color: 'from-cyan-500' },
                        { step: 3, title: 'HR Round', desc: 'Behavioral', icon: Users, color: 'from-emerald-500' }
                      ].map((item, i) => (
                        <motion.div
                          key={item.step}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 + i * 0.1 }}
                          className="flex items-center gap-4 pl-2"
                        >
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold relative z-10`}>
                            <item.icon className="w-5 h-5" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{item.title}</p>
                            <p className="text-xs text-white/40">{item.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={itemVariants}>
              <Card className="bg-gradient-to-br from-violet-500/10 to-cyan-500/10 border-violet-500/20">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-serif text-lg text-white">Quick Actions</h3>
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="space-y-2">
                  {[
                    { label: 'Practice Resume Questions', icon: FileText, path: '/mock-test' },
                    { label: 'Chat with AI Coach', icon: MessageSquare, path: '/ai-chat' },
                    { label: 'View Analytics', icon: BarChart3, path: '/dashboard' }
                  ].map((action, i) => (
                    <motion.button
                      key={action.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.1 }}
                      onClick={() => navigate(action.path)}
                      className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors text-left"
                    >
                      <action.icon className="w-5 h-5 text-white/50" />
                      <span className="text-white/70 text-sm">{action.label}</span>
                    </motion.button>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Home;