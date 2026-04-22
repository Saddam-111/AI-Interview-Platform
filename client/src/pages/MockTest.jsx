import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Building2, FileText, CheckCircle2, Zap, ArrowRight, AlertTriangle } from 'lucide-react';
import { aiAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';

const MockTest = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [config, setConfig] = useState({
    type: 'role-based',
    role: '',
    difficulty: 'medium',
    company: '',
    resumeBased: false
  });
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    setLoading(true);
    try {
      const res = await aiAPI.mockTest({
        type: config.type,
        role: config.role,
        difficulty: config.difficulty,
        company: config.company,
        resumeBased: config.resumeBased
      });
      
      if (res.data.success) {
        navigate('/home', { state: { mockTest: res.data.questions, config: config } });
      }
    } catch (error) {
      console.error('Error starting mock test:', error);
    }
    setLoading(false);
  };

  const testTypes = [
    { value: 'role-based', label: 'Role-based', icon: Target, description: 'Questions based on target job role', color: 'from-violet-500 to-cyan-500' },
    { value: 'resume-based', label: 'Resume-based', icon: FileText, description: 'Questions from your uploaded resume', color: 'from-purple-500 to-pink-500' },
    { value: 'company-based', label: 'Company-based', icon: Building2, description: 'Specific company questions', color: 'from-emerald-500 to-green-500' }
  ];

  const roles = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Data Scientist', 'DevOps Engineer', 'QA Engineer', 'Mobile Developer', 'ML Engineer'
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy' },
    { value: 'medium', label: 'Medium' },
    { value: 'hard', label: 'Hard' }
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
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="font-serif text-4xl text-white mb-2">Mock Test</h1>
        <p className="text-white/40">Choose your test type and start practicing</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Test Type Selection */}
          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="font-serif text-xl text-white mb-4 flex items-center gap-3">
                <Zap className="w-5 h-5 text-violet-400" />
                Test Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {testTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setConfig({ ...config, type: type.value, resumeBased: type.value === 'resume-based' })}
                    className={`p-5 rounded-xl border-2 text-left transition-all duration-300 ${
                      config.type === type.value
                        ? 'border-violet-500 bg-violet-500/10'
                        : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3`}>
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-medium text-white">{type.label}</p>
                    <p className="text-xs text-white/40 mt-1">{type.description}</p>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Configuration */}
          {config.type !== 'resume-based' && (
            <motion.div variants={itemVariants}>
              <Card>
                <h2 className="font-serif text-lg text-white mb-6">Configuration</h2>
                
                {config.type === 'role-based' && (
                  <div className="mb-6">
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">Target Role</label>
                    <select
                      value={config.role}
                      onChange={(e) => setConfig({ ...config, role: e.target.value })}
                      className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500/50 focus:outline-none transition-colors"
                    >
                      <option value="" className="bg-[#030303]">Select a role</option>
                      {roles.map(role => (
                        <option key={role} value={role} className="bg-[#030303]">{role}</option>
                      ))}
                    </select>
                  </div>
                )}

                {config.type === 'company-based' && (
                  <div className="mb-6">
                    <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">Target Company</label>
                    <input
                      type="text"
                      value={config.company}
                      onChange={(e) => setConfig({ ...config, company: e.target.value })}
                      placeholder="e.g., Google, Microsoft, Amazon"
                      className="w-full px-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-violet-500/50 focus:outline-none transition-colors"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">Difficulty</label>
                  <div className="grid grid-cols-3 gap-3">
                    {difficulties.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setConfig({ ...config, difficulty: d.value })}
                        className={`py-4 rounded-xl border-2 font-medium transition-all duration-300 ${
                          config.difficulty === d.value
                            ? 'border-violet-500 bg-violet-500/10 text-white'
                            : 'border-white/10 text-white/50 hover:border-white/20'
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Resume Warning */}
          {config.type === 'resume-based' && !user?.resume?.uploaded && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/20"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-500/20 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <h3 className="font-medium text-yellow-400">Resume Not Uploaded</h3>
                  <p className="text-sm text-white/50">Upload your resume in Profile to use resume-based tests</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Start Button */}
          <motion.div variants={itemVariants}>
            <button
              onClick={handleStart}
              disabled={loading || (config.type === 'resume-based' && !user?.resume?.uploaded) || (config.type === 'role-based' && !config.role)}
              className="w-full py-4 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Start Mock Test</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* What to Expect */}
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-medium text-white mb-4">What to Expect</h3>
              <div className="space-y-3">
                {[
                  '15 Multiple Choice Questions',
                  'Timed Assessment',
                  'AI-Generated Questions',
                  'Detailed Explanations'
                ].map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-4 h-4 text-violet-400" />
                    <span className="text-white/60 text-sm">{item}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* AI Powered Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border-violet-500/20">
              <div className="flex items-center gap-3 mb-3">
                <Zap className="w-5 h-5 text-white" />
                <h3 className="font-medium text-white">AI-Powered</h3>
              </div>
              <p className="text-sm text-white/50">
                Questions are generated based on your selected criteria and updated regularly
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default MockTest;