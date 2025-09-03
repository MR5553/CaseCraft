import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

interface Err extends Error {
    status?: number;
    errors?: string[];
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const globalErrorHandler: ErrorRequestHandler = (err: Err, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({
        status,
        message,
        success: false,
        errors: err.errors || [],
        stack: err.stack
    });
}