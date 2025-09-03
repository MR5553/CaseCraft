import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { apiError } from "../utils/apiError";
import { UploadOnCloudinary } from "../utils/Cloudinary";

const uploadImage = asyncHandler(async (req: Request, res: Response) => {
    const image = req.file?.path;

    if (!image) throw new apiError(400, "No image file provided in the request.");

    const result = await UploadOnCloudinary(image, "image");

    if (!result.url) throw new apiError(500, "Failed to upload image to Cloudinary.");

    return res.status(201).json({
        url: result.url,
        publicId: result.public_id,
        success: true,
        message: "Image is uploaded successful.",
    });
});


export { uploadImage };