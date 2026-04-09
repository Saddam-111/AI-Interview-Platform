import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Target, Building2, FileText, CheckCircle2, Zap, ArrowRight, AlertTriangle } from 'lucide-react';
import { aiAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';

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
    { value: 'role-based', label: 'Role-based', icon: Target, description: 'Questions based on target job role', color: 'from-blue-500 to-cyan-500' },
    { value: 'resume-based', label: 'Resume-based', icon: FileText, description: 'Questions from your uploaded resume', color: 'from-purple-500 to-pink-500' },
    { value: 'company-based', label: 'Company-based', icon: Building2, description: 'Specific company questions', color: 'from-green-500 to-emerald-500' }
  ];

  const roles = [
    'Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
    'Data Scientist', 'DevOps Engineer', 'QA Engineer', 'Mobile Developer', 'ML Engineer'
  ];

  const difficulties = [
    { value: 'easy', label: 'Easy', color: 'from-green-400 to-green-500' },
    { value: 'medium', label: 'Medium', color: 'from-yellow-400 to-orange-500' },
    { value: 'hard', label: 'Hard', color: 'from-red-400 to-red-500' }
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
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Mock Test</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Choose your test type and start practicing</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Test Type Selection */}
          <motion.div variants={itemVariants}>
            <Card>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-500" />
                Test Type
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {testTypes.map((type) => (
                  <motion.button
                    key={type.value}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setConfig({ ...config, type: type.value, resumeBased: type.value === 'resume-based' })}
                    className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                      config.type === type.value
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-lg shadow-blue-500/20'
                        : 'border-gray-200 dark:border-slate-600 hover:border-gray-300 dark:hover:border-slate-500'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-3 shadow-lg`}>
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                    <p className="font-semibold text-gray-900 dark:text-white">{type.label}</p>
                    <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{type.description}</p>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Configuration */}
          {config.type !== 'resume-based' && (
            <motion.div variants={itemVariants}>
              <Card>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Configuration</h2>
                
                {config.type === 'role-based' && (
                  <div className="mb-6">
                    <Select
                      label="Target Role"
                      value={config.role}
                      onChange={(e) => setConfig({ ...config, role: e.target.value })}
                      placeholder="Select a role"
                      options={roles.map(role => ({ value: role, label: role }))}
                    />
                  </div>
                )}

                {config.type === 'company-based' && (
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Target Company</label>
                    <input
                      type="text"
                      value={config.company}
                      onChange={(e) => setConfig({ ...config, company: e.target.value })}
                      placeholder="e.g., Google, Microsoft, Amazon"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-3">Difficulty</label>
                  <div className="flex gap-3">
                    {difficulties.map((d) => (
                      <button
                        key={d.value}
                        onClick={() => setConfig({ ...config, difficulty: d.value })}
                        className={`flex-1 py-3 rounded-xl border-2 font-medium transition-all ${
                          config.difficulty === d.value
                            ? `bg-gradient-to-r ${d.color} text-white border-transparent shadow-lg`
                            : 'border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-400 hover:border-gray-300 dark:hover:border-slate-500'
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
              className="bg-yellow-50 dark:bg-yellow-900/20 border-2 border-yellow-200 dark:border-yellow-800 rounded-xl p-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-yellow-800 dark:text-yellow-300">Resume Not Uploaded</h3>
                  <p className="text-sm text-yellow-700 dark:text-yellow-400">Upload your resume in the Profile section to use resume-based tests</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Start Button */}
          <motion.div variants={itemVariants}>
            <Button
              onClick={handleStart}
              loading={loading}
              disabled={loading || (config.type === 'resume-based' && !user?.resume?.uploaded) || (config.type === 'role-based' && !config.role)}
              className="w-full"
              icon={ArrowRight}
              size="lg"
            >
              Start Mock Test
            </Button>
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* What to Expect */}
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4">What to Expect</h3>
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
                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-gray-700 dark:text-slate-300">{item}</span>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* AI Powered Card */}
          <motion.div variants={itemVariants}>
            <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <Zap className="w-5 h-5" />
                </div>
                <h3 className="font-bold">AI-Powered</h3>
              </div>
              <p className="text-sm opacity-90">
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