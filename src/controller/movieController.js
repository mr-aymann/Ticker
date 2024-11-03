const pool = require("../config/db");

// Add a new movie
const addMovie = async (req, res) => {
  const {
    title,
    genre,
    release_date,
    duration,
    language,
    director,
    production_company,
    cast,
    synopsis,
    rating,
    poster_url,
  } = req.body;

  const query = `
    INSERT INTO movies 
    (title, genre, release_date, duration, language, director, production_company, cast, synopsis, rating, poster_url)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *;
  `;

  const values = [
    title,
    genre,
    release_date,
    duration,
    language,
    director,
    production_company,
    cast,
    synopsis,
    rating,
    poster_url,
  ];

  try {
    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding movie:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Fetch all movies
const getAllMovies = async (req, res) => {
  const query = `
      SELECT * FROM movies ORDER BY release_date DESC;
    `;

  try {
    const result = await pool.query(query);
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching movies:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get movie details by ID
const getMovieDetailsById = async (req, res) => {
  const { id } = req.params; // Get the movie ID from the URL parameter

  try {
    const query = `
        SELECT 
          m.id, 
          m.title, 
          m.genre, 
          m.release_date, 
          m.duration, 
          m.language, 
          m.director, 
          m.production_company, 
          m.synopsis, 
          m.rating, 
          m.poster_url,
          m.cover_url, 
          m.created_at,
          json_agg(
            json_build_object(
              'name', c.name, 
              'role', c.role, 
              'image_url', c.image_url
            )
          ) AS cast
        FROM movies m
        LEFT JOIN unnest(m.cast_ids) AS cast_id ON true
        LEFT JOIN crew c ON c.id = cast_id
        WHERE m.id = $1
        GROUP BY m.id;
      `;

    const { rows } = await pool.query(query, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Movie not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server error" });
  }
};



// API route for search
const search= async (req, res) => {
  const { query, type, limit = 10 } = req.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    let searchResults = [];

    if (type === 'movie' || !type) {
      const movieQuery = `
        SELECT id, title
        FROM movies
        WHERE title ILIKE $1
        LIMIT $2
      `;
      const movieResults = await pool.query(movieQuery, [`%${query}%`, limit]);
      searchResults.push(...movieResults.rows.map(row => ({ type: 'movie', ...row })));
    }

    if (type === 'theatre' || !type) {
      const theatreQuery = `
        SELECT id, name, city, state
        FROM theatres
        WHERE name ILIKE $1 OR city ILIKE $1 OR state ILIKE $1
        LIMIT $2
      `;
      const theatreResults = await pool.query(theatreQuery, [`%${query}%`, limit]);
      searchResults.push(...theatreResults.rows.map(row => ({ type: 'theatre', ...row })));
    }

    res.json(searchResults);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
}




module.exports = { getAllMovies, getMovieDetailsById, addMovie, search };
