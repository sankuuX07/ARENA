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
import {
  registerLocalStudent,
  loginLocalStudent,
  logoutLocalStudent,
  getLocalUserProfile,
  getLocalSession,
} from '../services/localAuth';
import { LoadingSpinner } from '../components/LoadingSpinner';

const isLocalAuth = import.meta.env.VITE_AUTH_MODE === 'local';

interface AuthContextType {
  currentUser: User | any | null;
  userProfile: UserProfile | null;
  /** True only during the initial Firebase auth-state check on app load. */
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

  /**
   * `initializing` is true ONLY during the very first auth-state check on
   * app boot. It becomes false permanently once Firebase resolves the initial
   * state. It is deliberately separate from per-operation loading flags so
   * that login/register errors are visible and the app is never permanently
   * stuck behind a spinner.
   */
  const [initializing, setInitializing] = useState<boolean>(true);

  useEffect(() => {
    if (isLocalAuth) {
      console.log('// TEMPORARY DEVELOPMENT AUTH MODE - Using Local Auth');
      // Local Auth Flow
      const initLocalAuth = async () => {
        const session = getLocalSession();
        if (session) {
          setCurrentUser(session as any);
          try {
            const profile = await getLocalUserProfile(session.uid);
            setUserProfile(
              profile || {
                uid: session.uid,
                fullName: session.email?.split('@')[0] || 'Student',
                email: session.email || '',
                role: 'student',
              }
            );
          } catch {
            setUserProfile({
              uid: session.uid,
              fullName: session.email?.split('@')[0] || 'Student',
              email: session.email || '',
              role: 'student',
            });
          }
        } else {
          setCurrentUser(null);
          setUserProfile(null);
        }
        setInitializing(false);
      };
      
      initLocalAuth();
      return () => {}; // No subscription for local mode
    }

    const unsubscribe = subscribeToAuthState(async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const profile = await getUserProfile(user.uid);
          setUserProfile(
            profile || {
              uid: user.uid,
              fullName: user.displayName || user.email?.split('@')[0] || 'Student',
              email: user.email || '',
              role: 'student',
            }
          );
        } catch {
          // Profile fetch failed — use a minimal fallback so the user is
          // still considered authenticated.
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
      // Mark initialization complete after the first callback fires.
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  const updateUserProfileState = (updated: UserProfile) => {
    setUserProfile(updated);
  };

  /**
   * Login: calls Firebase signInWithEmailAndPassword and immediately sets
   * currentUser from the returned credential so the ProtectedRoute guard
   * sees an authenticated user before React Router navigates.
   *
   * onAuthStateChanged will fire shortly after and update the profile.
   * Throws on failure — the calling component must catch and display the error.
   */
  const login = async (params: LoginParams): Promise<void> => {
    if (isLocalAuth) {
      const localUser = await loginLocalStudent(params);
      setCurrentUser(localUser as any);
      const profile = await getLocalUserProfile(localUser.uid);
      if (profile) setUserProfile(profile);
      return;
    }

    const firebaseUser = await loginStudent(params);
    // Eagerly set currentUser so isAuthenticated becomes true synchronously
    // before the navigate() in the calling component fires.  onAuthStateChanged
    // will re-run shortly and may update userProfile, but that is non-blocking.
    setCurrentUser(firebaseUser);
  };

  /**
   * Register: creates the Firebase account + Firestore profile, then eagerly
   * sets currentUser so the ProtectedRoute guard sees an authenticated user
   * before React Router navigates.
   * Throws on failure — the calling component must catch and display the error.
   */
  const register = async (params: RegisterParams): Promise<void> => {
    if (isLocalAuth) {
      const profile = await registerLocalStudent(params);
      setCurrentUser({ uid: profile.uid, email: profile.email });
      setUserProfile(profile);
      return;
    }

    const profile = await registerStudent(params);
    // Eagerly set both currentUser (minimal shape) and userProfile so the
    // dashboard can render immediately while onAuthStateChanged catches up.
    setCurrentUser({ uid: profile.uid, email: profile.email });
    setUserProfile(profile);
  };

  const logout = async () => {
    if (isLocalAuth) {
      await logoutLocalStudent();
      setCurrentUser(null);
      setUserProfile(null);
      return;
    }

    await logoutStudent();
    // Eagerly clear state so protected routes block immediately.
    setCurrentUser(null);
    setUserProfile(null);
    // onAuthStateChanged will also fire with null and confirm the state.
  };

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading: initializing,
    isAuthenticated: Boolean(currentUser),
    login,
    register,
    logout,
    updateUserProfileState,
  };

  // Show a blocking spinner ONLY during the initial Firebase auth check on
  // app boot. After that, per-operation loading is managed by each component.
  if (initializing) {
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
