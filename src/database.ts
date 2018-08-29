import firebase from 'firebase/app';
import 'firebase/database';

import CONFIG from '@/config';
firebase.initializeApp(CONFIG);

export default firebase;
