import passport from "passport";
import { Strategy as GitHubStrategy, Profile as GitHub } from "passport-github2"
import { VerifyCallback } from "passport-oauth2";
import { Strategy as GoogleStrategy, Profile as Google } from "passport-google-oauth20";
import { Users } from "../model/Users.model";
import { userType } from "../types/user.types";


passport.use(new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID as string,
        clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        callbackURL: `${process.env.SERVER_URL}/auth/github/callback`,
        scope: ["user:email"]
    },
    async function (_accessToken: string, _refreshToken: string, profile: GitHub, done: VerifyCallback) {
        try {
            const email = profile.emails?.[0]?.value;
            const image = profile.photos?.[0]?.value;

            let user = await Users.findOne({ email });

            if (user) {
                const hasGitHub = user.providers.some((p) => p.provider === "github" && p.providerId === profile.id
                );

                if (!hasGitHub) {
                    user.providers.push({ provider: "github", providerId: profile.id });
                    await user.save();
                }

                return done(null, user as userType);
            }

            user = await Users.create({
                name: profile.displayName || profile.username,
                email,
                profileImage: { imageUrl: image },
                providers: [{ provider: "github", providerId: profile.id }],
                verified: true,
            });

            return done(null, user as userType);

        } catch (error) {
            return done(error as Error);
        }
    }
));

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
        scope: ["user:email"]
    },
    async function (_accessToken: string, _refreshToken: string, profile: Google, done: VerifyCallback) {
        try {
            const email = profile.emails![0].value;
            const image = profile.photos![0].value;

            let user = await Users.findOne({ email });

            if (user) {
                const hasGoogle = user.providers.some((p) => p.provider === "google" && p.providerId === profile.id
                );

                if (!hasGoogle) {
                    user.providers.push({ provider: "google", providerId: profile.id });
                    await user.save();
                }

                return done(null, user as userType);
            }

            user = await Users.create({
                name: profile.displayName || profile.username,
                email,
                profileImage: { imageUrl: image },
                providers: [{ provider: "google", providerId: profile.id }],
                verified: profile._json.email_verified ?? false,
            });
            return done(null, user as userType);

        } catch (error) {
            return done(error as Error);
        }
    }
));