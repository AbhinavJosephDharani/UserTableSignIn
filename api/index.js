const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

// MongoDB connection
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.warn('MONGODB_URI is not set — skipping database connection. API endpoints that require the DB will fail until this is provided.');
      return;
    }

    if (mongoose.connection.readyState === 0) {
      // Use a short serverSelectionTimeout so serverless functions fail fast
      // instead of hanging until the platform timeout (300s).
      await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 5000
      });
      console.log('MongoDB Connected');
    }
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

// User Schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    maxlength: 50,
    trim: true
  },
  password: {
    type: String,
    required: true,
    maxlength: 100
  },
  firstname: {
    type: String,
    required: true,
    maxlength: 50,
    trim: true
  },
  lastname: {
    type: String,
    required: true,
    maxlength: 50,
    trim: true
  },
  salary: {
    type: Number,
    required: true,
    min: 0
  },
  age: {
    type: Number,
    required: true,
    min: 0,
    max: 150
  },
  registerday: {
    type: Date,
    default: Date.now
  },
  signintime: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to database
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'User Table Sign-In API is running',
    timestamp: new Date().toISOString()
  });
});

// User registration
app.post('/api/users/register', [
  body('username').isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('firstname').isLength({ min: 1, max: 50 }).withMessage('First name is required'),
  body('lastname').isLength({ min: 1, max: 50 }).withMessage('Last name is required'),
  body('salary').isNumeric().withMessage('Salary must be a number'),
  body('age').isInt({ min: 0, max: 150 }).withMessage('Age must be between 0 and 150')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, firstname, lastname, salary, age } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const user = new User({
      username,
      password,
      firstname,
      lastname,
      salary: parseFloat(salary),
      age: parseInt(age)
    });

    await user.save();

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
app.post('/api/users/signin', [
  body('username').notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    user.signintime = new Date();
    await user.save();

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
app.get('/api/users/search/name', async (req, res) => {
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
app.get('/api/users/search/userid/:username', async (req, res) => {
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
app.get('/api/users/search/salary', async (req, res) => {
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
app.get('/api/users/search/age', async (req, res) => {
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
app.get('/api/users/search/after-john', async (req, res) => {
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
app.get('/api/users/search/never-signed-in', async (req, res) => {
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
app.get('/api/users/search/same-day-as-john', async (req, res) => {
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
app.get('/api/users/search/registered-today', async (req, res) => {
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
app.get('/api/users/all', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

module.exports = serverless(app);
