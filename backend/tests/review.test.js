// jest.setTimeout(30000); // Set timeout to 30 seconds
// const request = require('supertest');
// const app = require('../server');  // Import instance express dari server.js
// const { Pool } = require('pg'); // Sesuaikan dengan cara koneksi database kamu
// const http = require('http');

// // Mocking pool.query untuk mencegah koneksi ke database saat testing
// jest.mock('pg', () => {
//   const mPool = {
//     query: jest.fn(),
//     connect: jest.fn(),
//     end: jest.fn(),
//   };
//   return { Pool: jest.fn(() => mPool) };
// });

// const pool = new Pool();  // Sesuaikan dengan path ke file db.js

// // Mocking Middleware authenticateToken yang ada di server.js
// jest.mock('../server', () => {
//   const originalModule = jest.requireActual('../server');
//   return {
//     ...originalModule,
//     authenticateToken: (req, res, next) => {
//       req.user = { id: 1, username: 'testuser', role: 'user' };  // Simulasikan user yang sudah terautentikasi
//       next();
//     }
//   };
// });

// let server;
// beforeAll(done => {
//   server = http.createServer(app);
//   server.listen(3000, () => {
//     console.log('Test server running on port 3000');  // Logging untuk memverifikasi server berjalan
//     global.agent = request.agent(server);  // Gunakan agent untuk mendukung lebih baik
//     done();
//   });
// });

// afterAll(done => {
//   server.close(done);
// });

// describe('POST /api/comments', () => {
//   it('should add a comment successfully with status unapproved', async () => {
//     const mockComment = {
//       comment: 'Great movie!',
//       rate: 5,
//       id_movie: 1,
//     };

//     // Mock query untuk database
//     pool.query.mockResolvedValueOnce({
//       rows: [{ ...mockComment, id_comment: 1, status: 'unapproved' }],
//     });

//     const response = await global.agent  // Menggunakan agent untuk mendukung lebih baik
//       .post('/api/comments')
//       .send(mockComment)
//       .set('Authorization', `Bearer mock-jwt-token`);  // Simulating the JWT token for auth

//     expect(response.status).toBe(201);  // Status Created
//     expect(response.body.comment).toBe(mockComment.comment);
//     expect(response.body.status).toBe('unapproved');  // Ensure the comment is unapproved initially
//   });

//   it('should return 500 if there is an error adding the comment', async () => {
//     pool.query.mockRejectedValueOnce(new Error('Database error'));

//     const response = await global.agent  // Menggunakan agent untuk mendukung lebih baik
//       .post('/api/comments')
//       .send({
//         comment: 'Great movie!',
//         rate: 5,
//         id_movie: 1,
//       })
//       .set('Authorization', `Bearer mock-jwt-token`);

//     expect(response.status).toBe(500);
//     expect(response.body.message).toBe('Error adding comment');
//   });
// });

// describe('GET /api/movies/:id_movie/comments', () => {
//   it('should return approved comments for the given movie', async () => {
//     const mockComments = [
//       { id_comment: 1, comment: 'Great movie!', rate: 5, id_movie: 1, status: 'approved' },
//       { id_comment: 2, comment: 'Not bad!', rate: 4, id_movie: 1, status: 'approved' },
//     ];

//     pool.query.mockResolvedValueOnce({
//       rows: mockComments,
//     });

//     const response = await global.agent  // Menggunakan agent untuk mendukung lebih baik
//       .get('/api/movies/1/comments')
//       .set('Authorization', `Bearer mock-jwt-token`);  // Simulating the JWT token for auth

//     expect(response.status).toBe(200);
//     expect(response.body).toEqual(mockComments);  // Ensure the returned data matches mock data
//   });

//   it('should return 500 if there is an error fetching comments', async () => {
//     pool.query.mockRejectedValueOnce(new Error('Database error'));

//     const response = await global.agent  // Menggunakan agent untuk mendukung lebih baik
//       .get('/api/movies/1/comments')
//       .set('Authorization', `Bearer mock-jwt-token`);  // Simulating the JWT token for auth

//     expect(response.status).toBe(500);
//     expect(response.body.message).toBe('Error fetching comments');
//   });
// });
