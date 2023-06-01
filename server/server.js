require('dotenv').config();
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const authRouter = require('./routes/authRouter');
const notesRouter = require('./routes/notesRouter');
const connectDB = require('./db.js');

connectDB();

// Our server port
const PORT = process.env.PORT || 1234;

// Create an express app
const app = express();

// Format JSON into readable code
app.use(express.json());

// Parse cookies
app.use(cookieParser());

// Send all auth urls to authRouter
app.use('/auth', authRouter);

// Send all notes urls to notesRouter
app.use('/notes', notesRouter);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../dist', 'index.html')),
  );
} else {
  app.use(express.static(path.join(__dirname, '../client/src')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '../client/src/', 'index.html')),
  );
}

// 404 handler
app.use('*', (req, res) => {
  console.log('catch all');
  res.status(404).send('Not Found');
});

// Global error handler
app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send({ err: { message: err.message } });
});

const server = app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

module.exports = server;
