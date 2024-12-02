const request = require('supertest');
const app = require('../server');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// Mock `pg.Pool`
jest.mock('pg', () => {
  const mPool = {
    query: jest.fn(),
    connect: jest.fn(),
    end: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

// Mock Nodemailer
jest.mock('nodemailer', () => ({
  createTransport: jest.fn().mockReturnValue({
    sendMail: jest.fn().mockResolvedValue('Mock email sent'),
  }),
}));

const pool = new Pool();

describe('Auth API Tests', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should register a user successfully', async () => {
    pool.query
      .mockResolvedValueOnce({ rows: [] }) 
      .mockResolvedValueOnce({             
        rows: [{ id: 1, username: 'testuser', email: 'test@example.com' }],
      });
  
    jest.spyOn(bcrypt, 'genSalt').mockResolvedValue('mockSalt'); 
    jest.spyOn(bcrypt, 'hash').mockResolvedValue('mockHashedPassword'); 
  
    const response = await request(app).post('/api/register').send({
      username: 'testuser',
      email: 'test@example.com',
      password: 'Password123!',
    });
  
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('User registered successfully. Please verify your email.');
  });

  test('should log in user with valid credentials', async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          username: 'testuser',
          password: await bcrypt.hash('Password123!', 10), // Simulasi hash password
        },
      ],
    });
    
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);    
  
    const response = await request(app).post('/api/login').send({
      username: 'testuser',
      password: 'Password123!',
    });
  
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
  
  test('should fail login if username not found', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }); // User tidak ditemukan
  
    const response = await request(app).post('/api/login').send({
      username: 'unknownuser',
      password: 'Password123!',
    });
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Invalid username or password');
  });
  
  // test('should fail login if password is incorrect', async () => {
  //   pool.query.mockResolvedValueOnce({
  //     rows: [
  //       { id: 1, username: 'testuser', password: await bcrypt.hash('CorrectPassword123!', 10) },
  //     ],
  //   });
  
  //   const response = await request(app).post('/api/login').send({
  //     username: 'testuser',
  //     password: 'WrongPassword!',
  //   });
  
  //   expect(response.status).toBe(400);
  //   expect(response.body.message).toBe('Invalid username or password');
  // });
  
  test('should verify email with valid token', async () => {
    pool.query
      .mockResolvedValueOnce({
        rows: [{ email_verification_token: 'validtoken' }],
      }) // Token ditemukan
      .mockResolvedValueOnce({ rows: [] }); // Email berhasil diverifikasi
  
    const response = await request(app).get('/api/verify-email').query({ token: 'validtoken' });
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Email berhasil diverifikasi!');
  });
  
  test('should fail email verification with invalid token', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }); // Token tidak ditemukan
  
    const response = await request(app).get('/api/verify-email').query({ token: 'invalidtoken' });
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Token tidak valid atau sudah kedaluwarsa.');
  });

  test('should send reset password link if email exists', async () => {
    pool.query.mockResolvedValueOnce({ rows: [{ email: 'test@example.com' }] }); // Email ditemukan
  
    const response = await request(app).post('/api/forgot-password').send({ email: 'test@example.com' });
  
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Reset link sent');
  });
  
  test('should fail to send reset password link if email does not exist', async () => {
    pool.query.mockResolvedValueOnce({ rows: [] }); // Email tidak ditemukan
  
    const response = await request(app).post('/api/forgot-password').send({ email: 'nonexistent@example.com' });
  
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Email not found');
  });

});



afterAll(async () => {
  await pool.end();
});
