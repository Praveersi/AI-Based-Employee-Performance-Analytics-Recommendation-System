const Employee = require('../models/Employee');
const { validationResult } = require('express-validator');

// @desc    Add a new employee
// @route   POST /api/employees
// @access  Private
const addEmployee = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, department, skills, performanceScore, experience } = req.body;

    // Check for duplicate email
    const existing = await Employee.findOne({ email });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Employee with this email already exists' });
    }

    const employee = await Employee.create({
      name,
      email,
      department,
      skills,
      performanceScore,
      experience,
    });

    res.status(201).json({ success: true, message: 'Employee added successfully', data: employee });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
const getAllEmployees = async (req, res, next) => {
  try {
    const employees = await Employee.find().sort({ performanceScore: -1 });
    res.status(200).json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single employee by ID
// @route   GET /api/employees/:id
// @access  Private
const getEmployeeById = async (req, res, next) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, data: employee });
  } catch (error) {
    next(error);
  }
};

// @desc    Search employees by department or name
// @route   GET /api/employees/search
// @access  Private
const searchEmployees = async (req, res, next) => {
  try {
    const { department, name, minScore, maxScore } = req.query;
    const query = {};

    if (department) query.department = department;
    if (name) query.name = { $regex: name, $options: 'i' };
    if (minScore || maxScore) {
      query.performanceScore = {};
      if (minScore) query.performanceScore.$gte = Number(minScore);
      if (maxScore) query.performanceScore.$lte = Number(maxScore);
    }

    const employees = await Employee.find(query).sort({ performanceScore: -1 });
    res.status(200).json({ success: true, count: employees.length, data: employees });
  } catch (error) {
    next(error);
  }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, message: 'Employee updated successfully', data: employee });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = async (req, res, next) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ success: false, message: 'Employee not found' });
    }
    res.status(200).json({ success: true, message: 'Employee deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { addEmployee, getAllEmployees, getEmployeeById, searchEmployees, updateEmployee, deleteEmployee };
