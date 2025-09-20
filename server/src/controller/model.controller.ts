import { Request, Response } from "express";
import { deleteFromCloudinary, UploadOnCloudinary } from "../utils/Cloudinary";
import { ModelType } from "../types/models.type";
import { Models } from "../model/Models.model";


const AddModel = async (req: Request, res: Response) => {
    try {
        const { name, brand, variant, color, path, offsetX, offsetY }: ModelType = req.body;
        const image = req.file?.path;

        if (!name && !brand && !variant && !color && !path && !image) {
            res.status(400).json({ success: false, message: "Missing required fields" });
        }

        let Image: ModelType["image"] = { publicId: "", URL: "" };


        if (image) {
            const { public_id, url } = await UploadOnCloudinary(image, "image");

            if (!public_id || !url) {
                return res.status(500).json({ success: false, message: "Error while uploading image." });
            }

            Image = { publicId: public_id, URL: url }
        }

        const model = await Models.create({
            name: name,
            brand: brand,
            variant: variant,
            color: color,
            path: path,
            offsetX: Number(offsetX),
            offsetY: Number(offsetY),
            image: {
                publicId: Image.publicId,
                URL: Image.URL
            },
        });

        if (!model) {
            res.status(500).json({ success: false, message: "Error while uploading model" });
        }

        return res.status(200).json({
            model: model,
            success: true,
            message: "Model is created successfully",
        })

    } catch (error) {
        throw new error;
    }
};


const getAllModels = async (_req: Request, res: Response) => {
    try {
        const models = await Models.find();

        if (!models || models.length === 0) {
            return res.status(404).json({ success: false, message: "No models found" });
        }

        return res.status(200).json({
            success: true,
            models,
            message: "All models fetched successfully",
        });
    } catch (error) {
        throw new error;
    }
};


const updateModel = async (req: Request, res: Response) => {
    try {
        const { name, brand, variant, path, offsetX, offsetY }: ModelType = req.body;
        const image = req.file?.path;

        let Image: ModelType["image"] = { publicId: "", URL: "" };


        if (image) {
            const { public_id, url } = await UploadOnCloudinary(image, "image");

            if (!public_id || !url) {
                return res.status(500).json({ success: false, message: "Error while uploading image." });
            }

            Image = { publicId: public_id, URL: url }
        }



        const model = await Models.findByIdAndUpdate(req.params.id,
            {
                $set: {
                    name: name,
                    brand: brand,
                    variant: variant,
                    path: path,
                    offsetX: Number(offsetX),
                    offsetY: Number(offsetY),
                    image: {
                        publicId: Image.publicId,
                        URL: Image.URL
                    },
                }
            }, { new: true }
        );

        if (!model) {
            return res.status(500).json({ success: false, message: "Error while updating model" });
        }

        return res.status(200).json({
            success: true,
            message: "Model updated successfully",
            model: model,
        });

    } catch (error) {
        throw new error;
    }
};


const deleteModel = async (req: Request, res: Response) => {
    try {
        const id = req.body.id;

        if (!id) {
            return res.status(500).json({ success: false, message: "Model id is missing" });
        }

        const model = await Models.findById(id);

        if (!model) {
            return res.status(404).json({ success: false, message: "Model not found" });
        }

        if (model.image?.publicId) {
            await deleteFromCloudinary(model.image.publicId, "image");
        }

        await model.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Model deleted successfully",
        });

    } catch (error) {
        throw new error;
    }
}


export {
    AddModel,
    getAllModels,
    updateModel,
    deleteModel
};