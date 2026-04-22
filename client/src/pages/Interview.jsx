import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, CameraOff, Code2, FileText, CheckCircle2, ArrowLeft, 
  ArrowRight, Send, Loader2, AlertCircle
} from 'lucide-react';
import { interviewAPI, reportAPI } from '../utils/api';
import Card from '../components/ui/Card';

const Interview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [cameraStream, setCameraStream] = useState(null);
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [subjectiveAnswer, setSubjectiveAnswer] = useState('');
  const videoRef = useRef(null);

  useEffect(() => {
    fetchInterview();
  }, [id]);

  useEffect(() => {
    if (showCamera && videoRef.current) {
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          videoRef.current.srcObject = stream;
          setCameraStream(stream);
        })
        .catch(err => console.error('Camera error:', err));
    }
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [showCamera]);

  const fetchInterview = async () => {
    try {
      const res = await interviewAPI.getInterview(id);
      if (res.data.success) {
        setInterview(res.data.interview);
        
        if (res.data.interview.status === 'completed') {
          try {
            const reportRes = await reportAPI.get(id);
            if (reportRes.data.success) {
              navigate(`/report/${id}`);
              return;
            }
          } catch (e) {
            navigate(`/report/${id}`);
            return;
          }
        }
        
        if (res.data.interview.currentRound !== 'completed' && res.data.interview.currentRound !== null) {
          fetchQuestions(res.data.interview.currentRound);
        }
      }
    } catch (error) {
      console.error('Error fetching interview:', error);
    }
    setLoading(false);
  };

  const fetchQuestions = async (round) => {
    try {
      const res = await interviewAPI.getQuestions(id);
      if (res.data.success) {
        setQuestions(res.data.questions);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
    setLoading(false);
  };

  const handleAnswer = async (answer) => {
    setSubmitting(true);
    try {
      const question = questions[currentQuestion];
      
      if (interview.currentRound === 'assessment') {
        await interviewAPI.submitAnswer(id, {
          questionId: question._id,
          answer,
          timeSpent: 30
        });
      } else if (interview.currentRound === 'coding') {
        await interviewAPI.submitCode(id, {
          questionId: question._id,
          code: answer.code,
          language: answer.language,
          output: answer.output
        });
      } else {
        await interviewAPI.submitSubjective(id, {
          questionId: question._id,
          answer
        });
      }

      setAnswers({ ...answers, [currentQuestion]: answer });

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        await nextRound();
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
    setSubmitting(false);
  };

  const nextRound = async () => {
    try {
      const res = await interviewAPI.nextRound(id);
      if (res.data.success) {
        setInterview(res.data.interview);
        if (res.data.interview.currentRound === 'completed') {
          const reportRes = await reportAPI.generate(id);
          if (reportRes.data.success) {
            navigate(`/report/${reportRes.data.report._id}`);
          }
        } else {
          setCurrentQuestion(0);
          setAnswers({});
          fetchQuestions(res.data.interview.currentRound);
        }
      }
    } catch (error) {
      console.error('Error moving to next round:', error);
    }
  };

  const getRoundColor = (round) => {
    switch (round) {
      case 'assessment': return 'from-violet-500 to-cyan-500';
      case 'coding': return 'from-emerald-500 to-green-500';
      case 'core': return 'from-orange-500 to-red-500';
      case 'hr': return 'from-purple-500 to-pink-500';
      default: return 'from-white/20 to-white/10';
    }
  };

  const renderAssessment = () => {
    const q = questions[currentQuestion];
    return (
      <motion.div
        key="assessment"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <span className="text-white/40">Question {currentQuestion + 1} of {questions.length}</span>
          <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getRoundColor('assessment')} text-white font-medium`}>
            Assessment Round
          </div>
        </div>

        <Card className="p-8">
          <h3 className="font-serif text-xl text-white mb-8">{q?.question}</h3>
          
          <div className="space-y-3">
            {q?.options?.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleAnswer(opt)}
                disabled={submitting}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 ${
                  answers[currentQuestion] === opt
                    ? 'border-violet-500 bg-violet-500/10'
                    : 'border-white/10 hover:border-white/30 hover:bg-white/[0.02]'
                }`}
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 mr-3 text-sm font-medium">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-white/80">{opt}</span>
              </motion.button>
            ))}
          </div>
        </Card>

        <div className="flex gap-4">
          {currentQuestion > 0 && (
            <button
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              className="py-3 px-6 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-colors flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Previous
            </button>
          )}
          <button
            onClick={() => handleAnswer(answers[currentQuestion] || q?.options?.[0])}
            disabled={submitting || !answers[currentQuestion]}
            className="flex-1 py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Answer
              </>
            )}
          </button>
        </div>
      </motion.div>
    );
  };

  const renderCoding = () => {
    const q = questions[currentQuestion];

    return (
      <motion.div
        key="coding"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <span className="text-white/40">Problem {currentQuestion + 1} of {questions.length}</span>
          <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getRoundColor('coding')} text-white font-medium`}>
            Coding Round
          </div>
        </div>

        <Card className="p-8">
          <h3 className="font-serif text-xl text-white mb-6">{q?.question}</h3>
          
          <div className="mb-6">
            <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:border-violet-500/50 focus:outline-none transition-colors"
            >
              <option value="javascript" className="bg-[#030303]">JavaScript</option>
              <option value="python" className="bg-[#030303]">Python</option>
              <option value="java" className="bg-[#030303]">Java</option>
              <option value="cpp" className="bg-[#030303]">C++</option>
              <option value="c" className="bg-[#030303]">C</option>
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">Your Solution</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={15}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-white font-mono text-sm placeholder-white/20"
              placeholder="// Write your code here..."
            />
          </div>

          <button
            onClick={() => { handleAnswer({ code, language, output: '' }); setCode(''); }}
            disabled={submitting || !code}
            className="w-full py-3 rounded-xl bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Solution
              </>
            )}
          </button>
        </Card>
      </motion.div>
    );
  };

  const renderSubjective = (round) => {
    const q = questions[currentQuestion];
    const isHR = round === 'hr';

    return (
      <motion.div
        key={round}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="space-y-6"
      >
        <div className="flex justify-between items-center">
          <span className="text-white/40">Question {currentQuestion + 1} of {questions.length}</span>
          <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getRoundColor(round)} text-white font-medium`}>
            {round === 'core' ? 'Core Round' : 'HR Round'}
          </div>
        </div>

        <Card className="p-8">
          <h3 className="font-serif text-xl text-white mb-6">{q?.question}</h3>
          
          {isHR && (
            <div className="mb-6 p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-400" />
              <p className="text-sm text-yellow-400/80">Tip: Start with your introduction and be confident!</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-xs uppercase tracking-widest text-white/40 mb-3">Your Answer</label>
            <textarea
              value={subjectiveAnswer}
              onChange={(e) => setSubjectiveAnswer(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-violet-500/50 focus:outline-none transition-colors"
              placeholder="Type your answer here..."
            />
          </div>

          <button
            onClick={() => { handleAnswer(subjectiveAnswer); setSubjectiveAnswer(''); }}
            disabled={submitting || !subjectiveAnswer}
            className="w-full py-3 rounded-xl bg-white text-black font-medium hover:bg-white/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                Submit Answer
              </>
            )}
          </button>
        </Card>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white/60">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="text-center">
          <p className="text-white/40">Interview not found</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#030303] p-4 md:p-8"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="font-serif text-2xl text-white">
              {interview.type === 'cse' ? 'CSE/IT' : `Non-CSE (${interview.stream})`} Interview
            </h1>
            <p className="text-white/40 capitalize">Difficulty: {interview.difficulty}</p>
          </div>
          <button
            onClick={() => setShowCamera(!showCamera)}
            className={`py-2 px-4 rounded-xl border transition-colors flex items-center gap-2 ${
              showCamera 
                ? 'bg-red-500/20 border-red-500/30 text-red-400' 
                : 'border-white/10 text-white/60 hover:text-white hover:bg-white/5'
            }`}
          >
            {showCamera ? <CameraOff className="w-5 h-5" /> : <Camera className="w-5 h-5" />}
            <span>{showCamera ? 'Stop Camera' : 'Enable Camera'}</span>
          </button>
        </div>

        {/* Camera Preview */}
        <AnimatePresence>
          {showCamera && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl overflow-hidden"
            >
              <video
                ref={videoRef}
                autoPlay
                muted
                className="w-full max-h-64 object-cover"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Content */}
        <AnimatePresence mode="wait">
          {questions.length > 0 && (
            <>
              {interview.currentRound === 'assessment' && renderAssessment()}
              {interview.currentRound === 'coding' && renderCoding()}
              {interview.currentRound === 'core' && renderSubjective('core')}
              {interview.currentRound === 'hr' && renderSubjective('hr')}
            </>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default Interview;