import aiService from '../services/aiService.js';
import Interview from '../models/Interview.js';
import User from '../models/User.js';

export const chat = async (req, res) => {
  try {
    const { messages, userMessage } = req.body;

    const user = await User.findById(req.user._id);
    const resumeInfo = user?.resume?.parsed ? {
      skills: user.resume.parsed.skills || [],
      education: user.resume.parsed.education || [],
      experience: user.resume.parsed.experience || '',
      summary: user.resume.parsed.summary || '',
      projects: user.resume.parsed.projects || []
    } : null;

    const response = await aiService.chatWithAI(messages || [], userMessage, resumeInfo);

    res.json({
      success: true,
      response
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Error in chat',
      error: error.message
    });
  }
};

export const mockTest = async (req, res) => {
  try {
    const { type, role, difficulty, company, resumeBased } = req.body;

    const user = await User.findById(req.user._id);
    
    let questions;
    
    if (resumeBased && user.resume?.parsed) {
      questions = await aiService.generateQuestions(
        role || user.preferences?.desiredRole || 'Software Engineer',
        difficulty || 'medium',
        'assessment',
        15
      );
      questions.resumeContext = user.resume.parsed;
    } else if (company) {
      questions = await aiService.generateQuestions(
        role || 'Software Engineer',
        difficulty || 'medium',
        'assessment',
        15
      );
      questions.company = company;
    } else {
      questions = await aiService.generateQuestions(
        role || 'Software Engineer',
        difficulty || 'medium',
        'assessment',
        15
      );
    }

    res.json({
      success: true,
      questions: questions.questions,
      metadata: {
        type,
        role,
        difficulty,
        company,
        resumeBased
      }
    });
  } catch (error) {
    console.error('Mock test error:', error);
    res.status(500).json({
      success: false,
      message: 'Error generating mock test',
      error: error.message
    });
  }
};

export const analyzeAnswer = async (req, res) => {
  try {
    const { question, answer, type } = req.body;

    let evaluation;
    if (type === 'coding') {
      evaluation = await aiService.evaluateCoding(question, answer.code, answer.language, []);
    } else {
      evaluation = await aiService.evaluateSubjective(question, answer);
    }

    res.json({
      success: true,
      evaluation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error analyzing answer',
      error: error.message
    });
  }
};

export const parseResume = async (req, res) => {
  try {
    const { resumeText } = req.body;

    if (!resumeText || !resumeText.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Resume text is required'
      });
    }

    const parsed = await aiService.parseResume(resumeText);

    const user = await User.findByIdAndUpdate(
      req.user._id,
      {
        'resume.uploaded': true,
        'resume.parsed': parsed
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      parsed,
      user: user.toJSON()
    });
  } catch (error) {
    console.error('Parse resume error:', error);
    res.status(500).json({
      success: false,
      message: 'Error parsing resume',
      error: error.message
    });
  }
};

export const adaptDifficulty = async (req, res) => {
  try {
    const { currentScore, difficulty, round } = req.body;

    const adaptation = await aiService.adaptDifficulty(currentScore, difficulty, round);

    res.json({
      success: true,
      adaptation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adapting difficulty',
      error: error.message
    });
  }
};

export const getInsights = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);

    const insights = {
      totalInterviews: interviews.length,
      averageScore: interviews.length > 0 
        ? Math.round(interviews.reduce((acc, i) => acc + (i.totalScore || 0), 0) / interviews.length)
        : 0,
      roundsCompleted: interviews.filter(i => i.status === 'completed').length,
      strongAreas: [],
      weakAreas: [],
      recentPerformance: interviews.slice(0, 5).map(i => ({
        date: i.createdAt,
        score: i.totalScore,
        round: i.currentRound
      }))
    };

    res.json({
      success: true,
      insights
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching insights',
      error: error.message
    });
  }
};