import { ErrorRequestHandler, NextFunction, Request, Response } from "express";
import { apiError } from "../utils/apiError";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler: ErrorRequestHandler = (err: apiError, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({
        status,
        success: false,
        message,
        errors: err.errors || [],
        stack: err.stack
    });
}