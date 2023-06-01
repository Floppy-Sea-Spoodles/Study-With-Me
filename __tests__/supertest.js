const request = require('supertest');
const express = require('express');
const app = require('../server/server');
const mongoose = require('mongoose');
const userController = require('../server/controllers/userController');

describe('Route Integration', () => {
  afterAll(async () => {
    await mongoose.disconnect();
    app.close();
  });
  describe('Authentication', () => {
    describe('/auth/login', () => {
      describe('POST', () => {
        // Plug in Test User and PW in MongoDB
        it('return a 201 status and expect an object with key property of userId and userName', async () => {
          const response = await request(app).post('/auth/login').send({
            username: 'coolbeans',
            password: '1234',
          });
          expect(response.status).toBe(201);
        });
        it('returns an error when username or password is missing', async () => {
          const response = await request(app).post('/auth/login').send({
            username: 'duckerusers',
          });
          expect(response.status).toBe(500);
        });

        it('returns an error when username or password is incorrect', async () => {
          const response = await request(app).post('/auth/login').send({
            username: 'thisduckyusershouldntexist',
            password: 'thisduckyuserpwisincorrect',
          });
          expect(response.status).toBe(500);
        });
      });
    });
  });
  describe('404 Handler', () => {
    describe('/*', () => {
      describe('GET', () => {
        it('Should handle all other routes and send a 404 response', async () => {
          const response = await request(app).get('/*');
          expect(response.text).toBe('Not Found');
          expect(response.status).toBe(404);
        });
      });
    });
  });
});
