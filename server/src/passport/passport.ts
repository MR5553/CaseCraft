import passport from "passport";
import { Strategy as GitHubStrategy, Profile as GitHub } from "passport-github2"
import { VerifyCallback } from "passport-oauth2";
import { Strategy as GoogleStrategy, Profile as Google } from "passport-google-oauth20";
import { Users } from "../model/Users.model";
import { userType } from "../types/user.types";


passport.use(new GitHubStrategy(
    {
        clientID: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        callbackURL: `${process.env.SERVER_URL}/auth/github/callback`,
        scope: ["user:email"]
    },
    async function (_accessToken: string, _refreshToken: string, profile: GitHub, done: VerifyCallback) {
        try {
            const email = profile.emails?.[0]?.value;
            const image = profile.photos?.[0]?.value;

            const isUserExists = await Users.findOne({
                $or: [
                    { "profileInfo.email": email },
                    { "profileInfo.username": profile.username },
                    { "githubId": profile.id }
                ]
            });

            if (isUserExists) {
                if (!isUserExists.githubId) {
                    isUserExists.githubId = profile.id;
                    isUserExists.providers.push(profile.provider);

                    await isUserExists.save();
                }

                return done(null, isUserExists as userType);
            }

            const user = await Users.create({
                profileInfo: {
                    name: profile.displayName || profile.username,
                    email: email,
                    username: profile.username,
                    profileImage: {
                        imageUrl: image
                    }
                },
                githubId: profile.id,
                providers: profile.provider,
                isVerified: true
            });
            return done(null, user as userType);

        } catch (error) {
            return done(error as Error);
        }
    }
));

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: `${process.env.SERVER_URL}/auth/google/callback`,
        scope: ["user:email"]
    },
    async function (_accessToken: string, _refreshToken: string, profile: Google, done: VerifyCallback) {
        try {
            const email = profile.emails![0].value;
            const image = profile.photos![0].value;

            const isUserExists = await Users.findOne({
                $or: [
                    { "profileInfo.email": email },
                    { "profileInfo.username": profile.username },
                    { "googleId": profile.id }
                ]
            });

            if (isUserExists) {
                if (!isUserExists.googleId) {
                    isUserExists.googleId = profile.id;
                    isUserExists.providers.push(profile.provider);

                    await isUserExists.save();
                }

                return done(null, isUserExists as userType)
            }

            const user = await Users.create({
                profileInfo: {
                    name: profile.displayName || profile.username,
                    email: email,
                    username: profile.username,
                    profileImage: {
                        imageUrl: image
                    }
                },
                providers: profile.provider,
                googleId: profile.id,
                isVerified: profile._json.email_verified
            });
            return done(null, user as userType);

        } catch (error) {
            return done(error as Error);
        }
    }
));