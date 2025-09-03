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
        throw new Error(`Token generation failed: ${(error as Error).message}`);
    }
};


const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password }: userType = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ success: false, message: "Name, Email & Password are required." });
        }

        const existingUser = await Users.findOne({ email: email });

        if (existingUser) {
            return res.status(409).json({ success: false, message: "User already exists, please signin instead." });
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
            return res.status(500).json({ success: false, message: "Unable to create user." });
        }

        //await EmailVerification(user);

        const new_user = await Users.findById(user.id).select(
            "-password -refreshToken -verificationCode -verificationCodeExpiry"
        );

        return res.status(201).json({
            user: new_user,
            success: true,
            message: `We just sent a verification mail to ${email}`,
        });

    } catch (error) {
        return res.status(500).json({ sucess: false, error: (error as Error).message });
    }
};


const signin = async (req: Request, res: Response) => {
    try {
        const { email, password }: userType = req.body;

        if (!email || !password) {
            return res.status(400).json({ success: false, message: "Email and password are required." });
        }

        const existingUser = await Users.findOne({ email: email }).select("-refreshToken -verificationCode -verificationCodeExpiry") as userType;

        if (!existingUser) {
            res.status(404).json({ success: false, message: "User does not exist, please sign up instead.return " });
        }

        if (!existingUser.isVerified) {
            return res.status(401).json({ success: false, message: "Please verify your email to continue" });
        }

        if (!existingUser.password) {
            return res.status(400).json({ success: false, message: "Please sign in with your social account" });
        }

        const isPasswordValid = await existingUser.isPasswordCorrect(password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Incorrect password." });
        }

        const { accessToken, refreshToken } = await generateToken(existingUser.id);

        const user = await Users.findById(existingUser.id).select("-password -refreshToken -verificationCode -verificationCodeExpiry");

        return res.status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json({
                success: true,
                message: "User logged in successfully.",
                user: user,
            });

    } catch (error) {
        return res.status(500).json({ sucess: false, error: (error as Error).message });
    }
};


const VerifyEmail = async (req: Request, res: Response) => {
    try {
        const otp: number = req.body.otp;

        if (!otp) {
            return res.status(404).json({ message: "verification code required." });
        }

        if (!isValidObjectId(req.params.id)) {
            return res.status(409).json({ message: "Invalid user id." });
        }

        const user = await Users.findById(req.params.id).select("-password") as userType;

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.isVerified) {
            return res.status(400).json({ message: "User already verified!.. " });
        }

        if (!user.verificationCodeExpiry || user.verificationCodeExpiry <= new Date()) {
            return res.status(400).json({ message: "Verification code has expired." });
        }

        if (user.verificationCode !== otp) {
            return res.status(400).json({ message: "Invalid verification code." });
        }

        const { accessToken, refreshToken } = await generateToken(user.id);

        user.isVerified = true;
        user.refreshToken = refreshToken;
        user.verificationCode = undefined;
        user.verificationCodeExpiry = undefined;
        await user.save();

        return res.status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json({
                user,
                success: true,
                message: "Email verified successfully",
            });

    } catch (error) {
        return res.status(500).json({ sucess: false, error: (error as Error).message });
    }
};


const resendVerificationCode = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid user ID." });
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
            return res.status(404).json({ success: false, message: "User not found." });
        }

        //sent email with verification code

        return res.status(200).json({
            id: user.id,
            success: true,
            message: "Verification code sent successfully.",
        });

    } catch (error) {
        return res.status(500).json({ sucess: false, error: (error as Error).message });
    }
};


const Logout = async (req: Request, res: Response) => {
    try {
        await Users.findByIdAndUpdate(
            req.auth.id,
            {
                $unset: { refreshToken: 1 },
            },
            { new: true }
        );

        return res.status(200)
            .clearCookie("accessToken", option)
            .clearCookie("refreshToken", option)
            .json({
                success: true,
                message: "User logged out successfully.",
            });

    } catch (error) {
        return res.status(500).json({ sucess: false, error: (error as Error).message });
    }
};


const refreshAccessToken = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.refreshToken || req.body.refreshToken;

        if (!token) {
            return res.status(401).json({ success: false, message: "Unauthorized request!.." });
        }

        const decode = await jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET!
        ) as jwtToken;

        const user = await Users.findById(decode.id) as userType;

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid refresh token!.." });
        }

        if (token !== user.refreshToken) {
            return res.status(401).json({ success: false, message: "Refresh token is expired!.." });
        }

        const { accessToken, refreshToken } = await generateToken(user.id);

        return res.status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .json({
                success: true,
                message: "Access token and refresh token updated successfully!..",
            });

    } catch (error) {
        return res.status(500).json({ sucess: false, error: (error as Error).message });
    }
};


const getProfile = async (req: Request, res: Response) => {
    try {
        return res.status(200).json({
            user: req.auth,
            success: true,
            message: "current user fetched successfully."
        });

    } catch (error) {
        return res.status(500).json({ sucess: false, error: (error as Error).message });
    }
};


const updateProfileImage = async (req: Request, res: Response) => {
    try {
        const profileImageLocal = req.file?.path;

        if (!profileImageLocal) {
            return res.status(400).json({ success: false, message: "Profile image is required." });
        }

        const existingUser = await Users.findById(req.auth.id);

        if (existingUser?.profileImage?.publicId) {
            await deleteFromCloudinary(existingUser.profileImage.publicId, "image");
        }

        const uploadedImage = await UploadOnCloudinary(profileImageLocal, "image");

        if (!uploadedImage?.url) {
            return res.status(500).json({ success: false, message: "Error while uploading image." });
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

        return res.status(200).json({
            user: user,
            success: true,
            message: "Profile image updated successfully.",
        });

    } catch (error) {
        return res.status(500).json({ sucess: false, error: (error as Error).message });
    }
};


const forgetPassword = async (req: Request, res: Response) => {
    try {
        const email = req.body.email;

        if (!email) {
            return res.status(400).json({ success: false, message: "email is required!.." });
        }

        const user = await Users.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ success: false, message: "user does not exist!.." });
        }

        const verificationCode = crypto.randomInt(100000, 999999);
        user.verificationCode = verificationCode;
        user.verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save();

        // send email with verificationCode...

        return res.status(200).json({
            success: true,
            id: user.id,
            email: user.email,
            message: `OTP sent to ${user.email}`,
        });

    } catch (error) {
        return res.status(500).json({ sucess: false, error: (error as Error).message });
    }
};


const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { otp } = req.body;

        if (!otp) {
            return res.status(400).json({ success: false, message: "OTP is required." });
        }

        const user = (await Users.findById(req.params.id)) as userType;

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        if (user.verificationCode !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP." });
        }

        if (!user.verificationCodeExpiry || new Date(user.verificationCodeExpiry) <= new Date()) {
            return res.status(400).json({ success: false, message: "OTP has expired." });
        }

        user.verificationCode = undefined;
        user.verificationCodeExpiry = undefined;
        await user.save();

        const updatedUser = await Users.findById(user.id).select(
            "-password -refreshToken -verificationCode -verificationCodeExpiry"
        );

        return res.status(200).json({
            user: updatedUser,
            success: true,
            message: "OTP verified successfully.",
        });

    } catch (error) {
        return res.status(500).json({ sucess: false, error: (error as Error).message });
    }
};


const resetPassword = async (req: Request, res: Response) => {
    try {
        const { password } = req.body;
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid user ID." });
        }

        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required." });
        }

        const user = await Users.findByIdAndUpdate(
            id,
            { $set: { password } },
            { new: true }
        ).select("-password -refreshToken -verificationCode -verificationCodeExpiry");

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found or error while resetting password." });
        }

        return res.status(200).json({
            success: true,
            message: "Password reset successfully.",
        });

    } catch (error) {
        return res.status(500).json({ success: false, error: (error as Error).message });
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