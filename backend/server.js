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
app.get('/api/movies', async (req, res) => {
  const { query } = req.query;
  try {
    const searchQuery = `%${query}%`;
    const result = await pool.query(`
      SELECT movies.id_movie, movies.title, movies.year, movies.rating, array_agg(genres.name) as genre, movies.poster, movies.trailer
      FROM movies
      LEFT JOIN movie_genres ON movies.id_movie = movie_genres.id_movie
      LEFT JOIN genres ON movie_genres.id_genre = genres.id_genre
      WHERE movies.title ILIKE $1 AND movies.status = 'approved'
      GROUP BY movies.id_movie;
    `, [searchQuery]);

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

app.get('/api/movies/title/:title', async (req, res) => {
  const { title } = req.params;
  try {
      const result = await pool.query(
        `SELECT movies.id_movie, movies.synopsis, movies.alt_title, movies.title, movies.year, movies.rating, 
         array_agg(genres.name) as genres, movies.poster, movies.trailer
         FROM movies
         LEFT JOIN movie_genres ON movies.id_movie = movie_genres.id_movie
         LEFT JOIN genres ON movie_genres.id_genre = genres.id_genre
         WHERE movies.title ILIKE $1 AND movies.status = 'approved'
         GROUP BY movies.id_movie`, 
        [title]
      );
<<<<<<< HEAD
      console.log(result.rows); // Cek apakah data yang dikembalikan benar
      res.json(result.rows[0]); 
=======

      if (result.rows.length > 0) {
          res.json(result.rows[0]);  // Jika ada film yang ditemukan, kirimkan hasilnya
      } else {
          res.status(404).json({ message: 'Film tidak ditemukan' });  // Jika tidak ada film, kirimkan 404
      }
>>>>>>> 06f4256 (display actors from db and add comments feature)
  } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
  }
});

<<<<<<< HEAD
=======
app.get('/api/movies/:id_movie/actors', async (req, res) => {
  const { id_movie } = req.params;
  try {
    const result = await pool.query(
      `SELECT actors.name, actors.photo
       FROM actors
       JOIN movie_actors ON actors.id_actor = movie_actors.id_actor
       WHERE movie_actors.id_movie = $1`, [id_movie]
    );
    console.log(result.rows); // Cek apakah data yang dikembalikan benar
    
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Endpoint untuk menambah komentar
app.post('/api/comments', async (req, res) => {
  const { comment, rate, id_movie } = req.body;

  // Dummy data: User Alice digunakan sebagai pengguna yang memberikan komentar
  const dummyUsername = 'alice';

  try {
    // Cari ID user berdasarkan username
    const userResult = await pool.query('SELECT id_user FROM users WHERE username = $1', [dummyUsername]);
    
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const id_user = userResult.rows[0].id_user;

    // Simpan komentar di database
    const insertCommentQuery = `
      INSERT INTO comments (comment, rate, id_movie, id_user, status)
      VALUES ($1, $2, $3, $4, 'approved')
      RETURNING *;
    `;
    const result = await pool.query(insertCommentQuery, [comment, rate, id_movie, id_user]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error adding comment:', err.message);
    res.status(500).json({ message: 'Error adding comment' });
  }
});

// Endpoint untuk mengambil komentar berdasarkan film
app.get('/api/movies/:id_movie/comments', async (req, res) => {
  const { id_movie } = req.params;

  try {
    const result = await pool.query(`
      SELECT comments.comment, comments.rate, users.username
      FROM comments
      JOIN users ON comments.id_user = users.id_user
      WHERE comments.id_movie = $1 AND comments.status = 'approved'
    `, [id_movie]);

    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching comments:', err.message);
    res.status(500).json({ message: 'Error fetching comments' });
  }
});
>>>>>>> 06f4256 (display actors from db and add comments feature)

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
