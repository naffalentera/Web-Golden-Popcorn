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

const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;


// Register ---------------------------------------------------------------------------------------------------------------------//
// Function to send email
const sendVerificationEmail = (user, token) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from:{
      name: 'Golden Popcorn',
      address: process.env.EMAIL_USER,
    }, 
    to: user.email,
    subject: 'Email Verification',
    text: `Please verify your email by clicking on the link: ${process.env.CLIENT_URL}/verify-email?token=${token}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Register route
app.post('/api/register', [
  check('username').isLength({ min: 5 }).withMessage('Username must be at least 3 characters long'),
  check('email').isEmail().withMessage('Please enter a valid email'),
  check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/\d/).withMessage('Password must contain at least one number')
    .matches(/\W/).withMessage('Password must contain at least one special character'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, password } = req.body;

  try {
    // Cek apakah email sudah terdaftar
    const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Buat token verifikasi email
    const emailVerificationToken = crypto.randomBytes(20).toString('hex');

    // Simpan user ke database
    const newUser = await pool.query(
      `INSERT INTO users (username, email, password, email_verification_token) 
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [username, email, hashedPassword, emailVerificationToken]
    );

    // Kirim email verifikasi
    sendVerificationEmail(newUser.rows[0], emailVerificationToken);

    res.status(201).json({ success: true, message: 'User registered successfully. Please verify your email.' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/verify-email', async (req, res) => {
  const { token } = req.query;

  if (!token) {
    console.log('Token is missing');
    return res.status(400).json({ success: false, message: 'Token tidak valid' });
  }

  try {
    console.log('Token received:', token);
    const result = await pool.query('SELECT * FROM users WHERE email_verification_token = $1', [token]);

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Token tidak valid atau sudah kedaluwarsa.' });
    }

    await pool.query('UPDATE users SET is_email_verified = true, email_verification_token = NULL WHERE email_verification_token = $1', [token]);

    res.json({ success: true, message: 'Email berhasil diverifikasi!' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Log in ------------------------------------------------------------------------------------------------------------------------------------------------------- //
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  // Validasi request
  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  try {
    // Cari pengguna berdasarkan username
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

    if (result.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    const user = result.rows[0];

    // Cek apakah password cocok dengan hashed password di database
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid username or password' });
    }

    // Buat JWT token jika login berhasil
    const token = jwt.sign({ id: user.id_user, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Kirim token dan role pengguna ke frontend
    res.json({ success: true, token, role: user.role });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Login Google ----------------------------------------------------------------------------------------------------------------------------------------------------- //
app.use(session({
  secret: 'my_super_secret_key', 
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

// Google OAuth strategy configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID, // Client ID dari Google
  clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Client Secret dari Google
  callbackURL: 'http://localhost:5000/auth/google/callback' // URL yang akan digunakan setelah login berhasil
},
async (token, tokenSecret, profile, done) => {
  try {
    // Lihat apakah pengguna sudah ada di database berdasarkan Google ID
    const result = await pool.query('SELECT * FROM users WHERE oauth_uid = $1', [profile.id]);

    if (result.rows.length > 0) {
      // Jika pengguna sudah ada, lanjutkan login
      return done(null, result.rows[0]);
    } else {
      // Jika pengguna belum ada, simpan ke database
      const newUser = await pool.query(
        `INSERT INTO users (username, email, oauth_provider, oauth_uid, is_email_verified)
        VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [profile.displayName, profile.emails[0].value, 'google', profile.id, true]
      );

      // Setelah berhasil menyimpan, lanjutkan login
      return done(null, newUser.rows[0]);
    }
  } catch (error) {
    return done(error, null);
  }
}));

// Passport session setup
passport.serializeUser((user, done) => {
  done(null, user.id_user);
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id_user = $1', [id]);
    done(null, result.rows[0]);
  } catch (error) {
    done(error, null);
  }
});

// Memulai proses login dengan Google
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Menangani callback setelah login Google berhasil
app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    const { id_user, role } = req.user;

    // Buat JWT token dengan payload yang berisi id_user dan role
    const token = jwt.sign({ id: id_user, role: role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.redirect(`http://localhost:3000/home?token=${token}`);
  }
);

// Forget password ------------------------------------------------------------------------------------------------------------------------------------------------------- //
app.post('/api/forgot-password', async (req, res) => {
  const { email } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Email not found' });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour from now

    // Save token to database
    await pool.query('UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE email = $3', 
      [resetPasswordToken, resetPasswordExpires, email]);

    // Send email with reset link
    const resetURL = `http://localhost:3000/reset-password?token=${resetToken}&email=${email}`;
    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. 
                     Please click on the following link, or paste this into your browser to complete the process: ${resetURL}`;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        
      },
    });


    await transporter.sendMail({
      from:{
        name: 'Golden Popcorn',
        address: process.env.EMAIL_USER,
      }, 
      to: email,
      subject: 'Password Reset',
      text: message,
    });

    res.json({ success: true, message: 'Reset link sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.get('/api/reset-password', (req, res) => {
  // Render or send the reset password page to the user
  res.redirect(`http://localhost:3000/reset-password`);
});

app.post('/api/reset-password', async (req, res) => {
  const { token, email, newPassword } = req.body;

  try {
    const user = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (user.rows.length === 0) {
      return res.status(400).json({ success: false, message: 'Invalid email' });
    }

    // Hash token and check if it matches the one in the database
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const UserToken = user.rows[0].reset_password_token;
    const tokenExpiry = new Date(user.rows[0].reset_password_expires);

    if (UserToken !== hashedToken || tokenExpiry < new Date()) {
      return res.status(400).json({ success: false, message: 'Token is invalid or has expired' });
    }

    // Hash new password and save it
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query('UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE email = $2', 
      [hashedPassword, email]);

    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});



// ------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Handle filter
const getFilterValue = (param) => param && param !== 'all' ? param : '%';

const buildMoviesQuery = (searchQuery, genreFilter, countryFilter, yearFilter, limit, offset) => `
  SELECT movies.id_movie, movies.title, movies.year, movies.rating, array_agg(genres.name) as genre, array_agg(countries.name) as country, movies.poster, movies.trailer
  FROM movies
  LEFT JOIN movie_genres ON movies.id_movie = movie_genres.id_movie
  LEFT JOIN genres ON movie_genres.id_genre = genres.id_genre
  LEFT JOIN movie_countries ON movies.id_movie = movie_countries.id_movie
  LEFT JOIN countries ON movie_countries.id_country = countries.id_country
  WHERE movies.title ILIKE $1
  AND ($2::text = '%' OR genres.name ILIKE $2)
  AND ($3::text = '%' OR countries.name ILIKE $3)
  AND ($4::text = '%' OR movies.year::text = $4)
  AND movies.status = 'approved'
  GROUP BY movies.id_movie, countries.name
  LIMIT $5 OFFSET $6;
`;

const handleMoviesRequest = async (req, res, isSearch = false) => {
  const { query, genre, country, year, page = 1, limit = 20  } = req.query;

  try {
    const searchQuery = isSearch && query ? `%${query}%` : '%';
    const genreFilter = getFilterValue(genre);
    const countryFilter = getFilterValue(country);
    const yearFilter = getFilterValue(year);
    const offset = (page - 1) * limit;

    // console.log('Filters applied in SQL:', { searchQuery, genreFilter, countryFilter, awardFilter, yearFilter });

    const sqlQuery = buildMoviesQuery(searchQuery, genreFilter, countryFilter, yearFilter, limit, offset);

    const result = await pool.query(sqlQuery, [searchQuery, genreFilter, countryFilter, yearFilter, limit, offset]);

    // console.log('Movies fetched:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching movies:', err);
    res.status(500).send('Server Error');
  }
};

// API endpoint untuk mendapatkan semua film dengan filter (untuk homepage)
app.get('/api/movies/all', (req, res) => handleMoviesRequest(req, res, false));

// API endpoint untuk mendapatkan film berdasarkan query di search page
app.get('/api/movies', (req, res) => handleMoviesRequest(req, res, true));


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

//app.get('/api/awards', async (req, res) => {
//  try {
//    const result = await pool.query('SELECT name FROM awards ORDER BY name');
//    res.json(result.rows);
//  } catch (err) {
//    console.error(err.message);
//    res.status(500).send('Server Error');
//  }
//});

// ------------------------------------------------------------------------------------------------------------------------------------------------------- //
// Watchlist

// Middleware untuk memverifikasi token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];  // Ambil header Authorization
  const token = authHeader && authHeader.split(' ')[1];  // Ekstrak token dari header

  console.log('Authorization Header:', authHeader);
  console.log('Extracted Token:', token);

  if (token == null) return res.status(401).json({ message: 'Token is missing' });  // Jika tidak ada token, kirim Unauthorized

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token is invalid' });  // Jika token tidak valid, kirim Forbidden
    
    req.user = user;  // Simpan informasi user di request object
    next();  // Lanjutkan ke middleware berikutnya atau ke route handler
  });
}

app.post('/api/watchlist', authenticateToken, (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.id; // ID pengguna dari token yang terautentikasi

  const query = 'INSERT INTO watchlist (id_user, id_movie) VALUES ($1, $2) ON CONFLICT DO NOTHING;';

  pool.query(query, [userId, movieId], (error, results) => {
      if (error) {
          console.error('Error inserting into watchlist:', error);
          return res.status(500).json({ message: 'Error adding movie to watchlist' });
      }
      return res.status(200).json({ message: 'Movie added to watchlist' });
  });
});

// API untuk mendapatkan watchlist berdasarkan id_user
app.get('/api/watchlist', authenticateToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const query = `
      SELECT movies.*
      FROM watchlist
      INNER JOIN movies ON watchlist.id_movie = movies.id_movie
      WHERE watchlist.id_user = $1;
    `;
    const { rows } = await pool.query(query, [userId]);

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Watchlist is empty.' });
    }

    res.json(rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
});


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
       array_agg(DISTINCT genres.name) as genres, movies.poster, movies.trailer, array_agg(DISTINCT countries.name) as countries
       FROM movies
       LEFT JOIN movie_genres ON movies.id_movie = movie_genres.id_movie
       LEFT JOIN genres ON movie_genres.id_genre = genres.id_genre
       LEFT JOIN movie_countries ON movies.id_movie = movie_countries.id_movie
       LEFT JOIN countries ON movie_countries.id_country = countries.id_country
       WHERE movies.title ILIKE $1 AND movies.status = 'approved'
       GROUP BY movies.id_movie`,
      [title]
    );

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Film tidak ditemukan' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


app.get('/api/movies/:id_movie/actors', async (req, res) => {
  const { id_movie } = req.params;
  try {
    const result = await pool.query(
      `SELECT actors.name, actors.photo
       FROM actors
       JOIN movie_actors ON actors.id_actor = movie_actors.id_actor
       WHERE movie_actors.id_movie = $1`, [id_movie]
    );
    
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
  const dummyUsername = 'naffa';

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

//endpoint untuk data admin
app.get('/api/admins', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id_user, username, email, role 
       FROM users 
       WHERE role = 'admin'`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch admin users' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
