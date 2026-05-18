const express = require('express');
const router = express.Router();
const {
    getEmployees,
    searchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
} = require('../controllers/employeeController');
const { protect } = require('../middleware/authMiddleware');

router.route('/').get(protect, getEmployees).post(protect, addEmployee);
router.route('/search').get(protect, searchEmployees);
router.route('/:id').put(protect, updateEmployee).delete(protect, deleteEmployee);

module.exports = router;
