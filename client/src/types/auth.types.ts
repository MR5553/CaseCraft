import type { userType } from "./types";

export interface userState {
    user: userType;
    hydrated: boolean;
    isAuthenticated: boolean;
};

export interface action {
    SignIn: (email: string, password: string) => Promise<void>;
    Signup: (name: string, email: string, password: string) => Promise<void>;
    getProfile: () => Promise<void>;
    setHydrated: () => void;
    SignOut: () => void;
};