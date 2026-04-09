import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Clock, Shield, Eye, MessageSquare, TrendingUp, 
  AlertTriangle, CheckCircle2, BookOpen, MessageCircle, PlayCircle, 
  Target, Award
} from 'lucide-react';
import { reportAPI } from '../utils/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

const ReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReport();
  }, [id]);

  const fetchReport = async () => {
    try {
      let res = await reportAPI.get(id);
      if (!res.data.success) {
        res = await reportAPI.generate(id);
      }
      if (res.data.success) {
        setReport(res.data.report || res.data);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
    }
    setLoading(false);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'from-green-400 to-green-500';
    if (score >= 60) return 'from-yellow-400 to-orange-500';
    return 'from-red-400 to-red-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Improvement';
    return 'Poor';
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-slate-400">Report not found</p>
          <Button variant="primary" onClick={() => navigate('/dashboard')} className="mt-4">
            Go to Dashboard
          </Button>
        </div>
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
      {/* Back Button */}
      <motion.div variants={itemVariants}>
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard')}
          icon={ArrowLeft}
        >
          Back to Dashboard
        </Button>
      </motion.div>

      {/* Main Score Card */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/10 dark:to-purple-900/10" />
          <div className="relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Interview Report</h1>
                <p className="text-gray-500 dark:text-slate-400 mt-1">
                  {new Date(report.generatedAt).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              <div className="text-center md:text-right">
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className={`inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br ${getScoreColor(report.overallScore)} mb-2 shadow-lg`}
                >
                  <span className="text-3xl font-bold text-white">{Math.round(report.overallScore)}</span>
                </motion.div>
                <div className={`px-4 py-1 rounded-full text-sm font-semibold bg-gradient-to-r ${getScoreColor(report.overallScore)} text-white`}>
                  {getScoreLabel(report.overallScore)}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-4 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${report.overallScore}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className={`h-full bg-gradient-to-r ${getScoreColor(report.overallScore)}`}
              />
            </div>
          </div>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Round Breakdown */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-500" />
              Round Breakdown
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Assessment */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-900 dark:text-white">Assessment</span>
                  <span className="text-2xl font-bold text-blue-600">{Math.round(report.roundBreakdown.assessment?.score || 0)}%</span>
                </div>
                <div className="w-full h-2 bg-blue-200 dark:bg-blue-800 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-blue-500" style={{ width: `${report.roundBreakdown.assessment?.score || 0}%` }} />
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {report.roundBreakdown.assessment?.correctAnswers || 0}/15 correct
                </p>
              </motion.div>

              {/* Coding/Core */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-2xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {report.roundBreakdown.coding ? 'Coding' : 'Core'}
                  </span>
                  <span className="text-2xl font-bold text-green-600">
                    {Math.round((report.roundBreakdown.coding?.score || report.roundBreakdown.core?.score || 0))}%
                  </span>
                </div>
                <div className="w-full h-2 bg-green-200 dark:bg-green-800 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-green-500" style={{ width: `${report.roundBreakdown.coding?.score || report.roundBreakdown.core?.score || 0}%` }} />
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  {report.roundBreakdown.coding?.solved || report.roundBreakdown.core?.totalQuestions || 0} questions
                </p>
              </motion.div>

              {/* HR Round */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-2xl bg-purple-50 dark:bg-purple-900/20 border border-purple-100 dark:border-purple-800 md:col-span-2"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-gray-900 dark:text-white">HR Round</span>
                  <span className="text-2xl font-bold text-purple-600">{Math.round(report.roundBreakdown.hr?.score || 0)}%</span>
                </div>
                <div className="w-full h-2 bg-purple-200 dark:bg-purple-800 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-purple-500" style={{ width: `${report.roundBreakdown.hr?.score || 0}%` }} />
                </div>
                <p className="text-sm text-gray-500 dark:text-slate-400">
                  Confidence: {Math.round(report.roundBreakdown.hr?.confidence || 0)}%
                </p>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          {/* Time & Stats */}
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-500" />
                Time & Stats
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                  <span className="text-gray-600 dark:text-slate-400">Time on Platform</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {Math.floor((report.timeOnPlatform || 0) / 60)}m {(report.timeOnPlatform || 0) % 60}s
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-700/50">
                  <span className="text-gray-600 dark:text-slate-400">Cheating Probability</span>
                  <span className={`font-semibold ${
                    report.cheatingProbability < 30 ? 'text-green-600' :
                    report.cheatingProbability < 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {report.cheatingProbability || 0}%
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Behavioral Insights */}
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-500" />
                Behavioral Insights
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Eye Contact', value: report.behavioralInsights?.eyeContact || 0, color: 'blue' },
                  { label: 'Confidence', value: report.behavioralInsights?.confidence || 0, color: 'green' },
                  { label: 'Clarity', value: report.behavioralInsights?.clarity || 0, color: 'purple' }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-gray-600 dark:text-slate-400">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">{item.value}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className={`h-full bg-gradient-to-r from-${item.color}-400 to-${item.color}-500`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>

      {/* Strengths & Weak Areas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-green-500" />
              Strengths
            </h2>
            <div className="space-y-3">
              {report.strengths?.length > 0 ? (
                report.strengths.map((strength, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-green-50 dark:bg-green-900/20"
                  >
                    <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-slate-300">{strength}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-slate-400 text-center py-4">No strengths identified yet</p>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              Weak Areas
            </h2>
            <div className="space-y-3">
              {report.weakAreas?.length > 0 ? (
                report.weakAreas.map((area, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20"
                  >
                    <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-700 dark:text-slate-300">{area}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-slate-400 text-center py-4">No weak areas identified</p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Suggestions */}
      <motion.div variants={itemVariants}>
        <Card>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Suggestions
          </h2>
          <div className="space-y-3">
            {report.suggestions?.length > 0 ? (
              report.suggestions.map((suggestion, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-sm">→</span>
                  </div>
                  <span className="text-gray-700 dark:text-slate-300">{suggestion}</span>
                </motion.div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-slate-400 text-center py-4">No suggestions available</p>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Learning Path */}
      {report.aiRecommendations?.learningPath?.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Personalized Learning Path
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {report.aiRecommendations.learningPath.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
                >
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mb-3 ${
                    item.priority === 'high' ? 'bg-red-500' :
                    item.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                  }`}>
                    {item.priority} priority
                  </div>
                  <h3 className="font-semibold mb-2">{item.topic}</h3>
                  <ul className="text-sm opacity-90 space-y-1">
                    {item.resources?.map((r, j) => (
                      <li key={j} className="flex items-center gap-1">
                        <span>•</span> {r}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
        <Button 
          onClick={() => navigate('/home')}
          className="flex-1"
          icon={PlayCircle}
          size="lg"
        >
          Start New Interview
        </Button>
        <Button 
          variant="secondary"
          onClick={() => navigate('/ai-chat')}
          className="flex-1"
          icon={MessageCircle}
          size="lg"
        >
          Chat with AI Coach
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default ReportPage;