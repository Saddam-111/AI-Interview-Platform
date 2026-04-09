import express from 'express';
import * as aiController from '../controllers/aiController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/chat', protect, aiController.chat);
router.post('/mock-test', protect, aiController.mockTest);
router.post('/analyze-answer', protect, aiController.analyzeAnswer);
router.post('/resume-parse', protect, aiController.parseResume);
router.post('/difficulty-adapt', protect, aiController.adaptDifficulty);
router.get('/insights', protect, aiController.getInsights);

export default router;