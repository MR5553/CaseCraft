import type { userType } from "./types";

export interface userState {
    user: userType;
    hydrated: boolean;
    isAuthenticated: boolean;
    resendAttempts: number;
};

export interface action {
    setUser: (user: userType) => void;
    getProfile: () => Promise<void>;
    SignOut: () => Promise<void>;
    setHydrated: () => void;
};