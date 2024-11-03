const pool = require('../config/db');

// Define the Theater schema

const insertTheatre = async () => {
    const query = `
    INSERT INTO theaters  (name, city, state, address, latitude, longitude)
    VALUES 
     -- Theatres in Mumbai
    ('PVR Phoenix Mills', 'Mumbai', 'Maharashtra', 'Phoenix Mills, Lower Parel', 18.9945, 72.8258),
    ('Inox Nariman Point', 'Mumbai', 'Maharashtra', 'Nariman Point, Churchgate', 18.9250, 72.8245),
    ('Cinepolis Andheri', 'Mumbai', 'Maharashtra', 'Infinity Mall, Andheri West', 19.1355, 72.8236),
    ('Carnival Cinemas Borivali', 'Mumbai', 'Maharashtra', 'Borivali East', 19.2288, 72.8540),
    ('Regal Cinema Colaba', 'Mumbai', 'Maharashtra', 'Colaba, Mumbai', 18.9215, 72.8305),
    
    -- Theatres in Delhi
    ('PVR Anupam', 'Delhi', 'Delhi', 'Saket, New Delhi', 28.5239, 77.2061),
    ('INOX Nehru Place', 'Delhi', 'Delhi', 'Nehru Place, New Delhi', 28.5495, 77.2516),
    ('PVR Plaza', 'Delhi', 'Delhi', 'Connaught Place, New Delhi', 28.6315, 77.2167),
    ('Delite Cinema', 'Delhi', 'Delhi', 'Asaf Ali Road, New Delhi', 28.6515, 77.2388),
    ('Carnival Cinemas Pitampura', 'Delhi', 'Delhi', 'Pitampura, New Delhi', 28.6938, 77.1425),

    -- Theatres in Hyderabad
    ('PVR Cinemas Kukatpally', 'Hyderabad', 'Telangana', 'Kukatpally, Hyderabad', 17.4933, 78.3997),
    ('INOX GVK One', 'Hyderabad', 'Telangana', 'GVK One Mall, Banjara Hills', 17.4235, 78.4483),
    ('Cinepolis Manjeera Mall', 'Hyderabad', 'Telangana', 'Manjeera Mall, Kukatpally', 17.4925, 78.3989),
    ('Asian Cinemas Malkajgiri', 'Hyderabad', 'Telangana', 'Malkajgiri, Hyderabad', 17.4598, 78.5232),
    ('Sensation Insomnia', 'Hyderabad', 'Telangana', 'Kachiguda, Hyderabad', 17.3850, 78.4867),

    -- Theatres in Kolkata
    ('PVR Diamond Plaza', 'Kolkata', 'West Bengal', 'Diamond Plaza Mall, Jessore Road', 22.6276, 88.4091),
    ('INOX South City', 'Kolkata', 'West Bengal', 'South City Mall, Prince Anwar Shah Road', 22.5014, 88.3632),
    ('Carnival Cinemas Salt Lake', 'Kolkata', 'West Bengal', 'Salt Lake City, Kolkata', 22.5867, 88.4185),
    ('Priya Cinema', 'Kolkata', 'West Bengal', 'Deshapriya Park, Kolkata', 22.5176, 88.3519),
    ('Star Theatre', 'Kolkata', 'West Bengal', 'Hatibagan, Kolkata', 22.6004, 88.3685);
    `;

    try {
        await pool.query(query);
        console.log('Data inserted successfully');
    } catch (error) {
        console.error('Error inserting data:', error);
    } 
};

const createTheaterTable = async () => {
    const query = `
    CREATE TABLE IF NOT EXISTS theaters (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        city VARCHAR(100) NOT NULL,
        state VARCHAR(100) NOT NULL,
        address VARCHAR(255),       
        latitude DECIMAL(9,6),
        longitude DECIMAL(9,6),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`;

    

    try {
        await pool.query(query); 
        console.log('Theaters table created or already exists.');
        //insertTheatre();
    } catch (error) {
        console.error('Error creating theaters table:', error);
    }
};


module.exports = createTheaterTable;
