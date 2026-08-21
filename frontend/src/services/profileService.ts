import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { UserProfile } from '../types';

/**
 * Default fallback values for student profile attributes
 */
export const sanitizeStudentProfile = (docData: any, uid: string): UserProfile => {
  return {
    uid,
    fullName: docData?.fullName || 'Student Name',
    email: docData?.email || '',
    role: 'student',
    phone: docData?.phone || '',
    profilePhotoUrl: docData?.profilePhotoUrl || '',
    dateOfBirth: docData?.dateOfBirth || '',
    gender: docData?.gender || '',
    college: docData?.college || '',
    degree: docData?.degree || '',
    branch: docData?.branch || '',
    graduationYear: docData?.graduationYear || '',
    bio: docData?.bio || '',
    skills: Array.isArray(docData?.skills) ? docData.skills : [],
    programmingLanguages: Array.isArray(docData?.programmingLanguages)
      ? docData.programmingLanguages
      : [],
    createdAt: docData?.createdAt || null,
    updatedAt: docData?.updatedAt || null,
  };
};

/**
 * Fetch a student's profile by UID from Firestore
 */
export const getStudentProfile = async (uid: string): Promise<UserProfile> => {
  if (!db) {
    const savedDemo = localStorage.getItem('arena_demo_user');
    if (savedDemo) {
      const parsed = JSON.parse(savedDemo);
      if (parsed.uid === uid) {
        return sanitizeStudentProfile(parsed, uid);
      }
    }
    return sanitizeStudentProfile({}, uid);
  }

  try {
    const userRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userRef);
    if (snapshot.exists()) {
      return sanitizeStudentProfile(snapshot.data(), uid);
    }
    return sanitizeStudentProfile({}, uid);
  } catch (error) {
    console.error('[ProfileService] Error fetching profile:', error);
    throw new Error('Unable to load student profile. Please try again.');
  }
};

/**
 * Update a student's profile in Firestore
 */
export const updateStudentProfile = async (
  uid: string,
  updates: Partial<UserProfile>
): Promise<UserProfile> => {
  const payload: Record<string, any> = {
    ...updates,
    updatedAt: db ? serverTimestamp() : new Date().toISOString(),
  };

  delete payload.uid; // Do not overwrite UID
  delete payload.email; // Email remains read-only for auth security

  if (!db) {
    const savedDemo = localStorage.getItem('arena_demo_user');
    const existing = savedDemo ? JSON.parse(savedDemo) : {};
    const updated = sanitizeStudentProfile({ ...existing, ...payload }, uid);
    localStorage.setItem('arena_demo_user', JSON.stringify(updated));
    return updated;
  }

  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, payload);
    return await getStudentProfile(uid);
  } catch (error) {
    console.error('[ProfileService] Error updating profile:', error);
    throw new Error('Profile could not be updated. Please try again.');
  }
};

/**
 * Validate and upload a student's profile photo to Firebase Storage
 */
export const uploadProfilePhoto = async (uid: string, file: File): Promise<string> => {
  // 1. File Type Validation
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (!validTypes.includes(file.type.toLowerCase())) {
    throw new Error('Invalid file format. Only JPG, PNG, and WEBP images are supported.');
  }

  // 2. File Size Validation (Max 2MB)
  const maxSizeInBytes = 2 * 1024 * 1024;
  if (file.size > maxSizeInBytes) {
    throw new Error('Image file size exceeds the 2MB limit. Please choose a smaller image.');
  }

  // 3. Storage Upload
  if (storage) {
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const fileRef = ref(storage, `profile_photos/${uid}/avatar.${ext}`);
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      return downloadUrl;
    } catch (err) {
      console.warn('[ProfileService] Firebase Storage upload fallback:', err);
    }
  }

  // Fallback data URL generation for demo/offline environments
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Failed to process selected profile photo.'));
    reader.readAsDataURL(file);
  });
};
