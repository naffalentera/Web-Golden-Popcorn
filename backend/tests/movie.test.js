const request = require('supertest');
const app = require('../server');  // Mengimpor app dari server.js
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mocking pool.query untuk mencegah koneksi ke database saat testing
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

const pool = new Pool();

describe('POST /api/movie/add', () => {
  let token; // Variable untuk menyimpan token

  beforeAll(async () => {
    // Mock response untuk login
    const hashedPassword = await bcrypt.hash('Test123!', 10);

    pool.query.mockResolvedValueOnce({
      rows: [{ id_user: 1, username: 'testuser', password: hashedPassword, role: 'admin', is_suspended: false }]  // Mock user data
    });

    // Simulasi login untuk mendapatkan token admin
    const loginResponse = await request(app)
      .post('/api/login') // Ganti dengan endpoint login kamu
      .send({
        username: 'testuser',  // Ganti dengan username yang valid
        password: 'Test123!'  // Ganti dengan password yang valid
      });

    console.log('Login Response:', loginResponse.body);  // Tambahkan log ini untuk memeriksa respons login
    
    token = loginResponse.body.token; // Ambil token dari response login

    // Ensure the token is correctly formatted
    expect(token).toBeDefined();
  });

  it('should create a new movie and return 201 status', async () => {
    const newMovie = {
      title: 'Test Movie',
      altTitle: 'Alt Test Movie',
      year: 2024,
      country: 'USA',
      synopsis: 'A great movie.',
      genres: [1, 2], // Pastikan ID genre yang valid
      actors: [{ id_actor: 1 }, { id_actor: 2 }],
      trailer: 'http://some-trailer-link.com',
      poster: 'http://some-poster-link.com',
      posterLink: 'http://some-poster-link.com/full'
    };

    // Mock query untuk genre check
    pool.query.mockResolvedValueOnce({
      rows: [{ id_genre: 1 }, { id_genre: 2 }],
    });

    // Mock query untuk country check
    pool.query.mockResolvedValueOnce({
      rows: [{ id_country: 1 }],
    });

    // Mock query untuk penambahan movie
    pool.query.mockResolvedValueOnce({
      rows: [{ id_movie: 1, ...newMovie }],
    });

    // Mock query untuk movie_countries
    pool.query.mockResolvedValueOnce({
      rows: []
    });

    // Mock query untuk movie_genres
    pool.query.mockResolvedValueOnce({
      rows: []
    });

    // Mock query untuk movie_actors
    pool.query.mockResolvedValueOnce({
      rows: []
    });

    const response = await request(app)
      .post('/api/movie/add') // Endpoint yang diuji
      .set('Authorization', `Bearer ${token}`) // Gunakan token yang didapat
      .send(newMovie) // Data yang dikirim
      .expect(201); // Mengecek apakah status code yang dikembalikan adalah 201

    // Mengecek bahwa response memiliki struktur yang sesuai
    expect(response.body.message).toBe('Movie added successfully with approved status.');
    expect(response.body).toHaveProperty('success', true);
    // Tidak ada properti movie dalam respons, jadi kita tidak perlu memvalidasinya
  });

  it('should return 400 if required fields are missing', async () => {
    const incompleteMovie = {
      title: 'Test Movie',
      year: 2024,
      country: 'USA',
      synopsis: 'A great movie.',
      genres: [1, 2]
    };

    const response = await request(app)
      .post('/api/movie/add')
      .set('Authorization', `Bearer ${token}`) // Gunakan token
      .send(incompleteMovie)
      .expect(400); // Status code yang diharapkan adalah 400 jika ada field yang hilang

    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].msg).toBe('Trailer URL is required'); // Sesuaikan pesan kesalahan yang diharapkan dengan validasi yang ada
  });
});
