import { Router } from "express";
import {
    AddModel,
    getAllModels,
    updateModel,
    deleteModel
} from "../controller/model.controller"
import { uploadFile } from "../middleware/multer.middleware";


const router = Router();


router.post("/models", uploadFile.single("image"), AddModel);
router.get("/models", getAllModels);
router.put("/models/:id", uploadFile.single("image"), updateModel);
router.delete("/models/:id", deleteModel);


export default router;