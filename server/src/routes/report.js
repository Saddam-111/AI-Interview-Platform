import express from 'express';
import * as reportController from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate/:interviewId', protect, reportController.generateReport);
router.get('/:id', protect, reportController.getReport);
router.get('/', protect, reportController.getAllReports);

export default router;