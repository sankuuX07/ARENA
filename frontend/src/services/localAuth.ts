import { UserProfile, RegisterParams, LoginParams } from '../types';

const USERS_KEY = 'arena_local_users';
const SESSION_KEY = 'arena_local_session';

// Simple hash just to avoid plaintext in localStorage
const hashPassword = (password: string) => btoa(password + '_local_salt');

export const registerLocalStudent = async (params: RegisterParams): Promise<UserProfile> => {
  const { fullName, email, password, confirmPassword } = params;

  if (!fullName || !email || !password) {
    throw new Error('Name, email, and password are required.');
  }

  if (confirmPassword !== undefined && password !== confirmPassword) {
    throw new Error('Passwords do not match.');
  }

  if (password.length < 6) {
    throw new Error('Password should be at least 6 characters.');
  }

  const usersJson = localStorage.getItem(USERS_KEY);
  const users = usersJson ? JSON.parse(usersJson) : [];

  if (users.find((u: any) => u.email === email)) {
    throw new Error('An account with this email already exists.');
  }

  const newUser = {
    uid: 'local_' + Date.now().toString(),
    email,
    fullName,
    passwordHash: hashPassword(password),
    role: 'student' as const,
  };

  users.push(newUser);
  localStorage.setItem(USERS_KEY, JSON.stringify(users));

  // Do not auto-login here, AuthContext will set session if needed, 
  // actually wait, let's just create the session here to match Firebase behavior.
  localStorage.setItem(SESSION_KEY, newUser.uid);

  return {
    uid: newUser.uid,
    fullName: newUser.fullName,
    email: newUser.email,
    role: newUser.role,
  };
};

export const loginLocalStudent = async (params: LoginParams): Promise<{ uid: string; email: string }> => {
  const { email, password } = params;
  
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }

  const usersJson = localStorage.getItem(USERS_KEY);
  const users = usersJson ? JSON.parse(usersJson) : [];

  const user = users.find((u: any) => u.email === email);

  if (!user || user.passwordHash !== hashPassword(password)) {
    throw new Error('Invalid email or password.');
  }

  localStorage.setItem(SESSION_KEY, user.uid);

  return { uid: user.uid, email: user.email };
};

export const logoutLocalStudent = async (): Promise<void> => {
  localStorage.removeItem(SESSION_KEY);
};

export const getLocalUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const usersJson = localStorage.getItem(USERS_KEY);
  const users = usersJson ? JSON.parse(usersJson) : [];
  const user = users.find((u: any) => u.uid === uid);
  
  if (user) {
    return {
      uid: user.uid,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
  }
  return null;
};

export const getLocalSession = (): { uid: string; email: string } | null => {
  const uid = localStorage.getItem(SESSION_KEY);
  if (uid) {
    const usersJson = localStorage.getItem(USERS_KEY);
    const users = usersJson ? JSON.parse(usersJson) : [];
    const user = users.find((u: any) => u.uid === uid);
    if (user) {
      return { uid: user.uid, email: user.email };
    }
  }
  return null;
};

// DEV ONLY: Expose to window for easy testing/clearing
(window as any).clearLocalAuth = () => {
  console.log('Clearing local development authentication data...');
  localStorage.removeItem(USERS_KEY);
  localStorage.removeItem(SESSION_KEY);
};
