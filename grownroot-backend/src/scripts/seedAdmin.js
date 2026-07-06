import 'dotenv/config';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

// Create (or promote) an admin account so the admin dashboard is reachable.
// Reads ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD from the environment.
//   npm run seed:admin
async function seedAdmin() {
  const name = process.env.ADMIN_NAME || 'Admin';
  const email = (process.env.ADMIN_EMAIL || 'admin@grownroot.com').toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'Admin@123';

  await connectDB();

  let user = await User.findOne({ email });
  if (user) {
    // Promote an existing account and make sure it's active.
    user.role = 'admin';
    user.status = 'active';
    await user.save();
    console.log(`Promoted existing user to admin: ${email}`);
  } else {
    user = await User.create({ name, email, password, role: 'admin', status: 'active' });
    console.log(`Created admin: ${email} (password: ${password})`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

seedAdmin().catch((err) => {
  console.error('Failed to seed admin:', err.message);
  process.exit(1);
});
