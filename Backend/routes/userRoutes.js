const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const router = express.Router();

// User registration
router.post('/register', [
  body('username').isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstname').isLength({ min: 1, max: 50 }).withMessage('First name is required'),
  body('lastname').isLength({ min: 1, max: 50 }).withMessage('Last name is required'),
  body('salary').isNumeric().withMessage('Salary must be a number'),
  body('age').isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, firstname, lastname, salary, age } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Create new user
    const user = new User({
      username,
      password,
      firstname,
      lastname,
      salary: parseFloat(salary),
      age: parseInt(age)
    });

    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// User sign-in
router.post('/signin', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Update sign-in time
    user.signintime = new Date();
    await user.save();

    // Return user without password
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      message: 'Sign-in successful',
      user: userResponse
    });
  } catch (error) {
    console.error('Sign-in error:', error);
    res.status(500).json({ error: 'Sign-in failed' });
  }
});

// Search users by first and/or last name
router.get('/search/name', async (req, res) => {
  try {
    const { firstname, lastname } = req.query;
    
    if (!firstname && !lastname) {
      return res.status(400).json({ error: 'At least one name parameter is required' });
    }

    const query = {};
    if (firstname) query.firstname = { $regex: firstname, $options: 'i' };
    if (lastname) query.lastname = { $regex: lastname, $options: 'i' };

    const users = await User.find(query).select('-password');
    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Name search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Search users by userid (username)
router.get('/search/userid/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await User.findOne({ username }).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    console.error('User ID search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Search users by salary range
router.get('/search/salary', async (req, res) => {
  try {
    const { min, max } = req.query;
    
    if (!min || !max) {
      return res.status(400).json({ error: 'Both min and max salary parameters are required' });
    }

    const users = await User.find({
      salary: { $gte: parseFloat(min), $lte: parseFloat(max) }
    }).select('-password');

    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Salary search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Search users by age range
router.get('/search/age', async (req, res) => {
  try {
    const { min, max } = req.query;
    
    if (!min || !max) {
      return res.status(400).json({ error: 'Both min and max age parameters are required' });
    }

    const users = await User.find({
      age: { $gte: parseInt(min), $lte: parseInt(max) }
    }).select('-password');

    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Age search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Search users who registered after john registered
router.get('/search/after-john', async (req, res) => {
  try {
    const john = await User.findOne({ username: 'john' });
    if (!john) {
      return res.status(404).json({ error: 'John user not found' });
    }

    const users = await User.find({
      registerday: { $gt: john.registerday }
    }).select('-password');

    res.json({ users, count: users.length, johnRegisteredOn: john.registerday });
  } catch (error) {
    console.error('After John search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Search users who never signed in
router.get('/search/never-signed-in', async (req, res) => {
  try {
    const users = await User.find({
      signintime: null
    }).select('-password');

    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Never signed in search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Search users who registered on the same day as john
router.get('/search/same-day-as-john', async (req, res) => {
  try {
    const john = await User.findOne({ username: 'john' });
    if (!john) {
      return res.status(404).json({ error: 'John user not found' });
    }

    const startOfDay = new Date(john.registerday);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(john.registerday);
    endOfDay.setHours(23, 59, 59, 999);

    const users = await User.find({
      registerday: { $gte: startOfDay, $lte: endOfDay }
    }).select('-password');

    res.json({ users, count: users.length, johnRegisteredOn: john.registerday });
  } catch (error) {
    console.error('Same day as John search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Search users who registered today
router.get('/search/registered-today', async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    const users = await User.find({
      registerday: { $gte: startOfDay, $lte: endOfDay }
    }).select('-password');

    res.json({ users, count: users.length, date: today.toDateString() });
  } catch (error) {
    console.error('Registered today search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

// Get all users
router.get('/all', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
