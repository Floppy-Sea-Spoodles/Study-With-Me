import React, { useState, useEffect } from 'react';
import './assets/App.scss';

function Notepad({ totalNotes, setTotalNotes, savedNote, setSavedNote }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // tell this component to update (title, content) when `savedNote` changes
  useEffect(() => {
    if (savedNote) {
      setTitle(savedNote.title);
      setContent(savedNote.content);
    }
  }, [savedNote]);

  const saveNote = async () => {
    try {
      // Create a new note
      const response = await fetch('/notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      const newNote = await response.json();
      setTotalNotes([...totalNotes, newNote]); //update totalNotes to the newer version
    } catch (err) {
      console.error(err);
    }
  };

  const updateNote = async () => {
    // PATCH /notes/:id
    try {
      const response = await fetch(`/notes/${savedNote._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });
      const updatedNote = await response.json();

      // Find the element in totalNotes where _id is equal to the _id to the updatedNote
      // and replace that element with the updatedNote
      const newTotalNotes = structuredClone(totalNotes);
      const index = newTotalNotes.findIndex(e => e._id === updatedNote._id);
      newTotalNotes[index] = updatedNote;
      setTotalNotes(newTotalNotes);
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a note by note id
  const deleteNote = async () => {
    try {
      const response = await fetch(`/notes/${savedNote._id}`, {
        method: 'DELETE',
      });
      const deletedNote = await response.json();

      const newTotalNotes = structuredClone(totalNotes);
      const index = newTotalNotes.findIndex(e => e._id === deletedNote._id);
      newTotalNotes.splice(index, 1);
      setTotalNotes(newTotalNotes);

      createNewNote();
    } catch (err) {
      console.error(err);
    }
  };

  const createNewNote = async () => {
    setSavedNote();
    setTitle('');
    setContent('');
  };

  return (
    <div className='note'>
      <input
        id='noteTitle'
        type='text'
        placeholder='Note Title'
        value={title}
        onChange={e => setTitle(e.target.value)}
        required
      ></input>
      <textarea
        id='noteBody'
        type='text'
        placeholder='Jot some notes!'
        rows='44'
        cols='54'
        value={content}
        onChange={e => setContent(e.target.value)}
        required
      ></textarea>

      {savedNote?._id ? (
        <>
          <button onClick={updateNote}>Update</button>
          <button onClick={deleteNote}>Delete</button>
          <button onClick={createNewNote}>Create New Note</button>
        </>
      ) : (
        <button onClick={saveNote}>save</button>
      )}
    </div>
  );
}

export default Notepad;
