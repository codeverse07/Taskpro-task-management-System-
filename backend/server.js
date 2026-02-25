const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');

// Load environment variables
dotenv.config();

// Initialize app
const app = express();
const server = http.createServer(app);

// Initialize Socket.io
const io = require('./socket').init(server);

io.on('connection', (socket) => {
    // Socket initialization logic if needed
});

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected successfully');
    } catch (err) {
        console.error('MongoDB connection error:', err.message);
        process.exit(1);
    }
};

connectDB();

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Task Management API is running');
});

// Import Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/users', require('./routes/users'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
