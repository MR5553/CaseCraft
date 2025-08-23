import type { userType } from "./user.types";

export interface apiResponse {
    success: boolean;
    message: string;
    user: userType;
}

export interface apiError {
    errors: [];
    message: string;
    stack: string;
    status: number;
    success: false;
}