import { Document } from "mongoose";

export interface ModelType extends Document {
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