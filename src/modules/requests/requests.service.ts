import { prisma } from "../../config/database.js";
import { AppError } from "../../shared/errors/AppError.js";
import { HttpCode } from "../../shared/errors/HttpCode.js";

export const requestsService = {
    async create(
        clientId: string,
        data: { productName: string; description?: string },
    ) {
        return prisma.productRequest.create({
            data: {
                clientId,
                productName: data.productName,
                description: data.description ?? "",
            },
        });
    },

    async list(userId: string, role: string) {
        const query =
            role === "CLIENT"
                ? {
                      where: { clientId: userId },
                      include: { offers: true },
                      orderBy: { createdAt: "desc" },
                  }
                : {
                      where: { status: { in: ["PENDING", "OFFERED"] } },
                      include: { offers: { where: { providerId: userId } } },
                      orderBy: { createdAt: "desc" },
                  };

        return prisma.productRequest.findMany(query);
    },

    async getById(requestId: string) {
        const request = await prisma.productRequest.findUnique({
            where: { id: requestId },
            include: {
                offers: {
                    include: {
                        provider: {
                            select: { id: true, name: true, email: true },
                        },
                    },
                },
            },
        });
        if (!request)
            throw new AppError(HttpCode.NOT_FOUND, "Solicitud no encontrada");

        return request;
    },

    async cancel(requestId: string, clientId: string) {
        const request = await prisma.productRequest.findUnique({
            where: { id: requestId, clientId },
        });

        if (!request)
            throw new AppError(HttpCode.NOT_FOUND, "Solicitud no encontrada");

        if (request.status === "ACCEPTED" || request.status === "CANCELLED") {
            throw new AppError(
                HttpCode.BAD_REQUEST,
                "No se puede cancelar una solicitud en este estado",
            );
        }

        return prisma.productRequest.update({
            where: { id: requestId },
            data: { status: "CANCELLED" },
        });
    },
};
