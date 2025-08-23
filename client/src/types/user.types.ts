export interface userType {
    profileInfo: {
        name: string;
        username: string;
        email: string;
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
    _id: string;
    watchHistory: string[];
    watchLater: string[];
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
}