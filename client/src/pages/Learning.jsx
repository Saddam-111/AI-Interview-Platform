import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, Target, ArrowRight, Calendar, BookOpen, Zap, BarChart3 } from 'lucide-react';
import { interviewAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Learning = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const res = await interviewAPI.getAll();
      if (res.data.success) {
        setInterviews(res.data.interviews);
      }
    } catch (error) {
      console.error('Error fetching interviews:', error);
    }
    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-emerald-500';
      case 'in_progress': return 'bg-yellow-500';
      default: return 'bg-white/20';
    }
  };

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

  const completedCount = interviews.filter(i => i.status === 'completed').length;
  const skillsCount = user?.resume?.parsed?.skills?.length || 0;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="font-serif text-4xl text-white mb-2">Learning Center</h1>
        <p className="text-white/40">Track your progress and resume</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Resume Card */}
        <motion.div variants={itemVariants}>
          <Card hover className="h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white">Resume Status</h3>
                <p className="text-sm text-white/40">
                  {user?.resume?.uploaded ? 'Uploaded' : 'Not uploaded'}
                </p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: user?.resume?.uploaded ? '100%' : '0%' }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
              />
            </div>
            <button
              onClick={() => navigate('/profile')}
              className={`w-full py-3 rounded-xl text-sm font-medium transition-colors ${
                user?.resume?.uploaded 
                  ? 'border border-white/10 text-white hover:bg-white/5' 
                  : 'bg-white text-black hover:bg-white/90'
              }`}
            >
              {user?.resume?.uploaded ? 'Update Resume' : 'Upload Resume'}
            </button>
          </Card>
        </motion.div>

        {/* Interviews Card */}
        <motion.div variants={itemVariants}>
          <Card hover className="h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white">Completed</h3>
                <p className="text-sm text-white/40">{completedCount} sessions</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((completedCount / 10) * 100, 100)}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-emerald-500 to-green-500"
              />
            </div>
            <button
              onClick={() => navigate('/home')}
              className="w-full py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              <span>Start New</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Card>
        </motion.div>

        {/* Skills Card */}
        <motion.div variants={itemVariants}>
          <Card hover className="h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-medium text-white">Skills</h3>
                <p className="text-sm text-white/40">{skillsCount} detected</p>
              </div>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(skillsCount * 10, 100)}%` }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
            <button
              onClick={() => navigate('/mock-test')}
              className="w-full py-3 rounded-xl border border-white/10 text-white text-sm font-medium hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
            >
              <span>Practice</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </Card>
        </motion.div>
      </div>

      {/* Interview History */}
      <motion.div variants={itemVariants}>
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h2 className="font-serif text-xl text-white">Interview History</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : interviews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-white/40 font-medium">Date</th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-white/40 font-medium">Type</th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-white/40 font-medium">Round</th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-white/40 font-medium">Score</th>
                    <th className="text-left py-3 px-4 text-xs uppercase tracking-widest text-white/40 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.map((interview, index) => (
                    <motion.tr
                      key={interview._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/5 hover:bg-white/[0.02] cursor-pointer"
                      onClick={() => {
                        if (interview.status === 'completed') {
                          navigate(`/report/${interview._id}`);
                        } else {
                          navigate(`/interview/${interview._id}`);
                        }
                      }}
                    >
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2 text-white/70">
                          <Calendar className="w-4 h-4 text-white/30" />
                          {new Date(interview.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-4 px-4 text-white/70">
                        {interview.type === 'cse' ? 'CSE/IT' : `Non-CSE (${interview.stream})`}
                      </td>
                      <td className="py-4 px-4 text-white/70 capitalize">
                        {interview.currentRound || 'Not started'}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${getStatusColor(interview.status)}`}
                              style={{ width: `${Math.min(Math.round(interview.totalScore || 0), 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-white">
                            {Math.min(Math.round(interview.totalScore || 0), 100)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white/70`}>
                          {interview.status.replace('_', ' ')}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-white/30" />
              </div>
              <p className="text-white/40 mb-4">No interviews yet. Start your first interview!</p>
              <button
                onClick={() => navigate('/home')}
                className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors inline-flex items-center gap-2"
              >
                <span>Start Interview</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Learning;