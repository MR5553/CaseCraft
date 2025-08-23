import express from "express";
import cors from "cors";
import morgan from "morgan";
import CookieParser from "cookie-parser";
import passport from "passport";
import "./passport/passport"
import { globalErrorHandler } from "./utils/globalErrorHandler";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));
app.use(CookieParser());
app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(passport.initialize());


import userRoute from "./routes/user.route";
import authRoute from "./routes/passport.route";
import caseRoute from "./routes/case.route";

app.use("/api/auth", userRoute);
app.use("/auth", authRoute);
app.use("/api", caseRoute)


app.use(globalErrorHandler);

export default app;