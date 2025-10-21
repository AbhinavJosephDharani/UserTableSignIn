const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

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
    maxlength: 100 // Increased for hashed passwords
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

module.exports = mongoose.model('User', userSchema);
