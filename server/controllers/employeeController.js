const Employee = require('../models/Employee');

// @desc    Get all employees
// @route   GET /api/employees
// @access  Private
const getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Search employees
// @route   GET /api/employees/search
// @access  Private
const searchEmployees = async (req, res) => {
    try {
        const { department, name, minScore } = req.query;
        let query = { createdBy: req.user.id };

        if (department) {
            query.department = new RegExp(department, 'i');
        }
        if (name) {
            query.name = new RegExp(name, 'i');
        }
        if (minScore) {
            query.performanceScore = { $gte: Number(minScore) };
        }

        const employees = await Employee.find(query).sort({ createdAt: -1 });
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add employee
// @route   POST /api/employees
// @access  Private
const addEmployee = async (req, res) => {
    try {
        const { name, email, department, skills, performanceScore, experience } = req.body;

        if (!name || !email || !department || !skills || performanceScore === undefined || experience === undefined) {
            return res.status(400).json({ message: 'Please add all required fields' });
        }
        
        // Check duplicate email
        const existingEmployee = await Employee.findOne({ email });
        if(existingEmployee) {
             return res.status(400).json({ message: 'Employee with this email already exists' });
        }

        const employee = await Employee.create({
            name,
            email,
            department,
            skills,
            performanceScore,
            experience,
            createdBy: req.user.id
        });

        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update employee
// @route   PUT /api/employees/:id
// @access  Private
const updateEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the employee creator
        if (employee.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const updatedEmployee = await Employee.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedEmployee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete employee
// @route   DELETE /api/employees/:id
// @access  Private
const deleteEmployee = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);

        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the employee creator
        if (employee.createdBy.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        await employee.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getEmployees,
    searchEmployees,
    addEmployee,
    updateEmployee,
    deleteEmployee
};
