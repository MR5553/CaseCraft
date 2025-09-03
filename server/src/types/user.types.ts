import { Document } from "mongoose";

export interface userType extends Document {
    name: string;
    email: string;
    password?: string;
    Number?: string;
    profileImage?: {
        publicId: string;
        imageUrl: string;
    };
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