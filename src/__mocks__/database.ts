import CONFIG from '@/config';
import firebase from 'firebase';
const FirebaseServer = require('firebase-server');
const server = new FirebaseServer(5000, '127.0.0.1', {});

CONFIG.databaseURL = "ws://localhost:5000";
firebase.initializeApp(CONFIG);
export const mock = true;
export default firebase;
