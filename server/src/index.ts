import "dotenv/config";
import db from "./db/dbConfig";
import express from "express";
import cors from "cors";
import morgan from "morgan";
import CookieParser from "cookie-parser";
import passport from "passport";
import "./passport/passport";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { globalErrorHandler } from "./utils/globalErrorHandler";
db();

const { PORT } = process.env || 8000;

const app = express();

app.use(helmet());
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(express.static("public"));
app.use(CookieParser());
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: {
        message: "Too many requests from this IP, please try again later",
        error: "RATE_LIMIT_EXCEEDED"
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(globalLimiter);

app.use(cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(passport.initialize());


import userRoute from "./routes/user.route";
import authRoute from "./routes/passport.route";
import modelRoute from "./routes/model.route";
import orderRoute from "./routes/order.route";


app.use("/api/auth", userRoute);
app.use("/api/passport", authRoute);
app.use("/api/model", modelRoute)
app.use("/api/payment", orderRoute)


app.use(globalErrorHandler);

app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});

export default app;