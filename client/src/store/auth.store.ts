import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { api } from "../lib/axios";
import type { action, userState } from "../types/auth.types";
import type { apiError, res } from "../types/res.types";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type { userType } from "../types/types";


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
        immer((set, get) => ({
            ...initialState,

            SignIn: async (email, password) => {
                try {
                    const { data } = await api.post<res<userType>>("api/auth/signin", { email, password });

                    if (data.success) {
                        set({ user: data.user, isAuthenticated: data.user.verified });
                        toast.success(data.message)
                    }

                } catch (error: unknown) {
                    const err = error as AxiosError<apiError>;
                    toast.error(err.response?.data.message)
                }
            },

            Signup: async (name, email, password) => {
                try {
                    const { data } = await api.post<res<userType>>("api/auth/signup", { name, email, password });

                    if (data.success) set({ user: data.user });

                } catch (error) {
                    const err = error as AxiosError<apiError>;
                    toast.error(err.response?.data.message)
                }
            },

            getProfile: async () => {
                try {
                    const { data } = await api.get<res<userType>>("api/auth/me");
                    console.log(data);

                    if (data.success) {
                        set({ user: data.user, isAuthenticated: data.user.verified });
                    }

                } catch (error) {
                    const err = error as AxiosError<apiError>;
                    toast.error(err.response?.data.message)
                }
            },

            SignOut: async () => {
                try {
                    const { data } = await api.get<res<userType>>("api/auth/signout");

                    if (data.success) set({ ...initialState, hydrated: true });

                } catch (error) {
                    const err = error as AxiosError<apiError>;
                    toast.error(err.response?.data.message)
                }
            },

            ResendVerification: async () => {
                try {
                    set((state) => {
                        if (state.resendAttempts >= 5) {
                            toast.error("You have reached the maximum resend attempts (5).");
                            return state;
                        }

                        return { resendAttempts: state.resendAttempts + 1 };
                    });

                    const { data } = await api.post<res<userType>>(`api/auth/resend-verification-code/${get().user._id}`
                    );

                    if (data.success) {
                        toast.success(data.message || "Verification code sent!");
                    }

                } catch (error) {
                    const err = error as AxiosError<apiError>;
                    toast.error(err.response?.data.message);
                }
            },

            setUser: (user) => {
                set({ user: user })
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