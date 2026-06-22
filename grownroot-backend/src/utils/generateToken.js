import jwt from 'jsonwebtoken';

// Sign a JWT carrying the user id. Used at login/register.
export default function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}
