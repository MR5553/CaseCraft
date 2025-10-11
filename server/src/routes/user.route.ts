import { Router } from "express";
import { verifyJwtToken } from "../middleware/auth.middleware";
import {
    forgetPassword,
    getProfile,
    Logout,
    refreshAccessToken,
    ResendVerificationCode,
    resetPassword,
    signin,
    signup,
    updateProfile,
    updateProfileImage,
    VerifyEmail,
} from "../controller/user.controller";


const router = Router();


router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", verifyJwtToken, Logout);
router.post("/refresh-token", refreshAccessToken);

router.post("/verify-email/:id", VerifyEmail);
router.post("/resend-verification-code/:id", ResendVerificationCode);

router.put("/forgot-password", forgetPassword);
router.post("/reset-password", resetPassword);

router.get("/me", verifyJwtToken, getProfile);
router.put("/me/image", verifyJwtToken, updateProfileImage);
router.put("/me/update", verifyJwtToken, updateProfile);

export default router;