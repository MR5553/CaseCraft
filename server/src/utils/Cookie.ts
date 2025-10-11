import { CookieOptions } from "express";

const Option: { refresh: CookieOptions, access: CookieOptions, reset: CookieOptions } = {
    access: {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
        path: "/",
    },
    refresh: {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
        path: "/",
    },
    reset: {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
        path: "/",
    }
};
export default Option;