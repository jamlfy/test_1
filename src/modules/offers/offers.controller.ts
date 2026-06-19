import { Request, Response, NextFunction } from "express";
import { offersService } from "./offers.service.js";
import { HttpCode } from "../../shared/errors/HttpCode.js";

export const offersController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const offer = await offersService.create(
                req.params.id as string,
                req.user!.userId,
                req.body,
            );
            res.status(HttpCode.CREATED).json(offer);
        } catch (e) {
            next(e);
        }
    },

    async listByRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const offers = await offersService.listByRequest(
                req.params.id as string,
            );
            res.json(offers);
        } catch (e) {
            next(e);
        }
    },

    async accept(req: Request, res: Response, next: NextFunction) {
        try {
            await offersService.accept(
                req.params.id as string,
                req.user!.userId,
            );
            res.json({ message: "Función no implementada" });
        } catch (e) {
            next(e);
        }
    },

    async reject(req: Request, res: Response, next: NextFunction) {
        try {
            await offersService.reject(
                req.params.id as string,
                req.user!.userId,
            );
            res.json({ message: "Función no implementada" });
        } catch (e) {
            next(e);
        }
    },

    async counter(req: Request, res: Response, next: NextFunction) {
        try {
            await offersService.counter(
                req.params.id as string,
                req.user!.userId,
                req.body,
            );
            res.status(HttpCode.CREATED).json({
                message: "Función no implementada",
            });
        } catch (e) {
            next(e);
        }
    },

    async respondToCounter(req: Request, res: Response, next: NextFunction) {
        try {
            await offersService.respondToCounter(
                req.params.id as string,
                req.user!.userId,
                req.body,
            );
            res.json({ message: "Función no implementada" });
        } catch (e) {
            next(e);
        }
    },
};
