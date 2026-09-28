import React from 'react';
import { User } from 'firebase/auth';
import { UserProfile, RegisterParams, LoginParams } from '../types';
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
export declare const AuthProvider: React.FC<{
    children: React.ReactNode;
}>;
export declare const useAuth: () => AuthContextType;
export {};
//# sourceMappingURL=AuthContext.d.ts.map