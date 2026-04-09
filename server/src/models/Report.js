import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  overallScore: {
    type: Number,
    required: true
  },
  roundBreakdown: {
    assessment: {
      score: Number,
      totalQuestions: Number,
      correctAnswers: Number,
      timeSpent: Number,
      weakAreas: [String],
      strongAreas: [String]
    },
    coding: {
      score: Number,
      totalQuestions: Number,
      solved: Number,
      timeSpent: Number,
      languagesUsed: [String],
      weakAreas: [String],
      strongAreas: [String]
    },
    core: {
      score: Number,
      totalQuestions: Number,
      timeSpent: Number,
      weakAreas: [String],
      strongAreas: [String]
    },
    hr: {
      score: Number,
      totalQuestions: Number,
      timeSpent: Number,
      confidence: Number,
      tone: String
    }
  },
  pastStats: {
    totalInterviews: Number,
    averageScore: Number,
    improvement: Number,
    lastInterviewDate: Date
  },
  timeOnPlatform: {
    type: Number,
    default: 0
  },
  weakAreas: [String],
  strengths: [String],
  suggestions: [String],
  behavioralInsights: {
    eyeContact: Number,
    confidence: Number,
    clarity: Number,
    pace: Number
  },
  cheatingProbability: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  cheatingFlags: [{
    type: String,
    event: String,
    timestamp: Date
  }],
  aiRecommendations: {
    nextSteps: [String],
    learningPath: [{
      topic: String,
      priority: String,
      resources: [String]
    }]
  },
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

reportSchema.index({ userId: 1, generatedAt: -1 });

export default mongoose.model('Report', reportSchema);