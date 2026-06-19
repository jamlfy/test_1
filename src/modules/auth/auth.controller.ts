import { Request, Response, NextFunction } from "express";
import { authService } from "./auth.service.js";
import { HttpCode } from "../../shared/errors/HttpCode.js";

export const authController = {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.register(req.body);
            res.status(HttpCode.CREATED).json(result);
        } catch (e) {
            next(e);
        }
    },

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;
            const result = await authService.login(email, password);
            res.json(result);
        } catch (e) {
            next(e);
        }
    },

    async me(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await authService.me(req.user!.userId);
            res.json(result);
        } catch (e) {
            next(e);
        }
    },
};
