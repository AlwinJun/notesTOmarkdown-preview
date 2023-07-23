import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Split from 'react-split';
import { nanoid } from 'nanoid';
import './app.css';
import { addDoc, deleteDoc, onSnapshot, doc, setDoc } from 'firebase/firestore';
import notesCollection, { db } from './firebase';

export default function App() {
  const [notes, setNotes] = useState([]);

  const [currentNoteId, setCurrentNoteId] = useState('');

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

  useEffect(() => {
    // Set current id to the first note after the data from firestore is loaded
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id);
    }
  }, [notes]);

  const currentNote = notes.find((note) => note.id === currentNoteId) || notes[0];

  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);

  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    const newNoteRef = await addDoc(notesCollection, newNote);
    setCurrentNoteId(newNoteRef.id);
  }

  async function updateNote(text) {
    const docRef = doc(db, 'notes', currentNoteId);
    await setDoc(docRef, { body: text, updatedAt: Date.now() }, { merge: true });
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
            notes={sortedNotes}
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

