const express = require('express');
const router = express.Router();
const User = require('../models/user'); // adjust path

// ------------------
// Register
// POST /auth/register
// body: { username, email, password }
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if email exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already exists' });

    const newUser = new User({ username, email, password });
    await newUser.save();

    res.json({ success: true, user: { _id: newUser._id, username, email } });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ------------------
// Login
// POST /auth/login
// body: { email, password }
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Simple password check (no hashing)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    res.json({ success: true, user: { _id: user._id, username: user.username, email: user.email } });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;



