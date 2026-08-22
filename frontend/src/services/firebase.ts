import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getAuth, Auth } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFirebaseConfig } from '../utils/config';

let app: FirebaseApp | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;
let storage: FirebaseStorage | undefined;

const config = getFirebaseConfig();

console.log('API KEY: ' + (config.apiKey ? 'PRESENT' : 'MISSING'));
console.log('AUTH DOMAIN: ' + (config.authDomain ? 'PRESENT' : 'MISSING'));
console.log('PROJECT ID: ' + (config.projectId ? 'PRESENT' : 'MISSING'));
console.log('STORAGE BUCKET: ' + (config.storageBucket ? 'PRESENT' : 'MISSING'));
console.log('MESSAGING SENDER ID: ' + (config.messagingSenderId ? 'PRESENT' : 'MISSING'));
console.log('APP ID: ' + (config.appId ? 'PRESENT' : 'MISSING'));
console.log('API KEY MATCHES FIREBASE WEB APP CONFIG: ' + (config.apiKey === 'AIzaSyBwOUdkBRdfqN_506GzdV_2k2gDTwvM' ? 'YES' : 'NO'));

const isInvalid = (v: any) => !v || (typeof v === 'string' && v.startsWith('PASTE_YOUR_'));

const missingKeys = Object.entries(config)
  .filter(([, v]) => isInvalid(v))
  .map(([k]) => k);

if (missingKeys.length === 0) {
  // All required Firebase config values are present — initialize.
  try {
    if (!getApps().length) {
      app = initializeApp(config);
    } else {
      app = getApps()[0];
    }
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    console.log('[Firebase] Initialized successfully with Auth, Firestore, and Storage');
  } catch (error) {
    console.error('[Firebase] Initialization failed:', error);
  }
} else {
  console.error(
    '[Firebase] MISSING CONFIGURATION — Login and Create Account will NOT work.\n' +
    'Create frontend/.env and set these variables:\n' +
    missingKeys.map(k => `  VITE_${k.replace(/([A-Z])/g, '_$1').toUpperCase()} = <your value>`).join('\n') +
    '\nSee frontend/.env.example for the full template.'
  );
}

export { app, auth, db, storage };
