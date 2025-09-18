export interface userType {
    _id: string;
    name: string;
    email: string;
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
    createdAt: string;
    updatedAt: string;
}


export type Model = {
    _id: string;
    name: string;
    brand: string;
    variant: string;
    color: string;
    image: {
        publicId: string;
        URL: string;
    };
    path: string;
    offsetX: number;
    offsetY: number;
}