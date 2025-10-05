export interface Address {
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

export interface userType {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profileImage?: {
        publicId: string;
        imageUrl: string;
    };
    address: Address;
    providers: Provider[];
    refreshToken: string;
    verified: boolean;
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