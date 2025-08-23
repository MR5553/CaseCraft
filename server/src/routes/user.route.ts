import { Router } from "express";
import { auth } from "../middleware/auth.middleware";
import {
    forgetPassword,
    getProfile,
    getWatchHistory,
    Logout,
    refreshAccessToken,
    ResendEmailVerificationCode,
    resetPassword,
    setUsername,
    signin,
    signup,
    updateAccountDetails,
    updateProfileImage,
    VerifyEmail,
    VerifyOtp
} from "../controller/user.controller";


const router = Router();

router.post("/sign-up", signup);
router.post("/sign-in", signin);
router.post("/verify-email/:id", VerifyEmail);
router.post("/resend-verification-code/:id", ResendEmailVerificationCode);
router.post("/forget-password", forgetPassword);
router.post("/verify-otp/:id", VerifyOtp);
router.post("/reset-password/:id", resetPassword);
router.post("/refresh-token", refreshAccessToken);

router.post("sign-out", auth, Logout);
router.get("/get-profile", auth, getProfile);
router.post("/update-details", auth, updateAccountDetails);
router.post("/update-profile-image", updateProfileImage);
router.get("/watch-history", auth, getWatchHistory);
router.post("/set-username", auth, setUsername);

export default router;