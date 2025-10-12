import { Response, Request, Router } from "express";
import passport from "passport";
import { userType } from "../types/user.types";
import { generateToken } from "../controller/user.controller";
import Option from "../utils/Cookie";


const router = Router();


router.get("/github", passport.authenticate("github", { scope: ["user:email"] }));
router.get("/github/callback", passport.authenticate("github", { session: false, failureRedirect: `${process.env.CLIENT_ORIGIN}/sign-in` }),
    async (req: Request, res: Response) => {
        try {
            const user = req.user as userType;

            const { accessToken, refreshToken } = await generateToken(user.id);

            return res
                .status(200)
                .cookie("accessToken", accessToken, Option.access)
                .cookie("refreshToken", refreshToken, Option.refresh)
                .redirect(`${process.env.CLIENT_ORIGIN}${URL}`)

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

            const URL = (req.query.state as string) || "/";

            return res
                .status(200)
                .cookie("accessToken", accessToken, Option.access)
                .cookie("refreshToken", refreshToken, Option.refresh)
                .redirect(`${process.env.CLIENT_ORIGIN}${URL}`)

        } catch (error) {
            console.error("GitHub login error:", error);
            res.redirect(
                `${process.env.CLIENT_ORIGIN}/sign-in?error=oauth_failed`
            );
        }
    }
);

export default router;