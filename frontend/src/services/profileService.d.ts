import { UserProfile } from '../types';
/**
 * Default fallback values for student profile attributes
 */
export declare const sanitizeStudentProfile: (docData: any, uid: string) => UserProfile;
/**
 * Fetch a student's profile by UID from Firestore
 */
export declare const getStudentProfile: (uid: string) => Promise<UserProfile>;
/**
 * Update a student's profile in Firestore
 */
export declare const updateStudentProfile: (uid: string, updates: Partial<UserProfile>) => Promise<UserProfile>;
/**
 * Validate and upload a student's profile photo to Firebase Storage
 */
export declare const uploadProfilePhoto: (uid: string, file: File) => Promise<string>;
//# sourceMappingURL=profileService.d.ts.map