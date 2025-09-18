import { Response, Request, Router } from "express";
import passport from "passport";
import { userType } from "../types/user.types";
import { generateToken, option } from "../controller/user.controller";


const router = Router();


router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { session: false, failureRedirect: `${process.env.CLIENT_ORIGIN}/sign-in` }),
    async (req: Request, res: Response) => {
        try {
            const user = req.user as userType;

            const { accessToken, refreshToken } = await generateToken(user.id);

            return res
                .status(200)
                .cookie("accessToken", accessToken, option)
                .cookie("refreshToken", refreshToken, option)
                .redirect(`${process.env.CLIENT_ORIGIN!}/`)

        } catch (error) {
            console.error("GitHub login error:", error);
            res.redirect(
                `${process.env.CLIENT_ORIGIN}/sign-in?error=oauth_failed`
            );
        }
    }
);


router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_ORIGIN}/sign-in` }),
    async (req: Request, res: Response) => {
        try {
            const user = req.user as userType;

            const { accessToken, refreshToken } = await generateToken(user.id);

            return res
                .status(200)
                .cookie("accessToken", accessToken, option)
                .cookie("refreshToken", refreshToken, option)
                .redirect(`${process.env.CLIENT_ORIGIN!}/`)

        } catch (error) {
            console.error("GitHub login error:", error);
            res.redirect(
                `${process.env.CLIENT_ORIGIN}/sign-in?error=oauth_failed`
            );
        }
    }
);

export default router;