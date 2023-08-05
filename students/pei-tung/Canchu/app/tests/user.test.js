const request = require('supertest');
const app = require('../app');
require('dotenv').config();
process.env.NODE_ENV = 'test';

describe('POST /signup', () => {
  test('Sign Up Success: 200', async () => {
    const userName = 'user';
    const userEmail = 'user@gmail.com';
    const response = await request(app).post('/api/1.0/users/signup').send({
      name: userName,
      email: userEmail,
      password: 'test',
    });
    expect(response.body.data).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
      }),
    );
    expect(response.body.data.user).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        provider: 'native',
        email: userEmail,
        name: userName,
      }),
    );
    expect(response.body.data.user).toHaveProperty('picture');
    expect(response.statusCode).toBe(200);
  });
  test('Sign Up Failed: Email Already Exists', async () => {
    const userName = 'invalidEmail';
    const userEmail = 'user@gmail.com';
    const response = await request(app).post('/api/1.0/users/signup').send({
      name: userName,
      email: userEmail,
      password: 'test',
    });
    expect(response.body.error).toEqual('Sign Up Failed: Email Already Taken');
    expect(response.statusCode).toBe(403);
  });
  test('Sign Up Failed: Missing User Name', async () => {
    const userName = ' ';
    const userEmail = 'nousername@gmail.com';
    const response = await request(app).post('/api/1.0/users/signup').send({
      name: userName,
      email: userEmail,
      password: 'test',
    });
    expect(response.body.error).toEqual(
      'Sign Up Failed: Please fill out all fields',
    );
    expect(response.statusCode).toBe(400);
  });
  test('Sign Up Failed: Missing User Email', async () => {
    const userName = 'user';
    const userEmail = ' ';
    const response = await request(app).post('/api/1.0/users/signup').send({
      name: userName,
      email: userEmail,
      password: 'test',
    });
    expect(response.body.error).toEqual(
      'Sign Up Failed: Please fill out all fields',
    );
    expect(response.statusCode).toBe(400);
  });
  test('Sign Up Failed: Missing User Password', async () => {
    const userName = 'user';
    const userEmail = 'user@gmail.com';
    const response = await request(app).post('/api/1.0/users/signup').send({
      name: userName,
      email: userEmail,
      password: ' ',
    });
    expect(response.body.error).toEqual(
      'Sign Up Failed: Please fill out all fields',
    );
    expect(response.statusCode).toBe(400);
  });
});

describe('POST /signin', () => {
  test('Native Sign In Success: 200', async () => {
    const provider = 'native';
    const userEmail = 'user@gmail.com';
    const response = await request(app).post('/api/1.0/users/signin').send({
      provider: provider,
      email: userEmail,
      password: 'test',
    });
    expect(response.body.data).toEqual(
      expect.objectContaining({
        access_token: expect.any(String),
      }),
    );
    expect(response.body.data.user).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        provider: 'native',
        email: userEmail,
        name: expect.any(String),
      }),
    );
    expect(response.body.data.user).toHaveProperty('picture');
    expect(response.statusCode).toBe(200);
  });
  test('Native Sign In Failed: Wrong Password', async () => {
    const provider = 'native';
    const userEmail = 'user@gmail.com';
    const response = await request(app).post('/api/1.0/users/signin').send({
      provider: provider,
      email: userEmail,
      password: 'wrongPassword',
    });
    expect(response.body.error).toEqual('Sign In Failed: Wrong Password');
    expect(response.statusCode).toBe(403);
  });
  test('Native Sign In Failed: User Not Found', async () => {
    const provider = 'native';
    const userEmail = 'invaildEmail@gmail.com';
    const response = await request(app).post('/api/1.0/users/signin').send({
      provider: provider,
      email: userEmail,
      password: 'test',
    });
    expect(response.body.error).toEqual('Sign In Failed: Invalid Email');
    expect(response.statusCode).toBe(403);
  });
  test('Native Sign In Failed: Missing Provider', async () => {
    const provider = ' ';
    const userEmail = 'user@gmail.com';
    const response = await request(app).post('/api/1.0/users/signin').send({
      provider: provider,
      email: userEmail,
      password: 'test',
    });
    expect(response.body.error).toEqual(
      'Sign In Failed: Provider Field Missing',
    );
    expect(response.statusCode).toBe(400);
  });
  test('Native Sign In Failed: Missing Email', async () => {
    const provider = 'native';
    const userEmail = ' ';
    const response = await request(app).post('/api/1.0/users/signin').send({
      provider: provider,
      email: userEmail,
      password: 'test',
    });
    expect(response.body.error).toEqual(
      'Sign In Failed: Please fill out all fields',
    );
    expect(response.statusCode).toBe(400);
  });
  test('Native Sign In Failed: Missing Password', async () => {
    const provider = 'native';
    const userEmail = 'user@gmail.com';
    const response = await request(app).post('/api/1.0/users/signin').send({
      provider: provider,
      email: userEmail,
      password: ' ',
    });
    expect(response.body.error).toEqual(
      'Sign In Failed: Please fill out all fields',
    );
    expect(response.statusCode).toBe(400);
  });
});
