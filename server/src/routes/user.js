import express from 'express';
import * as userController from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.put('/profile', protect, userController.updateProfile);
router.get('/stats', protect, userController.getStats);
router.put('/role', protect, userController.updateRole);

export default router;