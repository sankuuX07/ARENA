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

// Only initialize Firebase if API key is populated
if (config.apiKey && config.apiKey !== 'your-firebase-api-key') {
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
    console.warn('[Firebase] Initialization skipped or encountered error:', error);
  }
} else {
  console.info('[Firebase] Config placeholder detected. Firebase will initialize once valid credentials are provided in .env');
}

export { app, auth, db, storage };
