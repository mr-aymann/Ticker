const pool = require('../config/db');

// Fetch theatres by location (city/state)
const getTheatresByLocation = async (req, res) => {
  const { city, state } = req.query;

  // Validate input
  if (!city && !state) {
    return res.status(400).json({ error: 'City or state is required' });
  }

  try {
    // Create dynamic query based on provided parameters
    const queryParams = [];
    let query = `
      SELECT id, name, city, state, address, latitude, longitude, created_at
      FROM theaters 
      WHERE 1=1`; // Start with a base condition

    if (city) {
      queryParams.push(city);
      query += ` AND city = $${queryParams.length}`;
    }

    if (state) {
      queryParams.push(state);
      query += ` AND state = $${queryParams.length}`;
    }

    // Execute the query
    const result = await pool.query(query, queryParams);

    // Check if any theatres are found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No theatres found for the given location' });
    }

    // Return the theatres
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching theatres:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getShowsByTheatre=async (req, res) => {
  const { tid, date } = req.query;

  // Validate input
  if (!tid || !date) {
    return res.status(400).json({ error: 'Theatre ID and date are required' });
  }

  try {
    // Prepare the query
    const query = `
      SELECT 
        s.show_id,
        s.screen_number,
        s.id AS screen_id,
        t.name AS theater_name,
        m.title AS movie_title,
        sl.slot_time AS slot,
        s.date,
        s.available_capacity,
        s.total_capacity,
        s.is_active,
        s.created_at,
        s.updated_at
      FROM 
        screen s
      JOIN 
        theaters t ON s.theater_id = t.id
      JOIN 
        movies m ON s.movie_id = m.id
      JOIN 
        slots sl ON s.slot_id = sl.id   -- Added join to slots table

      WHERE 
        s.theater_id = $1 AND s.date = $2
      ORDER BY 
        s.screen_number, s.theater_id, sl.slot_time;
    `;

    // Execute the query
    const result = await pool.query(query, [tid, date]);

    // Handle no shows found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'No shows found for the given theatre and date' });
    }

    // Return the result
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('Error fetching shows:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getTheatresByShows = async(req, res, next) => {
  const { id } = req.params;
  const { city, state, date } = req.query;

  console.log("Input parameters:", { id, city, state, date });
  
  try {
      const result = await pool.query(`
          SELECT 
              t.id AS theater_id,
              t.name AS theater_name,
              t.city,
              t.state,
              t.address,
              s.show_id,
              s.slot_id,
              s.show_time,
              s.date,
              s.available_capacity,
              s.total_capacity,
              s.screen_number,
              s.is_active
          FROM 
              screen s
          JOIN 
              theaters t ON s.theater_id = t.id
          WHERE 
              s.movie_id = $1 
              AND (t.city ILIKE $2 OR t.state ILIKE $3) 
              AND s.date = $4
          ORDER BY 
              t.id, s.show_time;
      `, [id, city, state, date]);

      console.log("Raw query results:", result.rows.length, "rows found");
      console.log("Unique theater IDs in results:", 
          [...new Set(result.rows.map(row => row.theater_id))]);

      const theatresMap = new Map();

      if (result.rows.length === 0) {
          return res.status(400).json({ message: "No theatres or shows found for the given parameters" });
      }

      result.rows.forEach((row, index) => {
          const { 
              theater_id, theater_name, city, state, address, 
              show_id, show_time, date, available_capacity, 
              total_capacity, screen_number, is_active, slot_id
          } = row;

          console.log(`Processing row ${index + 1}, theater_id: ${theater_id}`);
          
          if (!theatresMap.has(theater_id)) {
              console.log(`Creating new entry for theater ${theater_id}`);
              theatresMap.set(theater_id, {
                  theater_id,
                  theater_name,
                  city,
                  state,
                  address,
                  shows: []
              });
          }

          // Add show details to the theatre's shows array
          theatresMap.get(theater_id).shows.push({
              show_id,
              show_time,
              slot_id,
              date,
              available_capacity,
              total_capacity,
              screen_number,
              is_active
          });

          console.log(`Theater ${theater_id} now has ${theatresMap.get(theater_id).shows.length} shows`);
      });

      // Debug Map contents
      console.log("Theatres in Map:", Array.from(theatresMap.keys()));
      
      // Convert the Map to an array of theatres
      const theatres = Array.from(theatresMap.values());
      console.log("Final theatres array length:", theatres.length);
      console.log("Shows per theatre:", theatres.map(t => ({
          theater_id: t.theater_id,
          show_count: t.shows.length
      })));

      return res.status(200).json({ 
          theatres,
          debug: {
              totalRows: result.rows.length,
              uniqueTheatres: theatres.length,
              showCounts: theatres.map(t => ({
                  theater_id: t.theater_id,
                  shows: t.shows.length
              }))
          }
      });

  } catch (error) {
      console.error('Error fetching theatres and shows:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
  }
};





// Correct export
module.exports = { getTheatresByLocation, getShowsByTheatre ,getTheatresByShows };
