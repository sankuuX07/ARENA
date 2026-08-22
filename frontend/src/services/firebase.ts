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

console.log('[Firebase Debug] API Key received length:', config.apiKey ? config.apiKey.length : 0);
console.log('[Firebase Debug] API Key prefix:', config.apiKey ? config.apiKey.substring(0, 5) : 'NONE');

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
