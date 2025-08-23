import { v2 as Cloudinary } from "cloudinary";
import fs from "fs";

Cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


type resourceType = "image" | "video" | "raw";

export async function UploadOnCloudinary(path: string, resource_type: resourceType) {
    try {
        const response = await Cloudinary.uploader.upload(path, { folder: "caseCraft", resource_type: resource_type });

        fs.unlinkSync(path);
        return response;

    } catch (error) {
        await fs.unlinkSync(path);
        throw error;
    }
};

export function deleteFromCloudinary(publicId: string, resource_type: resourceType) {
    return Cloudinary.uploader.destroy(publicId, { resource_type });
};