import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import { uploadImage } from "../controller/case.controller";
import { uploadFile } from "../middleware/multer.middleware";



const router = Router();


router.post("/case/upload-image", auth, uploadFile.single("image"), uploadImage);


export default router;