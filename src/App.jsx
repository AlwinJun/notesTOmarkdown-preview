import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Split from 'react-split';
import { nanoid } from 'nanoid';
import './app.css';

export default function App() {
  const [notes, setNotes] = useState(
    // Using lazy state => function that returns a state value
    () => JSON.parse(localStorage.getItem('notes')) || []
  );

  const [currentNoteId, setCurrentNoteId] = useState(notes[0]?.id || '');

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes));
  }, [notes]);

  const currentNote = notes.find((note) => note.id === currentNoteId) || notes[0];

  function createNewNote() {
    const newNote = {
      id: nanoid(),
      body: "# Type your markdown note's title here",
    };
    setNotes((prevNotes) => [newNote, ...prevNotes]);
    setCurrentNoteId(newNote.id);
  }

  function updateNote(text) {
    setNotes((prevNotes) => {
      // Move the edited note at the top on note list
      const noteLists = [];
      prevNotes.map((note) =>
        note.id === currentNoteId ? noteLists.unshift({ ...note, body: text }) : noteLists.push(note)
      );
      return noteLists;
    });
  }

  function deleteNote(event, noteId) {
    event.stopPropagation();
    setNotes((prevNote) => prevNote.filter((note) => note.id !== noteId));
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction='horizontal' className='split'>
          <Sidebar
            notes={notes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            deleteNote={deleteNote}
          />
          {currentNoteId && notes.length > 0 && <Editor currentNote={currentNote} updateNote={updateNote} />}
        </Split>
      ) : (
        <div className='no-notes'>
          <h1>You have no notes</h1>
          <button className='first-note' onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}

