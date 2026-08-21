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
 * Format Firebase Auth technical error codes into user-friendly messages
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

  return error.message || 'Authentication failed. Please check your inputs and try again.';
};

/**
 * Register a new student account and create Firestore user document
 */
export const registerStudent = async (params: RegisterParams): Promise<UserProfile> => {
  const { fullName, email, password } = params;

  if (!auth || !db) {
    // Demo fallback mode if Firebase credentials are not configured in .env
    const mockUid = `demo-${Date.now()}`;
    const mockProfile: UserProfile = {
      uid: mockUid,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      role: 'student',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('arena_demo_user', JSON.stringify(mockProfile));
    return mockProfile;
  }

  // 1. Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
  const firebaseUser = userCredential.user;

  // 2. Create Firestore user document: users/{firebaseUser.uid}
  const userDocRef = doc(db, 'users', firebaseUser.uid);
  const userProfileData: Omit<UserProfile, 'createdAt'> & { createdAt: any } = {
    uid: firebaseUser.uid,
    fullName: fullName.trim(),
    email: email.trim().toLowerCase(),
    role: 'student',
    createdAt: serverTimestamp(),
  };

  await setDoc(userDocRef, userProfileData);

  return {
    ...userProfileData,
    createdAt: new Date().toISOString(),
  };
};

/**
 * Log in an existing student
 */
export const loginStudent = async (params: LoginParams): Promise<User | UserProfile> => {
  const { email, password } = params;

  if (!auth) {
    // Demo fallback mode if Firebase credentials are not configured in .env
    const savedDemo = localStorage.getItem('arena_demo_user');
    if (savedDemo) {
      return JSON.parse(savedDemo);
    }
    const mockProfile: UserProfile = {
      uid: `demo-user-123`,
      fullName: 'Student User',
      email: email.trim().toLowerCase(),
      role: 'student',
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('arena_demo_user', JSON.stringify(mockProfile));
    return mockProfile;
  }

  const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
  return userCredential.user;
};

/**
 * Log out the authenticated student
 */
export const logoutStudent = async (): Promise<void> => {
  if (auth) {
    await signOut(auth);
  }
  localStorage.removeItem('arena_demo_user');
};

/**
 * Fetch Firestore user document by UID
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  if (!db) {
    const savedDemo = localStorage.getItem('arena_demo_user');
    if (savedDemo) {
      return JSON.parse(savedDemo);
    }
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
    console.error('Error fetching user profile from Firestore:', error);
    return null;
  }
};

/**
 * Subscribe to Firebase Auth state changes
 */
export const subscribeToAuthState = (
  callback: (user: User | null) => void
): (() => void) => {
  if (!auth) {
    const savedDemo = localStorage.getItem('arena_demo_user');
    if (savedDemo) {
      callback({ uid: JSON.parse(savedDemo).uid, email: JSON.parse(savedDemo).email } as any);
    } else {
      callback(null);
    }
    return () => {};
  }

  return onAuthStateChanged(auth, callback);
};
