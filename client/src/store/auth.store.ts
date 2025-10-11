import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { api } from "../lib/axios";
import type { action, userState } from "../types/auth.types";
import { toast } from "sonner";
import { isAxiosError } from "axios";


const initialState: userState = {
    user: {
        _id: "",
        name: "",
        email: "",
        phone: "",
        profileImage: {
            publicId: "",
            imageUrl: "",
        },
        address: {
            address_line_1: "",
            address_line_2: "",
            city: "",
            country: "",
            landmark: "",
            pincode: "",
            state: ""
        },
        providers: [{ provider: "", providerId: "" }],
        verified: false,
        refreshToken: "",
        createdAt: "",
        updatedAt: ""
    },
    hydrated: false,
    isAuthenticated: false,
    resendAttempts: 0,
}


export const useAuth = create<userState & action>()(
    persist(
        immer((set) => ({
            ...initialState,

            setUser: (user) => {
                set((state) => {
                    state.user = user;
                    state.isAuthenticated = user.verified;
                });
            },

            getProfile: async () => {
                try {
                    const { data } = await api.get("api/auth/me");

                    if (data.success) {
                        set((state) => {
                            state.user = data.user;
                            state.isAuthenticated = data.user.verified;
                        });
                    }

                } catch (error) {
                    if (isAxiosError(error) && error.response) {
                        toast.error(error.response.data.message);
                    }
                }
            },

            SignOut: async () => {
                try {
                    const { data } = await api.get("api/auth/signout");

                    if (data.success) set({ ...initialState, hydrated: true });

                } catch (error) {
                    if (isAxiosError(error) && error.response) {
                        toast.error(error.response.data.message);
                    }
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