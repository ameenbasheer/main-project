import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Crop from '../models/Crop.js';

// Strip sensitive fields before sending a user to the client (mirrors authController)
const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  avatar: u.avatar,
  status: u.status,
  createdAt: u.createdAt,
});

// GET /api/admin/stats — platform-wide counts for the dashboard
export const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, farmers, buyers, active, inactive, products] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'farmer' }),
    User.countDocuments({ role: 'buyer' }),
    User.countDocuments({ status: 'active' }),
    User.countDocuments({ status: 'inactive' }),
    Product.countDocuments(),
  ]);

  res.json({ totalUsers, farmers, buyers, active, inactive, products });
});

// GET /api/admin/users — list every user (newest first)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort('-createdAt');
  res.json(users.map(publicUser));
});

// PATCH /api/admin/users/:id/status — activate / deactivate a user
export const updateUserStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['active', 'inactive'].includes(status)) {
    res.status(400);
    throw new Error("Status must be 'active' or 'inactive'");
  }

  // An admin can't lock themselves out of the platform.
  if (req.user._id.toString() === req.params.id) {
    res.status(400);
    throw new Error('You cannot change your own status');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.status = status;
  await user.save();
  res.json(publicUser(user));
});

// DELETE /api/admin/users/:id — remove a user and their products & crops
export const deleteUser = asyncHandler(async (req, res) => {
  if (req.user._id.toString() === req.params.id) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }

  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Clean up anything the user owned so nothing is orphaned.
  await Promise.all([
    Product.deleteMany({ owner: user._id }),
    Crop.deleteMany({ owner: user._id }),
    user.deleteOne(),
  ]);

  res.json({ message: 'User deleted', id: req.params.id });
});
