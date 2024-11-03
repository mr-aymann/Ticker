const express = require('express');
const { getAllMovies } = require('../controller/movieController'); // Destructure the function
const { getMovieDetailsById } = require('../controller/movieController');
const {search}=require('../controller/movieController')
const { getTheatresByShows } = require('../controller/theatreController');
const {runInsertionJob} =require('../controller/testController');


const router = express.Router();


// Route to fetch theatres based on location
router.get('/', getAllMovies); // Adjusted route to match the base route

// API route to get movie details by ID
router.get('/:id', getMovieDetailsById);

router.get('/:id/theatres', getTheatresByShows);

router.get('/search',search);

router.use('/test',runInsertionJob)

module.exports = router;