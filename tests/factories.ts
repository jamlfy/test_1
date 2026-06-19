import { prisma } from "../src/config/database.js";
import { hashPassword } from "../src/shared/utils/password.js";

export const createUser = async (
    overrides: {
        name?: string;
        email?: string;
        password?: string;
        role?: string;
    } = {},
) => {
    const hashed = await hashPassword(overrides.password ?? "password123");
    return prisma.user.create({
        data: {
            name: overrides.name ?? "Test User",
            email: overrides.email ?? `test-${Date.now()}@example.com`,
            password: hashed,
            role: overrides.role ?? "CLIENT",
        },
    });
};

export const createRequest = async (
    clientId: string,
    overrides: {
        productName?: string;
        description?: string;
    } = {},
) => {
    return prisma.productRequest.create({
        data: {
            clientId,
            productName: overrides.productName ?? "Producto Test",
            description: overrides.description ?? "Descripción test",
        },
    });
};

export const createOffer = async (
    requestId: string,
    providerId: string,
    overrides: { price?: number; message?: string } = {},
) => {
    return prisma.offer.create({
        data: {
            requestId,
            providerId,
            price: overrides.price ?? 100,
            message: overrides.message ?? "",
        },
    });
};
