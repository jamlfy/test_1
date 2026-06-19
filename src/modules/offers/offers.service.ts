import { prisma } from "../../config/database.js";
import { AppError } from "../../shared/errors/AppError.js";
import { HttpCode } from "../../shared/errors/HttpCode.js";

export const offersService = {
    async create(
        requestId: string,
        providerId: string,
        data: { price: number; message?: string },
    ) {
        const request = await prisma.productRequest.findUnique({
            where: { id: requestId },
        });
        if (!request)
            throw new AppError(HttpCode.NOT_FOUND, "Solicitud no encontrada");
        if (
            request.status === "ACCEPTED" ||
            request.status === "CANCELLED" ||
            request.status === "REJECTED"
        ) {
            throw new AppError(
                HttpCode.BAD_REQUEST,
                "La solicitud ya está cerrada",
            );
        }

        const offer = await prisma.offer.create({
            data: {
                requestId,
                providerId,
                price: data.price,
                message: data.message ?? "",
            },
        });

        if (request.status === "PENDING") {
            await prisma.productRequest.update({
                where: { id: requestId },
                data: { status: "OFFERED" },
            });
        }

        return offer;
    },

    async listByRequest(requestId: string) {
        return prisma.offer.findMany({
            where: { requestId },
            include: {
                provider: { select: { id: true, name: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });
    },

    async accept(_offerId: string, _clientId: string) {
        throw new AppError(HttpCode.NOT_IMPLEMENTED, "Función no implementada");
    },

    async reject(_offerId: string, _clientId: string) {
        throw new AppError(HttpCode.NOT_IMPLEMENTED, "Función no implementada");
    },

    async counter(
        _offerId: string,
        _clientId: string,
        _data: { price: number; message?: string },
    ) {
        throw new AppError(HttpCode.NOT_IMPLEMENTED, "Función no implementada");
    },

    async respondToCounter(
        _offerId: string,
        _providerId: string,
        _data: { action: string; price?: number; message?: string },
    ) {
        throw new AppError(HttpCode.NOT_IMPLEMENTED, "Función no implementada");
    },
};
