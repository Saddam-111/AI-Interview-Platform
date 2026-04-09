import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['mcq', 'coding', 'subjective'],
    required: true
  },
  category: {
    type: String,
    enum: ['assessment', 'coding', 'core', 'hr'],
    required: true
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    required: true
  },
  question: {
    type: String,
    required: true
  },
  options: [{
    type: String
  }],
  correctAnswer: {
    type: String
  },
  code: {
    language: String,
    solution: String,
    testCases: [{
      input: String,
      expectedOutput: String
    }]
  },
  sampleAnswer: String,
  keywords: [String],
  topic: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

questionSchema.index({ category: 1, difficulty: 1 });
questionSchema.index({ topic: 1 });

export default mongoose.model('Question', questionSchema);