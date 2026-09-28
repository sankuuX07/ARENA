import { UserProfile, RegisterParams, LoginParams } from '../types';
export declare const registerLocalStudent: (params: RegisterParams) => Promise<UserProfile>;
export declare const loginLocalStudent: (params: LoginParams) => Promise<{
    uid: string;
    email: string;
}>;
export declare const logoutLocalStudent: () => Promise<void>;
export declare const getLocalUserProfile: (uid: string) => Promise<UserProfile | null>;
export declare const getLocalSession: () => {
    uid: string;
    email: string;
} | null;
//# sourceMappingURL=localAuth.d.ts.map