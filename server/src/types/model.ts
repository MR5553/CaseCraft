import { Document } from "mongoose";

export interface modelType extends Document {
    name: string;
    image: string;
    brand: string;
    path: string;
}

export interface CaseType extends Document {
    model: modelType;
    userId: string;
    price: number;
    total: number;
    material: {
        type: string;
        price: number;
    };
    finish: {
        type: string;
        price: number;
    }
}

export interface address {
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    state: string;
}