import { Document } from "mongoose";

interface Address {
    houseNo: string;
    street: string;
    locality: string;
    sector: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
}

export interface userType extends Document {
    name: string;
    email: string;
    password?: string;
    Number?: string;
    profileImage?: {
        publicId: string;
        imageUrl: string;
    };
    address: Address;
    providers: string[];
    googleId: string;
    githubId: string;
    refreshToken: string;
    isVerified: boolean;
    verificationCode: number | undefined;
    verificationCodeExpiry: Date | undefined;

    generateRefreshToken(): string;
    generateAccessToken(): string;
    isPasswordCorrect(password: string): Promise<boolean>;
}