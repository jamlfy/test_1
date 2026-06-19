import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../shared/utils/jwt.js';
import { AppError } from '../shared/errors/AppError.js';
import { HttpCode } from '../shared/errors/HttpCode.js';

export const authenticate = (req: Request, _res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    throw new AppError(HttpCode.UNAUTHORIZED, 'Token no proporcionado');
  }

  const token = header.split(' ')[1];
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    throw new AppError(HttpCode.UNAUTHORIZED, 'Token inválido o expirado');
  }
};
