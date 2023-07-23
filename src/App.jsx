import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Split from 'react-split';
import { nanoid } from 'nanoid';
import './app.css';
import { addDoc, deleteDoc, onSnapshot, doc } from 'firebase/firestore';
import notesCollection, { db } from './firebase';

export default function App() {
  const [notes, setNotes] = useState([]);

  const [currentNoteId, setCurrentNoteId] = useState(notes[0]?.id || '');

  useEffect(() => {
    // Add notes to the firesore db and notes state
    const disconnect = onSnapshot(notesCollection, (snapchat) => {
      const notesArr = snapchat.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setNotes(notesArr);
    });
    // Clean the onSnapchat listener
    return disconnect;
  }, []);

  const currentNote = notes.find((note) => note.id === currentNoteId) || notes[0];

  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
    };
    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id);
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

  async function deleteNote(e, noteId) {
    e.stopPropagation();
    const docRef = doc(db, 'notes', noteId);
    await deleteDoc(docRef);
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
          <Editor currentNote={currentNote} updateNote={updateNote} />
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

