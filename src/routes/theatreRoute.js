const express = require('express');
const { getTheatresByLocation,getShowsByTheatre } = require('../controller/theatreController'); // Destructure the function

const {getSeatLayoutByTheatre}=require('../controller/seatController')

const router = express.Router();

// Route to fetch theatres based on location
router.get('/', getTheatresByLocation);

router.get('/show', getShowsByTheatre);

router.get('/layout', getSeatLayoutByTheatre);

// Adjusted route to match the base route

module.exports = router;
