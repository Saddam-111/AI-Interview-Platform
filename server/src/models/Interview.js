import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['cse', 'non-cse'],
    required: true
  },
  stream: {
    type: String,
    enum: ['mechanical', 'civil', 'electrical', 'electronics', 'other', null],
    default: null
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'completed', 'abandoned'],
    default: 'pending'
  },
  currentRound: {
    type: String,
    enum: ['assessment', 'coding', 'core', 'hr', 'completed', null],
    default: null
  },
  rounds: {
    assessment: {
      questions: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        question: String,
        options: [String],
        userAnswer: String,
        correctAnswer: String,
        isCorrect: Boolean,
        timeSpent: Number
      }],
      score: { type: Number, default: 0 },
      totalQuestions: { type: Number, default: 15 },
      completedAt: Date
    },
    coding: {
      questions: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        question: String,
        language: String,
        code: String,
        output: String,
        status: { type: String, enum: ['pending', 'submitted', 'evaluated'] },
        score: Number,
        timeSpent: Number
      }],
      totalQuestions: { type: Number, default: 3 },
      completedAt: Date
    },
    core: {
      questions: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        question: String,
        answer: String,
        aiEvaluation: {
          score: Number,
          feedback: String,
          keywords: [String]
        },
        timeSpent: Number
      }],
      totalQuestions: { type: Number, default: 10 },
      completedAt: Date
    },
    hr: {
      questions: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
        question: String,
        answer: String,
        aiEvaluation: {
          score: Number,
          feedback: String,
          confidence: Number,
          tone: String
        },
        timeSpent: Number
      }],
      totalQuestions: { type: Number, default: 10 },
      completedAt: Date
    }
  },
  totalScore: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number,
    default: 0
  },
  startTime: Date,
  endTime: Date,
  recording: {
    url: String,
    duration: Number
  },
  behaviorData: [{
    event: String,
    timestamp: Date,
    details: Object
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

interviewSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Interview', interviewSchema);