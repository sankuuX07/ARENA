import { User } from 'firebase/auth';
import { RegisterParams, LoginParams, UserProfile } from '../types';
/**
 * Format Firebase Auth technical error codes into user-friendly messages.
 */
export declare const getFriendlyErrorMessage: (error: any) => string;
/**
 * Register a new student account and create Firestore user document.
 * Throws on any failure — the caller is responsible for catching and
 * displaying the error.
 */
export declare const registerStudent: (params: RegisterParams) => Promise<UserProfile>;
/**
 * Log in an existing student.
 * Returns the Firebase User object on success.
 * Throws on invalid credentials, network errors, etc.
 */
export declare const loginStudent: (params: LoginParams) => Promise<User>;
/**
 * Log out the authenticated student.
 */
export declare const logoutStudent: () => Promise<void>;
/**
 * Fetch Firestore user document by UID.
 * Returns null (never throws) so callers can gracefully fall back to a
 * minimal profile constructed from the Firebase Auth user object.
 */
export declare const getUserProfile: (uid: string) => Promise<UserProfile | null>;
/**
 * Subscribe to Firebase Auth state changes.
 * Calls callback(null) immediately if Firebase is not configured.
 */
export declare const subscribeToAuthState: (callback: (user: User | null) => void) => (() => void);
//# sourceMappingURL=authService.d.ts.map