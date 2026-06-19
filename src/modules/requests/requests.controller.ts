import { Request, Response, NextFunction } from "express";
import { requestsService } from "./requests.service.js";
import { HttpCode } from "../../shared/errors/HttpCode.js";

export const requestsController = {
    async create(req: Request, res: Response, next: NextFunction) {
        try {
            const request = await requestsService.create(
                req.user!.userId,
                req.body,
            );
            res.status(HttpCode.CREATED).json(request);
        } catch (e) {
            next(e);
        }
    },

    async list(req: Request, res: Response, next: NextFunction) {
        try {
            const requests = await requestsService.list(
                req.user!.userId,
                req.user!.role,
            );
            res.json(requests);
        } catch (e) {
            next(e);
        }
    },

    async getById(req: Request, res: Response, next: NextFunction) {
        try {
            const request = await requestsService.getById(
                req.params.id as string,
            );
            res.json(request);
        } catch (e) {
            next(e);
        }
    },

    async cancel(req: Request, res: Response, next: NextFunction) {
        try {
            const request = await requestsService.cancel(
                req.params.id as string,
                req.user!.userId,
            );
            res.json(request);
        } catch (e) {
            next(e);
        }
    },
};
