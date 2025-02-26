const express = require('express');
const theatreRoute = require('./routes/theatreRoute');
const movieRoute = require('./routes/movieRoute');
const seatRoute = require('./routes/seatRoute');
const authRoute = require('./routes/authRoute');
const cronRoute= require('./routes/cronRoute');
const initSchemas = require('./schemas/index');
const bodyParser = require("body-parser");
const {authenticateToken} = require('./middleware/auth'); // Middleware to authenticate routes


require('dotenv').config();
const cors = require("cors");

const app = express();

// Initialize the database schemas
initSchemas()
    .then(() => {
        console.log('Database schemas initialized');
    })
    .catch(err => {
        console.error('Error initializing schemas', err);
    });

// Middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(express.json());
app.use(cors());

// Public Routes (Authentication)
app.use('/auth', authRoute);



// Protected Routes (Require Authentication)
app.use('/api/theatre', theatreRoute); // Protected theatre routes
app.use('/api/movies', movieRoute);    // Protected movie routes
app.use('/api/seat-booking', authenticateToken,seatRoute);       // Protected booking routes
// Cron Job Route
app.use('/api', cronRoute); // Use the cron route

// Test Route
app.use('/api', (req, res) => {
    res.send('app.js is working');
});



module.exports = app;
