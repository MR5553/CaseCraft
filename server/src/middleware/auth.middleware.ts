import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Users } from "../model/Users.model";
import { jwtToken } from "../types/jwt.types";
import { asyncHandler } from "../utils/asyncHandler";


export const auth = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", " ");

    if (!token) return res.status(400).json({ message: "No token found, Sign-in instead." });

    const decodedToken = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as jwtToken;

    const user = await Users.findById(decodedToken.id).select("-profileInfo.password -refreshToken");

    if (!user) return res.status(404).json({ message: "Unathorized access." });

    req.auth = user;

    return next();
});