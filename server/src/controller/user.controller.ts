import { CookieOptions, Request, Response } from "express";
import { Users } from "../model/Users.model";
import { userType } from "../types/user.types";
import crypto from "node:crypto";
import { EmailVerification, ResetPassword } from "../mail/template.mail";
import { asyncHandler } from "../utils/asyncHandler";
import { apiError } from "../utils/apiError";
import mongoose, { isValidObjectId } from "mongoose";
import jwt from "jsonwebtoken";
import { jwtToken } from "../types/jwt.types";
import { deleteFromCloudinary, UploadOnCloudinary } from "../utils/Cloudinary";


const option: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 30 * 24 * 60 * 60 * 1000,
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

const signup = asyncHandler(async (req: Request, res: Response) => {
    const { name, email, password }: userType["profileInfo"] = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Name, Email & Password are required." });
    }

    const isUserExists = await Users.findOne({ "profileInfo.email": email });

    if (isUserExists) {
        if (isUserExists.isVerified) throw new apiError(409, "User already exists, please signin instead.")

        throw new apiError(404, "user already exists, please verify email");
    }

    const verificationCode = crypto.randomInt(100000, 999999);

    const user = await Users.create({
        profileInfo: {
            name,
            email,
            username: email.split("@")[0].toLowerCase(),
            password
        },
        verificationCode: verificationCode,
        verificationCodeExpiry: Date.now() + (60 * 60 * 1000)
    }) as userType;

    if (!user) throw new apiError(404, "Unable to create user.")

    await EmailVerification(user);

    const createdUser = await Users.findById(user._id).select("-profileInfo.password -refreshToken -verificationCode -verificationCodeExpiry");

    return res.status(201).json({
        user: createdUser,
        success: true,
        message: `We just sent a verification mail to ${email}`
    });
});

const signin = asyncHandler(async (req: Request, res: Response) => {
    const { email, username, password }: userType["profileInfo"] = req.body;

    if ((!email && !username) || !password) {
        return res.status(404).json({ message: "Email or username and password is required." });
    }

    const isUserExists = await Users.findOne({
        $or: [{ "profileInfo.email": email, "profileInfo.username": username }]
    }).select("-refreshToken -verificationCode -verificationCodeExpiry");

    if (!isUserExists) throw new apiError(404, "user does not exist, signup intead.");

    if (!isUserExists.isVerified) throw new apiError(401, "Please verify your email to continue.");

    if (!isUserExists.profileInfo.password) {
        throw new apiError(400, "Please sign in with your social account.");
    }

    const isValidPassword = isUserExists.isPasswordCorrect(password);

    if (!isValidPassword) throw new apiError(400, "Incorrect password.")

    const { accessToken, refreshToken } = await generateToken(String(isUserExists._id));

    const user = await Users.findById(isUserExists._id).select("-profileInfo.password -refreshToken -verificationCode -verificationCodeExpiry");

    return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json({
            user: user,
            success: true,
            message: "User Logged in successfully."
        });
});

const VerifyEmail = asyncHandler(async (req: Request, res: Response) => {
    const otp: number = req.body.otp;

    if (!otp) return res.status(404).json({ message: "verification code required." });

    if (!isValidObjectId(req.params.id)) return res.status(409).json({ message: "Invalid user id." });;

    const user = await Users.findById(req.params.id).select("-profileInfo.password") as userType;

    if (user.isVerified) throw new apiError(400, "user already verified!..")

    if (!user.verificationCodeExpiry || user.verificationCodeExpiry <= new Date()) {
        throw new apiError(400, "Verification code has expired.");
    }

    if (user.verificationCode !== otp) throw new apiError(400, "Invalid verification code.");

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
            user: user,
            success: true,
            message: "email verified successfully"
        });
});

const ResendEmailVerificationCode = asyncHandler(async (req: Request, res: Response) => {
    if (!isValidObjectId(req.params.id)) throw new apiError(400, "Invalid user id");

    const verificationCode = crypto.randomInt(100000, 999999);

    const user = await Users.findByIdAndUpdate(req.params.id, {
        verificationCode: verificationCode,
        verificationCodeExpiry: Date.now() + (60 * 60 * 1000)
    }) as userType;

    return res.status(200).json({
        id: user.id,
        success: true,
        message: "verification code sent successfully",
    });
});

const Logout = asyncHandler(async (req: Request, res: Response) => {
    await Users.findByIdAndUpdate(req.authUser.id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        { new: true }
    );

    return res.status(200)
        .clearCookie("accessToken", option)
        .clearCookie("refreshToken", option)
        .json({
            sucsess: true,
            message: "user logout successfully."
        });
});

const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const recieveToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!recieveToken) throw new apiError(401, "unathorized requiest!..");

    const decodeToken = await jwt.verify(recieveToken, process.env.REFRESH_TOKEN_SECRET!) as jwtToken;

    const user = await Users.findById(decodeToken._id) as userType;

    if (!user) throw new apiError(401, "invalid refresh token!..");

    if (recieveToken !== user.refreshToken) throw new apiError(401, "refresh token is expired!..");

    const { accessToken, refreshToken } = await generateToken(user.id);

    return res.status(200)
        .cookie("accessToken", accessToken, option)
        .cookie("refreshToken", refreshToken, option)
        .json({
            success: true,
            message: "access token and refreshToken update successfully!.."
        });
});

const getProfile = asyncHandler(async (req: Request, res: Response) => {
    return res.status(200).json({
        user: req.authUser,
        success: true,
        message: "current user fetched successfully."
    });
});

const updateAccountDetails = asyncHandler(async (req: Request, res: Response) => {
    const { profileInfo: { name, username, description }, socialLinks: { LinkedIn, facebook, instagram, twitter, website } }: userType = req.body;

    const user = await Users.findByIdAndUpdate(req.authUser.id,
        {
            $set: {
                profileInfo: {
                    name,
                    username,
                    description
                },
                socialLinks: {
                    LinkedIn,
                    facebook,
                    instagram,
                    twitter,
                    website
                }
            }
        }, { new: true }
    ).select("-profileInfo.password -refreshToken -verificationCode -verificationCodeExpiry");

    return res.status(200).json({
        user: user,
        success: true,
        message: "account details updated!.."
    });
});

const updateProfileImage = asyncHandler(async (req: Request, res: Response) => {
    const profileImageLocal = req.file?.path;

    if (!profileImageLocal) return res.status(404).json({ message: "profile image required!.." });

    const oldProfileImage = await Users.findById(req.authUser.id) as userType;
    await deleteFromCloudinary(oldProfileImage.profileInfo.profileImage.publicId, "image");

    const profileImage = await UploadOnCloudinary(profileImageLocal, "image");

    if (profileImage.url) throw new apiError(400, "error while uploading image!..");

    const user = await Users.findByIdAndUpdate(req.authUser.id,
        {
            $set: {
                profileInfo: {
                    profileImage: {
                        imageUrl: profileImage.url,
                        publicId: profileImage.public_id
                    }
                }
            }
        }, { new: true }
    ).select("-profileInfo.password -refreshToken -verificationCode -verificationCodeExpiry");

    return res.status(200).json({
        user: user,
        success: true,
        message: "profile image updated!.."
    });
});

const forgetPassword = asyncHandler(async (req: Request, res: Response) => {
    const { email, username }: userType["profileInfo"] = req.body;

    if (!email && !username) return res.status(400).json({ message: "email or username is required!.." });

    const user = await Users.findOne({
        $or: [{ "profileInfo.email": email, "profileInfo.username": username }]
    }) as userType;

    if (!user) throw new apiError(404, "user does not exists!..");

    const verificationCode = crypto.randomInt(100000, 999999);

    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = new Date(Date.now() + (10 * 60 * 1000));
    await user.save();

    await ResetPassword(user);

    return res.status(200).json({
        id: user.id,
        success: true,
        message: `otp sent to ${user.profileInfo.email}`
    });
});

const VerifyOtp = asyncHandler(async (req: Request, res: Response) => {
    const otp: number = req.body.otp;

    if (!otp) return res.status(400).json({ message: "Otp is missing" });

    const user = await Users.findById(req.params.id) as userType;

    if (!user || user.verificationCode !== otp) {
        throw new apiError(400, "invalid Otp!..");
    }

    if (!user.verificationCodeExpiry || new Date(user.verificationCodeExpiry) <= new Date()) {
        throw new apiError(400, "Verification code has expired.");
    }

    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    const upadatedUser = await Users.findById(user.id).select("-profileInfo.password -refreshToken -verificationCode -verificationCodeExpiry");

    return res.status(200).json({
        user: upadatedUser,
        success: true,
        message: "Otp verified successfully."
    });
});

const resetPassword = asyncHandler(async (req: Request, res: Response) => {
    const password: string = req.body.password;

    if (!isValidObjectId(req.params.id)) return res.status(400).json({ message: "user id is not valid!.." });
    if (!password) return res.status(400).json({ message: "password is required!.." });

    const user = await Users.findByIdAndUpdate(req.params.id,
        {
            $set: {
                profileInfo: {
                    password: password
                }
            }
        },
        { new: true }
    ).select("-profileInfo.password -refreshToken -verificationCode -verificationCodeExpiry");

    if (!user) return res.status(400).json({ message: "error while resetting password!.." });

    return res.status(200).json({
        success: true,
        message: "password reset succesfully."
    });
});

const getWatchHistory = asyncHandler(async (req: Request, res: Response) => {
    const user = Users.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.authUser.id)
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullname: 1,
                                        username: 1,
                                        profileImage: 1
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "owner"
                            }
                        }
                    }
                ]
            }
        }
    ]);

    return res.status(200).json({
        success: true,
        message: "user watch history fetched.",
        watchHistory: user
    })
});

const setUsername = asyncHandler(async (req: Request, res: Response) => {
    const username: string = req.body.username;

    if (!username) return res.status(400).json({ message: "username is missing!.." });

    const existingUser = await Users.findOne({ "profileInfo.username": username }) as userType;

    if (existingUser && existingUser.id !== req.authUser.id) {
        throw new apiError(400, "username is already taken")
    }

    const user = await Users.findByIdAndUpdate(req.authUser.id,
        {
            $set: {
                profileInfo: {
                    username: username
                }
            }
        }
    ).select("-profileInfo.password -refreshToken -verificationCode -verificationCodeExpiry");

    return res.status(200).json({
        success: true,
        message: "username set successfully!..",
        user: user
    });

});

export {
    forgetPassword,
    getProfile,
    getWatchHistory,
    Logout,
    refreshAccessToken,
    ResendEmailVerificationCode,
    resetPassword,
    signin,
    signup,
    setUsername,
    updateAccountDetails,
    updateProfileImage,
    VerifyEmail,
    VerifyOtp
};