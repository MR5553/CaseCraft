import { CookieOptions, Request, Response } from "express";
import { Users } from "../model/Users.model";
import { userType } from "../types/user.types";
import crypto from "node:crypto";
// import { EmailVerification } from "../mail/template.mail";
import { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import { jwtToken } from "../types/jwt.types";
import { deleteFromCloudinary, UploadOnCloudinary } from "../utils/Cloudinary";


export const refreshTokenOption: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
    path: "/",
};


export const accessTokenOption: CookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "none",
    maxAge: 60 * 60 * 1000,
    path: "/",
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

        const existingUser = await Users.findOne({ email });

        if (existingUser) {
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
            return res.status(401).json({
                success: false,
                message: "Please verify your email to continue"
            });
        }

        if (!user || !user.password) {
            return res.status(401).json({
                success: false,
                message: "Invalid credentials or user not found."
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

        const userResponse = user.toJSON() as userType;
        delete userResponse.password;

        return res.status(200)
            .cookie("accessToken", accessToken, accessTokenOption)
            .cookie("refreshToken", refreshToken, refreshTokenOption)
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

        const user = await Users.findById(req.params.id).select("+verificationCode +verificationCodeExpiry") as userType;

        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.verified) {
            return res.status(400).json({ message: "User already verified!.. " });
        }

        if (!user.verificationCodeExpiry || new Date(user.verificationCodeExpiry) <= new Date()) {
            return res.status(400).json({ message: "Verification code has expired." });
        }

        if (user.verificationCode !== otp) {
            return res.status(400).json({ message: "Invalid verification code." });
        }

        const { accessToken, refreshToken } = await generateToken(user.id);

        user.verified = true;
        user.refreshToken = refreshToken;
        user.verificationCode = undefined;
        user.verificationCodeExpiry = undefined;
        await user.save();

        const userResponse = user.toJSON() as userType;
        delete userResponse.password;
        delete userResponse.verificationCode;
        delete userResponse.verificationCodeExpiry;


        return res.status(200)
            .cookie("accessToken", accessToken, accessTokenOption)
            .cookie("refreshToken", refreshToken, refreshTokenOption)
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
            user: user,
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
            .cookie("accessToken", accessTokenOption)
            .cookie("refreshToken", refreshTokenOption)
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

        const user = await Users.findById(decode.id).select("+refreshToken") as userType;

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
            .cookie("accessToken", accessToken, accessTokenOption)
            .cookie("refreshToken", refreshToken, refreshTokenOption)
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

        const user = await Users.findOne({ email: email }).
            select("+verificationCode +verificationCodeExpiry") as userType;

        if (!user) {
            return res.status(404).json({ success: false, message: "If a user exists, an OTP will be sent." });
        }

        if (user.verificationCodeExpiry && user.verificationCodeExpiry > new Date()) {
            return res.status(400).json({
                success: false,
                message: "An OTP was recently sent. Please wait before requesting a new one."
            });
        }

        const verificationCode = crypto.randomInt(100000, 999999);
        user.verificationCode = verificationCode;
        user.verificationCodeExpiry = new Date(Date.now() + 10 * 60 * 1000);
        await user.save({ validateBeforeSave: false });

        const userResponse = user.toJSON() as userType;
        delete userResponse.verificationCode;
        delete userResponse.verificationCodeExpiry;

        // send email with verificationCode...

        return res.status(200).json({
            success: true,
            user: userResponse,
            message: `OTP sent to ${user.email}`,
        });

    } catch (error) {
        console.error("Controller Error:", error);
        return res.status(500).json({
            success: false,
            message: "An internal server error occurred.",
        });
    }

};


const verifyOtp = async (req: Request, res: Response) => {
    try {
        const { otp } = req.body;
        const { id } = req.params;

        if (!otp) {
            return res.status(400).json({ success: false, message: "OTP is required." });
        }

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid user ID." });
        }

        const user = await Users.findById(id).select("+verificationCode +verificationCodeExpiry") as userType;

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
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({
            user: user,
            success: true,
            message: "OTP verified successfully.",
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
        const { password } = req.body;
        const { id } = req.params;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ success: false, message: "Invalid user ID." });
        }

        if (!password) {
            return res.status(400).json({ success: false, message: "Password is required." });
        }

        const user = await Users.findById(id).select("+password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        user.password = password;
        await user.save({ validateBeforeSave: false });
        await Users.findByIdAndUpdate(id, { $unset: { refreshToken: 1 } });

        return res.status(200).json({
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


const updateAddress = async (req: Request, res: Response) => {
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
    resendVerificationCode,
    resetPassword,
    signin,
    signup,
    updateProfileImage,
    VerifyEmail,
    verifyOtp,
    updateAddress
};