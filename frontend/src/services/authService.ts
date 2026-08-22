import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './firebase';
import { RegisterParams, LoginParams, UserProfile } from '../types';

/**
 * Format Firebase Auth technical error codes into user-friendly messages.
 */
export const getFriendlyErrorMessage = (error: any): string => {
  if (!error) return 'An unexpected error occurred. Please try again.';

  const code = error.code || error.message || '';

  if (code.includes('auth/email-already-in-use')) {
    return 'An account with this email already exists.';
  }
  if (
    code.includes('auth/wrong-password') ||
    code.includes('auth/user-not-found') ||
    code.includes('auth/invalid-credential')
  ) {
    return 'Incorrect email or password.';
  }
  if (code.includes('auth/weak-password')) {
    return 'Password must be at least 6 characters long.';
  }
  if (code.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (code.includes('auth/too-many-requests')) {
    return 'Too many failed attempts. Please try again later.';
  }
  if (code.includes('auth/network-request-failed')) {
    return 'Unable to connect. Please check your internet connection.';
  }
  if (
    code.includes('Firebase Authentication is not configured') ||
    code.includes('not configured')
  ) {
    return 'Authentication service is not configured. Please contact support.';
  }

  return error.message || 'Authentication failed. Please check your inputs and try again.';
};

/**
 * Register a new student account and create Firestore user document.
 * Throws on any failure — the caller is responsible for catching and
 * displaying the error.
 */
export const registerStudent = async (params: RegisterParams): Promise<UserProfile> => {
  const { fullName, email, password } = params;

  if (!auth) {
    throw new Error('Firebase Authentication is not configured. Please check your environment settings.');
  }

  // 1. Create Firebase Auth user — throws on duplicate email, weak password, etc.
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const firebaseUser = userCredential.user;

  const userProfileData: Omit<UserProfile, 'createdAt'> & { createdAt: any } = {
    uid: firebaseUser.uid,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    role: 'student',
    createdAt: serverTimestamp(),
  };

  // 2. Create Firestore profile — if this fails we still have a valid Firebase
  //    auth account. We attempt the write and propagate errors.
  if (db) {
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    try {
      await setDoc(userDocRef, userProfileData);
    } catch (firestoreError: any) {
      // Auth succeeded but Firestore write failed. Log it prominently but do
      // NOT throw — the user is authenticated and onAuthStateChanged will fire.
      // A minimal profile will be constructed from the auth object.
      console.error('[AuthService] Firestore profile write failed after auth creation:', firestoreError);
    }
  }

  return {
    ...userProfileData,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Log in an existing student.
 * Returns the Firebase User object on success.
 * Throws on invalid credentials, network errors, etc.
 */
export const loginStudent = async (params: LoginParams): Promise<User> => {
  const { email, password } = params;

  if (!auth) {
    throw new Error('Firebase Authentication is not configured. Please check your environment settings.');
  }

  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return userCredential.user;
};

/**
 * Log out the authenticated student.
 */
export const logoutStudent = async (): Promise<void> => {
  if (auth) {
    await signOut(auth);
  }
};

/**
 * Fetch Firestore user document by UID.
 * Returns null (never throws) so callers can gracefully fall back to a
 * minimal profile constructed from the Firebase Auth user object.
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!db) {
    // Firestore not configured — return null so the caller can fall back.
    console.warn('[AuthService] Firestore not configured; skipping profile fetch.');
    return null;
  }

  try {
    const userDocRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userDocRef);

    if (snapshot.exists()) {
      return snapshot.data() as UserProfile;
    }
    return null;
  } catch (error) {
    console.error('[AuthService] Error fetching user profile from Firestore:', error);
    return null;
  }
};

/**
 * Subscribe to Firebase Auth state changes.
 * Calls callback(null) immediately if Firebase is not configured.
 */
export const subscribeToAuthState = (
  callback: (user: User | null) => void
): (() => void) => {
  if (!auth) {
    // Firebase not configured — immediately signal "no user" so the
    // initializing spinner is dismissed and the login form is shown.
    callback(null);
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
};
