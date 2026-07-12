import asyncHandler from '../utils/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import User from '../models/User.js';
import { sendOtpEmail } from '../services/emailService.js';

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

  const otpCode = String(Math.floor(100000 + Math.random() * 900000));
  const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

  const user = await User.create({
    name,
    email,
    password,
    status: 'inactive',
    otpCode,
    otpExpires,
    role: role === 'buyer' || role === 'admin' ? role : 'farmer',
  });

  try {
    await sendOtpEmail(email, otpCode);
  } catch (err) {
    await User.findByIdAndDelete(user._id);
    res.status(err.status || 500);
    throw new Error(`Failed to send verification email: ${err.message}`);
  }

  res.status(201).json({
    email: user.email,
    message: 'Verification code sent to your email. Please enter it to complete registration.',
  });
});

// POST /api/auth/verify-otp
export const verifyOtp = asyncHandler(async (req, res) => {
  const { email, otpCode } = req.body;

  if (!email || !otpCode) {
    res.status(400);
    throw new Error('Email and OTP code are required');
  }

  const user = await User.findOne({ email }).select('+otpCode +otpExpires');
  if (!user) {
    res.status(404);
    throw new Error('No account found for that email');
  }

  if (!user.otpCode || !user.otpExpires || user.otpExpires < new Date()) {
    res.status(400);
    throw new Error('OTP code has expired. Please request a new one.');
  }

  if (user.otpCode !== otpCode.trim()) {
    res.status(400);
    throw new Error('Invalid OTP code');
  }

  user.status = 'active';
  user.otpCode = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.json({
    user: publicUser(user),
    token: generateToken(user._id),
  });
});

// POST /api/auth/resend-otp
export const resendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    res.status(400);
    throw new Error('Email is required to resend OTP');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('No account found for that email');
  }

  if (user.status === 'active') {
    res.status(400);
    throw new Error('This account is already verified. Please log in.');
  }

  const otpCode = String(Math.floor(100000 + Math.random() * 900000));
  const otpExpires = new Date(Date.now() + 15 * 60 * 1000);

  user.otpCode = otpCode;
  user.otpExpires = otpExpires;
  await user.save();

  await sendOtpEmail(email, otpCode);

  res.json({
    email: user.email,
    message: 'A new verification code has been sent to your email.',
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
