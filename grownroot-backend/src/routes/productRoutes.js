import { Router } from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = Router();

// Public marketplace reads
router.get('/', getProducts);
router.get('/:id', getProduct);

// Farmer-only writes
router.post('/', protect, authorize('farmer', 'admin'), createProduct);
router.delete('/:id', protect, authorize('farmer', 'admin'), deleteProduct);

export default router;
