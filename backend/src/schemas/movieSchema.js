const pool = require('../config/db');


const createMovieTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    genre VARCHAR(100),
    release_date DATE,
    duration INTEGER, -- Duration in minutes
    language VARCHAR(50),
    director VARCHAR(100),
    production_company VARCHAR(100),
    synopsis TEXT,
    rating DECIMAL(3,2), -- e.g., 8.5
    poster_url VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
;`
    try {
        await pool.query(query); 
        console.log('Movie table created or already exists.');
        //insertTheatre();
    } catch (error) {
        console.error('Error creating theaters table:', error);
    }
};






module.exports = createMovieTable;
