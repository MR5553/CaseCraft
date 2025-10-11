import axios, { type AxiosRequestConfig } from "axios";
import { AxiosError } from "axios";
import { toast } from "sonner";

declare module "axios" { interface AxiosRequestConfig { _retry?: boolean; } }

export const api = axios.create({
    baseURL: import.meta.env.VITE_SERVER_URL,
    withCredentials: true,
    timeout: 50000
});

api.interceptors.response.use((res) => res,
    async (error: AxiosError) => {
        const status = error.response?.status;
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

        if (status === 401 && originalRequest && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                await api.get("/api/auth/refresh-token", { withCredentials: true });
                return api(originalRequest);

            } catch (refreshError) {
                return Promise.reject(refreshError);
            }
        }

        if (!error.response) {
            toast.error("Network error or server is unreachable");
        }

        return Promise.reject(error);
    }
);