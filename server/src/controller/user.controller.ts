import { Request, Response } from "express";
import { Users } from "../model/Users.model";
import { userType } from "../types/user.types";
import crypto from "node:crypto";
// import { EmailVerification } from "../mail/template.mail";
import jwt from "jsonwebtoken";
import { jwtToken } from "../types/jwt.types";
import { deleteFromCloudinary, UploadOnCloudinary } from "../utils/Cloudinary";
import { isValidObjectId } from "mongoose";
import Option from "../utils/Cookie";


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

        const exist = await Users.findOne({ email });

        if (exist) {
            return res.status(409).json({
                success: false,
                message: "User already exists, please signin instead."
            });
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
            return res.status(500).json({ success: false, message: "Erro while creating user." });
        }

        // await EmailVerification(user);

        return res.status(201).json({
            user: user,
            success: true,
            message: `We just sent a verification mail to ${email}`,
        });

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred.",
        });
    }
};


const signin = async (req: Request, res: Response) => {
    try {
        const { email, password }: userType = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const user = await Users.findOne({ email: email }).select("+password") as userType;

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User does not exist, please sign up instead"
            });
        }

        if (!user.verified) {
            return res.status(400).json({
                userId: user.id,
                success: false,
                message: "Please verify your email to continue"
            });
        }

        const isPasswordValid = await user.passwordValidation(password);

        if (!isPasswordValid) {
            return res.status(400).json({
                success: false,
                message: "Incorrect password."
            });
        }

        const { accessToken, refreshToken } = await generateToken(user.id);

        const userResponse = user.toJSON();
        delete userResponse.password;

        return res.status(200)
            .cookie("accessToken", accessToken, Option.access)
            .cookie("refreshToken", refreshToken, Option.refresh)
            .json({
                success: true,
                message: "User logged in successfully.",
                user: userResponse,
            });

    } catch (error) {
        console.error("Controller Error:", error);

        return res.status(500).json({
            success: false,
            message: "An internal server error occurred.",
        });
    }
};


const VerifyEmail = async (req: Request, res: Response) => {
    try {
        const otp: number = req.body.otp;

        if (!otp) {
            return res.status(400).json({ message: "verification code required." });
        }

        if (!isValidObjectId(req.params.id)) {
            return res.status(409).json({ message: "Invalid user id." });
        }

        const user = await Users.findById(req.params.id).select("+verification_code +verification_code_expiry");

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.verified) {
            return res.status(400).json({ message: "User already verified!.. " });
        }

        if (!user.verificationCodeExpiry || user.verificationCodeExpiry <= new Date()) {
            return res.status(400).json({ message: "Verification code has expired." });
        }

        if (user.verificationCode !== otp) {
            return res.status(400).json({ message: "Invalid verification code." });
        }

        const { accessToken, refreshToken } = await generateToken(user.id);

        const userResponse = await Users.findByIdAndUpdate(
            user.id,
            {
                $set: {
                    verified: true,
                    refreshToken: refreshToken,
                },
                $unset: {
                    verificationCode: 1,
                    verificationCodeExpiry: 1
                },
            },
            { new: true }
        );

        return res.status(200)
            .cookie("accessToken", accessToken, Option.access)
            .cookie("refreshToken", refreshToken, Option.refresh)
            .json({
                user: userResponse,
                success: true,
                message: "Email verified successfully",
            });

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred.",
        });
    }
};


const ResendVerificationCode = async (req: Request, res: Response) => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res.status(400).json({ success: false, message: "Invalid user ID." });
        }

        const verificationCode = crypto.randomInt(100000, 999999);

        const user = await Users.findByIdAndUpdate(req.params.id,
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
            success: true,
            message: "Verification code sent successfully.",
        });

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred.",
        });
    }
};


const Logout = async (req: Request, res: Response) => {
    try {
        if (!req.auth || !req.auth.id) {
            return res.status(401).json({ success: false, message: "User not authenticated." });
        }

        await Users.findByIdAndUpdate(
            req.auth.id,
            {
                $unset: { refreshToken: 1 },
            },
            { new: true }
        );

        return res.status(200)
            .clearCookie("accessToken", Option.access)
            .clearCookie("refreshToken", Option.refresh)
            .json({
                success: true,
                message: "User logged out successfully.",
            });

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred.",
        });
    }
};


const refreshAccessToken = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.refreshToken || req.body.refreshToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request!.."
            });
        }

        const decode = await jwt.verify(
            token,
            process.env.REFRESH_TOKEN_SECRET as string
        ) as jwtToken;

        const user = await Users.findById(decode.id) as userType;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token!.."
            });
        }

        if (token !== user.refreshToken) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is expired or invalid!."
            });
        }

        const { accessToken, refreshToken } = await generateToken(user.id);

        return res.status(200)
            .cookie("accessToken", accessToken, Option.access)
            .cookie("refreshToken", refreshToken, Option.refresh)
            .json({
                success: true,
                message: "Access token and refresh token updated successfully!..",
            });

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred.",
        });
    }
};


const getProfile = async (req: Request, res: Response) => {
    try {
        if (!req.auth) {
            return res.status(401).json({ success: false, message: "User not authenticated." });
        }

        return res.status(200).json({
            user: req.auth,
            success: true,
            message: "current user fetched successfully."
        });
    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred.",
        });
    }
};


const updateProfileImage = async (req: Request, res: Response) => {
    try {
        if (!req.auth || !req.auth.id) {
            return res.status(401).json({ success: false, message: "User not authenticated." });
        }

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
        );

        return res.status(200).json({
            user: user,
            success: true,
            message: "Profile image updated successfully.",
        });

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred.",
        });
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
            return res.status(200).json({ message: "If this email exists, you will receive instructions." });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
            },
            process.env.ACCESS_TOKEN_SECRET as string,
            {
                expiresIn: "1h"
            }
        );

        user.token = token;
        await user.save({ validateBeforeSave: false });

        // send email with verificationCode...

        return res.status(200).cookie("reset_token", token, Option.reset).json({
            success: true,
            message: `An instruction sent to ${user.email}`,
        });

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred.",
        });
    }

};


const resetPassword = async (req: Request, res: Response) => {
    try {
        const token = req.cookies.reset_token || req.body.reset_token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized request!.."
            });
        }

        const decode = await jwt.verify(
            token,
            process.env.ACCESS_TOKEN_SECRET as string
        ) as jwtToken;

        const user = await Users.findById(decode.id).select("+token") as userType;

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid refresh token!.."
            });
        }

        if (token !== user.token) {
            return res.status(401).json({
                success: false,
                message: "Refresh token is expired or invalid!."
            });
        }

        const password = req.body.password;

        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required." });
        }

        user.password = password;
        user.token = "";
        await user.save({ validateBeforeSave: true });

        return res.status(200).clearCookie("reset_token").json({
            success: true,
            message: "Password reset successfully. Please sign in with your new password.",
        });

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred.",
        });
    }
};


const updateProfile = async (req: Request, res: Response) => {
    try {
        if (!req.auth || !req.auth.id) {
            return res.status(401).json({ success: false, message: "User not authenticated." });
        }

        const address = req.body;

        if (!address || !address.city) {
            return res.status(400).json({ success: false, message: "City and address details are missing" });
        }

        const user = await Users.findByIdAndUpdate(
            req.auth.id,
            {
                $set: {
                    address: address
                }
            },
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found or error while resetting password." });
        }

        return res.status(200).json({
            success: true,
            message: "Address updated.",
            user: user
        });

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred.",
        });
    }
};


export {
    forgetPassword,
    getProfile,
    Logout,
    refreshAccessToken,
    ResendVerificationCode,
    resetPassword,
    signin,
    signup,
    updateProfileImage,
    VerifyEmail,
    updateProfile
};