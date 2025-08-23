import { Document } from "mongoose";

export interface userType extends Document {
    profileInfo: {
        name: string;
        username: string;
        email: string;
        password: string;
        profileImage: {
            publicId: string;
            imageUrl: string;
        };
        coverImage: {
            publicId: string;
            imageUrl: string;
        };
        description?: string;
    };
    providers: string[];
    googleId: string;
    githubId: string;
    socialLinks: {
        instagram: string;
        facebook: string;
        twitter: string;
        LinkedIn: string;
        website: string;
    };
    watchHistory: string[];
    watchLater: string[];
    refreshToken: string;
    isVerified: boolean;
    verificationCode: number | undefined;
    verificationCodeExpiry: Date | undefined;
    generateRefreshToken(): string;
    generateAccessToken(): string;
    isPasswordCorrect(password: string): Promise<boolean>;
}