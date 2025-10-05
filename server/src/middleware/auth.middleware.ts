import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Users } from "../model/Users.model";
import { jwtToken } from "../types/jwt.types";


export const verifyJwtToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(400).json({
                success: false,
                message: "No token found, please sign in."
            });
        }

        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as jwtToken;

        const user = await Users.findOne({ $or: [{ "_id": decoded.id }, { "email": decoded.email }] });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Unauthorized access."
            });
        }

        req.auth = user;

        return next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error?.description || error?.message || "Unathorized access.",
        });
    }
};