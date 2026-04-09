import Interview from '../models/Interview.js';
import Report from '../models/Report.js';
import aiService from '../services/aiService.js';
import User from '../models/User.js';

export const generateReport = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.interviewId, userId: req.user._id })
      .populate('rounds.assessment.questions.questionId')
      .populate('rounds.coding.questions.questionId')
      .populate('rounds.core.questions.questionId')
      .populate('rounds.hr.questions.questionId');

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found or unauthorized'
      });
    }

    const user = await User.findById(req.user._id);

    const interviewData = {
      type: interview.type,
      difficulty: interview.difficulty,
      rounds: {
        assessment: interview.rounds?.assessment || {},
        coding: interview.rounds?.coding || {},
        core: interview.rounds?.core || {},
        hr: interview.rounds?.hr || {}
      },
      totalScore: interview.totalScore,
      timeSpent: interview.timeSpent,
      behaviorData: interview.behaviorData
    };

    const userProfile = {
      name: user?.name,
      role: user?.role,
      stream: user?.stream,
      skills: user?.resume?.parsed?.skills || [],
      preferences: user?.preferences
    };

    const aiReport = await aiService.generateReport(interviewData, userProfile);

    const codingQuestions = interview.rounds?.coding?.questions || [];
    const codingScore = codingQuestions.length > 0
      ? codingQuestions.reduce((acc, q) => acc + (q.score || 0), 0) / codingQuestions.length
      : 0;

    const coreQuestions = interview.rounds?.core?.questions || [];
    const coreScore = coreQuestions.length > 0
      ? coreQuestions.reduce((acc, q) => acc + (q.aiEvaluation?.score || 0), 0) / coreQuestions.length
      : 0;

    const hrQuestions = interview.rounds?.hr?.questions || [];
    const hrScore = hrQuestions.length > 0
      ? hrQuestions.reduce((acc, q) => acc + (q.aiEvaluation?.score || 0), 0) / hrQuestions.length
      : 0;

    const report = await Report.create({
      interviewId: interview._id,
      userId: interview.userId,
      overallScore: aiReport.overallScore,
      roundBreakdown: {
        assessment: {
          score: interview.rounds?.assessment?.score || 0,
          totalQuestions: 15,
          correctAnswers: interview.rounds?.assessment?.questions?.filter(q => q.isCorrect).length || 0,
          timeSpent: interview.rounds?.assessment?.questions?.reduce((acc, q) => acc + (q.timeSpent || 0), 0) || 0,
          weakAreas: aiReport.roundBreakdown?.assessment?.weakAreas || [],
          strongAreas: aiReport.roundBreakdown?.assessment?.strongAreas || []
        },
        coding: {
          score: Math.round(codingScore),
          totalQuestions: 3,
          solved: interview.rounds?.coding?.questions?.filter(q => q.status === 'evaluated').length || 0,
          timeSpent: interview.rounds?.coding?.questions?.reduce((acc, q) => acc + (q.timeSpent || 0), 0) || 0,
          languagesUsed: interview.rounds?.coding?.questions?.map(q => q.language).filter(Boolean) || [],
          weakAreas: aiReport.roundBreakdown?.coding?.weakAreas || [],
          strongAreas: aiReport.roundBreakdown?.coding?.strongAreas || []
        },
        core: {
          score: Math.round(coreScore),
          totalQuestions: 10,
          timeSpent: interview.rounds?.core?.questions?.reduce((acc, q) => acc + (q.timeSpent || 0), 0) || 0,
          weakAreas: aiReport.roundBreakdown?.core?.weakAreas || [],
          strongAreas: aiReport.roundBreakdown?.core?.strongAreas || []
        },
        hr: {
          score: Math.round(hrScore),
          totalQuestions: 10,
          timeSpent: interview.rounds?.hr?.questions?.reduce((acc, q) => acc + (q.timeSpent || 0), 0) || 0,
          confidence: hrQuestions.length > 0 
            ? hrQuestions.reduce((acc, q) => acc + (q.aiEvaluation?.confidence || 0), 0) / hrQuestions.length 
            : 0,
          tone: aiReport.roundBreakdown?.hr?.tone || 'professional'
        }
      },
      pastStats: {
        totalInterviews: 0,
        averageScore: 0,
        improvement: 0,
        lastInterviewDate: null
      },
      timeOnPlatform: interview.timeSpent || 0,
      weakAreas: aiReport.weakAreas || [],
      strengths: aiReport.strengths || [],
      suggestions: aiReport.suggestions || [],
      behavioralInsights: aiReport.behavioralInsights || {
        eyeContact: 0,
        confidence: 0,
        clarity: 0,
        pace: 0
      },
      cheatingProbability: aiReport.cheatingProbability || 0,
      cheatingFlags: [],
      aiRecommendations: aiReport.aiRecommendations || {
        nextSteps: [],
        learningPath: []
      }
    });

    res.json({
      success: true,
      report
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating report',
      error: error.message
    });
  }
};

export const getReport = async (req, res) => {
  try {
    const report = await Report.findOne({
      _id: req.params.id,
      userId: req.user._id
    }).populate('interviewId');

    if (!report) {
      return res.status(404).json({
        success: false,
        message: 'Report not found'
      });
    }

    res.json({
      success: true,
      report
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching report',
      error: error.message
    });
  }
};

export const getAllReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user._id })
      .populate('interviewId')
      .sort({ generatedAt: -1 })
      .limit(20);

    const pastStats = reports.length > 0 ? {
      totalInterviews: reports.length,
      averageScore: Math.round(reports.reduce((acc, r) => acc + r.overallScore, 0) / reports.length),
      lastInterviewDate: reports[0]?.generatedAt
    } : { totalInterviews: 0, averageScore: 0, lastInterviewDate: null };

    res.json({
      success: true,
      reports,
      pastStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching reports',
      error: error.message
    });
  }
};