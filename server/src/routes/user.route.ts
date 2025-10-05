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
    updateAddress,
    updateProfileImage,
    VerifyEmail,
    verifyOtp
} from "../controller/user.controller";


const router = Router();


router.post("/signup", signup);
router.post("/signin", signin);
router.post("/signout", verifyJwtToken, Logout);
router.post("/refresh-token", refreshAccessToken);

router.post("/verify-email/:token", VerifyEmail);
router.post("/resend-verification-code/:userId", resendVerificationCode);

router.post("/forgot-password", forgetPassword);
router.post("/verify-otp/:userId", verifyOtp);
router.post("/reset-password/:token", resetPassword);

router.get("/me", verifyJwtToken, getProfile);
router.put("/me/image", verifyJwtToken, updateProfileImage);
router.put("/me/update", verifyJwtToken, updateAddress);

export default router;