import multer from "multer";
import { v6 as uuid } from "uuid";
import path from "node:path";


const storage = multer.diskStorage({
    destination(_req, _file, cb) {
        cb(null, "./public/temp");
    },
    filename(_req, file, cb) {
        const ext = path.extname(file.originalname);
        const name = path.basename(file.originalname, ext).replace(/\s+/g, "_");
        cb(null, `${name}-${uuid()}${ext}`);
    },
});

export const uploadFile = multer({ storage: storage });