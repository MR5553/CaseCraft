import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { api } from "../lib/axios";
import type { action, userState } from "../types/auth.types";
import type { apiError, apiResponse } from "../types/res.types";
import { toast } from "sonner";
import type { AxiosError } from "axios";

const initialState: userState = {
    user: {
        profileInfo: {
            name: "",
            username: "",
            email: "",
            profileImage: {
                publicId: "",
                imageUrl: "",
            },
            coverImage: {
                publicId: "",
                imageUrl: "",
            },
            description: "",
        },
        providers: [],
        googleId: "",
        githubId: "",
        socialLinks: {
            instagram: "",
            facebook: "",
            twitter: "",
            LinkedIn: "",
            website: "",
        },
        _id: "",
        watchHistory: [],
        watchLater: [],
        isVerified: false,
        createdAt: "",
        updatedAt: "",
    },
    hydrated: false,
    isAuthenticated: false,
}


export const useAuth = create<userState & action>()(
    persist(
        immer((set) => ({
            ...initialState,

            SignIn: async (email, password) => {
                try {
                    const { data } = await api.post<apiResponse>("api/auth/sign-in", { email, password });

                    if (data.success) {
                        set({ user: data.user, isAuthenticated: data.user.isVerified });
                        toast.success(data.message)
                    }

                } catch (error: unknown) {
                    const err = error as AxiosError<apiError>;
                    toast.error(err.response?.data.message)
                }
            },

            Signup: async (name, email, password) => {
                try {
                    const { data } = await api.post<apiResponse>("api/auth/sign-up", { name, email, password });

                    if (data.success) set({ user: data.user });

                } catch (error) {
                    const err = error as AxiosError<apiError>;
                    toast.error(err.response?.data.message)
                }
            },

            getProfile: async () => {
                try {
                    const { data } = await api.get<apiResponse>("api/auth/get-profile");

                    if (data.success) {
                        set({ user: data.user, isAuthenticated: data.user.isVerified });
                    }

                } catch (error) {
                    const err = error as AxiosError<apiError>;
                    toast.error(err.response?.data.message)
                }
            },

            SignOut: async () => {
                try {
                    const { data } = await api.get<apiResponse>("api/auth/sign-out");

                    if (data.success) set({ ...initialState, hydrated: true });

                } catch (error) {
                    const err = error as AxiosError<apiError>;
                    toast.error(err.response?.data.message)
                }
            },

            setHydrated: () => set({ hydrated: true }),
        })),
        {
            name: "auth",
            onRehydrateStorage() {
                return (state, error) => {
                    if (!error) {
                        state?.setHydrated();
                    }
                };
            },
            partialize: (state) => ({
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
        }
    )
)