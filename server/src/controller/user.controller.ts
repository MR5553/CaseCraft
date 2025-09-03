import { CookieOptions, Request, Response } from "express";
import { Users } from "../model/Users.model";
import { userType } from "../types/user.types";
import crypto from "node:crypto";
// import { EmailVerification } from "../mail/template.mail";
import { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import { jwtToken } from "../types/jwt.types";
import { deleteFromCloudinary, UploadOnCloudinary } from "../utils/Cloudinary";


export const option: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};


export async function generateToken(userId: string) {
    try {
        const user = await Users.findById(userId) as userType;

        const refreshToken = user.generateRefreshToken();
        const accessToken = user.generateAccessToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { refreshToken, accessToken };

    } catch (error) {
        throw error("Something went wrong while generating refresh and access token", error);
    }
};


const signup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, email, password }: userType = req.body;

        if (!name || !email || !password) {
            res.status(400).json({ success: false, message: "Name, Email & Password are required." });
            return;
        }

        const existingUser = await Users.findOne({ email });

        if (existingUser) {
            res.status(409).json({ success: false, message: "User already exists, please signin instead." });
            return;
        }

        const verificationCode = crypto.randomInt(100000, 999999);

        const user = await Users.create({
            name,
            email,
            password,
            verificationCode,
            verificationCodeExpiry: Date.now() + 60 * 60 * 1000,
        });

        if (!user) {
            res.status(500).json({ success: false, message: "Unable to create user." });
            return;
        }

        //await EmailVerification(user);

        const new_user = await Users.findById(user.id).select(
            "-password -refreshToken -verificationCode -verificationCodeExpiry"
        );

        res.status(201).json({
            user: new_user,
            success: true,
            message: `We just sent a verification mail to ${email}`,
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


const signin = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password }: userType = req.body;

        if (!email || !password) {
            res.status(400).json({ success: false, message: "Email and password are required." });
            return;
        }

        const existingUser = await Users.findOne({ email }).select("-refreshToken -verificationCode -verificationCodeExpiry");

        if (!existingUser) {
            res.status(404).json({ success: false, message: "User does not exist, please sign up instead." });
            return;
        }

        if (!existingUser.isVerified) {
            res.status(401).json({ success: false, message: "Please verify your email to continue" });
            return;
        }

        if (!existingUser.password) {
            res.status(400).json({ success: false, message: "Please sign in with your social account" });
            return;
        }

        const isPasswordValid = await existingUser.isPasswordCorrect(password);

        if (!isPasswordValid) {
            res.status(400).json({ success: false, message: "Incorrect password." });
            return;
        }

        const { accessToken, refreshToken } = await generateToken(existingUser.id);

        const user = await Users.findById(existingUser.id).select("-password -refreshToken -verificationCode -verificationCodeExpiry");

        res.status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json({
                success: true,
                message: "User logged in successfully.",
                user: user,
            });

    } catch (error) {
        res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal server error" });
    }
};


const VerifyEmail = async (req: Request, res: Response): Promise<void> => {
    try {
        const otp: number = req.body.otp;

        if (!otp) {
            res.status(404).json({ message: "verification code required." });
            return;
        }

        if (!isValidObjectId(req.params.id)) {
            res.status(409).json({ message: "Invalid user id." });
            return;
        }

        const user = await Users.findById(req.params.id).select("-password") as userType;

        if (!user) {
            res.status(404).json({ message: "User not found." });
            return;
        }

        if (user.isVerified) {
            res.status(400).json({ message: "User already verified!.. " });
            return;
        }

        if (!user.verificationCodeExpiry || user.verificationCodeExpiry <= new Date()) {
            res.status(400).json({ message: "Verification code has expired." });
            return;
        }

        if (user.verificationCode !== otp) {
            res.status(400).json({ message: "Invalid verification code." });
            return;
        }

        const { accessToken, refreshToken } = await generateToken(user.id);

        user.isVerified = true;
        user.refreshToken = refreshToken;
        user.verificationCode = undefined;
        user.verificationCodeExpiry = undefined;
        await user.save();

        res.status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json({
                user,
                success: true,
                message: "Email verified successfully",
            });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


const resendVerificationCode = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            res.status(400).json({ success: false, message: "Invalid user ID." });
            return;
        }

        const verificationCode = crypto.randomInt(100000, 999999);

        const user = await Users.findByIdAndUpdate(id,
            {
                verificationCode,
                verificationCodeExpiry: Date.now() + 60 * 60 * 1000,
            },
            { new: true }
        );

        if (!user) {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }

        //sent email with verification code

        res.status(200).json({
            id: user.id,
            success: true,
            message: "Verification code sent successfully.",
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


const Logout = async (req: Request, res: Response): Promise<void> => {
    try {
        await Users.findByIdAndUpdate(
            req.auth.id,
            {
                $unset: { refreshToken: 1 },
            },
            { new: true }
        );

        res.status(200)
            .clearCookie("accessToken", option)
            .clearCookie("refreshToken", option)
            .json({
                success: true,
                message: "User logged out successfully.",
            });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


const refreshAccessToken = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.cookies.refreshToken || req.body.refreshToken;

        if (!token) {
            res.status(401).json({ success: false, message: "Unauthorized request!.." });
            return;
        }

        const decode = jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET!
        ) as jwtToken;

        const user = await Users.findById(decode.id) as userType;

        if (!user) {
            res.status(401).json({ success: false, message: "Invalid refresh token!.." });
            return;
        }

        if (token !== user.refreshToken) {
            res.status(401).json({ success: false, message: "Refresh token is expired!.." });
            return;
        }

        const { accessToken, refreshToken } = await generateToken(user.id);

        res.status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json({
                success: true,
                message: "Access token and refresh token updated successfully!..",
            });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


const getProfile = async (req: Request, res: Response): Promise<void> => {
    try {
        res.status(200).json({
            user: req.auth,
            success: true,
            message: "current user fetched successfully."
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


const updateProfileImage = async (req: Request, res: Response): Promise<void> => {
    try {
        const profileImageLocal = req.file?.path;

        if (!profileImageLocal) {
            res.status(400).json({ success: false, message: "Profile image is required." });
            return;
        }

        const existingUser = (await Users.findById(req.auth.id)) as userType;

        if (existingUser?.profileImage?.publicId) {
            await deleteFromCloudinary(existingUser.profileImage.publicId, "image");
        }

        const uploadedImage = await UploadOnCloudinary(profileImageLocal, "image");

        if (!uploadedImage?.url) {
            res.status(500).json({ success: false, message: "Error while uploading image." });
            return;
        }

        const user = await Users.findByIdAndUpdate(
            req.auth.id,
            {
                $set: {
                    profileImage: {
                        imageUrl: uploadedImage.url,
                        publicId: uploadedImage.public_id,
                    },
                },
            },
            { new: true }
        ).select("-password -refreshToken -verificationCode -verificationCodeExpiry");

        res.status(200).json({
            user: user,
            success: true,
            message: "Profile image updated successfully.",
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


const forgetPassword = async (req: Request, res: Response) => {
    try {
        const email = req.body.email;

        if (!email) {
            res.status(400).json({ success: false, message: "email is required!.." });
            return;
        }

        const user = await Users.findOne({ email });

        if (!user) {
            res.status(404).json({ success: false, message: "user does not exist!.." });
            return;
        }

        const verificationCode = crypto.randomInt(100000, 999999);
        user.verificationCode = verificationCode;
        user.verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        // send email with verificationCode...

        res.status(200).json({
            success: true,
            id: user.id,
            email: user.email,
            message: `OTP sent to ${user.email}`,
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


const verifyOtp = async (req: Request, res: Response): Promise<void> => {
    try {
        const { otp } = req.body;

        if (!otp) {
            res.status(400).json({ success: false, message: "OTP is required." });
            return;
        }

        const user = (await Users.findById(req.params.id)) as userType;

        if (!user) {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }

        if (user.verificationCode !== otp) {
            res.status(400).json({ success: false, message: "Invalid OTP." });
            return;
        }

        if (!user.verificationCodeExpiry || new Date(user.verificationCodeExpiry) <= new Date()) {
            res.status(400).json({ success: false, message: "OTP has expired." });
            return;
        }

        user.verificationCode = undefined;
        user.verificationCodeExpiry = undefined;
        await user.save();

        const updatedUser = await Users.findById(user.id).select(
            "-password -refreshToken -verificationCode -verificationCodeExpiry"
        );

        res.status(200).json({
            user: updatedUser,
            success: true,
            message: "OTP verified successfully.",
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


const resetPassword = async (req: Request, res: Response): Promise<void> => {
    try {
        const { password } = req.body;
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            res.status(400).json({ success: false, message: "Invalid user ID." });
            return;
        }

        if (!password) {
            res.status(400).json({ success: false, message: "Password is required." });
            return;
        }

        const user = await Users.findByIdAndUpdate(
            id,
            { $set: { password } },
            { new: true }
        ).select("-password -refreshToken -verificationCode -verificationCodeExpiry");

        if (!user) {
            res.status(404).json({ success: false, message: "User not found or error while resetting password." });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Password reset successfully.",
        });
    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Internal server error",
        });
    }
};


export {
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
};