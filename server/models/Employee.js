const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    department: {
        type: String,
        required: [true, 'Please add a department']
    },
    skills: {
        type: [String],
        required: [true, 'Please add skills']
    },
    performanceScore: {
        type: Number,
        required: [true, 'Please add a performance score'],
        min: [0, 'Performance score must be at least 0'],
        max: [100, 'Performance score cannot exceed 100']
    },
    experience: {
        type: Number,
        required: [true, 'Please add years of experience']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Employee', employeeSchema);
