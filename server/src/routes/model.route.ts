import { Router } from "express";
import {
    AddModel,
    getAllModels,
    updateModel,
    deleteModel
} from "../controller/Model.controller";
import { uploadFile } from "../middleware/multer.middleware";


const router = Router();


router.post("/add", uploadFile.single("image"), AddModel);
router.post("/getAllModels", uploadFile.single("image"), getAllModels);
router.post("/updateModel/:id", uploadFile.single("image"), updateModel);
router.post("/deleteModel/:id", uploadFile.single("image"), deleteModel);


export default router;