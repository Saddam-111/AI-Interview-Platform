import express from 'express';
import * as interviewController from '../controllers/interviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/start', protect, interviewController.startInterview);
router.get('/:id/questions', protect, interviewController.getQuestions);
router.post('/:id/answer', protect, interviewController.submitAnswer);
router.post('/:id/code', protect, interviewController.submitCode);
router.post('/:id/subjective', protect, interviewController.submitSubjective);
router.post('/:id/next-round', protect, interviewController.nextRound);
router.get('/:id', protect, interviewController.getInterview);
router.get('/', protect, interviewController.getAllInterviews);
router.post('/:id/behavior', protect, interviewController.logBehavior);

export default router;