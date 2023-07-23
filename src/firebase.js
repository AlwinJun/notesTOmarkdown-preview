import { initializeApp } from 'firebase/app';
import { collection, getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyDgNJ6P0Odybrly9eLln8oqqobKYC0tgq0',
  authDomain: 'notestomarkdown-previewer.firebaseapp.com',
  projectId: 'notestomarkdown-previewer',
  storageBucket: 'notestomarkdown-previewer.appspot.com',
  messagingSenderId: '178692277754',
  appId: '1:178692277754:web:89e2a7e652efab89275043',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
const notesCollection = collection(db, 'notes');
export default notesCollection;
