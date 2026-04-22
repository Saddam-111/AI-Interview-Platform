import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Award, Clock, BarChart3, Zap, ArrowRight, Activity } from 'lucide-react';
import { reportAPI, aiAPI } from '../utils/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const Dashboard = () => {
  const navigate = useNavigate();
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState(null);
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [reportsRes, insightsRes] = await Promise.all([
        reportAPI.getAll(),
        aiAPI.getInsights()
      ]);
      
      if (reportsRes.data.success) {
        setReports(reportsRes.data.reports);
        setStats(reportsRes.data.pastStats);
      }
      if (insightsRes.data.success) {
        setInsights(insightsRes.data.insights);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'bg-emerald-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
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

  const StatCard = ({ icon: Icon, label, value, color, delay }) => (
    <motion.div variants={itemVariants}>
      <Card hover className="relative overflow-hidden">
        <div className={`absolute top-0 right-0 w-32 h-32 rounded-full ${color} opacity-10 -translate-y-1/2 translate-x-1/2 blur-2xl`} />
        <div className="flex items-center gap-4">
          <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <p className="text-3xl font-serif text-white">{value}</p>
            <p className="text-sm text-white/40">{label}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header */}
      <motion.div variants={itemVariants}>
        <h1 className="font-serif text-4xl text-white mb-2">Dashboard</h1>
        <p className="text-white/40">Your performance overview</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          icon={Activity} 
          label="Interviews" 
          value={stats?.totalInterviews || 0} 
          color="bg-gradient-to-br from-violet-500 to-purple-600"
        />
        <StatCard 
          icon={TrendingUp} 
          label="Avg Score" 
          value={`${stats?.averageScore || 0}%`} 
          color="bg-gradient-to-br from-emerald-500 to-green-600"
        />
        <StatCard 
          icon={Award} 
          label="Rounds" 
          value={insights?.roundsCompleted || 0} 
          color="bg-gradient-to-br from-cyan-500 to-blue-600"
        />
        <StatCard 
          icon={Zap} 
          label="Sessions" 
          value={insights?.totalInterviews || 0} 
          color="bg-gradient-to-br from-orange-500 to-red-600"
        />
      </div>

      {reports.length > 0 ? (
        <>
          {/* Recent Performance */}
          <motion.div variants={itemVariants}>
            <Card>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-serif text-xl text-white flex items-center gap-3">
                  <BarChart3 className="w-5 h-5 text-violet-400" />
                  Recent Performance
                </h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => navigate('/learning')}
                  icon={ArrowRight}
                >
                  View All
                </Button>
              </div>
              
              <div className="space-y-3">
                {reports.slice(0, 5).map((report, index) => (
                  <motion.div
                    key={report._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => navigate(`/report/${report._id}`)}
                    className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer hover:bg-white/[0.05] hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${getScoreColor(report.overallScore)} flex items-center justify-center text-white font-bold text-lg`}>
                        {Math.round(report.overallScore)}
                      </div>
                      <div>
                        <p className="font-medium text-white">
                          {report.interviewId?.type === 'cse' ? 'CSE/IT' : `Non-CSE (${report.interviewId?.stream})`}
                        </p>
                        <p className="text-sm text-white/40">
                          {new Date(report.generatedAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-24 h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${report.overallScore}%` }}
                          transition={{ delay: 0.5, duration: 0.5 }}
                          className={`h-full ${getScoreColor(report.overallScore)}`}
                        />
                      </div>
                      <span className="font-bold text-white w-12 text-right">{Math.round(report.overallScore)}%</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <h3 className="font-serif text-lg text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-emerald-400" />
                  </span>
                  Strengths
                </h3>
                <div className="space-y-3">
                  {reports[0]?.strengths?.slice(0, 5).map((strength, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5"
                    >
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-white/70">{strength}</span>
                    </motion.div>
                  )) || (
                    <p className="text-white/40 text-center py-4">Complete more interviews to see your strengths</p>
                  )}
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="h-full">
                <h3 className="font-serif text-lg text-white mb-4 flex items-center gap-3">
                  <span className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                    <Target className="w-4 h-4 text-yellow-400" />
                  </span>
                  Areas to Improve
                </h3>
                <div className="space-y-3">
                  {reports[0]?.weakAreas?.slice(0, 5).map((area, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="flex items-center gap-3 p-3 rounded-xl bg-yellow-500/5"
                    >
                      <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center">
                        <svg className="w-3 h-3 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                      </div>
                      <span className="text-white/70">{area}</span>
                    </motion.div>
                  )) || (
                    <p className="text-white/40 text-center py-4">Keep practicing to identify areas for improvement</p>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      ) : (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center">
              <BarChart3 className="w-10 h-10 text-white" />
            </div>
            <h2 className="font-serif text-2xl text-white mb-3">No Reports Yet</h2>
            <p className="text-white/40 mb-8 max-w-md mx-auto">
              Complete your first interview to see your performance analytics and track your progress.
            </p>
            <Button 
              onClick={() => navigate('/home')}
              icon={ArrowRight}
            >
              Start Your First Interview
            </Button>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;