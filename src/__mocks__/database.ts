import CONFIG from '../config';
import firebase from 'firebase';
import FirebaseServer from 'firebase-server';

new FirebaseServer(5000, '127.0.0.1', {});
CONFIG.databaseURL = "ws://localhost:5000";
firebase.initializeApp(CONFIG);

export const mock = true;
export default firebase;
