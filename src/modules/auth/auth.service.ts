import { prisma } from '../../config/database.js';
import { hashPassword, comparePassword } from '../../shared/utils/password.js';
import { signToken } from '../../shared/utils/jwt.js';
import { AppError } from '../../shared/errors/AppError.js';
import { HttpCode } from '../../shared/errors/HttpCode.js';

export const authService = {
  async register(data: { name: string; email: string; password: string; role: string }) {
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new AppError(HttpCode.CONFLICT, 'Email ya registrado');

    const hashed = await hashPassword(data.password);
    const user = await prisma.user.create({
      data: { ...data, password: hashed },
    });

    const token = signToken({ userId: user.id, role: user.role });
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError(HttpCode.UNAUTHORIZED, 'Credenciales inválidas');

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new AppError(HttpCode.UNAUTHORIZED, 'Credenciales inválidas');

    const token = signToken({ userId: user.id, role: user.role });
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
  },

  async me(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new AppError(HttpCode.NOT_FOUND, 'Usuario no encontrado');
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  },
};
