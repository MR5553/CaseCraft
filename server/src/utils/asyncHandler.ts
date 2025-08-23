import { NextFunction, Response, Request } from "express";

export const asyncHandler = (reqHandler: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(reqHandler(req, res, next)).catch((err) => next(err));
    };
};