import asyncHandler from '../utils/asyncHandler.js';
import Product from '../models/Product.js';

// GET /api/products — public marketplace listing (supports ?category= & ?search=)
export const getProducts = asyncHandler(async (req, res) => {
  const filter = {};
  if (req.query.category) filter.category = req.query.category;
  if (req.query.search) filter.name = { $regex: req.query.search, $options: 'i' };

  const products = await Product.find(filter).sort('-createdAt');
  res.json(products);
});

// GET /api/products/:id — public
export const getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json(product);
});

// POST /api/products — farmer only
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create({
    ...req.body,
    owner: req.user._id,
    farmer: req.body.farmer || req.user.name,
  });
  res.status(201).json(product);
});

// DELETE /api/products/:id — owner, or an admin moderating the marketplace
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  const isOwner = product.owner.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not your product');
  }
  await product.deleteOne();
  res.json({ message: 'Product deleted', id: req.params.id });
});
