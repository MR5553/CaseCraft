import { Router } from "express";
import { verifyJwtToken } from "../middleware/auth.middleware";
import {
    forgetPassword,
    getProfile,
    Logout,
    refreshAccessToken,
    resendVerificationCode,
    resetPassword,
    signin,
    signup,
    updateProfileImage,
    VerifyEmail,
    verifyOtp
} from "../controller/user.controller";


const router = Router();

router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.post("/verify-email/:id", VerifyEmail);
router.post("/resend-verification-code/:id", resendVerificationCode);
router.post("/forget-password", forgetPassword);
router.post("/verify-otp/:id", verifyOtp);
router.post("/reset-password/:id", resetPassword);
router.post("/refresh-token", refreshAccessToken);

router.post("sign-out", verifyJwtToken, Logout);
router.get("/get-profile", verifyJwtToken, getProfile);
router.post("/update-profile-image", updateProfileImage);

export default router;