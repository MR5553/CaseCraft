import { useNavigate } from "react-router-dom";
import Uplaoder from "../components/Uploader";
import { AxiosError } from "axios";
import { useAuth } from "../store/auth.store";
import { toast } from "sonner";
import type { apiError } from "../types/res.types";
import { api } from "../lib/axios";
import { useCanvas } from "../store/useCanvas";


export default function UploadImage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { setUploadedImage } = useCanvas();


    const handleUpload = async (image: File) => {
        if (!isAuthenticated) return toast.error("You must be Sign-in to upload an image.");

        const formData = new FormData();
        formData.append("image", image);

        await toast.promise(api.post("/api/case/upload-image", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        }),
            {
                loading: "Uploading image...",
                success: (res) => {
                    const { data } = res;
                    if (data.success) {
                        setUploadedImage(data.url);
                        navigate("/configure/design");
                    }
                    return data.message || "Image uploaded successfully!";
                },
                error: (err: AxiosError<apiError>) =>
                    err.response?.data.message || "Upload failed",
            }
        );
    };

    return (
        <Uplaoder
            accept={["image/png", "image/jpeg", "image/jpg"]}
            size={3}
            onUploadFile={(image) => handleUpload(image)}
        />
    )
}