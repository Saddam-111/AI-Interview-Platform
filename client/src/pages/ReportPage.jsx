import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Clock, Shield, Eye, MessageSquare, TrendingUp, 
  AlertTriangle, CheckCircle2, BookOpen, MessageCircle, PlayCircle, 
  Target, Award, BarChart3
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
    if (score >= 80) return 'from-emerald-500 to-green-500';
    if (score >= 60) return 'from-yellow-500 to-orange-500';
    return 'from-red-500 to-rose-500';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Work';
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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.23, 1, 0.32, 1] } }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-2 border-violet-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-white/40 mb-4">Report not found</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90"
          >
            Go to Dashboard
          </button>
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
        <button 
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
      </motion.div>

      {/* Main Score Card */}
      <motion.div variants={itemVariants}>
        <Card className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/10 to-cyan-500/10" />
          <div className="relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-6">
              <div>
                <h1 className="font-serif text-3xl text-white">Interview Report</h1>
                <p className="text-white/40 mt-1">
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
                  className={`inline-flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-br ${getScoreColor(report.overallScore)} mb-3 violet-glow`}
                >
                  <span className="text-4xl font-serif text-white">{Math.round(report.overallScore)}</span>
                </motion.div>
                <div className={`px-4 py-1.5 rounded-full text-sm font-medium bg-white/10 text-white`}>
                  {getScoreLabel(report.overallScore)}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Round Breakdown */}
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <Card>
            <h2 className="font-serif text-xl text-white mb-6 flex items-center gap-3">
              <Target className="w-5 h-5 text-violet-400" />
              Round Breakdown
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Assessment */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-white">Assessment</span>
                  <span className="text-2xl font-serif text-white">{Math.round(report.roundBreakdown.assessment?.score || 0)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-violet-500" style={{ width: `${report.roundBreakdown.assessment?.score || 0}%` }} />
                </div>
                <p className="text-sm text-white/40">
                  {report.roundBreakdown.assessment?.correctAnswers || 0}/15 correct
                </p>
              </motion.div>

              {/* Coding/Core */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-white">
                    {report.roundBreakdown.coding ? 'Coding' : 'Core'}
                  </span>
                  <span className="text-2xl font-serif text-white">
                    {Math.round((report.roundBreakdown.coding?.score || report.roundBreakdown.core?.score || 0))}%
                  </span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-cyan-500" style={{ width: `${report.roundBreakdown.coding?.score || report.roundBreakdown.core?.score || 0}%` }} />
                </div>
                <p className="text-sm text-white/40">
                  {report.roundBreakdown.coding?.solved || report.roundBreakdown.core?.totalQuestions || 0} questions
                </p>
              </motion.div>

              {/* HR Round */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 md:col-span-2"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-medium text-white">HR Round</span>
                  <span className="text-2xl font-serif text-white">{Math.round(report.roundBreakdown.hr?.score || 0)}%</span>
                </div>
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-emerald-500" style={{ width: `${report.roundBreakdown.hr?.score || 0}%` }} />
                </div>
                <p className="text-sm text-white/40">
                  Confidence: {Math.round(report.roundBreakdown.hr?.confidence || 0)}%
                </p>
              </motion.div>
            </div>
          </Card>
        </motion.div>

        {/* Sidebar Stats */}
        <div className="space-y-4">
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-medium text-white mb-4 flex items-center gap-3">
                <Clock className="w-5 h-5 text-violet-400" />
                Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02]">
                  <span className="text-white/50">Time</span>
                  <span className="font-medium text-white">
                    {Math.floor((report.timeOnPlatform || 0) / 60)}m {(report.timeOnPlatform || 0) % 60}s
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 rounded-xl bg-white/[0.02]">
                  <span className="text-white/50">Integrity</span>
                  <span className={`font-medium ${
                    report.cheatingProbability < 30 ? 'text-emerald-400' :
                    report.cheatingProbability < 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {(100 - (report.cheatingProbability || 0))}%
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Behavioral */}
          <motion.div variants={itemVariants}>
            <Card>
              <h3 className="font-medium text-white mb-4 flex items-center gap-3">
                <Eye className="w-5 h-5 text-cyan-400" />
                Analysis
              </h3>
              <div className="space-y-4">
                {[
                  { label: 'Eye Contact', value: report.behavioralInsights?.eyeContact || 0 },
                  { label: 'Confidence', value: report.behavioralInsights?.confidence || 0 },
                  { label: 'Clarity', value: report.behavioralInsights?.clarity || 0 }
                ].map((item) => (
                  <div key={item.label}>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-white/50">{item.label}</span>
                      <span className="text-sm font-medium text-white">{item.value}%</span>
                    </div>
                    <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${item.value}%` }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <h2 className="font-serif text-lg text-white mb-4 flex items-center gap-3">
              <Award className="w-5 h-5 text-emerald-400" />
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
                    className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/5"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    </div>
                    <span className="text-white/70 text-sm">{strength}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-white/30 text-center py-4">No strengths identified</p>
              )}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="h-full">
            <h2 className="font-serif text-lg text-white mb-4 flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-yellow-400" />
              Areas to Improve
            </h2>
            <div className="space-y-3">
              {report.weakAreas?.length > 0 ? (
                report.weakAreas.map((area, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center gap-3 p-3 rounded-xl bg-yellow-500/5"
                  >
                    <div className="w-5 h-5 rounded-full bg-yellow-500/20 flex items-center justify-center">
                      <AlertTriangle className="w-3 h-3 text-yellow-400" />
                    </div>
                    <span className="text-white/70 text-sm">{area}</span>
                  </motion.div>
                ))
              ) : (
                <p className="text-white/30 text-center py-4">No weak areas identified</p>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Suggestions */}
      <motion.div variants={itemVariants}>
        <Card>
          <h2 className="font-serif text-lg text-white mb-4 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-cyan-400" />
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
                  className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02]"
                >
                  <div className="w-5 h-5 rounded-full bg-violet-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs">→</span>
                  </div>
                  <span className="text-white/70 text-sm">{suggestion}</span>
                </motion.div>
              ))
            ) : (
              <p className="text-white/30 text-center py-4">No suggestions available</p>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Learning Path */}
      {report.aiRecommendations?.learningPath?.length > 0 && (
        <motion.div variants={itemVariants}>
          <Card className="bg-gradient-to-br from-violet-500/20 to-cyan-500/20 border-violet-500/20">
            <h2 className="font-serif text-lg text-white mb-4 flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-white" />
              Learning Path
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {report.aiRecommendations.learningPath.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white/5 rounded-xl p-4"
                >
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-3 ${
                    item.priority === 'high' ? 'bg-red-500/20 text-red-400' :
                    item.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-emerald-500/20 text-emerald-400'
                  }`}>
                    {item.priority}
                  </div>
                  <h3 className="font-medium text-white mb-2">{item.topic}</h3>
                  <ul className="text-sm text-white/50 space-y-1">
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
        <button 
          onClick={() => navigate('/home')}
          className="flex-1 py-4 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
        >
          <PlayCircle className="w-5 h-5" />
          <span>Start New Interview</span>
        </button>
        <button 
          onClick={() => navigate('/ai-chat')}
          className="flex-1 py-4 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors flex items-center justify-center gap-2"
        >
          <MessageCircle className="w-5 h-5" />
          <span>Chat with AI Coach</span>
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ReportPage;