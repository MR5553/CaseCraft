import { model, Schema } from "mongoose";
import { ModelType } from "../types/models.type";


const modelSchema = new Schema<ModelType>({
    name: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        required: true
    },
    variant: {
        type: String,
        required: true
    },
    color: {
        type: String,
        required: true
    },
    image: {
        publicId: {
            type: String,
            required: true
        },
        URL: {
            type: String,
            required: true
        }
    },
    path: {
        type: String,
        required: true
    },
    offsetX: {
        type: Number,
        default: 0
    },
    offsetY: {
        type: Number,
        default: 0
    },
}, { timestamps: true });


export const Models = model<ModelType>("Models", modelSchema);