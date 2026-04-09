import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, TrendingUp, Target, ArrowRight, Calendar, BarChart3, BookOpen } from 'lucide-react';
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
      case 'completed': return 'from-green-400 to-green-500';
      case 'in_progress': return 'from-yellow-400 to-orange-500';
      default: return 'from-gray-400 to-gray-500';
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
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
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Learning Center</h1>
        <p className="text-gray-500 dark:text-slate-400 mt-1">Track your progress and resume</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Resume Card */}
        <motion.div variants={itemVariants}>
          <Card hover className="h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-blue-500/25">
                <FileText className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Resume Status</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {user?.resume?.uploaded ? 'Uploaded' : 'Not uploaded'}
                </p>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: user?.resume?.uploaded ? '100%' : '0%' }}
                transition={{ duration: 0.5 }}
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
              />
            </div>
            <Button
              variant={user?.resume?.uploaded ? 'outline' : 'primary'}
              size="sm"
              onClick={() => navigate('/profile')}
              className="w-full"
            >
              {user?.resume?.uploaded ? 'Update Resume' : 'Upload Resume'}
            </Button>
          </Card>
        </motion.div>

        {/* Interviews Card */}
        <motion.div variants={itemVariants}>
          <Card hover className="h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/25">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Interviews Completed</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">{completedCount} sessions</p>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min((completedCount / 10) * 100, 100)}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500"
              />
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/home')}
              className="w-full"
              icon={ArrowRight}
            >
              Start New Interview
            </Button>
          </Card>
        </motion.div>

        {/* Skills Card */}
        <motion.div variants={itemVariants}>
          <Card hover className="h-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 dark:text-white">Skills Progress</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400">{skillsCount} skills detected</p>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden mb-4">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(skillsCount * 10, 100)}%` }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate('/mock-test')}
              className="w-full"
              icon={ArrowRight}
            >
              Practice Skills
            </Button>
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
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Interview History</h2>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            </div>
          ) : interviews.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-700">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">Round</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">Score</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600 dark:text-slate-400">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {interviews.map((interview, index) => (
                    <motion.tr
                      key={interview._id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-gray-50 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/30 cursor-pointer"
                      onClick={() => {
                        if (interview.status === 'completed') {
                          navigate(`/report/${interview._id}`);
                        } else {
                          navigate(`/interview/${interview._id}`);
                        }
                      }}
                    >
                      <td className="py-3 px-4 text-gray-700 dark:text-slate-300">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(interview.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-slate-300">
                        {interview.type === 'cse' ? 'CSE/IT' : `Non-CSE (${interview.stream})`}
                      </td>
                      <td className="py-3 px-4 text-gray-700 dark:text-slate-300 capitalize">
                        {interview.currentRound || 'Not started'}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-100 dark:bg-slate-600 rounded-full overflow-hidden">
                            <div
                              className={`h-full bg-gradient-to-r ${getStatusColor(interview.status)}`}
                              style={{ width: `${Math.min(Math.round(interview.totalScore || 0), 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {Math.min(Math.round(interview.totalScore || 0), 100)}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getStatusColor(interview.status)} text-white`}>
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
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 dark:bg-slate-800 flex items-center justify-center">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 dark:text-slate-400">No interviews yet. Start your first interview!</p>
              <Button
                variant="primary"
                onClick={() => navigate('/home')}
                className="mt-4"
                icon={ArrowRight}
              >
                Start Interview
              </Button>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default Learning;