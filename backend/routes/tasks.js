const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const { protect, admin } = require('../middleware/auth');
const { getIo } = require('../socket');

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    const { title, description, priority, deadline, assignedTo } = req.body;

    try {
        const task = await Task.create({
            title,
            description,
            priority,
            deadline,
            assignedTo: assignedTo || null,
            createdBy: req.user._id,
        });

        res.status(201).json(task);
        // Emit event to all connected clients
        getIo().emit('taskCreated', task);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/tasks
// @desc    Get all tasks
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const tasks = await Task.find({}).populate('assignedTo', 'name email').populate('createdBy', 'name');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/tasks/my-tasks
// @desc    Get tasks assigned to logged in user (employee)
// @access  Private
router.get('/my-tasks', protect, async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id }).populate('createdBy', 'name');
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task (Admin)
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    const { title, description, priority, deadline, assignedTo, status } = req.body;

    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            task.title = title || task.title;
            task.description = description || task.description;
            task.priority = priority || task.priority;
            task.deadline = deadline || task.deadline;
            task.assignedTo = assignedTo || task.assignedTo;
            task.status = status || task.status;

            const updatedTask = await task.save();
            res.json(updatedTask);
            getIo().emit('taskUpdated', updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task (Admin)
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            await task.deleteOne();
            res.json({ message: 'Task removed' });
            getIo().emit('taskDeleted', req.params.id);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PATCH /api/tasks/:id/status
// @desc    Update task status (Employee)
// @access  Private
router.patch('/:id/status', protect, async (req, res) => {
    const { status } = req.body;

    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            // Check if task is assigned to the current user or if the user is an admin
            if (task.assignedTo.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
                return res.status(403).json({ message: 'Not authorized to update this task' });
            }

            task.status = status;
            const updatedTask = await task.save();
            res.json(updatedTask);
            getIo().emit('taskUpdated', updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
