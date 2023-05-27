const express = require('express');

const PORT = 1234;
// const path = require('path');
const mongoose = require('mongoose');
const auth = require('./routes/auth');

const app = express();

const MONGO_URI = 'mongodb+srv://williaminterlock:acorn@cluster0.xxhf1te.mongodb.net/?retryWrites=true&w=majority';
mongoose
  .connect(MONGO_URI, {
    // options for the connect method to parse the URI
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // sets the name of the DB that our collections are part of
    dbName: 'Study_With_Me',
  })
  .then(() => console.log('Connected to Mongo DB.'))
  .catch((err) => console.log(err));

app.use(express.json());

app.use('/auth', auth);

app.get('/', (req, res) => {
  res.send('howdy howdy');
});

/**
 * 404 handler
 */
app.use('*', (req, res) => {
  res.status(404).send('Not Found');
});

/**
 * Global error handler
 */
app.use((err, req, res) => {
  console.log(err);
  res.status(500).send({ error: err });
});

app.listen(PORT);
