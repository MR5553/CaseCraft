import { Request, Response } from "express";
import { UploadOnCloudinary } from "../utils/Cloudinary";


const uploadImage = async (req: Request, res: Response) => {
    try {
        const image = req.file?.path;

        if (!image) {
            res.status(404).json({ success: false, message: "No image file provided in the request." });
            return;
        }

        const result = await UploadOnCloudinary(image, "image");

        if (!result.url) {
            res.status(500).json({ success: false, message: "Failed to upload image to Cloudinary." });
            return;
        }

        res.status(201).json({
            url: result.url,
            publicId: result.public_id,
            success: true,
            message: "Image is uploaded successful.",
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


export { uploadImage };