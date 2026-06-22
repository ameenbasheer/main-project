import { Router } from 'express';
import {
  getCrops,
  getCrop,
  createCrop,
  updateCrop,
  deleteCrop,
  addExpense,
  addSale,
  updateNote,
} from '../controllers/cropController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// All crop routes require a logged-in farmer
router.use(protect, authorize('farmer', 'admin'));

router.route('/').get(getCrops).post(createCrop);
router.route('/:id').get(getCrop).put(updateCrop).delete(deleteCrop);
router.post('/:id/expenses', addExpense);
router.post('/:id/sales', addSale);
router.put('/:id/note', updateNote);

export default router;
