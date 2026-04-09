import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Camera, CameraOff, Code2, FileText, CheckCircle2, ArrowLeft, 
  ArrowRight, Send, Loader2, AlertCircle
} from 'lucide-react';
import { interviewAPI, reportAPI } from '../utils/api';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Select from '../components/ui/Select';

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
      case 'assessment': return 'from-blue-500 to-cyan-500';
      case 'coding': return 'from-green-500 to-emerald-500';
      case 'core': return 'from-orange-500 to-red-500';
      case 'hr': return 'from-purple-500 to-pink-500';
      default: return 'from-gray-500 to-slate-500';
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
          <span className="text-gray-500 dark:text-slate-400">Question {currentQuestion + 1} of {questions.length}</span>
          <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getRoundColor('assessment')} text-white font-medium`}>
            Assessment Round
          </div>
        </div>

        <Card className="p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8">{q?.question}</h3>
          
          <div className="space-y-3">
            {q?.options?.map((opt, i) => (
              <motion.button
                key={i}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={() => handleAnswer(opt)}
                disabled={submitting}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                  answers[currentQuestion] === opt
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-slate-600 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-700 mr-3 text-sm font-semibold">
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </motion.button>
            ))}
          </div>
        </Card>

        <div className="flex gap-4">
          {currentQuestion > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(currentQuestion - 1)}
              icon={ArrowLeft}
            >
              Previous
            </Button>
          )}
          <Button
            onClick={() => handleAnswer(answers[currentQuestion] || q?.options?.[0])}
            disabled={submitting || !answers[currentQuestion]}
            className="flex-1"
            icon={submitting ? Loader2 : Send}
            loading={submitting}
          >
            Submit Answer
          </Button>
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
          <span className="text-gray-500 dark:text-slate-400">Problem {currentQuestion + 1} of {questions.length}</span>
          <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getRoundColor('coding')} text-white font-medium`}>
            Coding Round
          </div>
        </div>

        <Card className="p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{q?.question}</h3>
          
          <div className="mb-6">
            <Select
              label="Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              options={[
                { value: 'javascript', label: 'JavaScript' },
                { value: 'python', label: 'Python' },
                { value: 'java', label: 'Java' },
                { value: 'cpp', label: 'C++' },
                { value: 'c', label: 'C' }
              ]}
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Your Solution</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              rows={15}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-slate-900 text-gray-100 font-mono text-sm"
              placeholder="// Write your code here..."
            />
          </div>

          <Button
            onClick={() => { handleAnswer({ code, language, output: '' }); setCode(''); }}
            disabled={submitting || !code}
            variant="success"
            className="w-full"
            icon={submitting ? Loader2 : Send}
            loading={submitting}
          >
            Submit Solution
          </Button>
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
          <span className="text-gray-500 dark:text-slate-400">Question {currentQuestion + 1} of {questions.length}</span>
          <div className={`px-4 py-2 rounded-xl bg-gradient-to-r ${getRoundColor(round)} text-white font-medium`}>
            {round === 'core' ? 'Core Round' : 'HR Round'}
          </div>
        </div>

        <Card className="p-8">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">{q?.question}</h3>
          
          {isHR && (
            <div className="mb-6 p-4 rounded-xl bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
                <p className="text-sm text-yellow-800 dark:text-yellow-300">Tip: Start with your introduction and be confident!</p>
              </div>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">Your Answer</label>
            <textarea
              value={subjectiveAnswer}
              onChange={(e) => setSubjectiveAnswer(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-900 dark:text-white"
              placeholder="Type your answer here..."
            />
          </div>

          <Button
            onClick={() => { handleAnswer(subjectiveAnswer); setSubjectiveAnswer(''); }}
            disabled={submitting || !subjectiveAnswer}
            variant={isHR ? 'secondary' : 'primary'}
            className="w-full"
            icon={submitting ? Loader2 : Send}
            loading={submitting}
          >
            Submit Answer
          </Button>
        </Card>
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">Loading interview...</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-slate-400">Interview not found</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 md:p-8"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              {interview.type === 'cse' ? 'CSE/IT' : `Non-CSE (${interview.stream})`} Interview
            </h1>
            <p className="text-gray-500 dark:text-slate-400">Difficulty: {interview.difficulty}</p>
          </div>
          <Button
            variant={showCamera ? 'danger' : 'outline'}
            onClick={() => setShowCamera(!showCamera)}
            icon={showCamera ? CameraOff : Camera}
          >
            {showCamera ? 'Stop Camera' : 'Enable Camera'}
          </Button>
        </div>

        {/* Camera Preview */}
        <AnimatePresence>
          {showCamera && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-2xl overflow-hidden shadow-lg"
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