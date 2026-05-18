const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Employee name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    department: {
      type: String,
      required: [true, 'Department is required'],
      enum: {
        values: ['Development', 'Design', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations', 'QA'],
        message: '{VALUE} is not a valid department',
      },
    },
    skills: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length > 0,
        message: 'At least one skill is required',
      },
    },
    performanceScore: {
      type: Number,
      required: [true, 'Performance score is required'],
      min: [0, 'Performance score cannot be less than 0'],
      max: [100, 'Performance score cannot exceed 100'],
    },
    experience: {
      type: Number,
      required: [true, 'Years of experience is required'],
      min: [0, 'Experience cannot be negative'],
    },
    aiRecommendation: {
      type: String,
      default: '',
    },
    lastRecommendationDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search
employeeSchema.index({ department: 1 });
employeeSchema.index({ performanceScore: -1 });

module.exports = mongoose.model('Employee', employeeSchema);
