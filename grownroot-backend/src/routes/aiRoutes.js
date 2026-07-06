import { Router } from 'express';
import { dailyPlan, suggestCrops, diagnose, chat, weatherAdvice } from '../controllers/aiController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// All AI routes require a logged-in farmer (or admin).
router.use(protect, authorize('farmer', 'admin'));

router.post('/daily-plan', dailyPlan);
router.post('/suggest-crops', suggestCrops);
router.post('/weather-advice', weatherAdvice);
router.post('/diagnose', diagnose);
router.post('/chat', chat);

export default router;
