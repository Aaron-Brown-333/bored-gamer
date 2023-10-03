import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
    apiKey: 'AIzaSyA3aDG2CW9XPhd_iO1Ahf85KasbQnr9rtg',
    authDomain: 'bored-gamer-6dadc.firebaseapp.com',
    projectId: 'bored-gamer-6dadc',
    storageBucket: 'bored-gamer-6dadc.appspot.com',
    messagingSenderId: '607919777579',
    appId: '1:607919777579:web:2623830d107a542663076e',
    measurementId: 'G-EFVZQF9GV2',
    databaseURL: 'https://bored-gamer-6dadc-default-rtdb.firebaseio.com'
};


export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
export const firestoreDB = getFirestore(firebaseApp);
export const realtimeDB = getDatabase(firebaseApp);
