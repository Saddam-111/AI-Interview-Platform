import Interview from '../models/Interview.js';
import Question from '../models/Question.js';
import aiService from '../services/aiService.js';

export const startInterview = async (req, res) => {
  try {
    const { type, stream, difficulty = 'medium' } = req.body;

    const interview = await Interview.create({
      userId: req.user._id,
      type,
      stream,
      difficulty,
      status: 'in_progress',
      currentRound: 'assessment',
      startTime: new Date()
    });

    res.json({
      success: true,
      interview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error starting interview',
      error: error.message
    });
  }
};

export const getQuestions = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found or unauthorized'
      });
    }

    const category = interview.currentRound;
    const difficulty = interview.difficulty;
    let count = category === 'assessment' ? 15 : category === 'coding' ? 3 : 10;

    let questions;
    const aiQuestions = await aiService.generateQuestions(
      interview.type,
      difficulty,
      category,
      count
    );
    
    if (aiQuestions.questions && aiQuestions.questions.length > 0) {
      const savedQuestions = await Question.insertMany(
        aiQuestions.questions.map(q => ({
          ...q,
          category,
          type: category === 'assessment' ? 'mcq' : category === 'coding' ? 'coding' : 'subjective'
        }))
      );
      questions = savedQuestions;
    } else {
      questions = await Question.aggregate([
        { $match: { category, difficulty } },
        { $sample: { size: count } }
      ]);
    }

    res.json({
      success: true,
      questions,
      round: category
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching questions',
      error: error.message
    });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    const { questionId, answer } = req.body;

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found or unauthorized'
      });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const round = interview.currentRound;

    if (round === 'assessment') {
      const isCorrect = answer === question.correctAnswer;
      const scoreIncrement = isCorrect ? (100 / 15) : 0;

      interview.rounds.assessment.questions.push({
        questionId,
        question: question.question,
        options: question.options,
        userAnswer: answer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        timeSpent: req.body.timeSpent || 0
      });

      interview.rounds.assessment.score += scoreIncrement;
      await interview.save();
    }

    res.json({
      success: true,
      isCorrect: round === 'assessment' ? answer === question.correctAnswer : null,
      score: interview.rounds.assessment.score
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting answer',
      error: error.message
    });
  }
};

export const submitCode = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    const { questionId, code, language, output } = req.body;

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found or unauthorized' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const evaluation = await aiService.evaluateCoding(
      question.question,
      code,
      language,
      question.code?.testCases || []
    );

    interview.rounds.coding.questions.push({
      questionId,
      question: question.question,
      language,
      code,
      output,
      status: 'evaluated',
      score: evaluation.score,
      timeSpent: req.body.timeSpent || 0
    });

    const codingSum = interview.rounds.coding.questions.reduce((acc, q) => acc + (q.score || 0), 0);
    const assessmentScore = interview.rounds.assessment?.score || 0;
    const coreQuestions = interview.rounds.core?.questions || [];
    const hrQuestions = interview.rounds.hr?.questions || 0;
    const coreSum = coreQuestions.reduce((acc, q) => acc + (q.aiEvaluation?.score || 0), 0);
    const hrSum = hrQuestions.reduce((acc, q) => acc + (q.aiEvaluation?.score || 0), 0);
    interview.totalScore = assessmentScore + codingSum + coreSum + hrSum;

    await interview.save();

    res.json({
      success: true,
      evaluation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting code',
      error: error.message
    });
  }
};

export const submitSubjective = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    const { questionId, answer } = req.body;

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found or unauthorized' });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    const round = interview.currentRound;
    let evaluation;
    if (round === 'core' || round === 'hr') {
      evaluation = await aiService.evaluateSubjective(question.question, answer);
    }

    const answerData = {
      questionId,
      question: question.question,
      answer,
      aiEvaluation: evaluation,
      timeSpent: req.body.timeSpent || 0
    };

    if (round === 'core') {
      interview.rounds.core.questions.push(answerData);
    } else if (round === 'hr') {
      interview.rounds.hr.questions.push(answerData);
    }

    await interview.save();

    res.json({
      success: true,
      evaluation
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error submitting answer',
      error: error.message
    });
  }
};

export const nextRound = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found or unauthorized'
      });
    }

    const roundOrder = interview.type === 'cse' 
      ? ['assessment', 'coding', 'hr']
      : ['assessment', 'core', 'hr'];

    const currentIndex = roundOrder.indexOf(interview.currentRound);
    
    if (currentIndex < roundOrder.length - 1) {
      interview.currentRound = roundOrder[currentIndex + 1];
    } else {
      interview.currentRound = 'completed';
      interview.status = 'completed';
      interview.endTime = new Date();
      interview.timeSpent = Math.floor(
        (interview.endTime - interview.startTime) / 1000
      );
    }

    const assessmentScore = interview.rounds.assessment?.score || 0;
    
    const codingQuestions = interview.rounds.coding?.questions || [];
    const codingScore = codingQuestions.length > 0
      ? codingQuestions.reduce((acc, q) => acc + (q.score || 0), 0) / codingQuestions.length
      : 0;
    
    const coreQuestions = interview.rounds.core?.questions || [];
    const coreScore = coreQuestions.length > 0
      ? coreQuestions.reduce((acc, q) => acc + (q.aiEvaluation?.score || 0), 0) / coreQuestions.length
      : 0;
    
    const hrQuestions = interview.rounds.hr?.questions || [];
    const hrScore = hrQuestions.length > 0
      ? hrQuestions.reduce((acc, q) => acc + (q.aiEvaluation?.score || 0), 0) / hrQuestions.length
      : 0;

    interview.totalScore = (assessmentScore + codingScore + coreScore + hrScore) / 4;

    await interview.save();

    res.json({
      success: true,
      interview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error moving to next round',
      error: error.message
    });
  }
};

export const getInterview = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id })
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

    res.json({
      success: true,
      interview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching interview',
      error: error.message
    });
  }
};

export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      interviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching interviews',
      error: error.message
    });
  }
};

export const logBehavior = async (req, res) => {
  try {
    const interview = await Interview.findOne({ _id: req.params.id, userId: req.user._id });
    const { event, details } = req.body;

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview not found or unauthorized' });
    }

    interview.behaviorData.push({
      event,
      timestamp: new Date(),
      details
    });

    await interview.save();

    res.json({
      success: true
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging behavior',
      error: error.message
    });
  }
};