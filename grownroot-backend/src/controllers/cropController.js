import asyncHandler from '../utils/asyncHandler.js';
import Crop from '../models/Crop.js';

// Fetch a crop owned by the current user, or 404
async function findOwnedCrop(id, userId, res) {
  const crop = await Crop.findById(id);
  if (!crop) {
    res.status(404);
    throw new Error('Crop not found');
  }
  if (crop.owner.toString() !== userId.toString()) {
    res.status(403);
    throw new Error('Not your crop');
  }
  return crop;
}

// GET /api/crops — crops belonging to the logged-in farmer
export const getCrops = asyncHandler(async (req, res) => {
  const crops = await Crop.find({ owner: req.user._id }).sort('-createdAt');
  res.json(crops);
});

// GET /api/crops/:id
export const getCrop = asyncHandler(async (req, res) => {
  const crop = await findOwnedCrop(req.params.id, req.user._id, res);
  res.json(crop);
});

// POST /api/crops
export const createCrop = asyncHandler(async (req, res) => {
  const crop = await Crop.create({ ...req.body, owner: req.user._id });
  res.status(201).json(crop);
});

// PUT /api/crops/:id
export const updateCrop = asyncHandler(async (req, res) => {
  const crop = await findOwnedCrop(req.params.id, req.user._id, res);
  // owner cannot be reassigned via the body
  delete req.body.owner;
  Object.assign(crop, req.body);
  await crop.save();
  res.json(crop);
});

// DELETE /api/crops/:id
export const deleteCrop = asyncHandler(async (req, res) => {
  const crop = await findOwnedCrop(req.params.id, req.user._id, res);
  await crop.deleteOne();
  res.json({ message: 'Crop deleted', id: req.params.id });
});

// POST /api/crops/:id/expenses
export const addExpense = asyncHandler(async (req, res) => {
  const crop = await findOwnedCrop(req.params.id, req.user._id, res);
  crop.expenses.push(req.body);
  await crop.save();
  res.status(201).json(crop);
});

// POST /api/crops/:id/sales
export const addSale = asyncHandler(async (req, res) => {
  const crop = await findOwnedCrop(req.params.id, req.user._id, res);
  crop.sales.push(req.body);
  await crop.save();
  res.status(201).json(crop);
});

// PUT /api/crops/:id/note
export const updateNote = asyncHandler(async (req, res) => {
  const crop = await findOwnedCrop(req.params.id, req.user._id, res);
  crop.notes = req.body.note ?? '';
  await crop.save();
  res.json(crop);
});
