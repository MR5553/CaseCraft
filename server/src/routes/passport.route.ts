import { Response, Request, Router, CookieOptions } from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { jwtToken } from "../types/jwt.types";
import { asyncHandler } from "../utils/asyncHandler";
import { userType } from "../types/user.types";

const router = Router();

const option: CookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
};

router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { session: false, failureRedirect: `${process.env.CLIENT_ORIGIN}/sign-in` }),
    asyncHandler(async (req: Request, res: Response) => {
        const user = req.user as userType;

        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
            } as jwtToken,
            process.env.ACCESS_TOKEN_SECRET!,
            {
                expiresIn: "3d"
            }
        );

        const refreshToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
            } as jwtToken,
            process.env.REFRESH_TOKEN_SECRET!,
            {
                expiresIn: "7d"
            }
        );

        return res
            .status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .redirect(`${process.env.CLIENT_ORIGIN!}/`)
    })
);


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_ORIGIN}/sign-in` }),
    asyncHandler(async (req: Request, res: Response) => {
        const user = req.user as userType;

        const accessToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
            } as jwtToken,
            process.env.ACCESS_TOKEN_SECRET!,
            {
                expiresIn: "3d"
            }
        );

        const refreshToken = jwt.sign(
            {
                id: user.id,
                email: user.email,
            } as jwtToken,
            process.env.REFRESH_TOKEN_SECRET!,
            {
                expiresIn: "30d"
            }
        );

        return res
            .status(200)
            .cookie("accessToken", accessToken, option)
            .cookie("refreshToken", refreshToken, option)
            .redirect(`${process.env.CLIENT_ORIGIN}/`)
    })
);

export default router;