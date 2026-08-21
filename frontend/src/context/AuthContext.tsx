import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { UserProfile, RegisterParams, LoginParams } from '../types';
import {
  subscribeToAuthState,
  getUserProfile,
  loginStudent,
  registerStudent,
  logoutStudent,
} from '../services/authService';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface AuthContextType {
  currentUser: User | any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (params: LoginParams) => Promise<void>;
  register: (params: RegisterParams) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfileState: (updated: UserProfile) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthState(async (user) => {
      setLoading(true);
      if (user) {
        setCurrentUser(user);
        const profile = await getUserProfile(user.uid);
        if (profile) {
          setUserProfile(profile);
        } else {
          setUserProfile({
            uid: user.uid,
            fullName: user.displayName || user.email?.split('@')[0] || 'Student',
            email: user.email || '',
            role: 'student',
          });
        }
      } else {
        setCurrentUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUserProfileState = (updated: UserProfile) => {
    setUserProfile(updated);
  };

  const login = async (params: LoginParams) => {
    setLoading(true);
    try {
      const userOrProfile = await loginStudent(params);
      if ('uid' in userOrProfile && 'fullName' in userOrProfile) {
        setCurrentUser({ uid: userOrProfile.uid, email: userOrProfile.email });
        setUserProfile(userOrProfile as UserProfile);
      } else {
        const firebaseUser = userOrProfile as User;
        setCurrentUser(firebaseUser);
        const profile = await getUserProfile(firebaseUser.uid);
        setUserProfile(
          profile || {
            uid: firebaseUser.uid,
            fullName: firebaseUser.email?.split('@')[0] || 'Student',
            email: firebaseUser.email || '',
            role: 'student',
          }
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (params: RegisterParams) => {
    setLoading(true);
    try {
      const profile = await registerStudent(params);
      setUserProfile(profile);
      setCurrentUser({ uid: profile.uid, email: profile.email });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await logoutStudent();
      setCurrentUser(null);
      setUserProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    isAuthenticated: Boolean(currentUser),
    login,
    register,
    logout,
    updateUserProfileState,
  };

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-dark)',
          color: 'var(--text-main)',
        }}
      >
        <LoadingSpinner message="Verifying ARENA Authentication..." size={24} />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
