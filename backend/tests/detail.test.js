const request = require('supertest');
const app = require('../server'); // Import app dari server.js
const { Pool } = require('pg'); // Sesuaikan dengan cara koneksi database kamu

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

describe('GET /api/movies/title/:title', () => {
  it('should return movie details if movie is found', async () => {
    const mockMovieData = {
      id_movie: 1,
      synopsis: 'A great movie',
      alt_title: 'An Amazing Movie',
      title: 'Movie A',
      year: 2022,
      rating: 9.5,
      genres: ['Action', 'Adventure'],
      poster: '/images/movie-a.jpg',
      trailer: 'https://youtube.com/trailer-a',
      countries: ['USA'],
    };

    // Mocking query result
    pool.query.mockResolvedValueOnce({
      rows: [mockMovieData],
    });

    const response = await request(app).get('/api/movies/title/Movie A');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockMovieData);
  });

  it('should return 404 if movie is not found', async () => {
    // Mocking query result with empty array (no movie found)
    pool.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get('/api/movies/title/Movie X');

    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Film tidak ditemukan');
  });

  it('should return 500 if there is a server error', async () => {
    // Mocking query to throw an error
    pool.query.mockRejectedValueOnce(new Error('Server Error'));

    const response = await request(app).get('/api/movies/title/Movie A');

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server Error');
  });
});

describe('GET /api/movies/:id_movie/actors', () => {
  it('should return actors list if actors are found', async () => {
    const mockActorData = [
      { name: 'Actor 1', photo: '/images/actor1.jpg' },
      { name: 'Actor 2', photo: '/images/actor2.jpg' },
    ];

    // Mocking query result for actors
    pool.query.mockResolvedValueOnce({
      rows: mockActorData,
    });

    const response = await request(app).get('/api/movies/1/actors');

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockActorData);
  });

  it('should return empty array if no actors are found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] });

    const response = await request(app).get('/api/movies/1/actors');

    expect(response.status).toBe(200);
    expect(response.body).toEqual([]);
  });

  it('should return 500 if there is a server error', async () => {
    pool.query.mockRejectedValueOnce(new Error('Server Error'));

    const response = await request(app).get('/api/movies/1/actors');

    expect(response.status).toBe(500);
    expect(response.text).toBe('Server Error');
  });
});
