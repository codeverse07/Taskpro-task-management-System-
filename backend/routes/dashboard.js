const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/dashboard/admin
// @desc    Get Admin Dashboard stats
// @access  Private/Admin
router.get('/admin', protect, admin, async (req, res) => {
    try {
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ status: 'Completed' });
        const pendingTasks = await Task.countDocuments({ status: 'Pending' });
        const totalUsers = await User.countDocuments();

        res.json({
            totalTasks,
            completedTasks,
            pendingTasks,
            totalUsers,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/dashboard/employee
// @desc    Get Employee Dashboard stats
// @access  Private
router.get('/employee', protect, async (req, res) => {
    try {
        const myTasksCount = await Task.countDocuments({ assignedTo: req.user._id });
        const completedTasksCount = await Task.countDocuments({
            assignedTo: req.user._id,
            status: 'Completed',
        });
        const pendingTasksCount = await Task.countDocuments({
            assignedTo: req.user._id,
            status: 'Pending',
        });

        res.json({
            myTasksCount,
            completedTasksCount,
            pendingTasksCount,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
