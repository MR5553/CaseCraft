import { Router } from "express";
import { verifyJwtToken } from "../middleware/auth.middleware";
import { uploadImage } from "../controller/case.controller";
import { uploadFile } from "../middleware/multer.middleware";



const router = Router();


router.post("/case/upload-image", verifyJwtToken, uploadFile.single("image"), uploadImage);


export default router;