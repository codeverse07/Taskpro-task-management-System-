const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// @route   GET /api/users/employees
// @desc    Get all users with 'Employee' role for assigning tasks
// @access  Private/Admin
router.get('/employees', protect, admin, async (req, res) => {
    try {
        const employees = await User.find({ role: 'Employee' }).select('-password');
        res.json(employees);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/users/profile
// @desc    Update user profile (Name and Phone only)
// @access  Private
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
            // Email is explicitly excluded from being changed here

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role,
                phone: updatedUser.phone,
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/users/password
// @desc    Update user password
// @access  Private
router.put('/password', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            if (req.body.password) {
                user.password = req.body.password;
                await user.save();
                res.json({ message: 'Password updated successfully' });
            } else {
                res.status(400).json({ message: 'Password is required' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
