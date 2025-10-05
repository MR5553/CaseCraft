import { Document } from "mongoose";

interface Address {
    address_line_1: string;
    address_line_2: string;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

interface Provider {
    provider: "google" | "github" | "facebook" | "twitter" | "linkedin" | string;
    providerId: string;
}

export interface userType extends Document {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    profileImage?: {
        publicId: string;
        imageUrl: string;
    };
    address: Address;
    providers: Provider[];
    refreshToken: string;
    verified: boolean;
    verificationCode: number | undefined;
    verificationCodeExpiry: Date | undefined;

    generateRefreshToken(): string;
    generateAccessToken(): string;
    passwordValidation(password: string): Promise<boolean>;
}