const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Pool PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// API endpoint untuk mendapatkan film berdasarkan query
// app.get('/api/movies', async (req, res) => {
//   const { query } = req.query;
//   try {
//     const searchQuery = `%${query}%`;
//     const result = await pool.query(`
//       SELECT movies.id_movie, movies.title, movies.year, movies.rating, array_agg(genres.name) as genre, movies.poster, movies.trailer
//       FROM movies
//       LEFT JOIN movie_genres ON movies.id_movie = movie_genres.id_movie
//       LEFT JOIN genres ON movie_genres.id_genre = genres.id_genre
//       WHERE movies.title ILIKE $1 AND movies.status = 'approved'
//       GROUP BY movies.id_movie;
//     `, [searchQuery]);

//     res.json(result.rows);
//   } catch (err) {
//     console.error(err.message);
//     res.status(500).send('Server Error');
//   }
// });

app.get('/api/movies', async (req, res) => {
  const { query, genre, country, award, year } = req.query;

  try {
    const searchQuery = query ? `%${query}%` : '%';
    const genreFilter = genre !== 'all' ? genre : '%';
    const countryFilter = country !== 'all' ? country : '%';
    const awardFilter = award !== 'all' ? award : '%';
    const yearFilter = year !== 'all' ? year : '%';

    const result = await pool.query(`
      SELECT movies.id_movie, movies.title, movies.year, movies.rating, array_agg(genres.name) as genre, countries.name as country, movies.poster, movies.trailer
      FROM movies
      LEFT JOIN movie_genres ON movies.id_movie = movie_genres.id_movie
      LEFT JOIN genres ON movie_genres.id_genre = genres.id_genre
      LEFT JOIN countries ON movies.id_country = countries.id_country
      LEFT JOIN movie_awards ON movies.id_movie = movie_awards.id_movie
      LEFT JOIN awards ON movie_awards.id_award = awards.id_award
      WHERE movies.title ILIKE $1
      AND ($2::text = '%' OR genres.name ILIKE $2)
      AND ($3::text = '%' OR countries.name ILIKE $3)
      AND ($4::text = '%' OR awards.name ILIKE $4)
      AND ($5::text = '%' OR movies.year::text = $5)
      AND movies.status = 'approved'
      GROUP BY movies.id_movie, countries.name;
    `, [searchQuery, genreFilter, countryFilter, awardFilter, yearFilter]);

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});


app.get('/api/genres', async (req, res) => {
  try {
    const result = await pool.query('SELECT name FROM genres ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/countries', async (req, res) => {
  try {
    const result = await pool.query('SELECT name FROM countries ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

app.get('/api/awards', async (req, res) => {
  try {
    const result = await pool.query('SELECT name FROM awards ORDER BY name');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// app.post('/api/watchlist', authenticateToken, (req, res) => {
//   const { movieId } = req.body;
//   const userId = req.user.id; // ID pengguna dari token yang terautentikasi

//   const query = 'INSERT INTO watchlist (id_user, id_movie) VALUES ($1, $2)';

//   db.query(query, [userId, movieId], (error, results) => {
//       if (error) {
//           console.error('Error inserting into watchlist:', error);
//           return res.status(500).json({ message: 'Error adding movie to watchlist' });
//       }
//       res.status(200).json({ message: 'Movie added to watchlist' });
//   });
// });


// app.post('/api/movies/add', authenticateToken, (req, res) => {
//   const { title, description, genre, year, poster } = req.body;
//   const userId = req.user.id; // ID pengguna yang didapat dari token

//   // Lakukan query ke database untuk menambahkan movie
//   const query = `
//       INSERT INTO movies (title, description, genre, year, poster, user_id)
//       VALUES ($1, $2, $3, $4, $5, $6)
//   `;
//   const values = [title, description, genre, year, poster, userId];

//   db.query(query, values, (error, results) => {
//       if (error) {
//           console.error('Error adding movie:', error);
//           return res.status(500).json({ success: false, message: 'Error adding movie' });
//       }
//       res.status(201).json({ success: true, message: 'Movie added successfully' });
//   });
// });




const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
