import { Request, Response, NextFunction } from "express";
import { AppError } from "../shared/errors/AppError.js";
import { ZodError } from "zod";

export const errorHandler = (
    err: Error,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    if (err instanceof AppError) {
        return res.status(err.statusCode).json({ error: err.message });
    }

    if (err instanceof ZodError) {
        return res.status(400).json({
            error: "Error de validación",
            details: err.errors,
        });
    }

    console.error(err);
    return res.status(500).json({ error: "Error interno del servidor" });
};
