const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
  addEmployee,
  getAllEmployees,
  getEmployeeById,
  searchEmployees,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

// Validation rules
const employeeValidation = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2 }),
  body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('department')
    .notEmpty()
    .withMessage('Department is required')
    .isIn(['Development', 'Design', 'Marketing', 'HR', 'Finance', 'Sales', 'Operations', 'QA'])
    .withMessage('Invalid department'),
  body('skills').isArray({ min: 1 }).withMessage('At least one skill is required'),
  body('performanceScore')
    .isNumeric()
    .withMessage('Performance score must be a number')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Score must be between 0 and 100'),
  body('experience')
    .isNumeric()
    .withMessage('Experience must be a number')
    .isFloat({ min: 0 })
    .withMessage('Experience cannot be negative'),
];

router.get('/search', protect, searchEmployees);
router.get('/', protect, getAllEmployees);
router.get('/:id', protect, getEmployeeById);
router.post('/', protect, employeeValidation, addEmployee);
router.put('/:id', protect, updateEmployee);
router.delete('/:id', protect, deleteEmployee);

module.exports = router;
