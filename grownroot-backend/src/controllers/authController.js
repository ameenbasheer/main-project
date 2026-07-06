import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/User.js';

// Strip sensitive fields before sending a user to the client
const publicUser = (u) => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role,
  avatar: u.avatar,
  status: u.status,
  farmerProfile: u.farmerProfile,
});

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('Email already registered');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role === 'buyer' || role === 'admin' ? role : 'farmer',
  });

  res.status(201).json({
    user: publicUser(user),
    token: generateToken(user._id),
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  if (user.status === 'inactive') {
    res.status(403);
    throw new Error('Your account has been deactivated. Please contact support.');
  }

  res.json({
    user: publicUser(user),
    token: generateToken(user._id),
  });
});

// GET /api/auth/me  (protected)
export const getMe = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

// PUT /api/auth/profile  (protected) — update farmer profile / basic fields
export const updateProfile = asyncHandler(async (req, res) => {
  const user = req.user;
  const { name, avatar, farmerProfile } = req.body;

  if (name !== undefined) user.name = name;
  if (avatar !== undefined) user.avatar = avatar;
  if (farmerProfile) {
    user.farmerProfile = { ...user.farmerProfile.toObject(), ...farmerProfile };
  }

  await user.save();
  res.json({ user: publicUser(user) });
});
