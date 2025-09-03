export interface userType {
    name: string;
    username: string;
    email: string;
    profileImage: {
        publicId: string;
        imageUrl: string;
    };
    providers: string[];
    googleId: string;
    githubId: string;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}