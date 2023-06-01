const express = require('express');

const router = express.Router();
const notesController = require('../controllers/notesController');
const sessionController = require('../controllers/sessionController');

// Create a new note
router.post(
  '/',
  sessionController.isLoggedIn,
  notesController.createNote,
  // notesController.getUserNotes,
  (req, res) => res.status(201).json(res.locals.note),
);

// Get all notes from a user
router.get(
  '/',
  sessionController.isLoggedIn,
  notesController.getNotesByUsername,
  (req, res) =>
    res.json({ username: res.locals.username, notes: res.locals.notes }),
);

router.post('/display', notesController.getNote, (req, res) => {
  res.status(200).json(res.locals.note);
});

router.patch('/:id', notesController.updateNote, (req, res) => {
  res.status(200).json(res.locals.updatedNote);
});

router.delete('/:id', notesController.deleteNote, (req, res) => {
  res.status(200).json(res.locals.deletedNote);
});

module.exports = router;
